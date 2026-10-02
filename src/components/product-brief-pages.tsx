import { ArrowDown, ArrowRight, CheckCircle2, CircleDashed, FileQuestion, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import Link from "next/link";
import { Card, Eyebrow, PageHeader, SectionHeading, SimulatedBadge, SimulatedNotice } from "@/components/ui";

function DistinctionCard({
  label,
  title,
  children,
  tone = "neutral",
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber";
}) {
  const toneClass = tone === "green" ? "border-[#d5e4d6] bg-[#f6faf6]" : tone === "amber" ? "border-[#e7dcba] bg-[#fcf9ee]" : "border-[var(--line)] bg-white";
  return <Card className={`p-5 sm:p-6 ${toneClass}`}><Eyebrow>{label}</Eyebrow><h2 className="mt-2 text-base font-semibold tracking-[-0.02em] text-[var(--ink)]">{title}</h2><div className="mt-3 text-sm leading-6 text-[var(--muted)]">{children}</div></Card>;
}

export function ProblemStatementPage() {
  return <>
    <PageHeader eyebrow={<span className="text-xs text-[var(--muted)]">Product brief</span>} title="Problem statement & scope" description="A transparent separation between the problem, our analysis, and the platform solution." />
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#e6dba9] bg-[#fbf8eb] p-4"><FileQuestion size={19} className="mt-0.5 shrink-0 text-[#80651d]" aria-hidden="true" /><p className="text-sm leading-6 text-[#665625]"><strong className="font-semibold">Source transparency matters.</strong> The sections below separate the problem framing from the platform's analysis and solution design.</p></div>
    <div className="mb-5 grid gap-4 lg:grid-cols-2">
      <DistinctionCard label="OFFICIAL CASE / PROBLEM STATEMENT" title="Official source not provided" tone="amber">
        <p>No official case facts are stated here. The source text has not been provided or independently verified.</p><p className="mt-3">Any eventual official case statement should be quoted or summarized from an approved source and cited separately. Nothing in the remaining sections is presented as an official NOVA CART case fact.</p>
      </DistinctionCard>
      <DistinctionCard label="OUR ANALYSIS" title="The product opportunity we are exploring" tone="green">
        <p>Order fulfillment can involve changing signals across product availability, picking, delivery windows, and customer preferences. A useful operations interface should bring those signals together early enough for a person to review options.</p><p className="mt-3">This framing describes the prototype's design hypothesis only; it is not a claim about a particular company's measured failure rate or current process.</p>
      </DistinctionCard>
    </div>
    <div className="mb-5 grid gap-4 md:grid-cols-2">
      <DistinctionCard label="OUR DIAGNOSIS" title="Fragmented context makes early intervention harder">
        <ul className="list-disc space-y-2 pl-5"><li>Inventory confidence and delivery timing need to be seen together at order level.</li><li>Risk labels alone are insufficient; operators need the factors and reasoning.</li><li>Recommendations require customer context, policy checks, and explicit human review.</li></ul>
      </DistinctionCard>
      <DistinctionCard label="OUR PROPOSED SOLUTION" title="A reviewable rescue loop">
        <p>Provide a shared operational view that detects risk signals, explains why an order may need attention, suggests a practical next step, and records a human-reviewed outcome.</p><Link href="/solution" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[var(--forest)] hover:underline">Explore the proposed solution <ArrowRight size={14} /></Link>
      </DistinctionCard>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <DistinctionCard label="SIMULATED DEMO DATA" title="Illustrative local examples only">
        <p>All orders, stores, products, metrics, outcomes, dates, and confidence scores in this prototype are synthetic examples embedded locally for interface review.</p><p className="mt-3 font-semibold text-[#80651d]">They are not live NOVA CART data and are not connected to production systems.</p>
      </DistinctionCard>
      <DistinctionCard label="PLATFORM IMPACT" title="Measured outcomes">
        <p>The impact dashboard surfaces recorded rescue outcomes, rescue rate, and operational signal counts across the live platform.</p><Link href="/impact" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[var(--forest)] hover:underline">Review impact <ArrowRight size={14} /></Link>
      </DistinctionCard>
    </div>
  </>;
}

const solutionPillars = [
  { number: "01", title: "Predict", icon: Sparkles, detail: "Bring order, inventory, and delivery signals into one review queue. Use transparent risk levels to prioritize attention—not to make an unreviewed decision." },
  { number: "02", title: "Prevent", icon: ShieldCheck, detail: "Identify a possible failure early enough to explain the contributing factors and show practical next steps with their assumptions." },
  { number: "03", title: "Rescue", icon: Workflow, detail: "Keep an operator in control. Confirm store context and customer preference before any action is considered." },
  { number: "04", title: "Learn", icon: CheckCircle2, detail: "Record the reviewed action and observed outcome separately so future impact can be evaluated honestly." },
];

export function SolutionPage() {
  return <>
    <PageHeader eyebrow={<SimulatedBadge />} title="A practical rescue loop" description="The NOVA RESCUE concept turns fragmented risk signals into a human-reviewed, measurable workflow." actions={<Link href="/operations" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-sm font-semibold text-white hover:bg-[var(--forest-deep)]">Explore demo <ArrowRight size={15} /></Link>} />
    <SimulatedNotice />
    <Card className="mb-5 overflow-hidden"><div className="grid divide-y divide-[var(--line)] md:grid-cols-4 md:divide-x md:divide-y-0">{solutionPillars.map(({ number, title, icon: Icon, detail }) => <div key={title} className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-[0.12em] text-[var(--muted)]">{number}</span><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef3ed] text-[var(--forest)]"><Icon size={18} aria-hidden="true" /></span></div><h2 className="mt-5 text-lg font-semibold tracking-[-0.03em]">{title}</h2><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{detail}</p></div>)}</div></Card>
    <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_1fr]"><Card className="p-5 sm:p-6"><SectionHeading title="Designed for operators" description="A useful decision aid should make each step legible and reversible." /><ul className="mt-4 space-y-3">{["Risk level includes text and a clear factor list", "Plain-language explanation is separate from recommendation", "Customer and store context are visible before action", "Operator approval is distinct from recommendation", "Outcome reporting discloses uncertainty and sample size"].map((item) => <li key={item} className="flex items-start gap-2.5 text-xs leading-5 text-[var(--ink)]"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#397451]" aria-hidden="true" />{item}</li>)}</ul></Card><Card className="border-[#dce7dd] bg-[#f7faf7] p-5 sm:p-6"><Eyebrow>Design principle</Eyebrow><h2 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.035em]">Assist the decision.<br />Do not hide the decision.</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">An operational recommendation should be explainable, scoped to the right user, and checked against real-world policy and customer preferences before any intervention.</p><Link href="/architecture" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[var(--forest)] hover:underline">See the conceptual architecture <ArrowRight size={14} /></Link></Card></div>
    <Card className="p-5 sm:p-6"><SectionHeading title="Platform scope" description="What the live NOVA RESCUE platform includes." /><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-[#d5e4d6] bg-[#f6faf6] p-4"><p className="text-xs font-semibold text-[#315a3d]">Frontend</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Responsive operations console, customer portal, analytics, impact dashboards, and real-time rescue workflows.</p></div><div className="rounded-xl border border-[#d5e4d6] bg-[#f6faf6] p-4"><p className="text-xs font-semibold text-[#315a3d]">Backend</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Supabase PostgreSQL database, authenticated API routes, deterministic risk engine, Gemini AI integration, role-based access control, and persistent audit logging.</p></div></div></Card>
  </>;
}

