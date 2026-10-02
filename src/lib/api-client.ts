/**
 * Frontend API client for NOVA RESCUE backend.
 * Used by Server Components and React Server Actions to call internal routes.
 *
 * Never hardcodes secrets. Uses same-origin calls so cookies/headers propagate.
 */

type FetchInit = {
  method?: "GET" | "POST";
  body?: unknown;
  headers?: Record<string, string>;
  searchParams?: Record<string, string | number | undefined>;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly meta?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, init: FetchInit = {}): Promise<T> {
  const url = new URL(path, "http://localhost:3000");
  if (init.searchParams) {
    Object.entries(init.searchParams).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    });
  }

  const response = await fetch(url.toString(), {
    method: init.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const err = data as { code?: string; message?: string; meta?: Record<string, unknown> } | null;
    throw new ApiError(
      response.status,
      err?.code ?? "UNKNOWN",
      err?.message ?? "Request failed",
      err?.meta,
    );
  }

  return data as T;
}

export type ApiEnvelope<T> = { data: T; meta?: Record<string, unknown> };

export const api = {
  orders: {
    list: (query: { limit?: number; offset?: number; riskLevel?: string; status?: string; storeCode?: string } = {}) =>
      apiFetch<ApiEnvelope<{ order: unknown; risk: unknown | null }[]>>("/api/orders", {
        searchParams: {
          limit: query.limit,
          offset: query.offset,
          riskLevel: query.riskLevel,
          status: query.status,
          storeCode: query.storeCode,
        },
      }),
    get: (id: string) =>
      apiFetch<ApiEnvelope<{ order: unknown; risk: unknown | null }>>(`/api/orders/${id}`),
  },
  risk: {
    get: (orderId: string) => apiFetch<ApiEnvelope<unknown>>(`/api/risk/${orderId}`),
    analyze: (orderId: string) =>
      apiFetch<ApiEnvelope<unknown>>("/api/risk/analyze", {
        method: "POST",
        body: { orderId },
      }),
  },
  rescue: {
    create: (input: { orderId: string; action: string; notes?: string }) =>
      apiFetch<ApiEnvelope<unknown>>("/api/rescue", { method: "POST", body: input }),
    get: (id: string) => apiFetch<ApiEnvelope<unknown>>(`/api/rescue/${id}`),
    recordOutcome: (input: { rescueId: string; outcome: string; notes?: string }) =>
      apiFetch<ApiEnvelope<unknown>>("/api/rescue/outcome", { method: "POST", body: input }),
  },
  ai: {
    recommend: (input: { orderId: string; context?: string }) =>
      apiFetch<ApiEnvelope<unknown>>("/api/ai/recommend", { method: "POST", body: input }),
  },
  analytics: {
    summary: () => apiFetch<ApiEnvelope<unknown>>("/api/analytics"),
  },
  impact: {
    summary: () => apiFetch<ApiEnvelope<unknown>>("/api/impact"),
  },
  stores: {
    list: () => apiFetch<ApiEnvelope<unknown[]>>("/api/stores"),
  },
  inventory: {
    list: (query?: { riskLevel?: string; storeCode?: string }) =>
      apiFetch<ApiEnvelope<unknown[]>>("/api/inventory", {
        searchParams: { riskLevel: query?.riskLevel, storeCode: query?.storeCode },
      }),
  },
  auth: {
    session: () => apiFetch<{ authenticated: boolean; source: string; user: unknown }>("/api/auth/session"),
  },
  customer: {
    listOrders: (query: { limit?: number; offset?: number } = {}) =>
      apiFetch<ApiEnvelope<unknown[]>>("/api/customer/orders", {
        searchParams: { limit: query.limit, offset: query.offset },
      }),
    getOrder: (id: string) => apiFetch<ApiEnvelope<unknown>>(`/api/customer/orders/${id}`),
  },
  audit: {
    list: (limit = 25) =>
      apiFetch<ApiEnvelope<unknown[]>>("/api/audit", {
        headers: { "x-demo-principal": "admin-user:admin" },
        searchParams: { limit },
      }),
  },
};
