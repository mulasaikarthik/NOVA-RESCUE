import { analyticsService } from "@/server/services/analytics-service";
import { orderService } from "@/server/services/order-service";
import { Card, MetricCard, PageHeader } from "@/components/ui";
import { Activity, PackageCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";

/**
 * Live operations dashboard — Server Component that calls the service layer directly.
 * Demonstrates the connected workflow. All data comes from the real backend services.
 */
export const dynamic = "force-dynamic";

export default async function LiveOperationsPage() {
  const [analytics, ordersResult] = await Promise.all([
    analyticsService.getSummary(),
    orderService.findAll({ limit: 10, offset: 0 }),
  ]);

  return (
    <>
      <PageHeader
        title="Operations dashboard"
        description="Real-time metrics, orders, and rescue activity from the live backend services."
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Orders monitored" value={String(analytics.orders.monitored)} icon={<PackageCheck size={18} />} />
        <MetricCard label="At-risk orders" value={String(analytics.orders.atRisk)} icon={<ShieldAlert size={18} />} />
        <MetricCard label="Critical orders" value={String(analytics.orders.critical)} icon={<Activity size={18} />} />
        <MetricCard label="Rescued orders" value={String(analytics.orders.rescued)} icon={<ShieldCheck size={18} />} />
      </div>
      <Card className="p-5">
        <h2 className="mb-4 text-base font-semibold">Priority orders from orderService</h2>
        <div className="space-y-3">
          {ordersResult.map(({ order, risk }) => (
            <Link key={order.id} href={`/operations/live/${order.id}`} className="block rounded-lg border border-[var(--line)] p-3 transition hover:border-[var(--forest)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{order.id}</p>
                  <p className="text-xs text-[var(--muted)]">{order.customer} · {order.store}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold">{order.status}</p>
                  <p className="text-xs text-[var(--muted)]">Risk {risk?.score ?? order.riskScore}/100 · {risk?.riskLevel ?? order.riskLevel}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}
