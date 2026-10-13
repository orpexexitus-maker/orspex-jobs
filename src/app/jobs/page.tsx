import { Suspense } from "react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { getJobs } from "@/actions/jobs";
import { formatSalary, timeAgo } from "@/lib/format";

async function JobsList() {
  const jobs = await getJobs();

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No jobs posted yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="block bg-white rounded-lg shadow hover:shadow-md transition p-6"
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
              <p className="text-gray-600 text-sm">
                {job.employer.name} · {job.location}
              </p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {timeAgo(job.createdAt)}
            </span>
          </div>

          <p className="text-gray-700 text-sm line-clamp-2">
            {job.description}
          </p>

          <p className="text-sm text-green-700 font-medium mt-3">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function JobsPage() {
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Open positions</h1>
        <p className="text-gray-600 mb-8">Browse available jobs</p>
        <Suspense fallback={<div className="text-gray-500">Loading jobs...</div>}>
          <JobsList />
        </Suspense>
      </main>
    </div>
  );
}