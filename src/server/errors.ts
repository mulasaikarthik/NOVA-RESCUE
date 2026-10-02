import type { NextRequest } from "next/server";

export type ErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export class SafeError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly isPublic: boolean;
  readonly meta?: Record<string, unknown>;

  constructor(code: ErrorCode, status: number, message: string, meta?: Record<string, unknown>) {
    super(message);
    this.name = "SafeError";
    this.code = code;
    this.status = status;
    this.isPublic = true;
    this.meta = meta;
  }
}

export class BadRequestError extends SafeError {
  constructor(message = "Bad request", meta?: Record<string, unknown>) {
    super("BAD_REQUEST", 400, message, meta);
  }
}

export class ValidationError extends SafeError {
  constructor(message = "Validation failed", meta?: Record<string, unknown>) {
    super("VALIDATION_ERROR", 422, message, meta);
  }
}

export class UnauthorizedError extends SafeError {
  constructor(message = "Not authenticated") {
    super("UNAUTHORIZED", 401, message);
  }
}

export class ForbiddenError extends SafeError {
  constructor(message = "Access denied") {
    super("FORBIDDEN", 403, message);
  }
}

export class NotFoundError extends SafeError {
  constructor(message = "Resource not found") {
    super("NOT_FOUND", 404, message);
  }
}

export class ConflictError extends SafeError {
  constructor(message = "Resource conflict", meta?: Record<string, unknown>) {
    super("CONFLICT", 409, message, meta);
  }
}

export class RateLimitedError extends SafeError {
  constructor(message = "Too many requests", meta?: Record<string, unknown>) {
    super("RATE_LIMITED", 429, message, meta);
  }
}

export function toPublicError(error: unknown): { status: number; body: { code: string; message: string; meta?: Record<string, unknown> } } {
  if (error instanceof SafeError) {
    return {
      status: error.status,
      body: {
        code: error.code,
        message: error.message,
        ...(error.meta ? { meta: sanitizeMeta(error.meta) } : {}),
      },
    };
  }

  // Never leak stack, secrets, file paths, DB info, or internal details
  return {
    status: 500,
    body: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
    },
  };
}

function sanitizeMeta(meta: Record<string, unknown>): Record<string, unknown> {
  const forbidden = ["password", "secret", "token", "apikey", "api_key", "authorization", "cookie", "dsn", "database_url", "private_key"];
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (forbidden.includes(key.toLowerCase())) continue;
    if (typeof value === "string" && value.length > 2000) continue;
    clean[key] = value;
  }
  return clean;
}

export type RequestContext = {
  requestId: string;
  method: string;
  path: string;
  principal: { id: string; role: string } | null;
};

export function buildRequestContext(request: NextRequest, path: string, principal: { id: string; role: string } | null): RequestContext {
  return {
    requestId: request.headers.get("x-request-id") ?? `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    method: request.method,
    path,
    principal,
  };
}

export function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(init?.headers ?? {}),
    },
  });
}
