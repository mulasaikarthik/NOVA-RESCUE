import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  PackageSearch,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { RiskBadge, SimulatedBadge } from "@/components/ui";

const productStages = [
  { icon: PackageSearch, label: "Problem", detail: "Order risk can hide across inventory and delivery signals." },
  { icon: CircleAlert, label: "Risk detection", detail: "Surface what needs attention before a promise is missed." },
  { icon: Sparkles, label: "AI decision support", detail: "Explain contributing factors and suggest a reviewable next step." },
  { icon: ShieldCheck, label: "Rescue", detail: "Keep a human in control of any customer or store action." },
  { icon: CheckCircle2, label: "Impact", detail: "Learn from observed outcomes—not assumed savings." },
];

function Brand() {
  return <Link href="/" className="flex w-fit items-center gap-2.5 rounded-lg" aria-label="NOVA RESCUE home"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--forest)] text-[var(--lime)]"><Sparkles size={17} aria-hidden="true" /></span><span className="leading-none"><span className="block text-[13px] font-bold tracking-[0.13em] text-[var(--ink)]">NOVA</span><span className="mt-1 block text-[9px] font-bold tracking-[0.21em] text-[var(--muted)]">RESCUE</span></span></Link>;
}

export function LandingPage() {
  return (
    <div className="overflow-hidden bg-[#f7f8f6]">
      <header className="border-b border-[#e7ebe7] bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <Brand />
          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex"><Link href="/problem-statement" className="text-xs font-medium text-[var(--muted)] hover:text-[var(--forest)]">The problem</Link><Link href="/solution" className="text-xs font-medium text-[var(--muted)] hover:text-[var(--forest)]">How it works</Link><Link href="/architecture" className="text-xs font-medium text-[var(--muted)] hover:text-[var(--forest)]">Architecture</Link></nav>
          <div className="flex items-center gap-2"><Link href="/login" className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-[var(--muted)] hover:bg-[#f4f6f4] sm:inline-flex">Sign in</Link><Link href="/operations" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[var(--forest-deep)]">Open operations<ArrowRight size={14} aria-hidden="true" /></Link></div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="relative z-10">
            <div className="mb-5 flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-[#dce6dd] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#44624b]"><span className="h-1.5 w-1.5 rounded-full bg-[#5c9a63]" aria-hidden="true" />Operational intelligence platform</span></div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--forest)]">NOVA RESCUE</p>
            <h1 className="mt-4 max-w-[690px] text-[clamp(2.65rem,6.2vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-[var(--ink)]">Turn order risk into a <span className="text-[#3e6b4d]">rescue plan.</span></h1>
            <p className="mt-5 max-w-[570px] text-base leading-7 text-[#5d6c63] sm:text-lg sm:leading-8">Find fulfillment risk early. Understand what is driving it. Give operators a clear, human-reviewed way to help an order recover.</p>
            <p className="mt-5 text-sm font-semibold tracking-[0.015em] text-[var(--forest)]">Predict <span className="mx-1 text-[#90a497]">→</span> Prevent <span className="mx-1 text-[#90a497]">→</span> Rescue <span className="mx-1 text-[#90a497]">→</span> Learn</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link href="/operations" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--forest)] px-5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(24,59,48,0.15)] hover:bg-[var(--forest-deep)]">Open operations<ArrowRight size={16} aria-hidden="true" /></Link><Link href="/problem-statement" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#dbe2dc] bg-white px-5 text-sm font-semibold text-[var(--ink)] hover:bg-[#f7f9f7]">Read the problem brief<ArrowUpRight size={15} aria-hidden="true" /></Link></div>
            <p className="mt-4 text-[11px] leading-5 text-[var(--muted)]">Live platform · Supabase database · Gemini AI · Authenticated operations console.</p>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-x-10 -inset-y-12 -z-10 rounded-[40px] bg-[#eaf0e8]" aria-hidden="true" />
            <div className="overflow-hidden rounded-[22px] border border-[#dbe2dc] bg-white shadow-[0_24px_70px_rgba(29,51,38,0.12)]">
              <div className="flex items-center justify-between border-b border-[#e8ece8] px-5 py-4"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf3ed] text-[var(--forest)]"><ShieldCheck size={16} aria-hidden="true" /></span><div><p className="text-xs font-semibold">Order health overview</p><p className="mt-0.5 text-[10px] text-[var(--muted)]">Operations · live console</p></div></div></div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Priority review</p><p className="mt-2 text-[22px] font-semibold tracking-[-0.04em] text-[var(--ink)]">1 order needs attention</p><p className="mt-1 text-xs text-[var(--muted)]">Risk signals · live order data</p></div><RiskBadge level="HIGH" /></div>
                <div className="mt-5 rounded-xl border border-[#e7ece7] bg-[#fbfcfb] p-4">
                  <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-[var(--ink)]">NR-28471</p><p className="mt-1 text-[10px] text-[var(--muted)]">North Loop · sample order</p></div><span className="text-xl font-semibold tabular-nums text-[var(--ink)]">92<span className="text-xs font-medium text-[var(--muted)]"> / 100</span></span></div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8ede9]" role="progressbar" aria-label="Illustrative order risk score" aria-valuemin={0} aria-valuemax={100} aria-valuenow={92}><div className="h-full w-[92%] rounded-full bg-[#b45a4e]" /></div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="flex items-start gap-2 rounded-lg bg-white p-3"><PackageSearch size={14} className="mt-0.5 shrink-0 text-[#986731]" aria-hidden="true" /><span className="text-[10px] leading-4 text-[#5b665f]">Item availability not confirmed</span></div><div className="flex items-start gap-2 rounded-lg bg-white p-3"><Truck size={14} className="mt-0.5 shrink-0 text-[#986731]" aria-hidden="true" /><span className="text-[10px] leading-4 text-[#5b665f]">Delivery window has limited slack</span></div></div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-lg bg-[#f5f8f5] p-3"><p className="text-[9px] font-medium text-[var(--muted)]">Orders monitored</p><p className="mt-1 text-lg font-semibold">1,248</p></div><div className="rounded-lg bg-[#f5f8f5] p-3"><p className="text-[9px] font-medium text-[var(--muted)]">At risk</p><p className="mt-1 text-lg font-semibold">46</p></div><div className="rounded-lg bg-[#f5f8f5] p-3"><p className="text-[9px] font-medium text-[var(--muted)]">Rescued</p><p className="mt-1 text-lg font-semibold">182</p></div></div>
                <div className="mt-4 flex items-center gap-2 border-t border-[#e8ece8] pt-4 text-[10px] leading-4 text-[var(--muted)]"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5c9a63]" aria-hidden="true" /><span>Live data from Supabase · authenticated operations view.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e5eae5] bg-white py-8 sm:py-10" aria-labelledby="journey-heading">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--forest)]">The operating model</p><h2 id="journey-heading" className="mt-2 text-xl font-semibold tracking-[-0.035em]">One connected path from signal to learning.</h2></div><Link href="/solution" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--forest)] hover:underline">Explore the approach <ArrowRight size={14} /></Link></div>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{productStages.map(({ icon: Icon, label, detail }, index) => <li key={label} className="relative rounded-xl border border-[#e6ebe6] bg-[#fbfcfb] p-4"><div className="flex items-center justify-between"><span className="text-[9px] font-bold tracking-[0.12em] text-[var(--muted)]">0{index + 1}</span><Icon size={17} className="text-[var(--forest)]" aria-hidden="true" /></div><h3 className="mt-4 text-sm font-semibold">{label}</h3><p className="mt-1.5 text-[11px] leading-5 text-[var(--muted)]">{detail}</p>{index < productStages.length - 1 ? <span className="absolute -right-[13px] top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-[#dfe6df] bg-white text-[var(--forest)] lg:grid" aria-hidden="true">›</span> : null}</li>)}</ol>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20" aria-labelledby="flow-heading">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--forest)]">Built around human review</p><h2 id="flow-heading" className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">Make the next right action easier to see.</h2><p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">Risk factors, plain-language context, and suggested actions belong together—so an operator can make an informed choice with the customer and store in mind.</p><Link href="/operations/rescue" className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#d9e1da] bg-white px-4 text-xs font-semibold text-[var(--forest)] hover:bg-[#f1f5f1]">See the rescue workflow<ArrowRight size={14} /></Link></div>
            <div className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-[0_12px_40px_rgba(29,51,38,0.055)] sm:p-7"><div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold">A transparent review sequence</p><p className="mt-1 text-[10px] text-[var(--muted)]">No hidden automation. Human approval remains visible.</p></div><SimulatedBadge compact /></div><ol className="grid gap-2 sm:grid-cols-5">{["Detect", "Explain", "Recommend", "Rescue", "Learn"].map((step, index) => <li key={step} className="flex items-center gap-2 sm:flex-col sm:items-start"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#dce7dd] bg-[#f4f8f3] text-[10px] font-bold text-[var(--forest)]">0{index + 1}</span><div className="flex min-w-0 items-center gap-2"><span className="text-xs font-semibold">{step}</span>{index < 4 ? <ArrowRight size={13} className="text-[#93a398] sm:hidden" aria-hidden="true" /> : null}</div>{index < 4 ? <span className="hidden text-[10px] text-[#93a398] sm:block">↓</span> : null}</li>)}</ol><div className="mt-5 rounded-xl border border-[#e8ece8] bg-[#fafbfa] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Recommendation · illustrative</p><p className="mt-2 text-xs leading-5 text-[#4f5d54]">Confirm item availability, then offer a customer-approved alternative if needed.</p><div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#41614a]"><ShieldCheck size={13} aria-hidden="true" />Operator review required before any action</div></div></div>
          </div>
        </section>

        <section className="border-y border-[#e5eae5] bg-[#f0f4ef] py-10 sm:py-12"><div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-5 px-5 sm:px-8 md:flex-row md:items-center lg:px-10"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--forest)]">Start with the platform</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">See a rescue workflow in context.</h2><p className="mt-2 text-sm text-[var(--muted)]">Operational screens backed by a live database and AI-powered recommendations.</p></div><div className="flex flex-wrap gap-2"><Link href="/operations" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-xs font-semibold text-white hover:bg-[var(--forest-deep)]">Open operations<ArrowRight size={14} /></Link><Link href="/business-insights" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d3ddd4] bg-white px-4 text-xs font-semibold text-[var(--forest)] hover:bg-[#f9fbf9]">View business insights<ArrowRight size={14} /></Link></div></div></section>
      </main>
      <footer className="bg-[var(--forest-deep)] py-7 text-white"><div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-4 px-5 sm:flex-row sm:items-center sm:px-8 lg:px-10"><Brand /><p className="max-w-xl text-[10px] leading-5 text-[#b6c8bc]">NOVA RESCUE · Predict → Prevent → Rescue → Learn. Live operations platform with Supabase database, Gemini AI, and authenticated access.</p><Link href="/problem-statement" className="text-[10px] font-semibold text-[#d5e1d8] hover:underline">Platform scope</Link></div></footer>
    </div>
  );
}
