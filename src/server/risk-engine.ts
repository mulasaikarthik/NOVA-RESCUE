import type { OrderRecord } from "@/server/data/seed";
import type { RiskAnalysisResult, RiskFactor, RiskLevel } from "@/server/schemas";

/**
 * Deterministic risk engine.
 * Computes risk score and factors using rule-based logic on order, inventory, and delivery signals.
 * This runs BEFORE any AI service (Gemini) and does not depend on external APIs.
 */
export function computeRiskAnalysis(order: OrderRecord): RiskAnalysisResult {
  const factors: RiskFactor[] = [];
  let score = 0;

  // Inventory risk
  const lowConfidenceProducts = order.products.filter((p) => p.confidence < 70);
  if (lowConfidenceProducts.length > 0) {
    const severity = lowConfidenceProducts.length > 2 ? "high" : lowConfidenceProducts.length > 1 ? "medium" : "low";
    factors.push({
      type: "inventory",
      severity,
      description: `${lowConfidenceProducts.length} product(s) have low inventory confidence`,
      value: lowConfidenceProducts.length,
      threshold: 70,
    });
    score += lowConfidenceProducts.length * 12;
  }

  const unavailableProducts = order.products.filter((p) => p.availability === "Unavailable" || p.availability === "Unconfirmed");
  if (unavailableProducts.length > 0) {
    factors.push({
      type: "inventory",
      severity: unavailableProducts.length > 1 ? "critical" : "high",
      description: `${unavailableProducts.length} product(s) unavailable or unconfirmed`,
      value: unavailableProducts.length,
    });
    score += unavailableProducts.length * 18;
  }

  // Delivery risk (based on hours ago and risk score hint)
  if (order.hoursAgo > 20) {
    factors.push({
      type: "delivery",
      severity: "medium",
      description: "Order placed more than 20 hours ago",
      value: order.hoursAgo,
      threshold: 20,
    });
    score += 8;
  }

  // Order complexity
  if (order.itemsCount > 10) {
    factors.push({
      type: "complexity",
      severity: "medium",
      description: "Large basket requires additional picking time",
      value: order.itemsCount,
      threshold: 10,
    });
    score += 10;
  }

  // Store reliability (from order confidence)
  if (order.confidence < 75) {
    factors.push({
      type: "store",
      severity: order.confidence < 60 ? "high" : "medium",
      description: "Store inventory confidence below target",
      value: order.confidence,
      threshold: 75,
    });
    score += order.confidence < 60 ? 15 : 8;
  }

  // Substitution risk
  const substitutionSignals = order.riskFactors.filter((f) => f.toLowerCase().includes("substitut"));
  if (substitutionSignals.length > 0) {
    factors.push({
      type: "substitution",
      severity: "medium",
      description: "Substitution opportunity detected",
    });
    score += 5;
  }

  // Clamp score
  score = Math.min(100, Math.max(0, score));

  // Determine risk level
  const riskLevel: RiskLevel =
    score >= 85 ? "CRITICAL" : score >= 65 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";

  // Reason codes
  const reasonCodes = factors.map((f) => `${f.type.toUpperCase()}_${f.severity.toUpperCase()}`);

  return {
    orderId: order.id,
    riskLevel,
    score,
    factors,
    reasonCodes,
    timestamp: new Date().toISOString(),
  };
}
