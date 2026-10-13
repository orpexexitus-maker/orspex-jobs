import { Suspense } from "react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { getJobs, getJobFilterOptions } from "@/actions/jobs";
import { auth } from "@/lib/auth";
import { formatSalary, timeAgo } from "@/lib/format";
import { JobsFilters } from "./jobs-filters";

type SearchParams = {
  q?: string;
  country?: string;
  city?: string;
  title?: string;
};

async function JobsList({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  const jobs = await getJobs(searchParams);

  const isSeeker = session?.user?.role === "SEEKER";

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 mb-4">No jobs match your filters.</p>
        <Link
          href="/jobs"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
        >
          <div className="flex items-start justify-between gap-6">
            <Link href={`/jobs/${job.id}`} className="flex-1 min-w-0 block">
              <h2 className="text-xl font-semibold mb-1 hover:text-blue-600 transition-colors">
                {job.title}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                {job.company?.name ?? job.employer.name} · {job.location}
              </p>
              <p className="text-gray-700 text-sm line-clamp-2">
                {job.description}
              </p>
              <p className="text-sm text-green-700 mt-3 font-medium">
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {timeAgo(job.createdAt)}
              </p>
            </Link>

            <div className="flex-shrink-0">
              {isSeeker ? (
                <Link
                  href={`/jobs/${job.id}/apply`}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                  Apply
                </Link>
              ) : !session?.user ? (
                <Link
                  href={`/login?callbackUrl=/jobs/${job.id}`}
                  className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition font-medium text-sm"
                >
                  Sign in to apply
                </Link>
              ) : (
                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                >
                  View job
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function JobsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [options, jobs] = await Promise.all([
    getJobFilterOptions(),
    getJobs(searchParams),
  ]);
  const total = jobs.length;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Open positions</h1>
        <p className="text-gray-600">
          {total} {total === 1 ? "job" : "jobs"} available
        </p>
      </div>

      <JobsFilters
        options={options}
        currentFilters={{
          q: searchParams.q ?? "",
          country: searchParams.country ?? "",
          city: searchParams.city ?? "",
          title: searchParams.title ?? "",
        }}
      />

      <Suspense fallback={<div className="text-gray-500">Loading jobs...</div>}>
        <JobsList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav className="flex gap-4 text-sm">
            <Link href="/jobs" className="text-blue-600 font-medium">
              Jobs
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <JobsContent searchParams={params} />
    </div>
  );
}