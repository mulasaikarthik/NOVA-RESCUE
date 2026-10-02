import { createHandler } from "@/server/handler";
import { inventoryService } from "@/server/services/inventory-service";
import { requireAuth, requireScope } from "@/server/auth";
import { jsonResponse } from "@/server/errors";

export const GET = createHandler({
  method: "GET",
  path: "/api/stores",
  audit: null,
  handler: async ({ ctx, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "stores:read");

    const stores = await inventoryService.listStores();

    return jsonResponse({
      data: stores,
      meta: { count: stores.length },
    });
  },
});
