"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, type RegisterState } from "@/actions/auth";

const initialState: RegisterState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerUser, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an account</h1>

        {state.error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="name" type="text" required className="w-full border rounded px-3 py-2" />
            {state.fieldErrors?.name && (
              <p className="text-red-600 text-xs mt-1">{state.fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" required className="w-full border rounded px-3 py-2" />
            {state.fieldErrors?.email && (
              <p className="text-red-600 text-xs mt-1">{state.fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input name="password" type="password" required minLength={6} className="w-full border rounded px-3 py-2" />
            {state.fieldErrors?.password && (
              <p className="text-red-600 text-xs mt-1">{state.fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">I am a</label>
            <select name="role" required className="w-full border rounded px-3 py-2">
              <option value="SEEKER">Job Seeker</option>
              <option value="EMPLOYER">Employer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
