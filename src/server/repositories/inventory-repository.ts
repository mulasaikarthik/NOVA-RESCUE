import { SEED_ORDERS } from "@/server/data/seed";
import type { RiskLevel } from "@/server/schemas";

export type InventoryRecord = {
  sku: string;
  name: string;
  storeCode: string;
  storeName: string;
  confidence: number;
  availability: string;
  riskLevel: RiskLevel;
};

export interface InventoryRepository {
  findAll(filter?: { storeCode?: string; riskLevel?: RiskLevel }): Promise<InventoryRecord[]>;
  findBySku(sku: string, storeCode?: string): Promise<InventoryRecord | null>;
}

/**
 * Derives inventory signals from order products across stores.
 * This is a demo projection — replace with a real inventory snapshot table later.
 */
export class MockInventoryRepository implements InventoryRepository {
  async findAll(filter?: { storeCode?: string; riskLevel?: RiskLevel }): Promise<InventoryRecord[]> {
    const records: InventoryRecord[] = [];
    const seen = new Set<string>();

    for (const order of SEED_ORDERS) {
      for (const product of order.products) {
        const key = `${product.sku}:${order.storeCode}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const riskLevel = this.classifyRisk(product.confidence, product.availability);
        records.push({
          sku: product.sku,
          name: product.name,
          storeCode: order.storeCode,
          storeName: order.store,
          confidence: product.confidence,
          availability: product.availability,
          riskLevel,
        });
      }
    }

    let filtered = records;
    if (filter?.storeCode) filtered = filtered.filter((r) => r.storeCode === filter.storeCode);
    if (filter?.riskLevel) filtered = filtered.filter((r) => r.riskLevel === filter.riskLevel);

    return filtered.sort((a, b) => a.confidence - b.confidence);
  }

  async findBySku(sku: string, storeCode?: string): Promise<InventoryRecord | null> {
    const all = await this.findAll();
    return all.find((r) => r.sku === sku && (!storeCode || r.storeCode === storeCode)) ?? null;
  }

  private classifyRisk(confidence: number, availability: string): RiskLevel {
    if (availability === "Unavailable" || confidence < 45) return "CRITICAL";
    if (confidence < 60) return "HIGH";
    if (confidence < 75) return "MEDIUM";
    return "LOW";
  }
}

export const inventoryRepository: InventoryRepository = new MockInventoryRepository();
