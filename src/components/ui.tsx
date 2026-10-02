"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Circle,
  CircleAlert,
  OctagonAlert,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function Card({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--line)] bg-white shadow-[0_2px_8px_rgba(24,59,48,0.025)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]", className)}>
      {children}
    </p>
  );
}

export function SectionHeading({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        <h2 className="text-base font-semibold tracking-[-0.025em] text-[var(--ink)]">{title}</h2>
        {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

const buttonStyles = {
  primary: "bg-[var(--forest)] text-white hover:bg-[var(--forest-deep)] shadow-sm",
  secondary: "border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[#f7f9f7]",
  outline: "border border-[#cdd8d1] bg-transparent text-[var(--forest)] hover:bg-[var(--mint)]",
  ghost: "text-[var(--muted)] hover:bg-[#f1f4f1] hover:text-[var(--ink)]",
  danger: "bg-[#a23d36] text-white hover:bg-[#87322c]",
  lime: "bg-[var(--lime)] text-[var(--forest-deep)] hover:bg-[#d7f292]",
} as const;

export function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonStyles }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
        buttonStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

const riskConfig = {
  LOW: { className: "border-[#c8dfd1] bg-[#eef7f0] text-[#286447]", Icon: CheckCircle2 },
  MEDIUM: { className: "border-[#ead9a8] bg-[#fbf6e8] text-[#80621e]", Icon: CircleAlert },
  HIGH: { className: "border-[#f0c6a9] bg-[#fff2e9] text-[#974c1f]", Icon: TriangleAlert },
  CRITICAL: { className: "border-[#e5b3b0] bg-[#fff0ef] text-[#9d3934]", Icon: OctagonAlert },
} satisfies Record<RiskLevel, { className: string; Icon: typeof Circle }>;

export function RiskBadge({ level }: { level: RiskLevel }) {
  const { className, Icon } = riskConfig[level];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.08em]", className)}
      aria-label={`${level.toLowerCase()} risk`}
    >
      <Icon size={13} strokeWidth={2.2} aria-hidden="true" />
      {level}
    </span>
  );
}

const statusTone: Record<string, string> = {
  "Action required": "border-[#e5b3b0] bg-[#fff0ef] text-[#9d3934]",
  "Rescue in progress": "border-[#c8d7ed] bg-[#f0f5fc] text-[#365c92]",
  "Needs review": "border-[#ead9a8] bg-[#fbf6e8] text-[#80621e]",
  Monitoring: "border-[#dce4de] bg-[#f2f5f2] text-[#596a61]",
  Rescued: "border-[#c8dfd1] bg-[#eef7f0] text-[#286447]",
  Delivered: "border-[#c8dfd1] bg-[#eef7f0] text-[#286447]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium", statusTone[status] ?? "border-[var(--line)] bg-[#f5f7f5] text-[var(--muted)]")}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

/** @deprecated — app is live. Retained for import compatibility. */
export function SimulatedBadge(_props?: { compact?: boolean }) {
  return null;
}

export function MetricCard({
  label,
  value,
  change,
  icon,
  note,
  className,
}: {
  label: string;
  value: string;
  change?: string;
  icon: ReactNode;
  note?: string;
  className?: string;
}) {
  return (
    <Card className={cn("p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium leading-5 text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-[26px] font-semibold leading-none tracking-[-0.05em] text-[var(--ink)] sm:text-[30px]">{value}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eef3ed] text-[var(--forest)]" aria-hidden="true">{icon}</span>
      </div>
      {change || note ? (
        <p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">
          {change ? <span className="font-semibold text-[#397551]">{change}</span> : null}
          {change && note ? <span> · </span> : null}
          {note}
        </p>
      ) : null}
    </Card>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-7 sm:flex-row sm:items-end">
      <div className="max-w-3xl">
        {eyebrow ? <div className="mb-2">{eyebrow}</div> : null}
        <h1 className="text-[27px] font-semibold leading-tight tracking-[-0.045em] text-[var(--ink)] sm:text-[34px]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-[15px]">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** @deprecated — app is live. Retained for import compatibility. */
export function SimulatedNotice(_props?: { children?: ReactNode }) {
  return null;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-[#d6dfd9] bg-[#fafbfa] p-8 text-center">
      <div className="max-w-sm">
        <span className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#eef3ed] text-[var(--forest)]"><Circle size={18} aria-hidden="true" /></span>
        <h3 className="text-sm font-semibold text-[var(--ink)]">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{description}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}

export function ErrorState({ message = "This section could not be displayed." }: { message?: string }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-[#e8c4c1] bg-[#fff2f1] p-4 text-sm text-[#843d38]">
      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div><p className="font-semibold">Something went wrong</p><p className="mt-1">{message}</p></div>
    </div>
  );
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-label="Loading simulated content" role="status" className="space-y-3">
      <span className="sr-only">Loading simulated content</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="animate-pulse rounded-xl border border-[var(--line)] bg-white p-5">
          <div className="h-3 w-1/4 rounded bg-[#e8ede9]" />
          <div className="mt-4 h-5 w-2/3 rounded bg-[#eef1ee]" />
          <div className="mt-3 h-3 w-1/2 rounded bg-[#eef1ee]" />
        </div>
      ))}
    </div>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  children?: ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#102b23]/45 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogPrimitive.Title className="text-lg font-semibold tracking-[-0.02em] text-[var(--ink)]">{title}</DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close aria-label="Close dialog" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--muted)] hover:bg-[#f2f5f2]"><X size={17} /></DialogPrimitive.Close>
          </div>
          {children ? <div className="mt-5">{children}</div> : null}
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={onConfirm}>{confirmLabel}</Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const ToastContext = createContext<{ showToast: (message: string) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const showToast = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setMessage(""), 3600);
  }, []);
  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 px-4" aria-live="polite" aria-atomic="true">
        {message ? <div role="status" className="flex min-w-[min(24rem,calc(100vw-2rem))] items-center gap-2 rounded-xl bg-[var(--forest-deep)] px-4 py-3 text-sm font-medium text-white shadow-xl"><CheckCircle2 size={17} className="shrink-0 text-[var(--lime)]" aria-hidden="true" />{message}</div> : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context.showToast;
}

export const TabsRoot = TabsPrimitive.Root;
export const TabsList = TabsPrimitive.List;
export const TabsTrigger = TabsPrimitive.Trigger;
export const TabsContent = TabsPrimitive.Content;
