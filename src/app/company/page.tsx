import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { getCompany } from "@/actions/company";
import { Logo } from "@/components/logo";
import { CompanyForm } from "./company-form";

async function CompanyContent() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role;

  // Only EMPLOYERS can access this page.
  if (!role || role !== "EMPLOYER") {
    redirect("/dashboard");
  }

  const company = await getCompany();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav className="flex gap-4 text-sm">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
              Jobs
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Your company</h1>
          <p className="text-gray-600">
            {company
              ? "Update your company information. It appears on every job you post."
              : "Set up your company profile. It will appear on every job you post."}
          </p>
        </div>

        <CompanyForm company={company} />
      </main>
    </div>
  );
}

export default function CompanyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-8 text-center text-gray-500">
          Loading company...
        </div>
      }
    >
      <CompanyContent />
    </Suspense>
  );
}