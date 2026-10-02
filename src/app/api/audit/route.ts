import { createHandler } from "@/server/handler";
import { AuditEventSchema } from "@/server/schemas";
import { requireAuth, requireScope } from "@/server/auth";
import { appendAuditRecord, listAuditRecords, listAuditFromSupabase, toPublicAudit } from "@/server/audit";
import { jsonResponse } from "@/server/errors";
import { z } from "zod";

export const POST = createHandler({
  method: "POST",
  path: "/api/audit",
  bodySchema: AuditEventSchema,
  audit: null, // Audit of audits handled manually below
  handler: async ({ ctx, body, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "audit:write");

    const record = appendAuditRecord({
      principalId: p.id,
      role: p.role,
      eventType: body.eventType,
      entityType: body.entityType,
      entityId: body.entityId,
      details: body.details,
      outcome: "success",
    });

    return jsonResponse(
      {
        data: toPublicAudit(record),
      },
      { status: 201 },
    );
  },
});

export const GET = createHandler({
  method: "GET",
  path: "/api/audit",
  querySchema: z.object({
    limit: z.string().optional().transform((val) => {
      if (val === undefined || val === "") return 25;
      const n = Number(val);
      return Number.isNaN(n) ? 25 : Math.max(1, Math.min(100, n));
    }),
  }),
  audit: null,
  handler: async ({ ctx, query, principal }) => {
    const p = requireAuth(principal);
    requireScope(p, "audit:write");

    const records = listAuditRecords(query.limit);

    return jsonResponse({
      data: records.map(toPublicAudit),
      meta: { count: records.length },
    });
  },
});