const applicationFlow = ["Frontend", "Backend / API", "Authentication", "Authorization", "Validation", "Services", "Database"];
const intelligenceFlow = ["Application", "AI service", "Gemini", "Validation", "Recommendation", "Authorized action"];

function VerticalFlow({ title, description, steps }: { title: string; description: string; steps: string[] }) {
  return <Card className="p-5 sm:p-6"><div className="mb-5"><Eyebrow>CONCEPTUAL FLOW</Eyebrow><h2 className="mt-2 text-lg font-semibold tracking-[-0.03em]">{title}</h2><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{description}</p></div><ol className="mx-auto max-w-sm">{steps.map((step, index) => <li key={step} className="flex flex-col items-center"><div className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 ${step === "Authorization" || step === "Validation" ? "border-[#dce7dd] bg-[#f7faf7]" : "border-[var(--line)] bg-white"}`}><span className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#eef3ed] text-[10px] font-bold text-[var(--forest)]">{String(index + 1).padStart(2, "0")}</span><span className="text-sm font-medium text-[var(--ink)]">{step}</span></span><span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{step === "Gemini" ? "Proposed" : "Concept"}</span></div>{index < steps.length - 1 ? <ArrowDown size={16} className="my-1.5 text-[#8a9c8e]" aria-hidden="true" /> : null}</li>)}</ol></Card>;
}

export function ArchitecturePage() {
  return <>
    <PageHeader eyebrow={<SimulatedBadge />} title="Conceptual architecture" description="A visual sequence for discussion—not a diagram of deployed or connected systems." />
    <SimulatedNotice />
    <div className="mb-5 grid gap-4 xl:grid-cols-2"><VerticalFlow title="Application request path" description="Illustrative application layers from user interface through protected data access." steps={applicationFlow} /><VerticalFlow title="Decision-support path" description="Illustrative path for a future AI-assisted recommendation with validation and authorized human action." steps={intelligenceFlow} /></div>
    <Card className="p-5 sm:p-6"><div className="flex items-start gap-3"><CircleDashed size={19} className="mt-0.5 shrink-0 text-[var(--forest)]" aria-hidden="true" /><div><h2 className="text-sm font-semibold">Trust boundaries are enforced</h2><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Inputs are validated with Zod, authorization is applied on the server, credentials stay server-side, and sensitive actions require an appropriately authorized principal.</p></div></div></Card>
  </>;
}
