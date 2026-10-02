import type { OrderQuery } from "@/server/schemas";
import { SEED_ORDERS, type OrderRecord } from "@/server/data/seed";

export interface OrderRepository {
  findById(id: string): Promise<OrderRecord | null>;
  findAll(query: OrderQuery): Promise<OrderRecord[]>;
  update(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | null>;
}

/**
 * In-memory repository backed by seed data. Used as fallback when Supabase is unavailable.
 */
export class MockOrderRepository implements OrderRepository {
  private orders: OrderRecord[] = [...SEED_ORDERS];

  async findById(id: string): Promise<OrderRecord | null> {
    return this.orders.find((order) => order.id === id) ?? null;
  }

  async findAll(query: OrderQuery): Promise<OrderRecord[]> {
    let filtered = this.orders;
    if (query.storeCode) filtered = filtered.filter((o) => o.storeCode === query.storeCode);
    if (query.riskLevel) filtered = filtered.filter((o) => o.riskLevel === query.riskLevel);
    if (query.status) filtered = filtered.filter((o) => o.status === query.status);

    const sorted = filtered.sort((a, b) => b.riskScore - a.riskScore);
    return sorted.slice(query.offset, query.offset + query.limit);
  }

  async update(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | null> {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    this.orders[index] = { ...this.orders[index], ...patch };
    return this.orders[index];
  }
}

/**
 * Supabase repository. Uses real database when tables exist.
 */
export class SupabaseOrderRepository implements OrderRepository {
  constructor(private getClient: () => Promise<ReturnType<typeof import("@/utils/supabase/server").createClient> | null>) {}

  async findById(id: string): Promise<OrderRecord | null> {
    const supabase = await this.getClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_products(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return this.mapRow(data);
  }

  async findAll(query: OrderQuery): Promise<OrderRecord[]> {
    const supabase = await this.getClient();
    if (!supabase) return [];

    let q = supabase.from("orders").select("*, order_products(*)").order("risk_score", { ascending: false });
    if (query.storeCode) q = q.eq("store_code", query.storeCode);
    if (query.riskLevel) q = q.eq("risk_level", query.riskLevel);
    if (query.status) q = q.eq("status", query.status);

    const from = query.offset;
    const to = query.offset + query.limit - 1;
    const { data, error } = await q.range(from, to);

    if (error || !data) return [];
    return data.map((row) => this.mapRow(row));
  }

  async update(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | null> {
    const supabase = await this.getClient();
    if (!supabase) return null;

    const dbPatch: Record<string, unknown> = {};
    if (patch.status !== undefined) dbPatch.status = patch.status;
    if (patch.outcome !== undefined) dbPatch.outcome = patch.outcome;
    if (patch.rescueAction !== undefined) dbPatch.rescue_action = patch.rescueAction;
    if (patch.riskScore !== undefined) dbPatch.risk_score = patch.riskScore;
    if (patch.riskLevel !== undefined) dbPatch.risk_level = patch.riskLevel;
    dbPatch.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from("orders").update(dbPatch).eq("id", id).select().single();
    if (error || !data) return null;
    return this.findById(id);
  }

  private mapRow(row: Record<string, unknown>): OrderRecord {
    const products = Array.isArray(row.order_products)
      ? (row.order_products as Array<Record<string, unknown>>).map((p) => ({
          name: String(p.name),
          sku: String(p.sku),
          quantity: Number(p.quantity),
          availability: String(p.availability),
          confidence: Number(p.confidence),
        }))
      : [];

    return {
      id: String(row.id),
      customer: String(row.customer),
      email: row.email ? String(row.email) : "",
      store: String(row.store),
      storeCode: String(row.store_code),
      placedAt: String(row.placed_at),
      hoursAgo: Number(row.hours_ago),
      eta: row.eta ? String(row.eta) : "",
      total: Number(row.total),
      itemsCount: Number(row.items_count),
      riskScore: Number(row.risk_score),
      riskLevel: String(row.risk_level) as OrderRecord["riskLevel"],
      status: String(row.status) as OrderRecord["status"],
      confidence: Number(row.confidence),
      products,
      riskFactors: [],
      explanation: row.explanation ? String(row.explanation) : "",
      recommendation: row.recommendation ? String(row.recommendation) : "",
      rescueAction: row.rescue_action ? String(row.rescue_action) : "",
      outcome: row.outcome ? String(row.outcome) : "",
    };
  }
}

// Singleton with fallback
let instance: OrderRepository | null = null;
let supabaseTried = false;
let supabaseAvailable = false;

export async function getOrderRepository(): Promise<OrderRepository> {
  if (instance) return instance;

  if (!supabaseTried) {
    supabaseTried = true;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const supabaseRepo = new SupabaseOrderRepository(async () => {
        const { getSupabaseClient } = await import("@/utils/supabase/clients");
        return getSupabaseClient() as Promise<ReturnType<typeof import("@/utils/supabase/server").createClient> | null>;
      });
      try {
        await supabaseRepo.findAll({ limit: 1, offset: 0 });
        supabaseAvailable = true;
        instance = supabaseRepo;
        return instance;
      } catch (err) {
        console.warn("[OrderRepository] Supabase unavailable, falling back to in-memory:", err instanceof Error ? err.message : err);
      }
    }
  }

  instance = new MockOrderRepository();
  return instance;
}

/**
 * Default order repository. Starts as in-memory, upgrades to Supabase when available.
 * Services can also call getOrderRepository() to await the resolved instance.
 */
export const orderRepository: OrderRepository = {
  async findById(id) {
    return (await getOrderRepository()).findById(id);
  },
  async findAll(query) {
    return (await getOrderRepository()).findAll(query);
  },
  async update(id, patch) {
    return (await getOrderRepository()).update(id, patch);
  },
};
