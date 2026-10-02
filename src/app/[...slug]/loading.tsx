import { Activity } from "lucide-react";

export default function WorkspaceLoading() {
  return (
    <main aria-busy="true" aria-label="Loading NOVA RESCUE workspace" className="min-h-screen bg-[var(--canvas)]">
      <header className="flex h-[66px] items-center justify-between border-b border-[var(--line)] bg-white px-5 sm:px-8">
        <div className="h-3 w-36 animate-pulse rounded bg-[#e5ebe6]" aria-hidden="true" />
        <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.11em] text-[#735c20]"><Activity size={13} aria-hidden="true" />NOVA RESCUE</span>
      </header>
      <div className="mx-auto max-w-[1500px] space-y-5 px-5 py-8 sm:px-8">
        <div className="animate-pulse"><div className="h-3 w-28 rounded bg-[#e2e9e3]" /><div className="mt-3 h-9 w-72 max-w-full rounded bg-[#e6ebe7]" /><div className="mt-3 h-4 w-[min(32rem,100%)] rounded bg-[#e9eeea]" /></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl border border-[var(--line)] bg-white p-5"><div className="h-3 w-24 rounded bg-[#e9eeea]" /><div className="mt-5 h-7 w-20 rounded bg-[#e5ebe6]" /></div>)}</div>
        <div className="grid gap-4 xl:grid-cols-2"><div className="h-72 animate-pulse rounded-2xl border border-[var(--line)] bg-white" /><div className="h-72 animate-pulse rounded-2xl border border-[var(--line)] bg-white" /></div>
        <p role="status" className="sr-only">Loading workspace content.</p>
      </div>
    </main>
  );
}
