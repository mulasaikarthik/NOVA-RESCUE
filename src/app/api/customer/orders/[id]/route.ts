import { createHandler } from "@/server/handler";
import { OrderIdSchema } from "@/server/schemas";
import { orderService } from "@/server/services/order-service";
import { requireAuth } from "@/server/auth";
import { jsonResponse } from "@/server/errors";
import { z } from "zod";

/**
 * Customer-facing order detail.
 * Strips all internal risk/operational data.
 */

function toPublicOrder(order: {
  id: string;
  customer: string;
  store: string;
  placedAt: string;
  eta: string;
  total: number;
  itemsCount: number;
  status: string;
  products: { name: string; sku: string; quantity: number; availability: string }[];
  outcome: string;
}) {
  return {
    id: order.id,
    customer: order.customer,
    store: order.store,
    placedAt: order.placedAt,
    eta: order.eta,
    total: order.total,
    itemsCount: order.itemsCount,
    status: order.status,
    products: order.products.map((p) => ({
      name: p.name,
      quantity: p.quantity,
      availability: p.availability,
    })),
    outcome: order.outcome,
  };
}

export const GET = createHandler({
  method: "GET",
  path: "/api/customer/orders/[id]",
  paramsParser: (_slug, raw) => z.object({ id: OrderIdSchema }).parse({ id: raw.id }),
  audit: null,
  handler: async ({ params, principal }) => {
    const p = requireAuth(principal);
    const { order } = await orderService.findById(params.id);
    return jsonResponse({ data: toPublicOrder(order) });
  },
});
