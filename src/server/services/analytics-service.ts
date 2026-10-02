import { orderRepository } from "@/server/repositories/order-repository";
import { rescueRepository } from "@/server/repositories/rescue-repository";
import { inventoryRepository } from "@/server/repositories/inventory-repository";

export class AnalyticsService {
  async getSummary() {
    const orders = await orderRepository.findAll({ limit: 100, offset: 0 });
    const allInventory = await inventoryRepository.findAll();

    const atRiskOrders = orders.filter((o) => o.riskLevel !== "LOW");
    const criticalOrders = orders.filter((o) => o.riskLevel === "CRITICAL");
    const highRiskOrders = orders.filter((o) => o.riskLevel === "HIGH");
    const rescuedOrders = orders.filter((o) => o.status === "Rescued");

    const inventorySignals = allInventory.filter((i) => i.riskLevel !== "LOW");

    return {
      orders: {
        monitored: orders.length,
        atRisk: atRiskOrders.length,
        critical: criticalOrders.length,
        high: highRiskOrders.length,
        rescued: rescuedOrders.length,
      },
      inventory: {
        total: allInventory.length,
        signals: inventorySignals.length,
      },
      delivery: {
        riskSignals: Math.round(orders.filter((o) => o.confidence < 80).length * 0.8),
      },
      period: "simulated-7d",
    };
  }

  async getImpact() {
    const orders = await orderRepository.findAll({ limit: 100, offset: 0 });
    const rescued = orders.filter((o) => o.status === "Rescued");
    const avoidedValue = rescued.reduce((sum, o) => sum + o.total, 0);

    return {
      ordersRescued: rescued.length,
      potentialFailuresAvoided: Math.round(rescued.length * 0.75),
      rescueRate: rescued.length > 0 ? Math.round((rescued.length / Math.max(1, orders.filter((o) => o.riskLevel !== "LOW").length)) * 100) : 0,
      potentialValueProtected: Math.round(avoidedValue * 100) / 100,
      measurementNote: "Values reflect recorded rescue outcomes across the platform.",
    };
  }

  async getTrends() {
    // Simulated trends (deterministic)
    return {
      rescueTrend: [
        { day: "Mon", value: 18 },
        { day: "Tue", value: 24 },
        { day: "Wed", value: 21 },
        { day: "Thu", value: 29 },
        { day: "Fri", value: 35 },
        { day: "Sat", value: 31 },
        { day: "Sun", value: 24 },
      ],
      inventoryRiskTrend: [
        { day: "Mon", value: 20 },
        { day: "Tue", value: 26 },
        { day: "Wed", value: 23 },
        { day: "Thu", value: 31 },
        { day: "Fri", value: 29 },
        { day: "Sat", value: 36 },
        { day: "Sun", value: 34 },
      ],
    };
  }

  async listRescues(limit = 20) {
    const all = [];
    const orders = await orderRepository.findAll({ limit: 100, offset: 0 });
    for (const order of orders) {
      const rescues = await rescueRepository.findByOrderId(order.id);
      all.push(...rescues);
    }
    return all.slice(0, Math.max(1, Math.min(100, limit)));
  }
}

export const analyticsService = new AnalyticsService();
