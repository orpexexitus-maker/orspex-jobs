// src/components/SaveButton.tsx
"use client";
import { useState } from "react";

export function SaveButton({ jobId }: { jobId: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/saved-jobs", {
        method: saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) setSaved(!saved);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${
        saved
          ? "border-yellow-300 bg-yellow-50 text-yellow-800"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {saved ? "★ Saved" : "☆ Save"}
    </button>
  );
}