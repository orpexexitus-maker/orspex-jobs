"use client";

import { useState, useTransition } from "react";
import { applyToJob } from "@/actions/jobs";

export function ApplyButton({ jobId }: { jobId: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function handleApply() {
    startTransition(async () => {
      const res = await applyToJob(jobId);
      if ("success" in res && res.success) {
        setResult({ ok: true, message: "Application submitted!" });
      } else if ("error" in res) {
        setResult({ ok: false, message: res.error ?? "Something went wrong" });
      }
    });
  }

  if (result?.ok) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 rounded p-4 text-sm">
        ✓ {result.message}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleApply}
        disabled={pending}
        className="bg-blue-600 text-white rounded px-6 py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Applying..." : "Apply now"}
      </button>
      {result?.message && !result.ok && (
        <p className="text-red-600 text-sm mt-2">{result.message}</p>
      )}
    </div>
  );
}