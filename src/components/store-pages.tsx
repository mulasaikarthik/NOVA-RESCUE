"use client";

import { ArrowRight, Boxes, Check, CircleAlert, PackageSearch, RefreshCw, Search, ShoppingBasket, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ConfidenceBar, HorizontalBarChart, TrendChart } from "@/components/charts";
import { Button, Card, MetricCard, PageHeader, RiskBadge, SectionHeading, SimulatedBadge, SimulatedNotice, useToast } from "@/components/ui";
import { INVENTORY_ITEMS, STORES } from "@/lib/mock-data";

const inputClass = "h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-xs text-[var(--ink)] outline-none focus-visible:border-[#7b9b80]";

function InventoryTable() {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("all");
  const [store, setStore] = useState("all");
  const showToast = useToast();
  const items = useMemo(() => INVENTORY_ITEMS.filter((item) => {
    const matchesQuery = !query || `${item.name} ${item.sku} ${item.store}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesRisk = risk === "all" || item.risk === risk;
    const matchesStore = store === "all" || item.store === store;
    return matchesQuery && matchesRisk && matchesStore;
  }), [query, risk, store]);
  return (
    <>
      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="relative"><Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#829087]" aria-hidden="true" /><label className="sr-only" htmlFor="inventory-search">Search products or SKUs</label><input id="inventory-search" value={query} onChange={(event) => setQuery(event.target.value)} className={`${inputClass} w-full pl-9`} type="search" placeholder="Search product, SKU, store…" /></div>
        <div><label className="sr-only" htmlFor="inventory-risk">Filter by risk</label><select id="inventory-risk" value={risk} onChange={(event) => setRisk(event.target.value)} className={`${inputClass} w-full`}><option value="all">All risk levels</option><option value="CRITICAL">Critical</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option></select></div>
        <div><label className="sr-only" htmlFor="inventory-store">Filter by store</label><select id="inventory-store" value={store} onChange={(event) => setStore(event.target.value)} className={`${inputClass} w-full`}><option value="all">All stores</option>{Array.from(new Set(INVENTORY_ITEMS.map((item) => item.store))).map((name) => <option key={name} value={name}>{name}</option>)}</select></div>
      </div>
      <p className="mb-3 text-xs text-[var(--muted)]" aria-live="polite">Showing {items.length} of {INVENTORY_ITEMS.length} simulated product signals</p>
      {items.length ? <div className="overflow-x-auto rounded-xl border border-[var(--line)]"><table className="w-full min-w-[880px] border-collapse text-left">
        <caption className="sr-only">Simulated store inventory confidence, demand, risk, and substitution opportunities.</caption>
        <thead className="bg-[#f7f9f7] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#748179]"><tr><th scope="col" className="px-4 py-3">Product</th><th scope="col" className="px-4 py-3">Store</th><th scope="col" className="px-4 py-3">Inventory confidence</th><th scope="col" className="px-4 py-3">On hand · est.</th><th scope="col" className="px-4 py-3">Demand</th><th scope="col" className="px-4 py-3">Risk</th><th scope="col" className="px-4 py-3">Opportunity</th><th scope="col" className="px-4 py-3"><span className="sr-only">Review</span></th></tr></thead>
        <tbody className="divide-y divide-[#edf0ed]">{items.map((item) => <tr key={item.sku} className="hover:bg-[#fafcfa]"><td className="px-4 py-3"><p className="text-xs font-medium text-[var(--ink)]">{item.name}</p><p className="mt-1 text-[10px] text-[var(--muted)]">{item.sku}</p></td><td className="px-4 py-3 text-xs text-[var(--muted)]">{item.store}</td><td className="px-4 py-3"><ConfidenceBar value={item.confidence} label={`${item.name} inventory confidence`} /></td><td className="px-4 py-3 text-xs text-[var(--muted)]">{item.onHand}</td><td className="px-4 py-3 text-xs text-[var(--ink)]">{item.demand}</td><td className="px-4 py-3"><RiskBadge level={item.risk} /></td><td className="px-4 py-3 text-xs text-[var(--muted)]">{item.opportunity}</td><td className="px-4 py-3 text-right"><Button variant="ghost" className="min-h-8 whitespace-nowrap px-2.5 text-[10px]" onClick={() => showToast(`Demo review opened for ${item.sku}. No inventory updated.`)}>Review</Button></td></tr>)}</tbody>
      </table></div> : <div className="rounded-xl border border-dashed border-[#d6dfd9] p-10 text-center"><p className="text-sm font-semibold">No product signals match</p><p className="mt-1 text-xs text-[var(--muted)]">Change the filters to see other simulated items.</p></div>}
    </>
  );
}

export function InventoryPage() {
  return <>
    <PageHeader eyebrow={<SimulatedBadge />} title="Store inventory" description="Surface inventory confidence, unavailable products, and substitution opportunities before they affect an order." actions={<Link href="/store/insights" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-4 text-sm font-semibold text-[var(--forest)] hover:bg-[#f7f9f7]">Store insights <ArrowRight size={15} /></Link>} />
    <SimulatedNotice>Inventory counts and demand indicators are fixed demo examples, not live store or NOVA CART inventory.</SimulatedNotice>
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Inventory confidence" value="87%" icon={<Boxes size={18} />} note="weighted simulated estimate" /><MetricCard label="Unavailable products" value="8" icon={<CircleAlert size={18} />} note="across the demo catalog" /><MetricCard label="Substitution opportunities" value="14" icon={<RefreshCw size={18} />} note="preference-aware suggestions" /><MetricCard label="High-risk products" value="6" icon={<PackageSearch size={18} />} note="below confidence threshold" /></div>
    <Card className="p-4 sm:p-5"><SectionHeading title="Inventory signals" description="Search by product, filter by store or risk, and inspect confidence before considering a substitution." /><InventoryTable /></Card>
  </>;
}

export function StoreOverviewPage() {
  const showToast = useToast();
  return <>
    <PageHeader eyebrow={<SimulatedBadge />} title="Store operations" description="A simulated view of store-level fulfillment health and inventory signals." actions={<Link href="/store/inventory" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-sm font-semibold text-white hover:bg-[var(--forest-deep)]">Explore inventory <ArrowRight size={15} /></Link>} />
    <SimulatedNotice />
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Stores in sample" value="7" icon={<Boxes size={18} />} note="illustrative locations" /><MetricCard label="Average inventory confidence" value="90%" icon={<Check size={18} />} change="+2.4 pts" note="simulated week over week" /><MetricCard label="At-risk store indicators" value="12" icon={<CircleAlert size={18} />} note="review thresholds crossed" /><MetricCard label="Potential substitutions" value="14" icon={<ShoppingBasket size={18} />} note="examples for operator review" /></div>
    <Card className="mb-5 overflow-hidden"><div className="p-4 sm:p-5"><SectionHeading title="Store indicators" description="Availability, delivery, and order volume signals by sample location." /></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left"><caption className="sr-only">Simulated store indicators</caption><thead className="bg-[#f7f9f7] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#748179]"><tr><th scope="col" className="px-5 py-3">Store</th><th scope="col" className="px-4 py-3">Inventory confidence</th><th scope="col" className="px-4 py-3">Orders</th><th scope="col" className="px-4 py-3">Unavailable SKUs</th><th scope="col" className="px-4 py-3">Late delivery signal</th><th scope="col" className="px-4 py-3">Indicator</th></tr></thead><tbody className="divide-y divide-[#edf0ed]">{STORES.map((store) => <tr key={store.code}><td className="px-5 py-3.5"><p className="text-xs font-medium text-[var(--ink)]">{store.name}</p><p className="mt-1 text-[10px] text-[var(--muted)]">{store.code}</p></td><td className="px-4 py-3"><ConfidenceBar value={store.confidence} label={`${store.name} inventory confidence`} /></td><td className="px-4 py-3 text-xs text-[var(--muted)]">{store.orders}</td><td className="px-4 py-3 text-xs text-[var(--muted)]">{store.unavailable}</td><td className="px-4 py-3 text-xs text-[var(--muted)]">{store.lateRate}</td><td className="px-4 py-3"><span className="rounded-full border border-[#e5e9e5] bg-[#f6f8f6] px-2.5 py-1 text-[10px] font-medium text-[var(--muted)]">{store.risk}</span></td></tr>)}</tbody></table></div></Card>
    <div className="grid gap-4 md:grid-cols-2"><Card className="p-5"><Sparkles size={19} className="text-[var(--forest)]" aria-hidden="true" /><h2 className="mt-3 text-sm font-semibold">Recommendation · simulated</h2><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Prioritize a shelf-count confirmation at North Loop before suggesting a dairy substitution to a customer.</p><Button variant="outline" className="mt-4" onClick={() => showToast("Store recommendation saved in this demo view only.")}>Review recommendation</Button></Card><Card className="p-5"><TrendingUp size={19} className="text-[var(--forest)]" aria-hidden="true" /><h2 className="mt-3 text-sm font-semibold">Demand indicators</h2><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Fresh produce demand is rising in two sample stores. See how demand context connects with item risk.</p><Link href="/store/insights" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--forest)] hover:underline">Explore store insights <ArrowRight size={13} /></Link></Card></div>
  </>;
}

export function StoreInsightsPage() {
  return <>
    <PageHeader eyebrow={<SimulatedBadge />} title="Store insights" description="Connect demand indicators, product availability, and store-level fulfillment risk." actions={<Link href="/store/inventory" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-4 text-sm font-semibold text-[var(--forest)] hover:bg-[#f7f9f7]"><Boxes size={15} />Inventory</Link>} />
    <SimulatedNotice />
    <div className="mb-5 grid gap-4 xl:grid-cols-[1.4fr_1fr]"><TrendChart title="Sample demand index" description="An illustrative weekly relative demand index. It is not a forecast or live sales feed." data={[{ label: "Mon", value: 46 }, { label: "Tue", value: 50 }, { label: "Wed", value: 53 }, { label: "Thu", value: 59 }, { label: "Fri", value: 66 }, { label: "Sat", value: 78 }, { label: "Sun", value: 72 }]} unitLabel="index points" /><HorizontalBarChart title="Products with highest risk" description="Risk score for selected simulated product signals." rows={INVENTORY_ITEMS.slice(0, 5).map((item) => ({ label: item.name, value: 100 - item.confidence, detail: `${item.store} · ${item.confidence}% inventory confidence` }))} suffix="%" tone="amber" /></div>
    <SectionHeading title="Store recommendations" description="Specific, reviewable examples—not automated store instructions." />
    <div className="grid gap-3 md:grid-cols-3"><RecommendationCard number="01" title="Confirm shelf count" description="Verify the whole-milk count at North Loop before offering an alternative." evidence="42% confidence · 2 estimated on hand" /><RecommendationCard number="02" title="Use known preferences" description="Present a customer-approved oat-milk option when a requested item cannot be picked." evidence="Preference captured in simulated profile" /><RecommendationCard number="03" title="Watch fresh produce" description="Review the morning replenishment and pick rate for berries in Lakeview." evidence="Demand rising · confidence below target" /></div>
  </>;
}

function RecommendationCard({ number, title, description, evidence }: { number: string; title: string; description: string; evidence: string }) {
  return <Card className="p-4 sm:p-5"><span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-[#eef3ed] px-2 text-[10px] font-bold text-[var(--forest)]">{number}</span><h3 className="mt-3 text-sm font-semibold text-[var(--ink)]">{title}</h3><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{description}</p><p className="mt-4 border-t border-[var(--line)] pt-3 text-[10px] leading-4 text-[#617267]">Signal: {evidence}</p></Card>;
}
