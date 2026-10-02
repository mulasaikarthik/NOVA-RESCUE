"use client";

import Link from "next/link";
import { Button, ErrorState, SimulatedBadge } from "@/components/ui";

export default function WorkspaceError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[75vh] max-w-2xl place-items-center px-5 py-10">
      <section className="w-full rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8" aria-labelledby="workspace-error-title">
        <div className="mb-5 flex items-center justify-between"><Link href="/" className="text-xs font-semibold text-[var(--forest)] hover:underline">NOVA RESCUE</Link></div>
        <div id="workspace-error-title" className="sr-only">Workspace error</div>
        <ErrorState message="This section could not be displayed. Please try again." />
        <div className="mt-5 flex flex-wrap gap-2"><Button variant="secondary" onClick={reset}>Try again</Button><Link href="/operations" className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[var(--forest)] px-4 text-sm font-semibold text-white hover:bg-[var(--forest-deep)]">Back to operations</Link></div>
      </section>
    </main>
  );
}
