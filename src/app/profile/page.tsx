import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { getProfile } from "@/actions/profile";
import { Logo } from "@/components/logo";
import { ProfileForm } from "./profile-form";

async function ProfileContent() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role;

  // Only SEEKERS can access this page.
  // Anyone else (EMPLOYER, undefined, etc.) goes to dashboard.
  if (!role || role !== "SEEKER") {
    redirect("/dashboard");
  }

  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

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
          <h1 className="text-3xl font-bold mb-2">Your profile</h1>
          <p className="text-gray-600">
            Complete your profile to get matched with the right jobs.
            Employers see this information when you apply.
          </p>
        </div>

        <ProfileForm profile={profile} />
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-8 text-center text-gray-500">
          Loading profile...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}