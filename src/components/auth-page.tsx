"use client";

import { Activity, ArrowRight, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

type AuthMode = "login" | "register";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Auto-focus email input on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) return;

    setPending(true);
    setError(null);

    try {
      const endpoint = isRegister ? "/api/register" : "/api/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to ${isRegister ? "create account" : "sign in"}`);
      }

      // Instant redirect to operations workspace
      router.push("/operations");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setPending(false);
    }
  }

  function quickLogin(userEmail: string, userPassword = "workspace") {
    setEmail(userEmail);
    setPassword(userPassword);
    // Trigger submit in next tick
    setTimeout(() => {
      const form = document.getElementById("auth-form") as HTMLFormElement | null;
      form?.requestSubmit();
    }, 0);
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-[var(--forest-deep)] p-10 text-white lg:flex xl:p-14" aria-label="NOVA RESCUE platform overview">
        <div className="relative z-10"><Link href="/" className="flex w-fit items-center gap-3 rounded-lg"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--lime)] text-[var(--forest-deep)]"><Activity size={20} /></span><span><span className="block text-sm font-bold tracking-[0.12em]">NOVA</span><span className="mt-1 block text-[9px] tracking-[0.22em] text-[#c4d4ca]">RESCUE</span></span></Link></div>
        <div className="relative z-10 max-w-lg"><h1 className="text-4xl font-semibold leading-tight tracking-[-0.05em] xl:text-5xl">A clearer path from risk to rescue.</h1><p className="mt-4 max-w-md text-sm leading-6 text-[#c4d4ca]">Detect fulfillment risk early, understand what is driving it, and give operators a human-reviewed rescue workflow.</p><div className="mt-8 grid gap-3">{["Predict early", "Explain the signal", "Keep operators in control"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-[10px] font-bold text-[var(--lime)]">0{index + 1}</span><span className="text-xs text-[#d7e1da]">{item}</span></div>)}</div></div>
        <p className="relative z-10 text-[10px] leading-5 text-[#99aea0]">Secured with Supabase Auth · PostgreSQL database · Gemini AI integration.</p>
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full border border-white/[0.06]" aria-hidden="true" /><div className="absolute -bottom-16 -right-8 h-56 w-56 rounded-full border border-white/[0.06]" aria-hidden="true" />
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[430px]">
          <div className="mb-9 flex items-center justify-between"><Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--forest)]"><span aria-hidden="true">←</span>Back to home</Link></div>
          <div className="mb-7"><div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#edf3ed] text-[var(--forest)] lg:hidden"><Activity size={19} /></div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--forest)]">NOVA RESCUE · OPERATIONS PLATFORM</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">{isRegister ? "Create your account" : "Welcome back"}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{isRegister ? "Get instant access to the NOVA RESCUE operations platform." : "Sign in to access the operations console."}</p></div>
          <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
            {isRegister ? <div><label htmlFor="full-name" className="mb-1.5 block text-xs font-semibold text-[var(--ink)]">Full name</label><input id="full-name" value={name} onChange={(e) => setName(e.target.value)} type="text" autoComplete="name" className="h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm outline-none focus-visible:border-[#78977d]" placeholder="Your name" /></div> : null}
            <div><label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-[var(--ink)]">Work email</label><input ref={emailRef} id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required className="h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm outline-none focus-visible:border-[#78977d]" placeholder="name@company.com" /></div>
            <div><label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-[var(--ink)]">Password</label><div className="relative"><input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 8 : undefined} className="h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 pr-12 text-sm outline-none focus-visible:border-[#78977d]" placeholder={isRegister ? "At least 8 characters" : "Enter your password"} /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[var(--muted)] hover:bg-[#f2f5f2]">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
            {error ? <p className="rounded-lg border border-[#e8c4c1] bg-[#fff2f1] px-3 py-2 text-xs text-[#843d38]">{error}</p> : null}
            <button type="submit" disabled={pending || !email || !password} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-sm font-semibold text-white hover:bg-[var(--forest-deep)] disabled:opacity-60">
              {pending ? <><Loader2 size={15} className="animate-spin" aria-hidden="true" />Entering workspace…</> : <>{isRegister ? "Create account" : "Sign in"}<ArrowRight size={15} aria-hidden="true" /></>}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-[var(--muted)]">{isRegister ? "Already have an account?" : "New to NOVA RESCUE?"}{" "}<Link href={isRegister ? "/login" : "/register"} className="font-semibold text-[var(--forest)] underline-offset-4 hover:underline">{isRegister ? "Sign in" : "Create an account"}</Link></p>
          <div className="mt-5 rounded-xl border border-[#e5ebe6] bg-[#f7faf7] p-3"><div className="mb-2 flex items-center gap-1.5"><Sparkles size={12} className="text-[var(--forest)]" aria-hidden="true" /><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--forest)]">Quick access</p></div><p className="mb-2 text-[10px] leading-4 text-[var(--muted)]">Use any email + password — you'll land directly in the operations workspace.</p><div className="grid grid-cols-2 gap-1.5"><button type="button" onClick={() => quickLogin("operator@nova.rescue")} className="rounded-lg border border-[#dce5dd] bg-white px-2 py-1.5 text-left text-[10px] font-medium text-[var(--ink)] hover:border-[var(--forest)] hover:bg-[#f0f5f1]">operator@nova.rescue</button><button type="button" onClick={() => quickLogin("manager@nova.rescue")} className="rounded-lg border border-[#dce5dd] bg-white px-2 py-1.5 text-left text-[10px] font-medium text-[var(--ink)] hover:border-[var(--forest)] hover:bg-[#f0f5f1]">manager@nova.rescue</button></div></div>
          <p className="mt-5 text-center text-[10px] leading-5 text-[var(--muted)]">Secured by Supabase Auth · credentials encrypted and stored safely.</p>
        </div>
      </section>
    </main>
  );
}
