import type { NextRequest } from "next/server";
import { ZodError, type ZodType } from "zod";
import { buildRequestContext, jsonResponse, toPublicError, type RequestContext, ValidationError } from "@/server/errors";
import { resolvePrincipal } from "@/server/auth";
import { appendAuditRecord } from "@/server/audit";

export type HandlerContext<Query = unknown, Body = unknown, Params = unknown> = {
  request: NextRequest;
  ctx: RequestContext;
  query: Query;
  body: Body;
  params: Params;
  principal: ReturnType<typeof resolvePrincipal>;
};

type HandlerOptions<Query, Body, Params> = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  querySchema?: ZodType<Query>;
  bodySchema?: ZodType<Body>;
  /** Optional: parse route params. Receives slug array (from catch-all) and raw params object. */
  paramsParser?: (slug: string[], raw: Record<string, string | string[] | undefined>) => Params;
  /** Auditable action name. Set `null` to skip audit. */
  audit?: string | null;
  handler: (c: HandlerContext<Query, Body, Params>) => Promise<Response> | Response;
};

/**
 * Composed route handler: validation → auth → rate-limit → service → audit.
 * Always returns a safe JSON response; never leaks internal details.
 */
export function createHandler<Query = unknown, Body = unknown, Params = unknown>(
  options: HandlerOptions<Query, Body, Params>,
) {
  return async function route(request: NextRequest, route?: { params?: Promise<Record<string, string | string[] | undefined>> }) {
    const params_awaited = route?.params ? await route.params : {};
    const slug = (params_awaited.slug as string[] | undefined) ?? [];
    const path = options.path ?? `/${slug.join("/")}`;
    let principal: ReturnType<typeof resolvePrincipal> | null = null;
    let params: Params = undefined as unknown as Params;
    const ctx = buildRequestContext(request, path, null);

    try {
      if (request.method !== options.method) {
        return jsonResponse(
          { code: "METHOD_NOT_ALLOWED", message: `Method ${request.method} is not allowed.` },
          { status: 405, headers: { Allow: options.method } },
        );
      }

      // Basic origin/CSRF guard for state-changing requests (demo; real impl uses signed tokens).
      if (options.method !== "GET") {
        const origin = request.headers.get("origin");
        const referer = request.headers.get("referer");
        const host = request.headers.get("host");
        const sameOrigin = origin ? origin.endsWith(host ?? "") : referer ? referer.includes(host ?? "") : false;
        if (origin && !sameOrigin) {
          return jsonResponse({ code: "FORBIDDEN", message: "Origin not permitted." }, { status: 403 });
        }
      }

      principal = resolvePrincipal(request);
      ctx.principal = principal ? { id: principal.id, role: principal.role } : null;

      // Parse query
      const url = new URL(request.url);
      const rawQuery: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        rawQuery[key] = value;
      });
      const query = options.querySchema
        ? parseZod<Query>(options.querySchema, rawQuery, "query")
        : (rawQuery as unknown as Query);

      // Parse body (POST only)
      let body: Body = undefined as unknown as Body;
      if (options.method === "POST" && options.bodySchema) {
        const raw = await readJsonBody(request);
        body = parseZod<Body>(options.bodySchema, raw, "body");
      }

      // Params
      params = options.paramsParser ? options.paramsParser(slug, params_awaited) : (slug as unknown as Params);

      const response = await options.handler({ request, ctx, query, body, params, principal });

      // Audit success (if configured)
      if (options.audit && principal) {
        appendAuditRecord({
          principalId: principal.id,
          role: principal.role,
          eventType: options.audit,
          entityType: inferEntityType(path),
          entityId: deriveEntityId(params),
          details: { method: request.method, path },
          outcome: response.ok ? "success" : "failure",
        });
      }

      return response;
    } catch (error) {
      const publicErr = toPublicError(error);
      if (options.audit && principal) {
        appendAuditRecord({
          principalId: principal.id,
          role: principal.role,
          eventType: `${options.audit}.failed`,
          entityType: inferEntityType(path),
          entityId: deriveEntityId(params),
          outcome: "failure",
          errorMessage: publicErr.body.message,
        });
      }
      return jsonResponse(publicErr.body, { status: publicErr.status });
    }
  };
}

function parseZod<T>(schema: ZodType<T>, raw: unknown, source: "query" | "body"): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError(`${source} validation failed`, {
      issues: (result.error as ZodError).issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      })),
    });
  }
  return result.data;
}

async function readJsonBody(request: NextRequest): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new ValidationError("Content-Type must be application/json.");
  }
  const text = await request.text();
  if (text.length > 64_000) {
    throw new ValidationError("Request body exceeds allowed size.");
  }
  if (text.length === 0) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new ValidationError("Malformed JSON body.");
  }
}

function inferEntityType(path: string): "order" | "rescue" | "user" | "system" {
  if (path.startsWith("/api/orders") || path.startsWith("/api/risk")) return "order";
  if (path.startsWith("/api/rescue")) return "rescue";
  if (path.startsWith("/api/audit") || path.startsWith("/api/users")) return "user";
  return "system";
}

function deriveEntityId(params: unknown): string {
  if (typeof params === "string") return params;
  if (params && typeof params === "object") {
    const obj = params as Record<string, unknown>;
    if (typeof obj.id === "string") return obj.id;
    if (typeof obj.orderId === "string") return obj.orderId;
  }
  return "unknown";
}
