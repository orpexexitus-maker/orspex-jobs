import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getJob, applyToJob } from "@/actions/jobs";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/jobs/${id}/apply`);
  }

  if (session.user.role !== "SEEKER") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Seekers only</h1>
          <p className="text-gray-600 mb-6">
            Only job seekers can submit applications.
          </p>
          <Link
            href={`/jobs/${id}`}
            className="text-blue-600 hover:underline font-medium"
          >
            Back to job
          </Link>
        </div>
      </div>
    );
  }

  const job = await getJob(id);
  if (!job || !job.isActive) {
    notFound();
  }

  const existing = await prisma.application.findUnique({
    where: {
      jobId_seekerId: {
        jobId: id,
        seekerId: session.user.id,
      },
    },
  });

  if (existing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Already applied</h1>
          <p className="text-gray-600 mb-6">
            You have already submitted an application for this role.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            View my applications
          </Link>
        </div>
      </div>
    );
  }

  async function submitApplication(formData: FormData) {
    "use server";
    const coverNote = (formData.get("coverNote") as string) || undefined;
    const result = await applyToJob(id, coverNote);
    if (result?.error) {
      redirect(`/jobs/${id}/apply?error=${encodeURIComponent(result.error)}`);
    }
    redirect("/dashboard?applied=1");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          Back to job
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Apply for this position
          </h1>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mt-4 mb-6">
            <p className="font-semibold text-slate-900">{job.title}</p>
            <p className="text-sm text-gray-600 mt-1">
              {job.company?.name ?? job.employer.name} - {job.location}
            </p>
          </div>

          <form action={submitApplication} className="space-y-5">
            <div>
              <label
                htmlFor="coverNote"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cover note (optional)
              </label>
              <textarea
                id="coverNote"
                name="coverNote"
                rows={8}
                placeholder="Tell the employer why you are a great fit for this role..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href={`/jobs/${id}`}
                className="flex-1 text-center py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
              >
                Submit application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}