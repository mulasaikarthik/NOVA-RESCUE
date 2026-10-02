"use client";

import { ArrowDownUp, FilterX, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SIMULATED_ORDERS, type SimulatedOrder } from "@/lib/mock-data";
import { Button, EmptyState, RiskBadge, StatusBadge } from "@/components/ui";

const controlClass = "h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-xs text-[var(--ink)] outline-none focus-visible:border-[#7b9b80]";

type SortOption = "risk-desc" | "risk-asc" | "recent" | "oldest";

function filterOrders(
  orders: SimulatedOrder[],
  query: string,
  store: string,
  risk: string,
  status: string,
  date: string,
  sort: SortOption,
) {
  const normalized = query.trim().toLowerCase();
  const dateLimit = date === "today" ? 24 : date === "7days" ? 168 : date === "30days" ? 720 : Number.POSITIVE_INFINITY;
  return orders
    .filter((order) => {
      const matchesQuery = !normalized || [order.id, order.customer, order.store, order.storeCode].some((value) => value.toLowerCase().includes(normalized));
      const matchesStore = store === "all" || order.storeCode === store;
      const matchesRisk = risk === "all" || order.riskLevel === risk;
      const matchesStatus = status === "all" || order.status === status;
      const matchesDate = order.hoursAgo <= dateLimit;
      return matchesQuery && matchesStore && matchesRisk && matchesStatus && matchesDate;
    })
    .sort((left, right) => {
      if (sort === "risk-asc") return left.riskScore - right.riskScore;
      if (sort === "recent") return left.hoursAgo - right.hoursAgo;
      if (sort === "oldest") return right.hoursAgo - left.hoursAgo;
      return right.riskScore - left.riskScore;
    });
}

