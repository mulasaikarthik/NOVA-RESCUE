import type { NextRequest } from "next/server";
import { ForbiddenError, UnauthorizedError } from "@/server/errors";
import { parseSessionToken } from "@/utils/session";

export type Principal = {
  id: string;
  role: Role;
  scopes: Scope[];
};

export type Role = "operator" | "manager" | "support" | "admin" | "viewer";

export type Scope =
  | "orders:read"
  | "orders:rescue"
  | "rescue:execute"
  | "ai:recommend"
  | "inventory:read"
  | "stores:read"
  | "analytics:read"
  | "impact:read"
  | "audit:write"
  | "admin:users";

const ROLE_SCOPES: Record<Role, Scope[]> = {
  operator: ["orders:read", "orders:rescue", "rescue:execute", "inventory:read", "stores:read", "analytics:read", "impact:read"],
  manager: ["orders:read", "orders:rescue", "rescue:execute", "ai:recommend", "inventory:read", "stores:read", "analytics:read", "impact:read"],
  support: ["orders:read", "orders:rescue", "inventory:read", "stores:read"],
  admin: ["orders:read", "orders:rescue", "rescue:execute", "ai:recommend", "inventory:read", "stores:read", "analytics:read", "impact:read", "audit:write", "admin:users"],
  viewer: ["orders:read", "inventory:read", "stores:read", "analytics:read", "impact:read"],
};

/**
 * Resolves the principal from the request.
 * Checks in order:
 * 1. x-demo-principal header (testing override)
 * 2. nova_session cookie (local session)
 * Returns null if no principal found.
 */
export function resolvePrincipal(request: NextRequest): Principal | null {
  // Check for x-demo-principal header (testing override)
  const header = request.headers.get("x-demo-principal");
  if (header) {
    const trimmed = header.trim();
    if (trimmed.length === 0 || trimmed.length > 64 || /[^a-z0-9:_\-]/i.test(trimmed)) {
      return null;
    }
    const [idPart, rolePart] = trimmed.split(":");
    const id = (idPart ?? "user").slice(0, 40);
    const role = (rolePart ?? "operator").toLowerCase();
    if (!isRole(role)) return null;
    return { id, role, scopes: ROLE_SCOPES[role] };
  }

  // Check for nova_session cookie
  const sessionCookie = request.cookies.get("nova_session")?.value;
  if (sessionCookie) {
    try {
      const session = parseSessionToken(sessionCookie);
      if (session && isRole(session.role)) {
        return { id: session.userId, role: session.role, scopes: ROLE_SCOPES[session.role] };
      }
    } catch (err) {
      console.warn("[resolvePrincipal] Session parse failed:", err);
    }
  }

  return null;
}

function isRole(value: string): value is Role {
  return value === "operator" || value === "manager" || value === "support" || value === "admin" || value === "viewer";
}

export function requireAuth(principal: Principal | null): Principal {
  if (!principal) throw new UnauthorizedError("Not authenticated.");
  return principal;
}

export function requireScope(principal: Principal, scope: Scope): void {
  if (!principal.scopes.includes(scope)) {
    throw new ForbiddenError(`Missing required scope: ${scope}`);
  }
}

export function requireAnyScope(principal: Principal, scopes: Scope[]): void {
  if (!scopes.some((scope) => principal.scopes.includes(scope))) {
    throw new ForbiddenError(`Missing one of required scopes: ${scopes.join(", ")}`);
  }
}

export function verifyOwnership(principal: Principal, owner: string | null): void {
  // Admin and manager may access any resource
  if (principal.role === "admin" || principal.role === "manager") return;
  if (owner !== null && owner !== principal.id) {
    throw new ForbiddenError("You do not own this resource.");
  }
}

/**
 * Build a Principal from a Supabase user record.
 * The role is derived from user_metadata.role when present.
 */
export function buildPrincipalFromSupabaseUser(user: {
  id: string;
  user_metadata?: Record<string, unknown>;
}): Principal {
  const rawRole =
    user.user_metadata && typeof user.user_metadata.role === "string"
      ? user.user_metadata.role
      : "operator";
  const role = isRole(rawRole) ? rawRole : "operator";
  return { id: user.id, role, scopes: ROLE_SCOPES[role] };
}
