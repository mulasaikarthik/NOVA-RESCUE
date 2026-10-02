import type { RiskLevel } from "@/server/schemas";

export type RescueRecord = {
  id: string;
  orderId: string;
  action: string;
  status: "pending" | "approved" | "executed" | "failed" | "cancelled";
  principalId: string;
  createdAt: string;
  executedAt?: string;
  outcome?: string;
  notes?: string;
  recommendation?: string;
  riskLevel?: RiskLevel;
  riskScore?: number;
};

export interface RescueRepository {
  create(record: Omit<RescueRecord, "id" | "createdAt">): Promise<RescueRecord>;
  findById(id: string): Promise<RescueRecord | null>;
  findByOrderId(orderId: string): Promise<RescueRecord[]>;
  update(id: string, patch: Partial<RescueRecord>): Promise<RescueRecord | null>;
}

let nextMockId = 1000;

export class MockRescueRepository implements RescueRepository {
  private records: RescueRecord[] = [];
  async create(record: Omit<RescueRecord, "id" | "createdAt">): Promise<RescueRecord> {
    nextMockId += 1;
    const full: RescueRecord = { ...record, id: `RSC-${nextMockId}`, createdAt: new Date().toISOString() };
    this.records.unshift(full);
    if (this.records.length > 200) this.records.length = 200;
    return full;
  }
  async findById(id: string): Promise<RescueRecord | null> {
    return this.records.find((r) => r.id === id) ?? null;
  }
  async findByOrderId(orderId: string): Promise<RescueRecord[]> {
    return this.records.filter((r) => r.orderId === orderId);
  }
  async update(id: string, patch: Partial<RescueRecord>): Promise<RescueRecord | null> {
    const i = this.records.findIndex((r) => r.id === id);
    if (i === -1) return null;
    this.records[i] = { ...this.records[i], ...patch };
    return this.records[i];
  }
}

let nextSupabaseId = 1;

export class SupabaseRescueRepository implements RescueRepository {
  constructor(private getClient: () => Promise<ReturnType<typeof import("@/utils/supabase/server").createClient> | null>) {}

  async create(record: Omit<RescueRecord, "id" | "createdAt">): Promise<RescueRecord> {
    const supabase = await this.getClient();
    if (!supabase) throw new Error("Supabase unavailable");
    nextSupabaseId += 1;
    const id = `RSC-${Date.now()}-${nextSupabaseId}`;
    const { error } = await supabase.from("rescue_actions").insert({
      id,
      order_id: record.orderId,
      action: record.action,
      status: record.status,
      principal_id: record.principalId,
      notes: record.notes ?? null,
      recommendation: record.recommendation ?? null,
      risk_level: record.riskLevel ?? null,
      risk_score: record.riskScore ?? null,
      outcome: record.outcome ?? null,
    });
    if (error) throw error;
    return { ...record, id, createdAt: new Date().toISOString() };
  }

  async findById(id: string): Promise<RescueRecord | null> {
    const supabase = await this.getClient();
    if (!supabase) return null;
    const { data, error } = await supabase.from("rescue_actions").select("*").eq("id", id).single();
    if (error || !data) return null;
    return this.mapRow(data);
  }

  async findByOrderId(orderId: string): Promise<RescueRecord[]> {
    const supabase = await this.getClient();
    if (!supabase) return [];
    const { data } = await supabase.from("rescue_actions").select("*").eq("order_id", orderId).order("created_at", { ascending: false });
    return (data ?? []).map((r) => this.mapRow(r));
  }

  async update(id: string, patch: Partial<RescueRecord>): Promise<RescueRecord | null> {
    const supabase = await this.getClient();
    if (!supabase) return null;
    const dbPatch: Record<string, unknown> = {};
    if (patch.status !== undefined) dbPatch.status = patch.status;
    if (patch.executedAt !== undefined) dbPatch.executed_at = patch.executedAt;
    if (patch.outcome !== undefined) dbPatch.outcome = patch.outcome;
    if (patch.notes !== undefined) dbPatch.notes = patch.notes;
    const { error } = await supabase.from("rescue_actions").update(dbPatch).eq("id", id);
    if (error) return null;
    return this.findById(id);
  }

  private mapRow(r: Record<string, unknown>): RescueRecord {
    return {
      id: String(r.id),
      orderId: String(r.order_id),
      action: String(r.action),
      status: String(r.status) as RescueRecord["status"],
      principalId: String(r.principal_id),
      createdAt: String(r.created_at),
      ...(r.executed_at ? { executedAt: String(r.executed_at) } : {}),
      ...(r.outcome ? { outcome: String(r.outcome) } : {}),
      ...(r.notes ? { notes: String(r.notes) } : {}),
      ...(r.recommendation ? { recommendation: String(r.recommendation) } : {}),
      ...(r.risk_level ? { riskLevel: String(r.risk_level) as RiskLevel } : {}),
      ...(r.risk_score !== null && r.risk_score !== undefined ? { riskScore: Number(r.risk_score) } : {}),
    };
  }
}

let instance: RescueRepository | null = null;
let tried = false;

export async function getRescueRepository(): Promise<RescueRepository> {
  if (instance) return instance;
  if (!tried) {
    tried = true;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const repo = new SupabaseRescueRepository(async () => {
        const { getSupabaseClient } = await import("@/utils/supabase/clients");
        return getSupabaseClient() as Promise<ReturnType<typeof import("@/utils/supabase/server").createClient> | null>;
      });
      try {
        await repo.findByOrderId("__probe__");
        instance = repo;
        return instance;
      } catch (err) {
        console.warn("[RescueRepository] Supabase unavailable:", err instanceof Error ? err.message : err);
      }
    }
  }
  instance = new MockRescueRepository();
  return instance;
}

export const rescueRepository: RescueRepository = {
  async create(r) { return (await getRescueRepository()).create(r); },
  async findById(id) { return (await getRescueRepository()).findById(id); },
  async findByOrderId(id) { return (await getRescueRepository()).findByOrderId(id); },
  async update(id, p) { return (await getRescueRepository()).update(id, p); },
};
