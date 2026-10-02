import { RateLimitedError } from "@/server/errors";

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

/**
 * Simple in-memory sliding-window rate limiter. Per-principal + per-action.
 * Replace with distributed cache (Redis/Upstash) in production.
 */
export function enforceRateLimit(opts: { principalId: string; action: string; limit: number; windowMs: number }): void {
  const key = `rl:${opts.action}:${opts.principalId}`;
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart > opts.windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return;
  }

  if (existing.count >= opts.limit) {
    const retryAfter = Math.ceil((existing.windowStart + opts.windowMs - now) / 1000);
    throw new RateLimitedError("Too many requests. Please try again shortly.", { retryAfterSeconds: retryAfter });
  }

  existing.count += 1;
}
