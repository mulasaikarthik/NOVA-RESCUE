import { z } from "zod";

// Order schemas
export const OrderIdSchema = z.string().regex(/^NR-\d{5}$/, "Invalid order ID format");
// Query string coercion helper for Zod v4 compatibility
function coerceNumberWithDefault(defaultValue: number, min: number, max: number) {
  return z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === "") return defaultValue;
      const n = Number(val);
      if (Number.isNaN(n)) throw new Error("Invalid number");
      if (n < min || n > max) throw new Error(`Number must be between ${min} and ${max}`);
      return n;
    });
}

export const OrderQuerySchema = z.object({
  limit: coerceNumberWithDefault(20, 1, 100),
  offset: coerceNumberWithDefault(0, 0, 10000),
  storeCode: z.string().optional(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  status: z.string().optional(),
});

export const RiskAnalysisSchema = z.object({
  orderId: OrderIdSchema,
});

// Rescue schemas
export const RescueActionSchema = z.object({
  orderId: OrderIdSchema,
  action: z.enum([
    "request-substitution",
    "confirm-inventory",
    "adjust-delivery-window",
    "escalate-to-store",
    "monitor-only",
  ]),
  notes: z.string().max(500).optional(),
});

// AI recommendation schemas
export const AIRecommendationSchema = z.object({
  orderId: OrderIdSchema,
  context: z.string().max(1000).optional(),
});

// Store and inventory schemas
export const StoreCodeSchema = z.string().regex(/^[A-Z]+-\d{2}$/, "Invalid store code format");
export const InventoryQuerySchema = z.object({
  storeCode: StoreCodeSchema.optional(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});

// Audit schemas
export const AuditEventSchema = z.object({
  eventType: z.string().max(100),
  entityType: z.enum(["order", "rescue", "user", "system"]),
  entityId: z.string().max(50),
  details: z.record(z.string(), z.unknown()).optional(),
});

// Risk engine output
export const RiskLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const RiskFactorSchema = z.object({
  type: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  description: z.string(),
  value: z.number().optional(),
  threshold: z.number().optional(),
});

export const RiskAnalysisResultSchema = z.object({
  orderId: OrderIdSchema,
  riskLevel: RiskLevelSchema,
  score: z.number().min(0).max(100),
  factors: z.array(RiskFactorSchema),
  reasonCodes: z.array(z.string()),
  timestamp: z.string(),
});

// Export types
export type OrderQuery = z.infer<typeof OrderQuerySchema>;
export type RiskAnalysis = z.infer<typeof RiskAnalysisSchema>;
export type RescueAction = z.infer<typeof RescueActionSchema>;
export type AIRecommendation = z.infer<typeof AIRecommendationSchema>;
export type InventoryQuery = z.infer<typeof InventoryQuerySchema>;
export type AuditEvent = z.infer<typeof AuditEventSchema>;
export type RiskLevel = z.infer<typeof RiskLevelSchema>;
export type RiskFactor = z.infer<typeof RiskFactorSchema>;
export type RiskAnalysisResult = z.infer<typeof RiskAnalysisResultSchema>;
