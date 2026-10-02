"use client";

import {
  ArrowRight,
  Boxes,
  CircleAlert,
  Clock3,
  PackageCheck,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Users,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HorizontalBarChart, TrendChart } from "@/components/charts";
import { Button, Card, MetricCard, PageHeader, RiskBadge, SectionHeading, SimulatedBadge, SimulatedNotice, StatusBadge, TabsContent, TabsList, TabsRoot, TabsTrigger, ConfirmDialog, useToast } from "@/components/ui";
import { OrdersTable } from "@/components/order-table";
import { RESCUE_STEPS, SIMULATED_ORDERS, trendData } from "@/lib/mock-data";

const weeklyTrend = [
  { label: "Wk 1", value: 340 },
  { label: "Wk 2", value: 390 },
  { label: "Wk 3", value: 368 },
  { label: "Wk 4", value: 452 },
  { label: "Wk 5", value: 418 },
  { label: "Wk 6", value: 510 },
  { label: "Wk 7", value: 476 },
];

export function OperationsDashboard() {
  return (
    <>
      <PageHeader
        eyebrow={<SimulatedBadge />}
        title="Operations command center"
        description="A prioritized view of simulated order health, emerging risk, and rescue activity."
        actions={<Link href="/operations/orders" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-sm font-semibold text-white hover:bg-[var(--forest-deep)]">Open order queue <ArrowRight size={15} aria-hidden="true" /></Link>}
      />
      <SimulatedNotice />
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Orders monitored" value="1,248" icon={<PackageCheck size={18} />} change="+8.2%" note="vs. prior simulated period" />
        <MetricCard label="At-risk orders" value="46" icon={<ShieldAlert size={18} />} change="3.7%" note="of monitored orders" />
        <MetricCard label="Critical orders" value="8" icon={<CircleAlert size={18} />} note="2 awaiting operator review" />
        <MetricCard label="Rescued orders" value="182" icon={<ShieldCheck size={18} />} change="14.6%" note="recorded rescue outcomes" />
        <MetricCard label="Potential failures avoided" value="$18.4k" icon={<ShieldCheck size={18} />} note="simulated estimate, not realized value" />
        <MetricCard label="Inventory risk" value="23 SKUs" icon={<Boxes size={18} />} note="across 7 sample stores" />
        <MetricCard label="Delivery risk" value="14 routes" icon={<Truck size={18} />} note="within the demo review window" />
        <MetricCard label="Support signals" value="11" icon={<Users size={18} />} note="simulated escalation indicators" />
      </div>
      <div className="mb-6 grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <div>
          <SectionHeading title="Risk signals over time" description="Illustrative at-risk order volume by reporting period." />
          <TabsRoot defaultValue="week" className="rounded-2xl">
            <TabsList aria-label="Risk chart time period" className="mb-3 inline-flex rounded-lg border border-[var(--line)] bg-white p-1">
              <TabsTrigger value="week" className="rounded-md px-3 py-1.5 text-xs font-medium text-[var(--muted)] data-[state=active]:bg-[#edf3ec] data-[state=active]:text-[var(--forest)]">Last 7 days</TabsTrigger>
              <TabsTrigger value="trend" className="rounded-md px-3 py-1.5 text-xs font-medium text-[var(--muted)] data-[state=active]:bg-[#edf3ec] data-[state=active]:text-[var(--forest)]">Weekly trend</TabsTrigger>
            </TabsList>
            <TabsContent value="week"><TrendChart title="At-risk orders" description="Number of orders flagged for review each day in the simulated reporting period." data={trendData} unitLabel="orders" /></TabsContent>
            <TabsContent value="trend"><TrendChart title="Weekly at-risk volume" description="Weekly simulated orders flagged for review across seven reporting periods." data={weeklyTrend} unitLabel="orders" /></TabsContent>
          </TabsRoot>
        </div>
        <HorizontalBarChart
          title="Active risk signal mix"
          description="Flagged indicators grouped by operational source. An order can have multiple signals."
          rows={[
            { label: "Inventory uncertainty", value: 23, detail: "SKU signals across sample stores" },
            { label: "Delivery window pressure", value: 14, detail: "Route / timing indicators" },
            { label: "Pick capacity variance", value: 9, detail: "Compared with the sample baseline" },
            { label: "Support escalation signals", value: 6, detail: "Potential contact triggers" },
          ]}
          tone="amber"
        />
      </div>
      <Card className="p-4 sm:p-5">
        <OrdersTable compact title="Priority order review" />
      </Card>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#dce7dd] bg-[#f4f8f3] px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-[#455d4b]"><Clock3 size={15} aria-hidden="true" /><span>Demo view refreshed locally · not connected to live systems</span></div>
        <Link href="/operations/rescue" className="text-xs font-semibold text-[var(--forest)] hover:underline">Open rescue workflow →</Link>
      </div>
    </>
  );
}

export function OrdersPage() {
  return (
    <>
      <PageHeader eyebrow={<SimulatedBadge />} title="Order monitoring" description="Find, filter, and review individual simulated orders before considering a rescue action." actions={<Link href="/operations/rescue" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-4 text-sm font-semibold text-[var(--forest)] hover:bg-[#f7f9f7]"><Workflow size={15} aria-hidden="true" />Rescue queue</Link>} />
      <SimulatedNotice />
      <Card className="p-4 sm:p-5"><OrdersTable title="All monitored orders" /></Card>
    </>
  );
}

export function RescueQueuePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const showToast = useToast();
  const queue = SIMULATED_ORDERS.filter((order) => ["Action required", "Rescue in progress", "Needs review"].includes(order.status)).sort((a, b) => b.riskScore - a.riskScore);
  const selectedOrder = queue.find((order) => order.id === selectedId);

  return (
    <>
      <PageHeader eyebrow={<SimulatedBadge />} title="Rescue workflow" description="A human-reviewed sequence from early signal to documented outcome." actions={<Link href="/operations/orders" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-4 text-sm font-semibold text-[var(--forest)] hover:bg-[#f7f9f7]">All orders <ArrowRight size={15} aria-hidden="true" /></Link>} />
      <SimulatedNotice />
      <div className="mb-6 grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <Card className="p-4 sm:p-6">
          <SectionHeading title="From signal to outcome" description="The review path keeps recommendation and action separate, with a clear human approval point." />
          <ol className="mt-5">
            {RESCUE_STEPS.map((step, index) => (
              <li key={step.title} className="relative flex gap-4 pb-5 last:pb-0">
                {index < RESCUE_STEPS.length - 1 ? <span className="absolute left-[17px] top-9 h-[calc(100%-1rem)] w-px bg-[#dce5dd]" aria-hidden="true" /> : null}
                <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-xs font-bold ${index === 4 ? "border-[#d7e7b5] bg-[#f1f8e7] text-[#46652d]" : "border-[#e2e9e3] bg-[#f7f9f7] text-[var(--forest)]"}`} aria-label={`Step ${index + 1}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[var(--ink)]">{step.title}</h3>
                    <span className="rounded-full bg-[#f1f4f1] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{step.owner}</span>
                  </div>
                  <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--muted)]">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
        <Card className="p-4 sm:p-5">
          <SectionHeading title="Needs operator attention" description={`${queue.length} open simulated cases · highest risk first`} />
          <ul className="divide-y divide-[#edf0ed]">
            {queue.map((order) => (
              <li key={order.id} className="py-4 first:pt-1 last:pb-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/operations/orders/${order.id}`} className="text-xs font-semibold text-[var(--forest)] hover:underline">{order.id}<span className="sr-only"> order detail</span></Link>
                    <p className="mt-1 truncate text-sm font-medium text-[var(--ink)]">{order.customer}</p>
                    <p className="mt-1 truncate text-[11px] text-[var(--muted)]">{order.store}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2"><RiskBadge level={order.riskLevel} /><span className="text-[10px] text-[var(--muted)]">Score {order.riskScore}</span></div>
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{order.riskFactors[0]}</p>
                <div className="mt-3 flex items-center justify-between gap-2"><StatusBadge status={order.status} /><Button variant="outline" className="min-h-8 px-2.5 text-[11px]" onClick={() => setSelectedId(order.id)}>Review plan</Button></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-sm font-semibold text-[var(--ink)]">Workflow guardrails</h2><p className="mt-1 text-xs text-[var(--muted)]">The operator remains responsible for any real-world decision.</p></div><span className="rounded-full border border-[#dce7dd] bg-[#f4f8f3] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#42614a]">Human approval required</span></div>
      </Card>
      <ConfirmDialog
        open={selectedOrder !== undefined}
        onOpenChange={(open) => { if (!open) setSelectedId(null); }}
        title="Review simulated rescue plan"
        description={selectedOrder ? `Order ${selectedOrder.id} · ${selectedOrder.customer}. Confirm before dispatching to customer or store.` : ""}
        confirmLabel="Record demo review"
        onConfirm={() => { if (selectedOrder) showToast(`Demo review recorded locally for ${selectedOrder.id}. No external action taken.`); setSelectedId(null); }}
      >
        {selectedOrder ? <div className="rounded-xl border border-[#e5ebe6] bg-[#f8faf8] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Recommendation · simulated</p><p className="mt-2 text-sm leading-6 text-[var(--ink)]">{selectedOrder.recommendation}</p><div className="mt-3"><RiskBadge level={selectedOrder.riskLevel} /></div></div> : null}
      </ConfirmDialog>
    </>
  );
}
