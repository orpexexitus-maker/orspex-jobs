"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, type RegisterState } from "@/actions/auth";

const initialState: RegisterState = {};

export function RegisterForm({ role }: { role: "SEEKER" | "EMPLOYER" }) {
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialState
  );

  const isSeeker = role === "SEEKER";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{isSeeker ? "🔍" : "💼"}</div>
          <h1 className="text-2xl font-bold">
            {isSeeker ? "Create a Job Seeker account" : "Create an Employer account"}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {isSeeker
              ? "Find work and apply to jobs."
              : "Post jobs and hire candidates."}
          </p>
        </div>

        {state.error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* Hidden role input — set from the URL */}
          <input type="hidden" name="role" value={role} />

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full border rounded px-3 py-2"
            />
            {state.fieldErrors?.name && (
              <p className="text-red-600 text-xs mt-1">
                {state.fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded px-3 py-2"
            />
            {state.fieldErrors?.email && (
              <p className="text-red-600 text-xs mt-1">
                {state.fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full border rounded px-3 py-2"
            />
            {state.fieldErrors?.password && (
              <p className="text-red-600 text-xs mt-1">
                {state.fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {pending
              ? "Creating account..."
              : isSeeker
              ? "Create Job Seeker account"
              : "Create Employer account"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t text-center text-sm text-gray-600">
          <p>
            {isSeeker ? "Hiring instead?" : "Looking for work instead?"}{" "}
            <Link
              href={isSeeker ? "/register?role=employer" : "/register?role=seeker"}
              className="text-blue-600 hover:underline font-medium"
            >
              {isSeeker ? "Register as Employer" : "Register as Job Seeker"}
            </Link>
          </p>
          <p className="mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}