"use client";

import { ArrowRight, ClipboardList, KeyRound, ShieldCheck, UserCog, Users } from "lucide-react";
import Link from "next/link";
import { Card, PageHeader, SectionHeading, SimulatedBadge, SimulatedNotice, StatusBadge, useToast } from "@/components/ui";
import { SIMULATED_ORDERS } from "@/lib/mock-data";

const demoUsers = [
  { name: "Taylor Reed", email: "taylor.reed@example.test", role: "Operations lead", scope: "All sample stores", status: "Active", lastSeen: "Today · simulated" },
  { name: "Morgan Lewis", email: "morgan.lewis@example.test", role: "Store manager", scope: "North Loop · Minneapolis", status: "Active", lastSeen: "Yesterday · simulated" },
  { name: "Riley Shah", email: "riley.shah@example.test", role: "Support reviewer", scope: "Customer support", status: "Active", lastSeen: "Mar 12 · simulated" },
  { name: "Casey Jordan", email: "casey.jordan@example.test", role: "Read-only analyst", scope: "Sample analytics", status: "Invited", lastSeen: "Not yet · simulated" },
];

export function CustomerOverviewPage() {
  const order = SIMULATED_ORDERS[0];
  return <>
    <PageHeader eyebrow={<SimulatedBadge />} title="Customer order center" description="A customer-facing view of simulated order status and fulfillment updates." actions={<Link href="/customer/orders" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-sm font-semibold text-white hover:bg-[var(--forest-deep)]">View demo orders <ArrowRight size={15} /></Link>} />
    <SimulatedNotice>Customer names, email addresses, orders, and status messages below are fictional UI examples. This is not connected to a customer account.</SimulatedNotice>
    <Card className="mb-5 overflow-hidden"><div className="border-b border-[var(--line)] bg-[#fbfcfb] p-5 sm:p-6"><p className="text-xs text-[var(--muted)]">Sample customer profile</p><h2 className="mt-1 text-lg font-semibold">{order.customer}</h2><p className="mt-1 text-xs text-[var(--muted)]">{order.email}</p></div><div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--muted)]">Latest demo order</p><Link href={`/customer/orders/${order.id}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--forest)] hover:underline">{order.id}<ArrowRight size={13} /></Link></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--muted)]">Fulfillment status</p><div className="mt-2"><StatusBadge status={order.status} /></div></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--muted)]">Delivery estimate</p><p className="mt-2 text-sm font-semibold">{order.eta}</p></div></div></Card>
    <div className="grid gap-4 md:grid-cols-2"><Card className="p-5"><h3 className="text-sm font-semibold">Preference-aware updates</h3><p className="mt-2 text-xs leading-5 text-[var(--muted)]">A future experience could share important changes and request approval for a suggested replacement.</p></Card><Card className="p-5"><h3 className="text-sm font-semibold">Your data, handled carefully</h3><p className="mt-2 text-xs leading-5 text-[var(--muted)]">This UI prototype has no real customer profile, messaging, saved preference, or sign-in connection.</p></Card></div>
  </>;
}

