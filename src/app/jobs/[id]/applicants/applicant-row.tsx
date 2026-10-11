"use client";

import { useState, useTransition } from "react";
import { updateApplicationStatus } from "@/actions/jobs";

const STATUSES = ["APPLIED", "REVIEWING", "INTERVIEW", "HIRED", "REJECTED"] as const;
type Status = (typeof STATUSES)[number];

const COLORS: Record<Status, string> = {
  APPLIED: "bg-blue-100 text-blue-800",
  REVIEWING: "bg-yellow-100 text-yellow-800",
  INTERVIEW: "bg-purple-100 text-purple-800",
  HIRED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export function ApplicantRow({
  id,
  seekerName,
  seekerEmail,
  coverNote,
  status: initialStatus,
  createdAt,
}: {
  id: string;
  seekerName: string;
  seekerEmail: string;
  coverNote: string | null;
  status: string;
  createdAt: string;
}) {
  const [status, setStatus] = useState<Status>(initialStatus as Status);
  const [pending, startTransition] = useTransition();

  function handleChange(newStatus: Status) {
    setStatus(newStatus);
    startTransition(async () => {
      await updateApplicationStatus(id, newStatus);
    });
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">{seekerName}</p>
          <p className="text-sm text-gray-600">{seekerEmail}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${COLORS[status]}`}>
          {status}
        </span>
      </div>

      {coverNote && (
        <p className="text-sm text-gray-700 mt-2 italic">&quot;{coverNote}&quot;</p>
      )}

      <p className="text-xs text-gray-400 mt-2">
        Applied {new Date(createdAt).toLocaleDateString()}
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleChange(s)}
            disabled={pending || s === status}
            className={`text-xs px-3 py-1 rounded border ${
              s === status
                ? "bg-gray-100 text-gray-500 border-gray-200"
                : "hover:bg-gray-50 border-gray-300"
            } disabled:opacity-60`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}