import { createHandler } from "@/server/handler";
import { RescueActionSchema } from "@/server/schemas";
import { rescueService } from "@/server/services/rescue-service";
import { requireAuth, requireScope } from "@/server/auth";
import { jsonResponse } from "@/server/errors";

export const POST = createHandler({
  method: "POST",
  path: "/api/rescue",
  bodySchema: RescueActionSchema,
  audit: "rescue.create",
  handler: async ({ ctx, body, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "rescue:execute");

    const record = await rescueService.create(p, body);

    return jsonResponse(
      {
        data: record,
      },
      { status: 201 },
    );
  },
});
