import { orderService } from "@/server/services/order-service";
import { aiService } from "@/server/services/ai-service";
import { riskService } from "@/server/services/risk-service";
import { rescueRepository } from "@/server/repositories/rescue-repository";
import { Card, PageHeader, RiskBadge, StatusBadge, Button } from "@/components/ui";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Workflow, CheckCircle } from "lucide-react";
import { createRescue, recordOutcome, requestRecommendation } from "../actions";

export const dynamic = "force-dynamic";

export default async function LiveOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let orderData;
  try {
    orderData = await orderService.findById(id);
  } catch {
    notFound();
  }

  const { order, risk } = orderData;

  // Get risk analysis if not cached
  const riskAnalysis = risk ?? (await riskService.getAnalysis(id));

  // Get existing rescues for this order
  const rescues = await rescueRepository.findByOrderId(id);

  return (
    <>
      <PageHeader
        title={`Order ${order.id}`}
        description="Connected workflow: risk analysis → AI recommendation → rescue action → outcome → analytics"
      />

      <Link href="/operations/live" className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--forest)] hover:underline">
        <ArrowLeft size={14} /> Back to dashboard
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Summary */}
        <Card className="p-5">
          <h2 className="mb-4 text-base font-semibold">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[var(--muted)]">Customer:</span><span className="font-medium">{order.customer}</span></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Store:</span><span className="font-medium">{order.store}</span></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Status:</span><StatusBadge status={order.status} /></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Total:</span><span className="font-semibold">${order.total.toFixed(2)}</span></div>
          </div>
        </Card>

        {/* Risk Analysis */}
        <Card className="p-5">
          <h2 className="mb-4 text-base font-semibold">Deterministic risk analysis</h2>
          <div className="mb-3 flex items-center gap-3">
            <RiskBadge level={riskAnalysis.riskLevel} />
            <span className="text-sm font-semibold">{riskAnalysis.score}/100</span>
          </div>
          <div className="space-y-2">
            {riskAnalysis.factors.map((factor, i) => (
              <div key={i} className="rounded-lg border border-[var(--line)] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{factor.type} · {factor.severity}</p>
                <p className="mt-1 text-sm">{factor.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Recommendation */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--forest)]" />
            <h2 className="text-base font-semibold">AI recommendation</h2>
          </div>
          <form action={requestRecommendation} className="space-y-3">
            <input type="hidden" name="orderId" value={order.id} />
            <textarea
              name="context"
              placeholder="Optional: operator context (e.g., 'Customer called and wants oat milk instead')"
              className="w-full rounded-lg border border-[var(--line)] p-3 text-sm"
              rows={2}
            />
            <Button type="submit" variant="outline" className="w-full">
              <Sparkles size={14} /> Generate recommendation
            </Button>
          </form>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Uses Gemini when GEMINI_API_KEY is configured; otherwise returns deterministic fallback.
          </p>
        </Card>

        {/* Rescue Action */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Workflow size={18} className="text-[var(--forest)]" />
            <h2 className="text-base font-semibold">Rescue action</h2>
          </div>
          <form action={createRescue} className="space-y-3">
            <input type="hidden" name="orderId" value={order.id} />
            <select name="action" className="w-full rounded-lg border border-[var(--line)] p-3 text-sm" required>
              <option value="">Select action...</option>
              <option value="request-substitution">Request substitution</option>
              <option value="confirm-inventory">Confirm inventory</option>
              <option value="adjust-delivery-window">Adjust delivery window</option>
              <option value="escalate-to-store">Escalate to store</option>
              <option value="monitor-only">Monitor only</option>
            </select>
            <textarea
              name="notes"
              placeholder="Notes for the rescue action"
              className="w-full rounded-lg border border-[var(--line)] p-3 text-sm"
              rows={2}
            />
            <Button type="submit" className="w-full">
              <Workflow size={14} /> Create rescue
            </Button>
          </form>
        </Card>

        {/* Rescue History */}
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold">Rescue history</h2>
          {rescues.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No rescue actions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {rescues.map((rescue) => (
                <div key={rescue.id} className="rounded-lg border border-[var(--line)] p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold">{rescue.id}</p>
                      <p className="text-xs text-[var(--muted)]">Action: {rescue.action}</p>
                      {rescue.notes && <p className="mt-1 text-xs text-[var(--muted)]">{rescue.notes}</p>}
                    </div>
                    <StatusBadge status={rescue.status === "executed" ? "Rescued" : rescue.status === "approved" ? "In progress" : rescue.status} />
                  </div>
                  {rescue.status === "approved" && (
                    <form action={recordOutcome} className="mt-3 flex gap-2">
                      <input type="hidden" name="rescueId" value={rescue.id} />
                      <select name="outcome" className="rounded-lg border border-[var(--line)] p-2 text-xs" required>
                        <option value="">Record outcome...</option>
                        <option value="rescued">Rescued</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="monitoring">Monitoring</option>
                      </select>
                      <input name="notes" placeholder="Notes" className="flex-1 rounded-lg border border-[var(--line)] p-2 text-xs" />
                      <Button type="submit" variant="outline">
                        <CheckCircle size={12} /> Record
                      </Button>
                    </form>
                  )}
                  {rescue.outcome && (
                    <p className="mt-2 text-xs text-[var(--forest)]">
                      ✓ Outcome: {rescue.outcome}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
