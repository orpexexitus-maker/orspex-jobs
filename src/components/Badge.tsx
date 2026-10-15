// src/components/Badge.tsx
import * as React from "react";

type BadgeVariant =
  | "verified"
  | "visa"
  | "relocation"
  | "remote"
  | "fast"
  | "featured"
  | "salary";

type BadgeProps = {
  variant: BadgeVariant;
  children?: React.ReactNode;
  size?: "sm" | "md";
};

const STYLES: Record<BadgeVariant, { classes: string; icon: string; label: string }> = {
  verified:   { classes: "bg-blue-50 text-blue-700 ring-blue-200",          icon: "✅", label: "Verified" },
  visa:       { classes: "bg-green-50 text-green-700 ring-green-200",       icon: "✅", label: "Visa Sponsorship" },
  relocation: { classes: "bg-purple-50 text-purple-700 ring-purple-200",    icon: "✅", label: "Relocation" },
  remote:     { classes: "bg-cyan-50 text-cyan-700 ring-cyan-200",          icon: "✅", label: "Remote" },
  fast:       { classes: "bg-orange-50 text-orange-700 ring-orange-200",    icon: "⚡", label: "Fast Response" },
  featured:   { classes: "bg-yellow-50 text-yellow-800 ring-yellow-200",    icon: "⭐", label: "Featured" },
  salary:     { classes: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: "💰", label: "Salary Disclosed" },
};

export function Badge({ variant, children, size = "sm" }: BadgeProps) {
  const s = STYLES[variant];
  const sizeCls = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full ring-1 font-medium whitespace-nowrap ${s.classes} ${sizeCls}`}>
      <span aria-hidden>{s.icon}</span>
      {children ?? s.label}
    </span>
  );
}

// ─── Hire Faster badge with response-time color tiers ────────────────
export function HireFasterBadge({ score }: { score: number }) {
  let cls   = "bg-gray-100 text-gray-600 ring-gray-200";
  let label = "New";

  if (score >= 90)      { cls = "bg-green-100 text-green-700 ring-green-200";       label = "Responds Same Day"; }
  else if (score >= 75) { cls = "bg-emerald-100 text-emerald-700 ring-emerald-200"; label = "Fast Hire"; }
  else if (score >= 50) { cls = "bg-amber-100 text-amber-800 ring-amber-200";       label = "Moderate"; }
  else if (score >= 25) { cls = "bg-orange-100 text-orange-700 ring-orange-200";    label = "Slow"; }
  else                  { cls = "bg-red-100 text-red-700 ring-red-200";             label = "Very Slow"; }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ring-1 font-semibold text-xs px-2.5 py-1 ${cls}`}
      title={`Hire Faster Score: ${score}/100`}
    >
      <span className="font-bold">{score}</span>
      <span>·</span>
      <span>{label}</span>
    </span>
  );
}