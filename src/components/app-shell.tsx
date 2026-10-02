"use client";

import {
  Activity,
  Archive,
  BarChart3,
  Boxes,
  Building2,
  ChevronRight,
  ClipboardCheck,
  Command,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Workflow,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { SIMULATED_ORDERS } from "@/lib/mock-data";
import { SimulatedBadge, useToast } from "@/components/ui";
import { signOut } from "@/app/auth/actions";

const groups = [
  {
    label: "OPERATIONS",
    items: [
      { href: "/operations", label: "Command center", icon: LayoutDashboard },
      { href: "/operations/orders", label: "Orders", icon: ShoppingBag },
      { href: "/operations/rescue", label: "Rescue queue", icon: Workflow },
    ],
  },
  {
    label: "STORE",
    items: [
      { href: "/store/inventory", label: "Inventory", icon: Boxes },
      { href: "/store/insights", label: "Store insights", icon: Building2 },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { href: "/business-insights", label: "Business insights", icon: Sparkles },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/impact", label: "Impact", icon: Gauge },
    ],
  },
  {
    label: "CUSTOMER VIEW",
    items: [
      { href: "/customer", label: "Customer portal", icon: ShoppingBag },
      { href: "/customer/orders", label: "My orders", icon: Archive },
    ],
  },
  {
    label: "PLATFORM",
    items: [
      { href: "/problem-statement", label: "Problem statement", icon: FileText },
      { href: "/solution", label: "Solution overview", icon: ClipboardCheck },
      { href: "/architecture", label: "Architecture", icon: Command },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { href: "/admin/users", label: "Users & roles", icon: Users },
      { href: "/admin/audit", label: "Audit trail", icon: ShieldCheck },
    ],
  },
];

function Brand({ light = true }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex w-fit items-center gap-2.5 rounded-lg focus-visible:outline-offset-4" aria-label="NOVA RESCUE home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--lime)] text-[var(--forest-deep)]">
        <Activity size={19} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className={`leading-none ${light ? "text-white" : "text-[var(--ink)]"}`}>
        <span className="block text-[13px] font-bold tracking-[0.12em]">NOVA</span>
        <span className={`mt-1 block text-[9px] font-semibold tracking-[0.21em] ${light ? "text-[#c4d4ca]" : "text-[var(--muted)]"}`}>RESCUE</span>
      </span>
    </Link>
  );
}

