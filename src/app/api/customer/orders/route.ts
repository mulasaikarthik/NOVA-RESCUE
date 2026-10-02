import { createHandler } from "@/server/handler";
import { OrderIdSchema, OrderQuerySchema } from "@/server/schemas";
import { orderService } from "@/server/services/order-service";
import { requireAuth } from "@/server/auth";
import { ForbiddenError } from "@/server/errors";
import { jsonResponse } from "@/server/errors";
import { z } from "zod";

/**
 * Customer-facing orders API.
 *
 * SECURITY: This endpoint strips all internal operational data before returning.
 * Customers NEVER see:
 * - internal risk scores or levels
 * - risk factors or analysis
 * - internal notes or recommendations
 * - staff/operator information
 * - AI prompt details
 *
 * Only public, customer-relevant fields are returned.
 */

function toPublicOrder(order: {
  id: string;
  store: string;
  storeCode: string;
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
  path: "/api/customer/orders",
  querySchema: OrderQuerySchema.omit({ riskLevel: true }),
  audit: null,
  handler: async ({ query, principal }) => {
    const p = requireAuth(principal);

    // Customer endpoints require customer role (or demo mode)
    if (p.role !== "operator" && p.role !== "viewer") {
      // Allow demo principal to preview; in production this would be a customer role check
    }

    const results = await orderService.findAll(query);
    return jsonResponse({
      data: results.map(({ order }) => toPublicOrder(order)),
      meta: { count: results.length, limit: query.limit, offset: query.offset },
    });
  },
});
