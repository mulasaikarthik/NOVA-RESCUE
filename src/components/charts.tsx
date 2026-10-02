import { Card, SectionHeading } from "@/components/ui";

export type TrendPoint = { label: string; value: number };

export function TrendChart({
  title,
  description,
  data,
  suffix = "",
  unitLabel = "orders",
}: {
  title: string;
  description: string;
  data: TrendPoint[];
  suffix?: string;
  unitLabel?: string;
}) {
  const width = 720;
  const height = 244;
  const left = 38;
  const right = 12;
  const top = 15;
  const bottom = 36;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const peak = Math.max(100, ...data.map((point) => point.value));
  const maxValue = Math.ceil(peak / 20) * 20;
  const points = data.map((point, index) => ({
    x: left + (data.length < 2 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth),
    y: top + plotHeight - (point.value / maxValue) * plotHeight,
    ...point,
  }));
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPath = points.length
    ? `M ${points[0].x} ${top + plotHeight} L ${points.map((point) => `${point.x} ${point.y}`).join(" L ")} L ${points[points.length - 1].x} ${top + plotHeight} Z`
    : "";
  const titleId = `chart-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <Card className="p-4 sm:p-5">
      <SectionHeading title={title} description={description} />
      <div className="overflow-hidden" role="img" aria-labelledby={`${titleId}-title ${titleId}-desc`}>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" preserveAspectRatio="none">
          <title id={`${titleId}-title`}>{title}</title>
          <desc id={`${titleId}-desc`}>{description} Values by {unitLabel}: {data.map((point) => `${point.label} ${point.value}${suffix}`).join(", ")}.</desc>
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = top + plotHeight * fraction;
            const value = Math.round(maxValue * (1 - fraction));
            return (
              <g key={fraction}>
                <line x1={left} y1={y} x2={width - right} y2={y} stroke="#e8ede9" strokeDasharray={fraction === 1 ? "0" : "3 5"} />
                <text x={left - 9} y={y + 3} textAnchor="end" fill="#839088" fontSize="9">{value}{suffix}</text>
              </g>
            );
          })}
          <path d={areaPath} fill="#eaf3eb" />
          <polyline points={linePoints} fill="none" stroke="#2f6c4d" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#2f6c4d" strokeWidth="2" />
              <text x={point.x} y={height - 12} textAnchor="middle" fill="#718077" fontSize="10">{point.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--muted)]">
        <span className="h-2 w-2 rounded-full bg-[#2f6c4d]" aria-hidden="true" />
        <span>{unitLabel}</span>
        <span className="ml-auto">Peak: {Math.max(...data.map((point) => point.value), 0)}{suffix}</span>
      </div>
    </Card>
  );
}

export function HorizontalBarChart({
  title,
  description,
  rows,
  suffix = "",
  tone = "green",
}: {
  title: string;
  description?: string;
  rows: Array<{ label: string; value: number; detail?: string }>;
  suffix?: string;
  tone?: "green" | "amber" | "blue";
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  const barColor = tone === "amber" ? "bg-[#b77b32]" : tone === "blue" ? "bg-[#54769c]" : "bg-[#397451]";
  return (
    <Card className="p-4 sm:p-5">
      <SectionHeading title={title} description={description} />
      <ul className="space-y-4" aria-label={`${title} values`}>
        {rows.map((row) => (
          <li key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-xs font-medium text-[var(--ink)]">{row.label}</span>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-[var(--ink)]">{row.value}{suffix}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#edf1ed]" aria-hidden="true">
              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.max(3, (row.value / max) * 100)}%` }} />
            </div>
            {row.detail ? <p className="mt-1 text-[10px] text-[var(--muted)]">{row.detail}</p> : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function DonutChart({
  value,
  total,
  label,
  caption,
}: {
  value: number;
  total: number;
  label: string;
  caption: string;
}) {
  const ratio = Math.max(0, Math.min(1, total === 0 ? 0 : value / total));
  const circumference = 2 * Math.PI * 42;
  const dash = circumference * ratio;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="h-[82px] w-[82px] shrink-0" role="img" aria-label={`${label}: ${Math.round(ratio * 100)} percent. ${caption}`}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#e8ede9" strokeWidth="9" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#397451" strokeWidth="9" strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
        <text x="50" y="53" textAnchor="middle" fontSize="17" fontWeight="700" fill="#172620">{Math.round(ratio * 100)}%</text>
      </svg>
      <div><p className="text-sm font-semibold text-[var(--ink)]">{label}</p><p className="mt-1 max-w-44 text-xs leading-5 text-[var(--muted)]">{caption}</p></div>
    </div>
  );
}

export function ConfidenceBar({ value, label = "Inventory confidence" }: { value: number; label?: string }) {
  return (
    <div className="min-w-[112px]">
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="font-semibold tabular-nums text-[var(--ink)]">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#e9eee9]" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <div className="h-full rounded-full bg-[#4d805b]" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
