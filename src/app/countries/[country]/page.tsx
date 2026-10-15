// src/app/countries/[country]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getVisaCountry, VISA_COUNTRIES } from "@/lib/visaCountries";

type Params = { params: Promise<{ country: string }> };

export async function generateMetadata({ params }: Params) {
  const { country } = await params;
  const c = getVisaCountry(decodeURIComponent(country));
  if (!c) return { title: "Country Guide" };
  return {
    title: `Working in ${c.name} — Visa, Salaries & Jobs | Orspex`,
    description: `${c.name} work visa requirements, average salaries, cost of living, and in-demand jobs. ${c.tagline}`,
  };
}

export function generateStaticParams() {
  return VISA_COUNTRIES.map((c) => ({ country: c.slug }));
}

export default async function CountryGuidePage({ params }: Params) {
  const { country } = await params;
  const decoded = decodeURIComponent(country);
  const c = getVisaCountry(decoded);
  if (!c) return notFound();

  const [visaJobs, totalJobs] = await Promise.all([
    prisma.job.count({
      where: { isActive: true, country: c.slug, visaSponsorship: true },
    }),
    prisma.job.count({
      where: { isActive: true, country: c.slug },
    }),
  ]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <Link
            href="/countries"
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-emerald-700"
          >
            ← All countries
          </Link>

          <div className="flex items-start gap-5">
            <span className="text-5xl md:text-6xl">{c.flag}</span>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
                Working in {c.name}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-gray-600">{c.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/visa-sponsorship/${encodeURIComponent(c.slug)}`}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {visaJobs} visa-sponsored jobs →
                </Link>
                <Link
                  href={`/jobs?country=${encodeURIComponent(c.slug)}`}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  All {totalJobs} jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Why work in {c.name}?
              </h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                {c.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Work visa requirements
              </h2>
              <ul className="mt-4 space-y-3">
                {c.visaTypes.map((v) => (
                  <li
                    key={v}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <span className="text-green-600 text-lg">✓</span>
                    <span className="text-gray-800">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Job search tips
              </h2>
              <ul className="mt-4 space-y-3">
                {c.tips.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-gray-700">
                    <span className="text-blue-600 mt-1">●</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold uppercase text-gray-500">
                At a glance
              </h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-gray-500">Average salary</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {c.avgSalary}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Visa-sponsored jobs</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {visaJobs}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">All open jobs</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {totalJobs}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-6">
              <h3 className="font-semibold text-slate-900">
                Looking for jobs in {c.name}?
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Browse visa-sponsored roles from verified employers.
              </p>
              <Link
                href={`/visa-sponsorship/${encodeURIComponent(c.slug)}`}
                className="mt-4 inline-block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                View visa jobs →
              </Link>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold uppercase text-gray-500">
                Other countries
              </h3>
              <ul className="mt-3 space-y-2">
                {VISA_COUNTRIES.filter((x) => x.slug !== c.slug)
                  .slice(0, 5)
                  .map((x) => (
                    <li key={x.slug}>
                      <Link
                        href={`/countries/${encodeURIComponent(x.slug)}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600"
                      >
                        <span className="text-lg">{x.flag}</span>
                        {x.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}