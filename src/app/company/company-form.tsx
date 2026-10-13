"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateCompany, type CompanyState } from "@/actions/company";
import { CountrySelect } from "@/components/country-select";

const initialState: CompanyState = {};

type CompanyData = {
  name: string;
  country: string;
  city: string;
  registrationNo: string | null;
  website: string | null;
  industry: string | null;
  size: string | null;
} | null;

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Construction",
  "Hospitality",
  "Transportation",
  "Media",
  "Real Estate",
  "Energy",
  "Agriculture",
  "Legal",
  "Consulting",
  "Other",
];

const SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

export function CompanyForm({ company }: { company: CompanyData }) {
  const [state, formAction, pending] = useActionState(
    updateCompany,
    initialState
  );

  return (
    <div className="bg-white rounded-lg shadow p-8">
      {state.error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm">
          ✓ Company info saved successfully
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Company name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            defaultValue={company?.name ?? ""}
            placeholder="e.g. Acme Corporation"
            className="w-full border rounded px-3 py-2"
          />
          {state.fieldErrors?.name && (
            <p className="text-red-600 text-xs mt-1">
              {state.fieldErrors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <CountrySelect
              name="country"
              defaultValue={company?.country ?? null}
              required
            />
            {state.fieldErrors?.country && (
              <p className="text-red-600 text-xs mt-1">
                {state.fieldErrors.country}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              name="city"
              type="text"
              required
              defaultValue={company?.city ?? ""}
              placeholder="e.g. Makati"
              className="w-full border rounded px-3 py-2"
            />
            {state.fieldErrors?.city && (
              <p className="text-red-600 text-xs mt-1">
                {state.fieldErrors.city}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Registration / License number
          </label>
          <input
            name="registrationNo"
            type="text"
            defaultValue={company?.registrationNo ?? ""}
            placeholder="e.g. 12345678"
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your business registration ID. Used for verification. Optional.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            name="website"
            type="url"
            defaultValue={company?.website ?? ""}
            placeholder="https://company.com"
            className="w-full border rounded px-3 py-2"
          />
          {state.fieldErrors?.website && (
            <p className="text-red-600 text-xs mt-1">
              {state.fieldErrors.website}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <select
              name="industry"
              defaultValue={company?.industry ?? ""}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">Select industry...</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Company size
            </label>
            <select
              name="size"
              defaultValue={company?.size ?? ""}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">Select size...</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-between items-center gap-3">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back to dashboard
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 text-white rounded px-6 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save company"}
          </button>
        </div>
      </form>
    </div>
  );
}