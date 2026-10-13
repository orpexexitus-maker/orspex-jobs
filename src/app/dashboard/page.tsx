import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/actions/auth";
import { getMyApplications, getMyJobs } from "@/actions/jobs";
import { Logo } from "@/components/logo";

async function SeekerDashboard() {
  const applications = await getMyApplications();

  const STATUS_COLORS: Record<string, string> = {
    APPLIED: "bg-blue-100 text-blue-800",
    REVIEWING: "bg-yellow-100 text-yellow-800",
    INTERVIEW: "bg-purple-100 text-purple-800",
    HIRED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My applications</h2>
        <Link
          href="/profile"
          className="text-blue-600 text-sm hover:underline font-medium"
        >
          Edit profile →
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven&apos;t applied to any jobs yet.{" "}
          <Link href="/jobs" className="text-blue-600 hover:underline">
            Browse jobs →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/jobs/${app.job.id}`}
              className="block border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{app.job.title}</p>
                  <p className="text-sm text-gray-600">
                    {app.job.employer.name} · {app.job.location}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    STATUS_COLORS[app.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

async function EmployerDashboard() {
  const jobs = await getMyJobs();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My posted jobs</h2>
        <Link
          href="/jobs/new"
          className="bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700"
        >
          + Post a job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven&apos;t posted any jobs yet.
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-semibold hover:underline"
                  >
                    {job.title}
                  </Link>
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {job._count.applications}{" "}
                  {job._count.applications === 1 ? "applicant" : "applicants"}
                </span>
              </div>
              <div className="mt-3">
                <Link
                  href={`/jobs/${job.id}/applicants`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  View applicants →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function DashboardContent() {
  await connection();
  const session = await auth();

  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav className="flex gap-4 text-sm">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</Link>
            <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-600">
                {session.user.name} · {session.user.email} ·{" "}
                <span className="font-medium">{role}</span>
              </p>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="bg-red-600 text-white rounded px-4 py-2 text-sm hover:bg-red-700"
              >
                Sign out
              </button>
            </form>
          </div>

          <div className="border-t pt-6">
            {role === "SEEKER" && <SeekerDashboard />}
            {role === "EMPLOYER" && <EmployerDashboard />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-8 text-center text-gray-500">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}