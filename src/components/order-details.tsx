"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  Package,
  ShieldAlert,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConfidenceBar } from "@/components/charts";
import { Button, Card, ConfirmDialog, EmptyState, Eyebrow, PageHeader, RiskBadge, SectionHeading, SimulatedBadge, SimulatedNotice, StatusBadge, useToast } from "@/components/ui";
import { SIMULATED_ORDERS } from "@/lib/mock-data";

function RiskScore({ score, risk }: { score: number; risk: string }) {
  const color = risk === "CRITICAL" ? "#bd554d" : risk === "HIGH" ? "#c17b44" : risk === "MEDIUM" ? "#b79649" : "#47815e";
  const circumference = 2 * Math.PI * 38;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 92 92" className="h-[82px] w-[82px] shrink-0" role="img" aria-label={`Risk score ${score} out of 100, ${risk.toLowerCase()} risk`}>
        <circle cx="46" cy="46" r="38" fill="none" stroke="#e7ece8" strokeWidth="8" />
        <circle cx="46" cy="46" r="38" fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${(score / 100) * circumference} ${circumference}`} strokeLinecap="round" transform="rotate(-90 46 46)" />
        <text x="46" y="45" textAnchor="middle" fontSize="20" fontWeight="700" fill="#172620">{score}</text>
        <text x="46" y="59" textAnchor="middle" fontSize="8" fill="#718077">/ 100</text>
      </svg>
      <div><Eyebrow>Risk score</Eyebrow><div className="mt-2"><RiskBadge level={risk as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"} /></div><p className="mt-2 text-[11px] leading-4 text-[var(--muted)]">Illustrative score · not a live prediction</p></div>
    </div>
  );
}

function InfoCard({ title, icon, children, className = "" }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <Card className={`p-4 sm:p-5 ${className}`}>
      <div className="mb-4 flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eef3ed] text-[var(--forest)]" aria-hidden="true">{icon}</span><h2 className="text-sm font-semibold text-[var(--ink)]">{title}</h2></div>
      {children}
    </Card>
  );
}

export function OrderDetailsPage({ id, customerView = false }: { id: string; customerView?: boolean }) {
  const order = SIMULATED_ORDERS.find((item) => item.id.toLowerCase() === id.toLowerCase());
  const [dialogOpen, setDialogOpen] = useState(false);
  const showToast = useToast();

  if (!order) {
    return <div className="mx-auto max-w-xl py-10"><EmptyState title="Order not found" description="This order is not available in the current dataset." action={<Link href={customerView ? "/customer/orders" : "/operations/orders"} className="inline-flex min-h-10 items-center rounded-xl bg-[var(--forest)] px-4 text-sm font-semibold text-white">Back to orders</Link>} /></div>;
  }

  const isRescued = order.status === "Rescued";
  const history = isRescued
    ? [
      { title: "Risk identified", time: "Yesterday · simulated", complete: true },
      { title: "Recommendation reviewed", time: "Operator review · simulated", complete: true },
      { title: "Customer preference applied", time: "Action recorded locally", complete: true },
      { title: "Outcome observed", time: "Completed in sample data", complete: true },
    ]
    : [
      { title: "Risk identified", time: "Today · simulated signal", complete: true },
      { title: "Recommendation prepared", time: "Decision support · simulated", complete: true },
      { title: "Operator review", time: order.status === "Action required" ? "Awaiting review" : "In progress", complete: false },
      { title: "Outcome observed", time: "Not available in this sample", complete: false },
    ];

  return (
    <>
      <PageHeader
        eyebrow={<div className="flex items-center gap-2"><SimulatedBadge /><span className="text-xs text-[var(--muted)]">Order {order.id}</span></div>}
        title={customerView ? "Order details" : `Order ${order.id}`}
        description={`${order.customer} · ${order.store} · placed ${order.placedAt}`}
        actions={<><Link href={customerView ? "/customer/orders" : "/operations/orders"} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 text-sm font-semibold text-[var(--forest)] hover:bg-[#f7f9f7]"><ArrowLeft size={15} aria-hidden="true" />Orders</Link>{!customerView ? <Button onClick={() => setDialogOpen(true)}><ShieldAlert size={15} aria-hidden="true" />Review rescue plan</Button> : null}</>}
      />
      <SimulatedNotice>Order, customer, store, inventory, delivery, and outcome details below are local illustrative data. No AI service or live NOVA CART system is connected.</SimulatedNotice>

      <div className="mb-5 grid gap-4 lg:grid-cols-[1.45fr_0.8fr]">
        <Card className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><Eyebrow>Order summary</Eyebrow><p className="mt-2 text-xl font-semibold tracking-[-0.035em] text-[var(--ink)]">{order.id}</p><p className="mt-1 text-xs text-[var(--muted)]">{order.itemsCount} items · placed {order.placedAt}</p></div><StatusBadge status={order.status} /></div>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-4 sm:grid-cols-4">
            <div><p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">Order value</p><p className="mt-1.5 text-base font-semibold tabular-nums">${order.total.toFixed(2)}</p></div>
            <div><p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">Delivery window</p><p className="mt-1.5 text-sm font-semibold">{order.eta}</p></div>
            <div><p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">Store code</p><p className="mt-1.5 text-sm font-semibold">{order.storeCode}</p></div>
            <div><p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">Basket size</p><p className="mt-1.5 text-sm font-semibold">{order.itemsCount} items</p></div>
          </div>
        </Card>
        <Card className="p-4 sm:p-5"><RiskScore score={order.riskScore} risk={order.riskLevel} /><div className="mt-4 border-t border-[var(--line)] pt-4"><ConfidenceBar value={order.confidence} label="Overall signal confidence" /></div></Card>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <InfoCard title="Customer information" icon={<UserRound size={17} />}>
          <p className="text-sm font-semibold text-[var(--ink)]">{order.customer}</p><p className="mt-1 text-xs text-[var(--muted)]">{order.email}</p>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#f5f8f5] px-3 py-2.5 text-xs text-[var(--muted)]"><Check size={14} className="text-[#397451]" aria-hidden="true" /><span>Contact preferences: simulated profile · verify before any real communication</span></div>
        </InfoCard>
        <InfoCard title="Store & fulfillment" icon={<Store size={17} />}>
          <p className="text-sm font-semibold text-[var(--ink)]">{order.store}</p><p className="mt-1 text-xs text-[var(--muted)]">Store {order.storeCode} · sample location</p>
          <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-lg border border-[var(--line)] p-3"><p className="text-[10px] text-[var(--muted)]">Store inventory confidence</p><p className="mt-1 text-sm font-semibold">{order.confidence}%</p></div><div className="rounded-lg border border-[var(--line)] p-3"><p className="text-[10px] text-[var(--muted)]">Fulfillment status</p><p className="mt-1 text-sm font-semibold">{order.status}</p></div></div>
        </InfoCard>
      </div>

      <Card className="mb-5 overflow-hidden">
        <div className="px-4 pb-3 pt-4 sm:px-5"><SectionHeading title="Products & inventory" description="Illustrative availability signals by item. Confidence is an example measure, not a store feed." /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[730px] border-collapse text-left">
            <caption className="sr-only">Simulated product availability and inventory confidence for order {order.id}</caption>
            <thead className="bg-[#f7f9f7] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#748179]"><tr><th scope="col" className="px-5 py-3">Product</th><th scope="col" className="px-4 py-3">SKU</th><th scope="col" className="px-4 py-3">Qty</th><th scope="col" className="px-4 py-3">Availability</th><th scope="col" className="px-4 py-3">Confidence</th></tr></thead>
            <tbody className="divide-y divide-[#edf0ed]">{order.products.map((product) => <tr key={product.sku}><td className="px-5 py-3 text-xs font-medium text-[var(--ink)]">{product.name}</td><td className="px-4 py-3 text-xs text-[var(--muted)]">{product.sku}</td><td className="px-4 py-3 text-xs text-[var(--muted)]">{product.quantity}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 text-xs ${product.availability === "In stock" ? "text-[#397451]" : "text-[#8a6321]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{product.availability}</span></td><td className="px-4 py-3"><ConfidenceBar value={product.confidence} label={`${product.name} confidence`} /></td></tr>)}</tbody>
          </table>
        </div>
      </Card>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <InfoCard title="Delivery status & risk" icon={<MapPin size={17} />}>
          <div className="flex items-start gap-3"><Clock3 size={17} className="mt-0.5 shrink-0 text-[var(--forest)]" aria-hidden="true" /><div><p className="text-sm font-semibold text-[var(--ink)]">{order.eta}</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Estimated window shown from illustrative order data. No carrier or route is connected.</p></div></div>
          <div className="mt-4 rounded-lg border border-[#e8ece8] bg-[#fafbfa] p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-[var(--muted)]">Delivery risk indicator</span><RiskBadge level={order.riskLevel} /></div><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{order.riskLevel === "LOW" ? "No delivery intervention suggested in the sample." : "Delivery timing is one input to review alongside store confirmation and customer preference."}</p></div>
        </InfoCard>
        <InfoCard title="Risk factors" icon={<AlertTriangle size={17} />}>
          <ul className="space-y-3">{order.riskFactors.map((factor, index) => <li key={factor} className="flex items-start gap-2.5"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#ead9a8] bg-[#fbf6e8] text-[9px] font-bold text-[#80621e]" aria-label={`Factor ${index + 1}`}>{index + 1}</span><span className="text-xs leading-5 text-[var(--ink)]">{factor}</span></li>)}</ul>
        </InfoCard>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <InfoCard title="AI explanation · simulated" icon={<Sparkles size={17} />}>
          <p className="text-xs leading-6 text-[var(--muted)]">{order.explanation}</p><p className="mt-4 border-t border-[var(--line)] pt-3 text-[10px] leading-4 text-[var(--muted)]">Generated by the NOVA RESCUE AI service (Gemini with deterministic fallback).</p>
        </InfoCard>
        <InfoCard title="AI recommendation · simulated" icon={<Package size={17} />}>
          <p className="text-xs leading-6 text-[var(--ink)]">{order.recommendation}</p><div className="mt-4 rounded-lg border border-[#dce7dd] bg-[#f4f8f3] p-3"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#46634c]">Human review required</p><p className="mt-1 text-[11px] leading-5 text-[#52685a]">Validate stock, customer preference, and policy before considering any real action.</p></div>
        </InfoCard>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <InfoCard title="Rescue action" icon={<ShieldAlert size={17} />}>
          <p className="text-xs leading-5 text-[var(--muted)]">{order.rescueAction}</p>
          {!customerView ? <Button className="mt-4 w-full" onClick={() => setDialogOpen(true)}><ShieldAlert size={14} aria-hidden="true" />Review local demo action</Button> : null}
          <p className="mt-3 text-[10px] leading-4 text-[var(--muted)]">No customer, store, or external system will be contacted.</p>
        </InfoCard>
        <InfoCard title="Rescue history" icon={<Clock3 size={17} />}>
          <ol className="space-y-3">{history.map((item, index) => <li key={item.title} className="flex items-start gap-3"><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] ${item.complete ? "border-[#c8dfd1] bg-[#eef7f0] text-[#286447]" : "border-[#e1e7e2] bg-[#f7f9f7] text-[#87948b]"}`} aria-hidden="true">{item.complete ? <Check size={12} /> : index + 1}</span><div><p className="text-xs font-medium text-[var(--ink)]">{item.title}</p><p className="mt-0.5 text-[10px] text-[var(--muted)]">{item.time}</p></div></li>)}</ol>
        </InfoCard>
      </div>

      <Card className="border-[#dce7dd] bg-[#f7faf7] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><Eyebrow>Outcome · simulated</Eyebrow><h2 className="mt-1 text-base font-semibold text-[var(--ink)]">{order.status === "Rescued" ? "Rescue outcome recorded" : "Current outcome"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{order.outcome}</p></div><StatusBadge status={order.status} /></div>
      </Card>
      <ConfirmDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Record a local demo review?" description={`This is a UI-only interaction for ${order.id}. It does not change order data, send a message, or contact a store.`} confirmLabel="Record demo decision" onConfirm={() => { setDialogOpen(false); showToast(`Demo decision recorded locally for ${order.id}.`); }}>
        <div className="rounded-xl border border-[#e4e9e5] bg-[#f8faf8] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Suggested action · simulated</p><p className="mt-2 text-sm leading-6 text-[var(--ink)]">{order.recommendation}</p></div>
      </ConfirmDialog>
    </>
  );
}
