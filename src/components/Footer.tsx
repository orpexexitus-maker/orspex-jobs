// src/components/Footer.tsx
import Link from "next/link";
import { Logo } from "@/components/logo";

const COLUMNS = [
  {
    title: "For Candidates",
    links: [
      { href: "/jobs",             label: "Browse Jobs" },
      { href: "/visa-sponsorship", label: "Visa Sponsorship Jobs" },
      { href: "/countries",        label: "Country Guides" },
      { href: "/jobs?remote=true", label: "Remote Jobs" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { href: "/jobs/new", label: "Post a Job" },
      { href: "/pricing",  label: "Pricing" },
      { href: "/employers", label: "Verified Employers" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about",   label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms",   label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo size={26} />
            <p className="mt-3 max-w-xs text-sm text-gray-600">
              Connecting talent with verified employers worldwide. Search remote,
              relocation, and visa-sponsored jobs.
            </p>
            <div className="mt-4 flex gap-3 text-sm">
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">Telegram</a>
              <span className="text-gray-300">·</span>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">LinkedIn</a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-gray-900">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-gray-600 hover:text-blue-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-gray-200 pt-6 text-xs text-gray-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Orspex Jobs. All rights reserved.</p>
          <p>Built for global talent.</p>
        </div>
      </div>
    </footer>
  );
}
