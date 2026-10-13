"use client";

import { useState } from "react";
import { uploadResume, deleteResume } from "@/actions/upload";

export function ResumeUpload({
  initialUrl,
}: {
  initialUrl: string | null;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Client-side check for instant feedback
    if (file.size > 1 * 1024 * 1024) {
      setError("File too large. Maximum size is 1 MB.");
      e.target.value = "";
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    const result = await uploadResume(formData);

    if ("error" in result && result.error) {
      setError(result.error);
    } else if ("url" in result && result.url) {
      setUrl(result.url);
    }

    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete() {
    if (!confirm("Delete your CV? This cannot be undone.")) return;
    setDeleting(true);
    const result = await deleteResume();
    if (result.success) {
      setUrl(null);
    }
    setDeleting(false);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        CV / Resume
      </label>

      {url ? (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">My CV.pdf</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View current CV
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>

          <label className="mt-3 inline-block cursor-pointer text-sm text-blue-600 hover:underline">
            Replace with a new file
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition">
          <svg
            className="w-10 h-10 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {uploading ? "Uploading..." : "Click to upload your CV"}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            PDF only - Max 1 MB
          </span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}