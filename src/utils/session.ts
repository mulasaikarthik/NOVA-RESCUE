import { createHmac } from "node:crypto";

const SESSION_COOKIE = "nova_session";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "nova-rescue-dev-secret-change-in-prod";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export { SESSION_COOKIE, SESSION_MAX_AGE };

/**
 * Creates a signed session token for a user.
 * Format: userId.role.timestamp.signature
 */
export function createSessionToken(userId: string, role: string): string {
  const timestamp = Date.now().toString();
  const payload = `${userId}.${role}.${timestamp}`;
  const signature = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex").slice(0, 16);
  return `${payload}.${signature}`;
}

/**
 * Validates and parses a session token.
 * Returns { userId, role } if valid, null otherwise.
 */
export function parseSessionToken(token: string): { userId: string; role: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [userId, role, timestamp, signature] = parts;
  const payload = `${userId}.${role}.${timestamp}`;
  const expected = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex").slice(0, 16);
  if (signature !== expected) return null;
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Date.now() - ts > SESSION_MAX_AGE * 1000) return null;
  return { userId, role };
}
