// src/app/countries/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VISA_COUNTRIES } from "@/lib/visaCountries";

export const metadata = {
  title: "Country Guides — Work Abroad | Orspex Jobs",
  description:
    "Work visa requirements, average salaries, cost of living, in-demand jobs, and job search tips for UAE, Canada, Germany, UK, Saudi Arabia, and Qatar.",
};

export default async function CountriesIndex() {
  const counts = await prisma.job.groupBy({
    by: ["country"],
    where: { isActive: true },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.country, c._count._all]));

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm px-4 py-1.5 rounded-full mb-6 border border-emerald-100 font-medium">
            <span>🌍</span>
            Work abroad guides
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Country Guides
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Everything you need to work abroad — visa requirements, salaries,
            cost of living, and job search tips for each country.
          </p>
        </div>
      </section>

      {/* Country cards */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {VISA_COUNTRIES.map((c) => {
            const count = countMap.get(c.slug) ?? 0;
            return (
              <Link
                key={c.slug}
                href={`/countries/${encodeURIComponent(c.slug)}`}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{c.flag}</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {count} {count === 1 ? "job" : "jobs"}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-emerald-700">
                  {c.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{c.tagline}</p>
                <div className="mt-4 text-sm">
                  <span className="text-gray-500">Avg. salary: </span>
                  <span className="font-medium text-slate-800">{c.avgSalary}</span>
                </div>
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
                  Read {c.name} guide →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Ready to make the move?
          </h2>
          <p className="mt-2 text-gray-600">
            Browse visa-sponsored jobs from verified employers worldwide.
          </p>
          <Link
            href="/visa-sponsorship"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Browse visa sponsorship jobs →
          </Link>
        </div>
      </section>
    </div>
  );
}