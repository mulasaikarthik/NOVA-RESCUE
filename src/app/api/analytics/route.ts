import { createHandler } from "@/server/handler";
import { analyticsService } from "@/server/services/analytics-service";
import { requireAuth, requireScope } from "@/server/auth";
import { jsonResponse } from "@/server/errors";

export const GET = createHandler({
  method: "GET",
  path: "/api/analytics",
  audit: null,
  handler: async ({ ctx, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "analytics:read");

    const [summary, trends] = await Promise.all([
      analyticsService.getSummary(),
      analyticsService.getTrends(),
    ]);

    return jsonResponse({
      data: {
        summary,
        trends,
        disclaimer: "Simulated analytics data for prototype demonstration.",
      },
    });
  },
});
