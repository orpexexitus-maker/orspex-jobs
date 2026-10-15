// src/app/visa-sponsorship/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VISA_COUNTRIES } from "@/lib/visaCountries";

export const metadata = {
  title: "Visa Sponsorship Jobs — Global Opportunities | Orspex Jobs",
  description:
    "Find visa-sponsored jobs in UAE, Canada, Germany, UK, Saudi Arabia, and more. Verified employers offering relocation and sponsorship support.",
};

export default async function VisaSponsorshipIndex() {
  // Count visa jobs per country
  const counts = await prisma.job.groupBy({
    by: ["country"],
    where: { isActive: true, visaSponsorship: true },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.country, c._count._all]));

  const totalVisaJobs = counts.reduce((sum, c) => sum + c._count._all, 0);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-1.5 rounded-full mb-6 border border-green-100 font-medium">
            <span>✅</span>
            Verified sponsors only
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Visa Sponsorship Jobs
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Find verified employers who sponsor work visas and support relocation.
            Currently <strong className="text-slate-900">{totalVisaJobs}</strong>{" "}
            sponsored jobs across {counts.length} countries.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/jobs?visa=true"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Browse all visa jobs →
            </Link>
            <Link
              href="/jobs?visa=true&remote=true"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Remote + visa sponsored
            </Link>
          </div>
        </div>
      </section>

      {/* Country cards */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">
          Choose your destination
        </h2>
        <p className="mb-8 text-gray-600">
          Every country below has jobs with confirmed visa sponsorship.
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {VISA_COUNTRIES.map((c) => {
            const count = countMap.get(c.slug) ?? 0;
            return (
              <Link
                key={c.slug}
                href={`/visa-sponsorship/${encodeURIComponent(c.slug)}`}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{c.flag}</span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {count} {count === 1 ? "job" : "jobs"}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-blue-600">
                  {c.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{c.tagline}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium text-slate-700">
                    {c.avgSalary}
                  </span>
                </div>
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  See jobs in {c.name} →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <TrustItem
              icon="✅"
              title="Verified employers"
              body="Every employer on this list has been checked — trade license, contact info, and active website."
            />
            <TrustItem
              icon="🌍"
              title="Real visa sponsorship"
              body="Jobs are flagged visa-sponsoring only when the employer has confirmed it in the listing."
            />
            <TrustItem
              icon="⚡"
              title="Fast responders"
              body="Look for the ⚡ Fast Response badge — those employers reply within 7 days."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function TrustItem({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-2xl">{icon}</p>
      <h3 className="mt-2 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{body}</p>
    </div>
  );
}