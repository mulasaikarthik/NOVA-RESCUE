import { orderRepository } from "@/server/repositories/order-repository";
import { riskRepository } from "@/server/repositories/risk-repository";
import { computeRiskAnalysis } from "@/server/risk-engine";
import { NotFoundError } from "@/server/errors";
import type { RiskAnalysisResult } from "@/server/schemas";

export class RiskService {
  async analyze(orderId: string): Promise<RiskAnalysisResult> {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError(`Order ${orderId} not found.`);

    // Deterministic risk engine runs first — no AI dependency
    const analysis = computeRiskAnalysis(order);
    await riskRepository.save(analysis);
    return analysis;
  }

  async getAnalysis(orderId: string): Promise<RiskAnalysisResult> {
    const cached = await riskRepository.findByOrderId(orderId);
    if (cached) return cached;
    return this.analyze(orderId);
  }
}

export const riskService = new RiskService();
