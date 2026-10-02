import { createHandler } from "@/server/handler";
import { analyticsService } from "@/server/services/analytics-service";
import { requireAuth, requireScope } from "@/server/auth";
import { jsonResponse } from "@/server/errors";

export const GET = createHandler({
  method: "GET",
  path: "/api/impact",
  audit: null,
  handler: async ({ ctx, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "impact:read");

    const impact = await analyticsService.getImpact();

    return jsonResponse({
      data: impact,
    });
  },
});
