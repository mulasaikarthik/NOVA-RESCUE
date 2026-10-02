/**
 * Reference implementation: Supabase-backed OrderRepository.
 *
 * NOT wired into the application by default. The existing MockOrderRepository
 * continues to serve requests. To switch to Supabase, update
 * `src/server/repositories/order-repository.ts` to export a SupabaseOrderRepository
 * instance and ensure the `orders` table exists in your Supabase project.
 *
 * This file demonstrates the repository pattern so the transition is straightforward:
 * 1. Create a `orders` table in Supabase with the same shape as OrderRecord.
 * 2. Import this module and export a configured instance.
 * 3. Service layer remains unchanged.
 */

import type { OrderQuery } from "@/server/schemas";
import type { OrderRecord } from "@/server/data/seed";
import type { OrderRepository } from "@/server/repositories/order-repository";

export class SupabaseOrderRepository implements OrderRepository {
  constructor(private readonly client: {
    from: (table: string) => {
      select: () => { eq?: (col: string, val: unknown) => unknown; order?: (col: string, opts: { ascending: boolean }) => unknown; range: (from: number, to: number) => Promise<{ data: OrderRecord[] | null; error: { message: string } | null }> };
      update: (values: Partial<OrderRecord>) => { eq: (col: string, val: unknown) => { select: () => Promise<{ data: OrderRecord[] | null; error: { message: string } | null }> } };
    };
  }) {}

  async findById(id: string): Promise<OrderRecord | null> {
    const result = await this.client
      .from("orders")
      .select()
      .eq?.("id", id);
    // Placeholder: real implementation would parse result.data
    return null;
  }

  async findAll(query: OrderQuery): Promise<OrderRecord[]> {
    let q: unknown = this.client.from("orders").select();
    if (query.storeCode) {
      q = (q as { eq?: (col: string, val: unknown) => unknown }).eq?.("storeCode", query.storeCode);
    }
    if (query.riskLevel) {
      q = (q as { eq?: (col: string, val: unknown) => unknown }).eq?.("riskLevel", query.riskLevel);
    }
    if (query.status) {
      q = (q as { eq?: (col: string, val: unknown) => unknown }).eq?.("status", query.status);
    }
    q = (q as { order?: (col: string, opts: { ascending: boolean }) => unknown }).order?.("riskScore", { ascending: false });
    const range = (q as { range: (from: number, to: number) => Promise<{ data: OrderRecord[] | null; error: { message: string } | null }> }).range(
      query.offset,
      query.offset + query.limit - 1,
    );
    const { data, error } = await range;
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return data ?? [];
  }

  async update(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | null> {
    const { data, error } = await this.client
      .from("orders")
      .update(patch)
      .eq("id", id)
      .select();
    if (error) throw new Error(`Supabase update failed: ${error.message}`);
    return data?.[0] ?? null;
  }
}
