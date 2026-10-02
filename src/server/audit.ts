import type { AuditEvent } from "@/server/schemas";

type AuditRecord = {
  id: string;
  at: string;
  principalId: string;
  role: string;
  eventType: string;
  entityType: AuditEvent["entityType"];
  entityId: string;
  details?: Record<string, unknown>;
  outcome: "success" | "failure";
  errorMessage?: string;
};

const inMemoryLog: AuditRecord[] = [];
let mockCounter = 1000;

function appendInMemory(entry: Omit<AuditRecord, "id" | "at">): AuditRecord {
  mockCounter += 1;
  const record: AuditRecord = {
    ...entry,
    id: `AUD-${mockCounter}`,
    at: new Date().toISOString(),
  };
  inMemoryLog.unshift(record);
  if (inMemoryLog.length > 500) inMemoryLog.length = 500;
  return record;
}

export function appendAuditRecord(entry: {
  principalId: string;
  role: string;
  eventType: string;
  entityType: AuditEvent["entityType"];
  entityId: string;
  details?: Record<string, unknown>;
  outcome?: "success" | "failure";
  errorMessage?: string;
}): AuditRecord {
  const record = appendInMemory({
    principalId: entry.principalId,
    role: entry.role,
    eventType: entry.eventType,
    entityType: entry.entityType,
    entityId: entry.entityId,
    details: entry.details,
    outcome: entry.outcome ?? "success",
    errorMessage: entry.errorMessage,
  });
  // Fire-and-forget persist to Supabase
  void persistAuditToSupabase(record);
  return record;
}

export function listAuditRecords(limit = 25): AuditRecord[] {
  return inMemoryLog.slice(0, Math.max(1, Math.min(100, limit)));
}

export function toPublicAudit(record: AuditRecord) {
  return {
    id: record.id,
    at: record.at,
    principal: { id: record.principalId, role: record.role },
    eventType: record.eventType,
    entityType: record.entityType,
    entityId: record.entityId,
    details: record.details,
    outcome: record.outcome,
    errorMessage: record.errorMessage,
  };
}

/**
 * Attempts to persist the audit record to Supabase in addition to in-memory.
 * Called opportunistically — never blocks the request.
 */
export async function persistAuditToSupabase(record: AuditRecord): Promise<void> {
  try {
    const { getSupabaseClient } = await import("@/utils/supabase/clients");
    const supabase = await getSupabaseClient();
    if (!supabase) return;
    await supabase.from("audit_logs").insert({
      id: record.id,
      at: record.at,
      principal_id: record.principalId,
      role: record.role,
      event_type: record.eventType,
      entity_type: record.entityType,
      entity_id: record.entityId,
      details: record.details ?? null,
      outcome: record.outcome,
      error_message: record.errorMessage ?? null,
    });
  } catch {
    // Never fail the request on audit persistence issues
  }
}

export async function listAuditFromSupabase(limit = 25): Promise<AuditRecord[]> {
  try {
    const { getSupabaseClient } = await import("@/utils/supabase/clients");
    const supabase = await getSupabaseClient();
    if (!supabase) return [];
    const { data } = await supabase.from("audit_logs").select("*").order("at", { ascending: false }).limit(limit);
    if (!data) return [];
    return data.map((r) => ({
      id: String(r.id),
      at: String(r.at),
      principalId: String(r.principal_id),
      role: String(r.role),
      eventType: String(r.event_type),
      entityType: String(r.entity_type) as AuditEvent["entityType"],
      entityId: String(r.entity_id),
      details: (r.details as Record<string, unknown> | null) ?? undefined,
      outcome: String(r.outcome) as "success" | "failure",
      errorMessage: r.error_message ? String(r.error_message) : undefined,
    }));
  } catch {
    return [];
  }
}
