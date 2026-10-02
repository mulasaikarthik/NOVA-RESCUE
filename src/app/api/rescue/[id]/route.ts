import { createHandler } from "@/server/handler";
import { rescueService } from "@/server/services/rescue-service";
import { requireAuth, requireScope } from "@/server/auth";
import { jsonResponse } from "@/server/errors";
import { z } from "zod";

export const GET = createHandler({
  method: "GET",
  path: "/api/rescue/[id]",
  paramsParser: (_slug, raw) => z.object({ id: z.string().regex(/^RSC-\d+$/, "Invalid rescue ID format") }).parse({ id: raw.id }),
  audit: null,
  handler: async ({ ctx, params, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "orders:read");

    const record = await rescueService.findById(p, params.id);

    return jsonResponse({
      data: record,
    });
  },
});
