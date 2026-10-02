import { createHandler } from "@/server/handler";
import { OrderIdSchema } from "@/server/schemas";
import { orderService } from "@/server/services/order-service";
import { requireAuth, requireScope } from "@/server/auth";
import { jsonResponse } from "@/server/errors";
import { z } from "zod";

export const GET = createHandler({
  method: "GET",
  path: "/api/orders/[id]",
  paramsParser: (_slug, raw) => z.object({ id: OrderIdSchema }).parse({ id: raw.id }),
  audit: null,
  handler: async ({ ctx, params, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "orders:read");

    const { order, risk } = await orderService.findById(params.id);

    return jsonResponse({
      data: { order, risk },
    });
  },
});