export function CustomerOrdersPage() {
  return <>
    <PageHeader eyebrow={<SimulatedBadge />} title="Your demo orders" description="Track a sample order and review its illustrative status history." />
    <SimulatedNotice>All orders below are synthetic examples. No real order lookup or customer account is available.</SimulatedNotice>
    <Card className="overflow-hidden"><div className="p-4 sm:p-5"><SectionHeading title="Order history" description="Open an order for its sample details and timeline." /></div><div className="divide-y divide-[#edf0ed]">{SIMULATED_ORDERS.slice(0, 6).map((order) => <article key={order.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="flex min-w-0 items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eef3ed] text-[var(--forest)]"><ClipboardList size={17} aria-hidden="true" /></span><div className="min-w-0"><Link href={`/customer/orders/${order.id}`} className="text-xs font-semibold text-[var(--forest)] hover:underline">{order.id}<span className="sr-only"> order details</span></Link><p className="mt-1 truncate text-xs text-[var(--muted)]">{order.store} · {order.itemsCount} items · {order.placedAt}</p></div></div><div className="flex items-center justify-between gap-3 sm:justify-end"><StatusBadge status={order.status} /><span className="text-xs font-semibold tabular-nums">${order.total.toFixed(2)}</span><Link href={`/customer/orders/${order.id}`} className="inline-flex min-h-9 items-center rounded-lg px-2 text-[11px] font-semibold text-[var(--forest)] hover:bg-[#edf4ed]">Details →</Link></div></article>)}</div></Card>
  </>;
}

export function AdminUsersPage() {
  const showToast = useToast();
  return <>
    <PageHeader eyebrow={<SimulatedBadge />} title="Users & roles" description="An illustrative administration table for reviewing role-based access concepts." actions={<button type="button" onClick={() => showToast("Invite flow is illustrative only. Authentication is not implemented.")} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-sm font-semibold text-white hover:bg-[var(--forest-deep)]"><Users size={15} />Invite demo user</button>} />
    <SimulatedNotice>These sample users and roles are fictional. No account creation, sign-in, authorization, or role changes occur in this frontend.</SimulatedNotice>
    <div className="mb-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-[var(--line)] bg-white p-4"><p className="text-xs text-[var(--muted)]">Sample users</p><p className="mt-2 text-2xl font-semibold">04</p></div><div className="rounded-xl border border-[var(--line)] bg-white p-4"><p className="text-xs text-[var(--muted)]">Access roles</p><p className="mt-2 text-2xl font-semibold">04</p></div><div className="rounded-xl border border-[var(--line)] bg-white p-4"><p className="text-xs text-[var(--muted)]">Invitations</p><p className="mt-2 text-2xl font-semibold">01</p></div></div>
    <Card className="overflow-hidden"><div className="p-4 sm:p-5"><SectionHeading title="Demo workspace members" description="Role names are example labels and are not enforced by a backend." /></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left"><caption className="sr-only">Fictional users and prototype role labels</caption><thead className="bg-[#f7f9f7] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#748179]"><tr><th scope="col" className="px-5 py-3">Person</th><th scope="col" className="px-4 py-3">Role</th><th scope="col" className="px-4 py-3">Sample scope</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3">Last activity</th><th scope="col" className="px-4 py-3"><span className="sr-only">Review access</span></th></tr></thead><tbody className="divide-y divide-[#edf0ed]">{demoUsers.map((user) => <tr key={user.email}><td className="px-5 py-3.5"><p className="text-xs font-medium">{user.name}</p><p className="mt-1 text-[10px] text-[var(--muted)]">{user.email}</p></td><td className="px-4 py-3 text-xs">{user.role}</td><td className="px-4 py-3 text-xs text-[var(--muted)]">{user.scope}</td><td className="px-4 py-3"><span className="rounded-full border border-[#dce5dd] bg-[#f4f8f3] px-2.5 py-1 text-[10px] font-medium text-[#42614a]">{user.status}</span></td><td className="px-4 py-3 text-xs text-[var(--muted)]">{user.lastSeen}</td><td className="px-4 py-3 text-right"><button type="button" onClick={() => showToast(`Access review opened for ${user.name}. No changes saved.`)} className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-[10px] font-semibold text-[var(--forest)] hover:bg-[#edf4ed]"><UserCog size={13} aria-hidden="true" />Review</button></td></tr>)}</tbody></table></div></Card>
    <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#e3e9e5] bg-[#f8faf8] p-4"><KeyRound size={17} className="mt-0.5 shrink-0 text-[var(--forest)]" aria-hidden="true" /><p className="text-xs leading-5 text-[var(--muted)]"><strong className="text-[var(--ink)]">Prototype boundary:</strong> Role labels shown here are explanatory. There is no server-side access control in this stage.</p></div>
  </>;
}

const auditEntries = [
  { time: "10:48 AM · simulated", actor: "Taylor Reed · demo operator", event: "Reviewed rescue recommendation", entity: "NR-28471", detail: "Local prototype confirmation; no order was changed." },
  { time: "10:32 AM · simulated", actor: "Sample risk monitor", event: "Inventory confidence threshold shown", entity: "DAI-1042", detail: "Illustrative event row for UI review only." },
  { time: "9:58 AM · simulated", actor: "Morgan Lewis · demo manager", event: "Store recommendation viewed", entity: "NORTH-04", detail: "No store action or inventory update was sent." },
  { time: "Yesterday · simulated", actor: "Sample workflow", event: "Customer-approved substitute recorded", entity: "NR-28397", detail: "Fixed sample outcome, not a real customer contact." },
  { time: "Mar 12 · simulated", actor: "Riley Shah · demo reviewer", event: "Delivery risk signal inspected", entity: "SEA-12", detail: "Example audit detail; not a production event log." },
];

export function AdminAuditPage() {
  return <>
    <PageHeader eyebrow={<SimulatedBadge />} title="Audit trail" description="A sample event history that demonstrates how reviewable actions could be represented." />
    <SimulatedNotice>This is a fixed, fictional audit sample—not a compliance log, security event stream, or verified system history.</SimulatedNotice>
    <Card className="p-4 sm:p-5"><SectionHeading title="Recent prototype events" description="Actor, event, entity, and outcome stay visible as separate fields." /><ol className="divide-y divide-[#edf0ed]">{auditEntries.map((entry) => <li key={`${entry.time}-${entry.entity}`} className="grid gap-2 py-4 first:pt-1 sm:grid-cols-[140px_1fr_1fr] sm:gap-5"><p className="text-[10px] text-[var(--muted)]">{entry.time}</p><div><p className="text-xs font-semibold text-[var(--ink)]">{entry.event}</p><p className="mt-1 text-[10px] text-[var(--muted)]">{entry.actor}</p></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--forest)]">{entry.entity}</p><p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{entry.detail}</p></div></li>)}</ol></Card>
    <Card className="mt-4 border-[#dce7dd] bg-[#f7faf7] p-4"><div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[var(--forest)]" aria-hidden="true" /><p className="text-xs font-semibold">Future production consideration</p></div><p className="mt-2 text-xs leading-5 text-[var(--muted)]">A production audit system should be append-only, access controlled, tied to verified identities, and designed to retain appropriate evidence for sensitive actions.</p></Card>
  </>;
}
