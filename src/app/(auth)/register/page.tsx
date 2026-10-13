"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";

function RegisterContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  const role: "SEEKER" | "EMPLOYER" | null =
    roleParam === "seeker"
      ? "SEEKER"
      : roleParam === "employer"
      ? "EMPLOYER"
      : null;

  // No role yet — show the two role cards
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Join Orspex Jobs</h1>
            <p className="text-gray-600">
              What would you like to do?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Seeker card — entire card is a link */}
            <Link
              href="/register?role=seeker"
              className="group block bg-white border-2 border-gray-200 hover:border-blue-500 rounded-2xl p-8 transition hover:shadow-xl cursor-pointer"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                Find work
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                I&apos;m looking for a job
              </p>
              <span className="inline-block text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                Register as Job Seeker →
              </span>
            </Link>

            {/* Employer card — entire card is a link */}
            <Link
              href="/register?role=employer"
              className="group block bg-white border-2 border-gray-200 hover:border-blue-500 rounded-2xl p-8 transition hover:shadow-xl cursor-pointer"
            >
              <div className="text-5xl mb-4">💼</div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                Hire talent
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                I&apos;m hiring for my company
              </p>
              <span className="inline-block text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                Register as Employer →
              </span>
            </Link>
          </div>

          <p className="mt-8 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Role is set — show the form
  return <RegisterForm role={role} />;
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8 text-center text-gray-500">
          Loading...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}