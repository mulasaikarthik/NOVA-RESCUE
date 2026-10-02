import { createHandler } from "@/server/handler";
import { InventoryQuerySchema } from "@/server/schemas";
import { inventoryService } from "@/server/services/inventory-service";
import { requireAuth, requireScope } from "@/server/auth";
import { jsonResponse } from "@/server/errors";

export const GET = createHandler({
  method: "GET",
  path: "/api/inventory",
  querySchema: InventoryQuerySchema,
  audit: null,
  handler: async ({ ctx, query, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "inventory:read");

    const items = await inventoryService.findAll(query);

    return jsonResponse({
      data: items,
      meta: { count: items.length },
    });
  },
});
