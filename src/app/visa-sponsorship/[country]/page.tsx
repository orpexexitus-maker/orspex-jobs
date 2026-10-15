// src/app/visa-sponsorship/[country]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getVisaCountry, VISA_COUNTRIES } from "@/lib/visaCountries";
import { JobCard, type JobCardJob } from "@/components/JobCard";

type Params = { params: Promise<{ country: string }> };

export async function generateMetadata({ params }: Params) {
  const { country } = await params;
  const c = getVisaCountry(decodeURIComponent(country));
  if (!c) return { title: "Visa Sponsorship Jobs" };
  return {
    title: `${c.name} Visa Sponsorship Jobs — Orspex Jobs`,
    description: `Verified ${c.name} employers sponsoring work visas. ${c.tagline}`,
  };
}

export function generateStaticParams() {
  return VISA_COUNTRIES.map((c) => ({ country: c.slug }));
}

export default async function VisaCountryPage({ params }: Params) {
  const { country } = await params;
  const decoded = decodeURIComponent(country);
  const c = getVisaCountry(decoded);

  if (!c) return notFound();

  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
      visaSponsorship: true,
      country: c.slug,
    },
    orderBy: [{ hireFasterScore: "desc" }, { createdAt: "desc" }],
    take: 30,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logoUrl: true,
          verified: true,
          visaSponsor: true,
          relocationAssist: true,
          remoteFriendly: true,
          fastResponder: true,
        },
      },
    },
  });

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <Link
            href="/visa-sponsorship"
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
          >
            ← All countries
          </Link>

          <div className="flex items-start gap-5">
            <span className="text-5xl md:text-6xl">{c.flag}</span>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
                {c.name} Visa Sponsorship Jobs
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-gray-600">
                {c.tagline}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/jobs?visa=true&country=${encodeURIComponent(c.slug)}`}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  All {c.name} visa jobs →
                </Link>
                <Link
                  href="/countries"
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Country guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Country info */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Working in {c.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {c.description}
            </p>

            <h3 className="mt-6 text-sm font-semibold uppercase text-gray-500">
              Common visa types
            </h3>
            <ul className="mt-3 space-y-2">
              {c.visaTypes.map((v) => (
                <li key={v} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600">✓</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold uppercase text-gray-500">
              At a glance
            </h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Average salary</dt>
                <dd className="font-semibold text-slate-900">{c.avgSalary}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Open visa jobs</dt>
                <dd className="font-semibold text-slate-900">{jobs.length}</dd>
              </div>
            </dl>

            <h3 className="mt-6 text-sm font-semibold uppercase text-gray-500">
              Tips
            </h3>
            <ul className="mt-3 space-y-2">
              {c.tips.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="text-blue-600">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Latest visa-sponsored jobs in {c.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {jobs.length} open role{jobs.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-4xl">🌍</p>
            <p className="mt-3 text-lg font-semibold text-gray-900">
              No visa jobs in {c.name} right now
            </p>
            <p className="mt-1 text-sm text-gray-600">
              New roles are added daily. Save this page or check back soon.
            </p>
            <Link
              href="/jobs?visa=true"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Browse all visa jobs →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((j) => (
              <JobCard key={j.id} job={j as unknown as JobCardJob} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}