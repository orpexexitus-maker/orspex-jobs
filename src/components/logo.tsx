import Link from "next/link";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 600"
        width={size}
        height={size}
        aria-label="Orspex"
      >
        {/* Outer ring (light green) */}
        <circle cx="300" cy="300" r="280" fill="none" stroke="#6EE7A0" strokeWidth="18" />

        {/* Middle ring (light blue) */}
        <circle cx="300" cy="300" r="200" fill="none" stroke="#5BC0EB" strokeWidth="16" />

        {/* Large blue circle (core) */}
        <circle cx="300" cy="300" r="160" fill="#2563EB" />

        {/* Dark navy center */}
        <circle cx="300" cy="300" r="90" fill="#0F172A" />

        {/* Top node (cyan) */}
        <circle cx="300" cy="100" r="22" fill="#5BC0EB" />

        {/* Bottom node (cyan) */}
        <circle cx="300" cy="500" r="22" fill="#5BC0EB" />

        {/* Left node (green) */}
        <circle cx="100" cy="300" r="22" fill="#22C55E" />

        {/* Right node (green) */}
        <circle cx="500" cy="300" r="22" fill="#22C55E" />
      </svg>
      <span className="text-xl font-bold">Orspex Jobs</span>
    </Link>
  );
}