import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatSalary, formatDate, timeAgo } from "@/lib/format";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true, employer: true },
  });

  if (!job || !job.isActive) {
    notFound();
  }

  // Check if the current user has already applied
  const session = await auth();
  let hasApplied = false;

  if (session?.user && session.user.role === "SEEKER") {
    const existing = await prisma.application.findUnique({
      where: {
        jobId_seekerId: {
          jobId: job.id,
          seekerId: session.user.id!,
        },
      },
    });
    hasApplied = !!existing;
  }

  const isEmployer = session?.user?.role === "EMPLOYER";
  const isSeeker = session?.user?.role === "SEEKER";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-green-400 rounded-full"></div>
              <div className="absolute inset-1 border-2 border-blue-400 rounded-full"></div>
              <div className="absolute inset-2 bg-blue-600 rounded-full"></div>
              <div className="absolute inset-3 bg-slate-900 rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Orspex Jobs
            </span>
          </Link>
          <nav className="flex gap-4 text-sm items-center">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900 font-medium">
              Browse jobs
            </Link>
            {session?.user ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link
          href="/jobs"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          ← Back to all jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    job.priority === "URGENT" || job.priority === "IMMEDIATE"
                      ? "bg-red-50 text-red-700"
                      : job.priority === "IMPORTANT"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {job.priority}
                </span>
                <span className="text-xs text-gray-500">
                  Posted {timeAgo(job.createdAt)}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {job.title}
              </h1>

              <div className="flex items-center gap-2 text-gray-700 font-medium mb-4">
                {job.company?.name ?? "Unknown Company"}
                {job.company?.verified && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Job Description
              </h2>
              <div className="prose prose-slate max-w-none whitespace-pre-line text-gray-700 leading-relaxed">
                {job.description}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Ready to apply?</h3>

              {!session?.user && (
                <div className="space-y-3">
                  <Link
                    href={`/login?callbackUrl=/jobs/${job.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
                  >
                    Sign in to apply
                  </Link>
                  <p className="text-xs text-gray-500 text-center">
                    Don&apos;t have an account?{" "}
                    <Link href="/register?role=seeker" className="text-blue-600 hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              )}

              {isSeeker && hasApplied && (
                <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-xl text-center">
                  ✅ You have already applied
                </div>
              )}

              {isSeeker && !hasApplied && (
                <Link
                  href={`/jobs/${job.id}/apply`}
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
                >
                  Apply Now
                </Link>
              )}

              {isEmployer && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-3 rounded-xl text-center">
                  You&apos;re viewing this as an employer.
                </div>
              )}

              {/* Company info */}
              {job.company && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    About the company
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium text-slate-900">{job.company.name}</p>
                    {job.company.industry && <p>🏢 {job.company.industry}</p>}
                    {job.company.size && <p>👥 {job.company.size} employees</p>}
                    {job.company.website && (
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        🌐 Visit website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}