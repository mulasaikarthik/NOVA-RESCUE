import { orderRepository } from "@/server/repositories/order-repository";
import { rescueRepository, type RescueRecord } from "@/server/repositories/rescue-repository";
import { riskService } from "@/server/services/risk-service";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/server/errors";
import type { Principal } from "@/server/auth";
import { requireScope } from "@/server/auth";
import type { RescueAction } from "@/server/schemas";
import { enforceRateLimit } from "@/server/rate-limit";

export class RescueService {
  async create(principal: Principal, input: RescueAction): Promise<RescueRecord> {
    // 1. Authorization
    requireScope(principal, "rescue:execute");

    // 2. Rate limit
    enforceRateLimit({ principalId: principal.id, action: "rescue:create", limit: 20, windowMs: 60_000 });

    // 3. Validate order exists
    const order = await orderRepository.findById(input.orderId);
    if (!order) throw new NotFoundError(`Order ${input.orderId} not found.`);

    // 4. Verify order is in a rescueable state
    if (order.status === "Delivered") {
      throw new ConflictError("Order has already been delivered.", { orderId: input.orderId });
    }
    if (order.status === "Rescued") {
      throw new ConflictError("Order has already been rescued.", { orderId: input.orderId });
    }

    // 5. Run risk analysis if not cached
    const risk = await riskService.getAnalysis(input.orderId);

    // 6. Validate action against risk level
    if (risk.riskLevel === "LOW" && input.action !== "monitor-only") {
      throw new ValidationError("Low-risk orders do not require active rescue actions.");
    }

    // 7. Verify principal has permission for this action type
    if (input.action === "escalate-to-store" && principal.role === "viewer") {
      throw new ForbiddenError("Viewer role cannot escalate to store.");
    }

    // 8. Create rescue record
    const record = await rescueRepository.create({
      orderId: input.orderId,
      action: input.action,
      status: "approved",
      principalId: principal.id,
      notes: input.notes,
      recommendation: risk.factors[0]?.description,
      riskLevel: risk.riskLevel,
      riskScore: risk.score,
    });

    // 9. Update order status
    await orderRepository.update(input.orderId, {
      status: "Rescue in progress",
      rescueAction: this.describeAction(input.action),
    });

    return record;
  }

  async findById(principal: Principal, rescueId: string): Promise<RescueRecord> {
    const record = await rescueRepository.findById(rescueId);
    if (!record) throw new NotFoundError(`Rescue ${rescueId} not found.`);

    // Verify ownership or admin/manager role
    if (record.principalId !== principal.id && principal.role !== "admin" && principal.role !== "manager") {
      throw new ForbiddenError("You do not have access to this rescue record.");
    }

    return record;
  }

  private describeAction(action: string): string {
    const descriptions: Record<string, string> = {
      "request-substitution": "Requested customer-approved substitution",
      "confirm-inventory": "Confirmed inventory availability with store",
      "adjust-delivery-window": "Adjusted delivery window",
      "escalate-to-store": "Escalated to store manager",
      "monitor-only": "Continuing standard monitoring",
    };
    return descriptions[action] ?? action;
  }
}

export const rescueService = new RescueService();
