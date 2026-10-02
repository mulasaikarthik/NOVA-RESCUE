import { createHandler } from "@/server/handler";
import { OrderIdSchema } from "@/server/schemas";
import { riskService } from "@/server/services/risk-service";
import { requireAuth, requireScope } from "@/server/auth";
import { jsonResponse } from "@/server/errors";
import { z } from "zod";

export const GET = createHandler({
  method: "GET",
  path: "/api/risk/[orderId]",
  paramsParser: (_slug, raw) => z.object({ orderId: OrderIdSchema }).parse({ orderId: raw.orderId }),
  audit: null,
  handler: async ({ ctx, params, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "orders:read");

    const analysis = await riskService.getAnalysis(params.orderId);

    return jsonResponse({
      data: analysis,
    });
  },
});
