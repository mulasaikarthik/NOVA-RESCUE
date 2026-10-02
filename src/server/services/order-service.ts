import { orderRepository } from "@/server/repositories/order-repository";
import { riskRepository } from "@/server/repositories/risk-repository";
import type { OrderQuery } from "@/server/schemas";
import { NotFoundError } from "@/server/errors";

export class OrderService {
  async findById(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError(`Order ${orderId} not found.`);
    const risk = await riskRepository.findByOrderId(orderId);
    return { order, risk };
  }

  async findAll(query: OrderQuery) {
    const orders = await orderRepository.findAll(query);
    const riskResults = await riskRepository.findByOrderIds(orders.map((o) => o.id));
    const riskMap = new Map(riskResults.map((r) => [r.orderId, r]));
    return orders.map((order) => ({ order, risk: riskMap.get(order.id) ?? null }));
  }
}

export const orderService = new OrderService();
