import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { NewJobForm } from "./new-job-form";

export default async function NewJobPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "EMPLOYER") {
    redirect("/dashboard");
  }

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

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Post a new job</h1>
        <NewJobForm />
      </main>
    </div>
  );
}