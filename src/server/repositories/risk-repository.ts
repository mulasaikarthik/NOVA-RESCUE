import type { RiskAnalysisResult } from "@/server/schemas";

export interface RiskRepository {
  findByOrderId(orderId: string): Promise<RiskAnalysisResult | null>;
  save(result: RiskAnalysisResult): Promise<RiskAnalysisResult>;
  findByOrderIds(orderIds: string[]): Promise<RiskAnalysisResult[]>;
}

/** In-memory fallback. */
export class MockRiskRepository implements RiskRepository {
  private cache = new Map<string, RiskAnalysisResult>();

  async findByOrderId(orderId: string): Promise<RiskAnalysisResult | null> {
    return this.cache.get(orderId) ?? null;
  }

  async save(result: RiskAnalysisResult): Promise<RiskAnalysisResult> {
    this.cache.set(result.orderId, result);
    return result;
  }

  async findByOrderIds(orderIds: string[]): Promise<RiskAnalysisResult[]> {
    const results: RiskAnalysisResult[] = [];
    for (const id of orderIds) {
      const cached = this.cache.get(id);
      if (cached) results.push(cached);
    }
    return results;
  }
}

/** Supabase implementation. */
export class SupabaseRiskRepository implements RiskRepository {
  constructor(private getClient: () => Promise<ReturnType<typeof import("@/utils/supabase/server").createClient> | null>) {}

  async findByOrderId(orderId: string): Promise<RiskAnalysisResult | null> {
    const supabase = await this.getClient();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("risk_analyses")
      .select("*, risk_factors(*)")
      .eq("order_id", orderId)
      .order("analyzed_at", { ascending: false })
      .limit(1)
      .single();
    if (error || !data) return null;
    return this.mapRow(data);
  }

  async save(result: RiskAnalysisResult): Promise<RiskAnalysisResult> {
    const supabase = await this.getClient();
    if (!supabase) return result;
    const { data, error } = await supabase
      .from("risk_analyses")
      .insert({
        order_id: result.orderId,
        risk_level: result.riskLevel,
        score: result.score,
        reason_codes: result.reasonCodes,
      })
      .select()
      .single();
    if (error || !data) return result;

    if (result.factors.length > 0) {
      await supabase.from("risk_factors").insert(
        result.factors.map((f) => ({
          analysis_id: data.id,
          type: f.type,
          severity: f.severity,
          description: f.description,
          value: f.value ?? null,
          threshold: f.threshold ?? null,
        })),
      );
    }
    return result;
  }

  async findByOrderIds(orderIds: string[]): Promise<RiskAnalysisResult[]> {
    if (orderIds.length === 0) return [];
    const supabase = await this.getClient();
    if (!supabase) return [];
    const { data } = await supabase
      .from("risk_analyses")
      .select("*, risk_factors(*)")
      .in("order_id", orderIds)
      .order("analyzed_at", { ascending: false });
    if (!data) return [];

    // Deduplicate to latest per order
    const byOrder = new Map<string, RiskAnalysisResult>();
    for (const row of data) {
      const mapped = this.mapRow(row);
      if (!byOrder.has(mapped.orderId)) byOrder.set(mapped.orderId, mapped);
    }
    return orderIds.map((id) => byOrder.get(id)).filter((r): r is RiskAnalysisResult => Boolean(r));
  }

  private mapRow(row: Record<string, unknown>): RiskAnalysisResult {
    const factors = Array.isArray(row.risk_factors)
      ? (row.risk_factors as Array<Record<string, unknown>>).map((f) => ({
          type: String(f.type),
          severity: String(f.severity) as "low" | "medium" | "high" | "critical",
          description: String(f.description),
          ...(f.value !== null && f.value !== undefined ? { value: Number(f.value) } : {}),
          ...(f.threshold !== null && f.threshold !== undefined ? { threshold: Number(f.threshold) } : {}),
        }))
      : [];

    return {
      orderId: String(row.order_id),
      riskLevel: String(row.risk_level) as RiskAnalysisResult["riskLevel"],
      score: Number(row.score),
      factors,
      reasonCodes: Array.isArray(row.reason_codes) ? (row.reason_codes as string[]) : [],
      timestamp: String(row.analyzed_at),
    };
  }
}

let instance: RiskRepository | null = null;
let tried = false;

export async function getRiskRepository(): Promise<RiskRepository> {
  if (instance) return instance;
  if (!tried) {
    tried = true;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const supabaseRepo = new SupabaseRiskRepository(async () => {
        const { getSupabaseClient } = await import("@/utils/supabase/clients");
        return getSupabaseClient() as Promise<ReturnType<typeof import("@/utils/supabase/server").createClient> | null>;
      });
      try {
        await supabaseRepo.findByOrderIds([]);
        instance = supabaseRepo;
        return instance;
      } catch (err) {
        console.warn("[RiskRepository] Supabase unavailable:", err instanceof Error ? err.message : err);
      }
    }
  }
  instance = new MockRiskRepository();
  return instance;
}

export const riskRepository: RiskRepository = {
  async findByOrderId(id) { return (await getRiskRepository()).findByOrderId(id); },
  async save(r) { return (await getRiskRepository()).save(r); },
  async findByOrderIds(ids) { return (await getRiskRepository()).findByOrderIds(ids); },
};
