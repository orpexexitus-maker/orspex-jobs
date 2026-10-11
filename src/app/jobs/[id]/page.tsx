import Link from "next/link";
import { notFound } from "next/navigation";
import { getJob } from "@/actions/jobs";
import { auth } from "@/lib/auth";
import { ApplyButton } from "./apply-button";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) notFound();

  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isSeeker = role === "SEEKER";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">Orspex Jobs</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/jobs" className="text-blue-600 text-sm hover:underline">
          ← Back to jobs
        </Link>

        <div className="bg-white rounded-lg shadow p-8 mt-4">
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <p className="text-gray-600 mb-6">
            {job.employer.name} · {job.location}
          </p>

          {job.salaryMin && job.salaryMax && (
            <p className="text-lg text-green-700 mb-6">
              ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}
            </p>
          )}

          <h2 className="font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-wrap text-gray-800 mb-8">
            {job.description}
          </p>

          {isSeeker && <ApplyButton jobId={job.id} />}

          {!session?.user && (
            <div className="border-t pt-6 text-sm text-gray-600">
              <Link href="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>{" "}
              as a job seeker to apply.
            </div>
          )}

          {session?.user && !isSeeker && (
            <div className="border-t pt-6 text-sm text-gray-600">
              Only job seekers can apply to positions.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}