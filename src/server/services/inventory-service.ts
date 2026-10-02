import { inventoryRepository } from "@/server/repositories/inventory-repository";
import { storeRepository } from "@/server/repositories/store-repository";
import type { InventoryQuery } from "@/server/schemas";

export class InventoryService {
  async findAll(query: InventoryQuery) {
    return inventoryRepository.findAll({
      storeCode: query.storeCode,
      riskLevel: query.riskLevel,
    });
  }

  async listStores() {
    return storeRepository.findAll();
  }

  async findStore(code: string) {
    return storeRepository.findByCode(code);
  }
}

export const inventoryService = new InventoryService();
