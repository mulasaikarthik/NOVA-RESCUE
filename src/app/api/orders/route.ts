import { createHandler } from "@/server/handler";
import { OrderQuerySchema } from "@/server/schemas";
import { orderService } from "@/server/services/order-service";
import { requireAuth, requireScope } from "@/server/auth";
import { jsonResponse } from "@/server/errors";

export const GET = createHandler({
  method: "GET",
  path: "/api/orders",
  querySchema: OrderQuerySchema,
  audit: null,
  handler: async ({ ctx, query, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "orders:read");

    const orders = await orderService.findAll(query);

    return jsonResponse({
      data: orders,
      meta: {
        count: orders.length,
        limit: query.limit,
        offset: query.offset,
      },
    });
  },
});
