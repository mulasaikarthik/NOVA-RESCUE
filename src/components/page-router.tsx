"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, PageHeader, SimulatedBadge } from "@/components/ui";
import { AnalyticsPage, BusinessInsightsPage, ImpactPage } from "@/components/insights-pages";
import { OperationsDashboard, OrdersPage, RescueQueuePage } from "@/components/operations-pages";
import { OrderDetailsPage } from "@/components/order-details";
import { ArchitecturePage, ProblemStatementPage, SolutionPage } from "@/components/product-brief-pages";
import { AdminAuditPage, AdminUsersPage, CustomerOrdersPage, CustomerOverviewPage } from "@/components/portal-admin-pages";
import { InventoryPage, StoreInsightsPage, StoreOverviewPage } from "@/components/store-pages";

export function ProductPageRouter({ path }: { path: string }) {
  if (path === "operations") return <OperationsDashboard />;
  if (path === "operations/orders") return <OrdersPage />;
  if (path === "operations/rescue") return <RescueQueuePage />;
  if (path.startsWith("operations/orders/")) return <OrderDetailsPage id={path.slice("operations/orders/".length)} />;

  if (path === "customer") return <CustomerOverviewPage />;
  if (path === "customer/orders") return <CustomerOrdersPage />;
  if (path.startsWith("customer/orders/")) return <OrderDetailsPage id={path.slice("customer/orders/".length)} customerView />;

  if (path === "store") return <StoreOverviewPage />;
  if (path === "store/inventory") return <InventoryPage />;
  if (path === "store/insights") return <StoreInsightsPage />;

  if (path === "business-insights") return <BusinessInsightsPage />;
  if (path === "analytics") return <AnalyticsPage />;
  if (path === "impact") return <ImpactPage />;
  if (path === "problem-statement") return <ProblemStatementPage />;
  if (path === "solution") return <SolutionPage />;
  if (path === "architecture") return <ArchitecturePage />;
  if (path === "admin/users" || path === "admin") return <AdminUsersPage />;
  if (path === "admin/audit") return <AdminAuditPage />;

  return (
    <div className="mx-auto max-w-xl py-10">
      <PageHeader eyebrow={<SimulatedBadge />} title="Page not found" description="This route is not part of the NOVA RESCUE frontend prototype." />
      <Card className="p-6"><p className="text-sm text-[var(--muted)]">Explore the simulated operations workspace or return to the landing page.</p><div className="mt-4 flex flex-wrap gap-2"><Link href="/operations" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-sm font-semibold text-white"><ArrowLeft size={15} />Operations</Link><Link href="/" className="inline-flex min-h-10 items-center rounded-xl border border-[var(--line)] px-4 text-sm font-semibold text-[var(--forest)]">Home</Link></div></Card>
    </div>
  );
}
