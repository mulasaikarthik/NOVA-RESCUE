import { SEED_STORES } from "@/server/data/seed";

export type StoreRecord = (typeof SEED_STORES)[number];

export interface StoreRepository {
  findByCode(code: string): Promise<StoreRecord | null>;
  findAll(): Promise<StoreRecord[]>;
}

export class MockStoreRepository implements StoreRepository {
  async findByCode(code: string): Promise<StoreRecord | null> {
    return SEED_STORES.find((store) => store.code === code) ?? null;
  }

  async findAll(): Promise<StoreRecord[]> {
    return [...SEED_STORES];
  }
}

export const storeRepository: StoreRepository = new MockStoreRepository();
