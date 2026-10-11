"use client";

import { useActionState } from "react";
import { createJob, type JobState } from "@/actions/jobs";

const initialState: JobState = {};

export function NewJobForm() {
  const [state, formAction, pending] = useActionState(createJob, initialState);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {state.error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job title</label>
          <input name="title" type="text" required className="w-full border rounded px-3 py-2" />
          {state.fieldErrors?.title && (
            <p className="text-red-600 text-xs mt-1">{state.fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input name="location" type="text" required placeholder="e.g. Dubai, UAE" className="w-full border rounded px-3 py-2" />
          {state.fieldErrors?.location && (
            <p className="text-red-600 text-xs mt-1">{state.fieldErrors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" required rows={6} className="w-full border rounded px-3 py-2" placeholder="Describe the role, responsibilities, and requirements..." />
          {state.fieldErrors?.description && (
            <p className="text-red-600 text-xs mt-1">{state.fieldErrors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Salary min (optional)</label>
            <input name="salaryMin" type="number" min="0" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Salary max (optional)</label>
            <input name="salaryMax" type="number" min="0" className="w-full rounded px-3 py-2 border" />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Posting..." : "Post job"}
        </button>
      </form>
    </div>
  );
}