function Sidebar({ onClose, mobile = false }: { onClose?: () => void; mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <aside className={`flex h-full w-[264px] shrink-0 flex-col bg-[var(--forest-deep)] text-white ${mobile ? "shadow-2xl" : ""}`} aria-label="Main navigation">
      <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
        <Brand />
        {mobile ? <button type="button" onClick={onClose} aria-label="Close navigation" className="grid h-9 w-9 place-items-center rounded-lg text-[#d4e1d8] hover:bg-white/10"><X size={19} /></button> : null}
      </div>
      <div className="px-4 pt-4">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-[#dcebdc] text-[11px] font-bold text-[var(--forest)]">OP<span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--forest-deep)] bg-[#90c874]" aria-label="Workspace active" /></span>
              <div><p className="text-xs font-semibold">Operations</p><p className="mt-0.5 text-[10px] text-[#bbcbc1]">Live workspace</p></div>
            </div>
            <ChevronRight size={14} className="text-[#9eb1a4]" aria-hidden="true" />
          </div>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-5">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-[9px] font-bold tracking-[0.17em] text-[#8fa498]">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-[12px] font-medium transition-colors ${active ? "bg-white/10 text-white" : "text-[#c4d2c9] hover:bg-white/[0.07] hover:text-white"}`}
                    >
                      <Icon size={16} strokeWidth={active ? 2.1 : 1.8} aria-hidden="true" />
                      <span>{label}</span>
                      {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--lime)]" aria-hidden="true" /> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link href="/problem-statement" className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[11px] text-[#c4d2c9] hover:bg-white/[0.07] hover:text-white">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.08]"><FileText size={14} aria-hidden="true" /></span>
          <span><span className="block font-medium">Platform brief</span><span className="mt-0.5 block text-[10px] text-[#91a69a]">Scope & assumptions</span></span>
        </Link>
        <form action={signOut} className="mt-2">
          <button type="submit" className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[11px] text-[#c4d2c9] hover:bg-white/[0.07] hover:text-white">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.08]"><LogOut size={14} aria-hidden="true" /></span>
            <span><span className="block font-medium">Sign out</span><span className="mt-0.5 block text-[10px] text-[#91a69a]">End session</span></span>
          </button>
        </form>
        <p className="mt-3 px-2 text-[9px] text-[#81988a]">NOVA RESCUE · LIVE</p>
      </div>
    </aside>
  );
}

const breadcrumbNames: Record<string, string> = {
  "problem-statement": "Problem statement",
  "business-insights": "Business insights",
  solution: "Solution overview",
  architecture: "Architecture",
  customer: "Customer portal",
  orders: "Orders",
  operations: "Operations",
  rescue: "Rescue queue",
  store: "Store",
  inventory: "Inventory",
  insights: "Store insights",
  analytics: "Analytics",
  impact: "Impact",
  admin: "Administration",
  users: "Users & roles",
  audit: "Audit trail",
  login: "Sign in",
  register: "Create account",
};

function Breadcrumbs({ pathname }: { pathname: string }) {
  const parts = pathname.split("/").filter(Boolean);
  const segments = parts.length ? parts : ["operations"];
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 overflow-hidden text-xs">
        <li className="shrink-0"><Link href="/" className="font-medium text-[var(--muted)] hover:text-[var(--forest)]">NOVA</Link></li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const label = breadcrumbNames[segment] ?? (segment.startsWith("NR-") ? segment : segment);
          return (
            <li key={`${segment}-${index}`} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight size={13} className="shrink-0 text-[#aab5ae]" aria-hidden="true" />
              {isLast ? <span aria-current="page" className="truncate font-semibold text-[var(--ink)]">{label}</span> : <Link href={href} className="truncate text-[var(--muted)] hover:text-[var(--forest)]">{label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const showToast = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim().toUpperCase();
    const match = SIMULATED_ORDERS.find((order) => order.id === value);
    if (match) {
      router.push(`/operations/orders/${match.id}`);
      setQuery("");
    } else {
      showToast("No matching simulated order. Try NR-28471.");
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <div className="sticky top-0 hidden h-screen lg:block"><Sidebar /></div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="presentation">
          <button type="button" className="absolute inset-0 h-full w-full bg-[#0f211b]/55" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0"><Sidebar mobile onClose={() => setMobileOpen(false)} /></div>
        </div>
      ) : null}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-[66px] items-center justify-between gap-3 border-b border-[var(--line)] bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[#f5f7f5] lg:hidden"><Menu size={18} /></button>
            <Breadcrumbs pathname={pathname} />
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <form onSubmit={handleSearch} role="search" className="hidden h-9 w-52 items-center gap-2 rounded-lg border border-[var(--line)] bg-[#fafbfa] px-2.5 focus-within:border-[#94aa98] md:flex xl:w-64">
              <Search size={15} className="shrink-0 text-[#7a8981]" aria-hidden="true" />
              <label htmlFor="global-order-search" className="sr-only">Search simulated orders by order ID</label>
              <input id="global-order-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order ID…" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#8b978f]" />
              <button type="submit" className="sr-only">Search orders</button>
            </form>
            <SimulatedBadge compact />
            <div className="hidden items-center gap-2 border-l border-[var(--line)] pl-3 sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8efe8] text-[10px] font-bold text-[var(--forest)]" aria-hidden="true">OD</span>
              <span className="hidden text-right lg:block"><span className="block text-[11px] font-semibold text-[var(--ink)]">Demo operator</span><span className="mt-0.5 block text-[9px] text-[var(--muted)]">Operations</span></span>
            </div>
          </div>
        </header>
        <main id="main-content" className="mx-auto w-full max-w-[1560px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          {children}
        </main>
        <footer className="border-t border-[var(--line)] px-4 py-4 text-center text-[10px] text-[var(--muted)] sm:px-6 lg:px-8">
          NOVA RESCUE · LIVE · Supabase database · Gemini AI · Authenticated access
        </footer>
      </div>
    </div>
  );
}
