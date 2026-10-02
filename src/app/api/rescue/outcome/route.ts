import { createHandler } from "@/server/handler";
import { orderRepository } from "@/server/repositories/order-repository";
import { rescueRepository } from "@/server/repositories/rescue-repository";
import { requireAuth, requireScope } from "@/server/auth";
import { appendAuditRecord } from "@/server/audit";
import { NotFoundError, ValidationError } from "@/server/errors";
import { jsonResponse } from "@/server/errors";
import { z } from "zod";

const RescueOutcomeSchema = z.object({
  rescueId: z.string().regex(/^RSC-\d+$/, "Invalid rescue ID format"),
  outcome: z.enum(["rescued", "failed", "cancelled", "monitoring"]),
  notes: z.string().max(500).optional(),
});

/**
 * Records the outcome of a rescue action.
 * Updates order status, rescue record, and appends an audit entry.
 * Analytics and impact dashboards reflect the new outcome on next query.
 */
export const POST = createHandler({
  method: "POST",
  path: "/api/rescue/outcome",
  bodySchema: RescueOutcomeSchema,
  audit: "rescue.outcome",
  handler: async ({ body, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "rescue:execute");

    const rescue = await rescueRepository.findById(body.rescueId);
    if (!rescue) throw new NotFoundError(`Rescue ${body.rescueId} not found.`);
    if (rescue.principalId !== p.id && p.role !== "admin" && p.role !== "manager") {
      throw new ValidationError("You can only record outcomes for your own rescue actions.");
    }
    if (rescue.status === "executed" || rescue.status === "cancelled") {
      throw new ValidationError("This rescue action already has a final outcome.");
    }

    const statusMap = {
      rescued: { rescueStatus: "executed" as const, orderStatus: "Rescued" as const },
      failed: { rescueStatus: "failed" as const, orderStatus: "Action required" as const },
      cancelled: { rescueStatus: "cancelled" as const, orderStatus: "Needs review" as const },
      monitoring: { rescueStatus: "executed" as const, orderStatus: "Monitoring" as const },
    };
    const mapping = statusMap[body.outcome];

    await rescueRepository.update(body.rescueId, {
      status: mapping.rescueStatus,
      executedAt: new Date().toISOString(),
      outcome: body.outcome,
      notes: body.notes,
    });

    await orderRepository.update(rescue.orderId, {
      status: mapping.orderStatus,
      outcome: `${body.outcome}${body.notes ? `: ${body.notes}` : ""}`,
    });

    appendAuditRecord({
      principalId: p.id,
      role: p.role,
      eventType: "rescue.outcome.recorded",
      entityType: "rescue",
      entityId: body.rescueId,
      details: { orderId: rescue.orderId, outcome: body.outcome },
      outcome: "success",
    });

    return jsonResponse({
      data: {
        rescueId: body.rescueId,
        orderId: rescue.orderId,
        outcome: body.outcome,
        recordedAt: new Date().toISOString(),
      },
    });
  },
});
