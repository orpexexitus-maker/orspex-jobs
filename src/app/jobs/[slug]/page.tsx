// src/app/jobs/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge, HireFasterBadge } from "@/components/Badge";

type Params = { params: Promise<{ slug: string }> };

function formatSalary(job: any) {
  if (!job.salaryDisclosed || (job.salaryMin == null && job.salaryMax == null)) {
    return "Salary not disclosed";
  }
  const cur = job.salaryCurrency ?? "USD";
  const period = job.salaryPeriod ?? "year";
  const fmt = (n: number) => n.toLocaleString();
  if (job.salaryMin && job.salaryMax && job.salaryMin !== job.salaryMax) {
    return `${cur} ${fmt(job.salaryMin)} - ${fmt(job.salaryMax)} / ${period}`;
  }
  return `${cur} ${fmt(job.salaryMin ?? job.salaryMax ?? 0)} / ${period}`;
}

export default async function JobDetailPage({ params }: Params) {
  const { slug } = await params;

  // Try slug first, then fall back to id
  let job = await prisma.job.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: {
      company: true,
      employer: { select: { id: true, name: true, email: true } },
    },
  });

  if (!job) return notFound();

  // Increment view count (fire-and-forget)
  prisma.job
    .update({ where: { id: job.id }, data: { viewsCount: { increment: 1 } } })
    .catch(() => {});

  // Similar jobs (same category/country, exclude this one)
  const similar = await prisma.job.findMany({
    where: {
      id: { not: job.id },
      isActive: true,
      OR: [
        job.category ? { category: job.category } : {},
        { country: job.country },
        { visaSponsorship: job.visaSponsorship },
      ].filter(Boolean) as any,
    },
    take: 4,
    orderBy: { hireFasterScore: "desc" },
    include: {
      company: {
        select: {
          id: true, name: true, logoUrl: true, verified: true,
          visaSponsor: true, relocationAssist: true,
          remoteFriendly: true, fastResponder: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/jobs"
        className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
      >
        ← Back to all jobs
      </Link>

      {/* Header card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
            {job.company?.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-400">
                {(job.company?.name ?? "?").charAt(0)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="mt-1 text-gray-700">
                  {job.company?.name ?? "Company"} · {job.city}, {job.country}
                  {job.remote ? " · Remote" : ""}
                </p>
              </div>
              <HireFasterBadge score={job.hireFasterScore} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-600">
              <span className="font-medium text-gray-800">{formatSalary(job)}</span>
              {job.jobType && <span>· {job.jobType.replace("_", " ")}</span>}
              {job.experienceLevel && <span>· {job.experienceLevel}</span>}
              <span>· Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.company?.verified && <Badge variant="verified" size="md" />}
              {job.visaSponsorship && <Badge variant="visa" size="md" />}
              {job.relocationAssist && <Badge variant="relocation" size="md" />}
              {job.remote && <Badge variant="remote" size="md" />}
              {job.company?.fastResponder && <Badge variant="fast" size="md" />}
              {job.salaryDisclosed && <Badge variant="salary" size="md" />}
            </div>

            {/* Apply CTA */}
            <div className="mt-6 flex flex-wrap gap-3">
              <ApplyButton jobId={job.id} />
              <SaveButton jobId={job.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main content */}
        <div className="space-y-6">
          <Section title="About this role">
            <div className="prose prose-sm max-w-none whitespace-pre-line text-gray-700">
              {job.description}
            </div>
          </Section>

          {job.requirements && (
            <Section title="Requirements">
              <div className="prose prose-sm max-w-none whitespace-pre-line text-gray-700">
                {job.requirements}
              </div>
            </Section>
          )}

          {job.responsibilities && (
            <Section title="Responsibilities">
              <div className="prose prose-sm max-w-none whitespace-pre-line text-gray-700">
                {job.responsibilities}
              </div>
            </Section>
          )}

          {job.skills && job.skills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {job.interviewProcess && (
            <Section title="Interview process">
              <p className="whitespace-pre-line text-gray-700">{job.interviewProcess}</p>
              {job.responseDays != null && (
                <p className="mt-2 text-sm text-green-700">
                  ⚡ Typical response: within {job.responseDays} day
                  {job.responseDays === 1 ? "" : "s"}
                </p>
              )}
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold uppercase text-gray-500">Job overview</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Location" value={`${job.city}, ${job.country}`} />
              <Row label="Job type" value={job.jobType?.replace("_", " ") ?? "—"} />
              <Row label="Experience" value={job.experienceLevel ?? "—"} />
              <Row label="Category" value={job.category ?? "—"} />
              <Row label="Salary" value={formatSalary(job)} />
              <Row
                label="Visa sponsorship"
                value={job.visaSponsorship ? "✅ Yes" : "No"}
              />
              <Row
                label="Relocation"
                value={job.relocationAssist ? "✅ Yes" : "No"}
              />
              <Row label="Remote" value={job.remote ? "✅ Yes" : "No"} />
            </dl>
          </div>

          {job.company && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase text-gray-500">
                About the company
              </h3>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {job.company.name}
              </p>
              {job.company.about && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-4">
                  {job.company.about}
                </p>
              )}
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                >
                  Visit website →
                </a>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Similar jobs */}
      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Similar jobs
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {similar.map((s) => (
              <Link
                key={s.id}
                href={`/jobs/${s.slug ?? s.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">{s.title}</p>
                    <p className="truncate text-sm text-gray-600">
                      {s.company?.name} · {s.city}, {s.country}
                    </p>
                  </div>
                  <HireFasterBadge score={s.hireFasterScore} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-800">{value}</dd>
    </div>
  );
}

// Client components
import { ApplyButton } from "@/components/ApplyButton";
import { SaveButton } from "@/components/SaveButton";