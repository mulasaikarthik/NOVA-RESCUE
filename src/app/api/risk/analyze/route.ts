import { createHandler } from "@/server/handler";
import { RiskAnalysisSchema } from "@/server/schemas";
import { riskService } from "@/server/services/risk-service";
import { requireAuth, requireScope } from "@/server/auth";
import { jsonResponse } from "@/server/errors";

export const POST = createHandler({
  method: "POST",
  path: "/api/risk/analyze",
  bodySchema: RiskAnalysisSchema,
  audit: "risk.analyze",
  handler: async ({ ctx, body, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "orders:read");

    const analysis = await riskService.analyze(body.orderId);

    return jsonResponse(
      {
        data: analysis,
      },
      { status: 201 },
    );
  },
});
