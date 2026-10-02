import { createHandler } from "@/server/handler";
import { AIRecommendationSchema } from "@/server/schemas";
import { aiService } from "@/server/services/ai-service";
import { requireAuth, requireScope } from "@/server/auth";
import { enforceRateLimit } from "@/server/rate-limit";
import { jsonResponse } from "@/server/errors";

export const POST = createHandler({
  method: "POST",
  path: "/api/ai/recommend",
  bodySchema: AIRecommendationSchema,
  audit: "ai.recommend",
  handler: async ({ ctx, body, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "ai:recommend");

    // Stricter rate limit for AI calls
    enforceRateLimit({
      principalId: p.id,
      action: "ai:recommend",
      limit: 30,
      windowMs: 60_000,
    });

    const recommendation = await aiService.recommend(body);

    return jsonResponse({
      data: recommendation,
    });
  },
});