export function OrdersTable({
  compact = false,
  title,
}: {
  compact?: boolean;
  title?: string;
}) {
  const [query, setQuery] = useState("");
  const [store, setStore] = useState("all");
  const [risk, setRisk] = useState("all");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("all");
  const [sort, setSort] = useState<SortOption>("risk-desc");
  const orders = useMemo(() => filterOrders(SIMULATED_ORDERS, query, store, risk, status, date, sort), [query, store, risk, status, date, sort]);
  const hasFilters = query !== "" || store !== "all" || risk !== "all" || status !== "all" || date !== "all" || sort !== "risk-desc";

  function resetFilters() {
    setQuery("");
    setStore("all");
    setRisk("all");
    setStatus("all");
    setDate("all");
    setSort("risk-desc");
  }

  return (
    <div>
      {title ? <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-base font-semibold tracking-[-0.025em] text-[var(--ink)]">{title}</h2><p className="mt-1 text-xs text-[var(--muted)]">Search and refine the simulated order queue.</p></div><span className="hidden text-xs text-[var(--muted)] sm:block">{orders.length} shown</span></div> : null}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="relative sm:col-span-2 xl:col-span-2">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#829087]" aria-hidden="true" />
          <label htmlFor="orders-search" className="sr-only">Search by order, customer, or store</label>
          <input id="orders-search" className={`${controlClass} pl-9`} type="search" placeholder="Search orders, customers…" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div><label htmlFor="orders-date" className="sr-only">Filter by date range</label><select id="orders-date" className={controlClass} value={date} onChange={(event) => setDate(event.target.value)}><option value="all">All dates</option><option value="today">Last 24 hours</option><option value="7days">Last 7 days</option><option value="30days">Last 30 days</option></select></div>
        <div><label htmlFor="orders-store" className="sr-only">Filter by store</label><select id="orders-store" className={controlClass} value={store} onChange={(event) => setStore(event.target.value)}><option value="all">All stores</option>{Array.from(new Map(SIMULATED_ORDERS.map((order) => [order.storeCode, { code: order.storeCode, store: order.store }])).values()).map((item) => <option value={item.code} key={item.code}>{item.store}</option>)}</select></div>
        <div><label htmlFor="orders-risk" className="sr-only">Filter by risk level</label><select id="orders-risk" className={controlClass} value={risk} onChange={(event) => setRisk(event.target.value)}><option value="all">All risk levels</option><option value="CRITICAL">Critical risk</option><option value="HIGH">High risk</option><option value="MEDIUM">Medium risk</option><option value="LOW">Low risk</option></select></div>
        <div><label htmlFor="orders-status" className="sr-only">Filter by order status</label><select id="orders-status" className={controlClass} value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{["Action required", "Rescue in progress", "Needs review", "Monitoring", "Rescued", "Delivered"].map((value) => <option value={value} key={value}>{value}</option>)}</select></div>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-[var(--muted)]" aria-live="polite">Showing <span className="font-semibold text-[var(--ink)]">{orders.length}</span> of {SIMULATED_ORDERS.length} simulated orders</p>
        <div className="flex items-center gap-2">
          <label htmlFor="orders-sort" className="sr-only">Sort orders</label>
          <span className="hidden items-center gap-1 text-xs text-[var(--muted)] sm:inline-flex"><ArrowDownUp size={13} aria-hidden="true" />Sort</span>
          <select id="orders-sort" className="h-9 rounded-lg border border-[var(--line)] bg-white px-3 text-xs text-[var(--ink)]" value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
            <option value="risk-desc">Highest risk</option><option value="risk-asc">Lowest risk</option><option value="recent">Most recent</option><option value="oldest">Oldest first</option>
          </select>
          {hasFilters ? <Button variant="ghost" className="min-h-9 px-2.5 text-xs" onClick={resetFilters}><FilterX size={14} aria-hidden="true" />Reset</Button> : null}
        </div>
      </div>
      {orders.length === 0 ? (
        <EmptyState title="No orders match these filters" description="Try widening the date range or clearing one or more filters." action={<Button variant="secondary" onClick={resetFilters}>Clear all filters</Button>} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white">
          <table className={`w-full border-collapse text-left ${compact ? "min-w-[770px]" : "min-w-[920px]"}`}>
            <caption className="sr-only">Simulated NOVA RESCUE order queue with customer, store, risk, and status details.</caption>
            <thead className="bg-[#f7f9f7] text-[10px] font-semibold uppercase tracking-[0.09em] text-[#748179]">
              <tr>
                <th scope="col" className="px-4 py-3">Order</th>
                <th scope="col" className="px-4 py-3">Customer / store</th>
                <th scope="col" className="px-4 py-3">Placed</th>
                <th scope="col" className="px-4 py-3">Risk</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3 text-right">Total</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Open order</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ed]">
              {orders.slice(0, compact ? 5 : undefined).map((order) => (
                <tr key={order.id} className="group align-middle hover:bg-[#fafcfa]">
                  <td className="px-4 py-3.5"><Link href={`/operations/orders/${order.id}`} className="rounded text-xs font-semibold text-[var(--forest)] underline-offset-4 hover:underline focus-visible:underline">{order.id}</Link><p className="mt-1 text-[10px] text-[var(--muted)]">{order.itemsCount} items</p></td>
                  <td className="px-4 py-3.5"><p className="text-xs font-medium text-[var(--ink)]">{order.customer}</p><p className="mt-1 text-[10px] text-[var(--muted)]">{order.store}</p></td>
                  <td className="px-4 py-3.5 text-xs text-[var(--muted)]">{order.placedAt}</td>
                  <td className="px-4 py-3.5"><div className="flex flex-col items-start gap-1.5"><RiskBadge level={order.riskLevel} /><span className="text-[10px] text-[var(--muted)]">Score {order.riskScore}/100</span></div></td>
                  <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3.5 text-right text-xs font-semibold tabular-nums text-[var(--ink)]">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right"><Link href={`/operations/orders/${order.id}`} className="inline-flex min-h-8 items-center rounded-lg px-2.5 text-[11px] font-semibold text-[var(--forest)] hover:bg-[#edf4ed] focus-visible:outline-offset-1" aria-label={`Open order ${order.id} details`}>View<span className="sr-only"> order</span> →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          {compact && orders.length > 5 ? <div className="border-t border-[var(--line)] px-4 py-3 text-center"><Link href="/operations/orders" className="text-xs font-semibold text-[var(--forest)] hover:underline">View all {orders.length} matching orders →</Link></div> : null}
        </div>
      )}
    </div>
  );
}
