"use server";

import { aiService } from "@/server/services/ai-service";
import { rescueService } from "@/server/services/rescue-service";
import { rescueRepository } from "@/server/repositories/rescue-repository";
import { orderRepository } from "@/server/repositories/order-repository";
import { appendAuditRecord } from "@/server/audit";
import { buildPrincipalFromSupabaseUser, type Principal } from "@/server/auth";
import { getSupabaseUser } from "@/utils/supabase/auth";
import { revalidatePath } from "next/cache";

/**
 * Resolves the principal from the current Supabase session.
 * Server Actions always run on the server and can access cookies.
 */
async function getCurrentPrincipal(): Promise<Principal> {
  const user = await getSupabaseUser();
  if (user) return buildPrincipalFromSupabaseUser(user);
  throw new Error("Not authenticated. Please sign in.");
}

/**
 * Server Action: request an AI recommendation for an order.
 */
export async function requestRecommendation(formData: FormData): Promise<void> {
  try {
    const orderId = String(formData.get("orderId") ?? "");
    const context = String(formData.get("context") ?? "");
    if (!orderId) return;
    await getCurrentPrincipal(); // enforce auth
    await aiService.recommend({ orderId, context: context || undefined });
    revalidatePath("/operations/live");
    revalidatePath(`/operations/live/${orderId}`);
  } catch (error) {
    console.error("[requestRecommendation]", error);
  }
}

/**
 * Server Action: create a rescue action.
 */
export async function createRescue(formData: FormData): Promise<void> {
  try {
    const orderId = String(formData.get("orderId") ?? "");
    const action = String(formData.get("action") ?? "");
    const notes = String(formData.get("notes") ?? "");
    if (!orderId || !action) return;
    const principal = await getCurrentPrincipal();
    await rescueService.create(principal, {
      orderId,
      action: action as "request-substitution" | "confirm-inventory" | "adjust-delivery-window" | "escalate-to-store" | "monitor-only",
      notes: notes || undefined,
    });
    revalidatePath("/operations/live");
    revalidatePath(`/operations/live/${orderId}`);
  } catch (error) {
    console.error("[createRescue]", error);
  }
}

/**
 * Server Action: record the outcome of a rescue action.
 */
export async function recordOutcome(formData: FormData): Promise<void> {
  try {
    const rescueId = String(formData.get("rescueId") ?? "");
    const outcome = String(formData.get("outcome") ?? "");
    const notes = String(formData.get("notes") ?? "");
    if (!rescueId || !outcome) return;
    const principal = await getCurrentPrincipal();

    const rescue = await rescueRepository.findById(rescueId);
    if (!rescue) return;

    const statusMap = {
      rescued: { rescueStatus: "executed" as const, orderStatus: "Rescued" as const },
      failed: { rescueStatus: "failed" as const, orderStatus: "Action required" as const },
      cancelled: { rescueStatus: "cancelled" as const, orderStatus: "Needs review" as const },
      monitoring: { rescueStatus: "executed" as const, orderStatus: "Monitoring" as const },
    };
    const mapping = statusMap[outcome as keyof typeof statusMap];
    if (!mapping) return;

    await rescueRepository.update(rescueId, {
      status: mapping.rescueStatus,
      executedAt: new Date().toISOString(),
      outcome,
      notes: notes || undefined,
    });
    await orderRepository.update(rescue.orderId, {
      status: mapping.orderStatus,
      outcome: `${outcome}${notes ? `: ${notes}` : ""}`,
    });
    appendAuditRecord({
      principalId: principal.id,
      role: principal.role,
      eventType: "rescue.outcome.recorded",
      entityType: "rescue",
      entityId: rescueId,
      details: { orderId: rescue.orderId, outcome },
      outcome: "success",
    });

    revalidatePath("/operations/live");
    revalidatePath(`/operations/live/${rescue.orderId}`);
    revalidatePath("/impact");
    revalidatePath("/analytics");
  } catch (error) {
    console.error("[recordOutcome]", error);
  }
}
