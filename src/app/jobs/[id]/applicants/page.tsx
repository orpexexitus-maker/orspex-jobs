import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getJobWithApplicants } from "@/actions/jobs";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { ApplicantRow } from "./applicant-row";

async function ApplicantsList({ id }: { id: string }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const job = await getJobWithApplicants(id);
  if (!job) notFound();

  return (
    <div className="bg-white rounded-lg shadow p-8 mt-4">
      <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
      <p className="text-gray-600 mb-6">
        {job.applications.length}{" "}
        {job.applications.length === 1 ? "applicant" : "applicants"}
      </p>

      {job.applications.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No applications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {job.applications.map((app) => (
            <ApplicantRow
              key={app.id}
              id={app.id}
              seekerName={app.seeker.name}
              seekerEmail={app.seeker.email}
              coverNote={app.coverNote}
              status={app.status}
              createdAt={app.createdAt.toISOString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

async function ApplicantsWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  return <ApplicantsList id={id} />;
}

export default function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav className="flex gap-4 text-sm">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="text-blue-600 text-sm hover:underline">
          ← Back to dashboard
        </Link>
        <Suspense fallback={<div className="text-gray-500 mt-4">Loading applicants...</div>}>
          <ApplicantsWrapper params={params} />
        </Suspense>
      </main>
    </div>
  );
}