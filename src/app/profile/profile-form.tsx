"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateProfile, type ProfileState } from "@/actions/profile";
import { CountrySelect } from "@/components/country-select";
import { SkillsInput } from "@/components/skills-input";
import { ResumeUpload } from "./resume-upload";

const initialState: ProfileState = {};

type ProfileData = {
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  skills: string[];
  experience: number | null;
  education: string | null;
  resumeUrl: string | null;
};

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
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
          Profile saved successfully
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            defaultValue={profile.name}
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
            type="email"
            value={profile.email}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Email cannot be changed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              type="tel"
              defaultValue={profile.phone ?? ""}
              placeholder="+1 555 123 4567"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Education</label>
            <input
              name="education"
              type="text"
              defaultValue={profile.education ?? ""}
              placeholder="e.g. BSc Computer Science"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <CountrySelect
              name="country"
              defaultValue={profile.country}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              name="city"
              type="text"
              defaultValue={profile.city ?? ""}
              placeholder="e.g. Lagos, London, Dubai"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Years of experience
          </label>
          <input
            name="experience"
            type="number"
            min="0"
            max="80"
            defaultValue={profile.experience ?? ""}
            placeholder="e.g. 3"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Skills
          </label>
          <SkillsInput
            name="skills"
            defaultValue={profile.skills ?? []}
          />
          <p className="text-xs text-gray-500 mt-1">
            Press Enter or comma to add each skill
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            About you
          </label>
          <textarea
            name="bio"
            rows={5}
            maxLength={500}
            defaultValue={profile.bio ?? ""}
            placeholder="Brief introduction - your background, what you're looking for, what makes you a good fit..."
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Max 500 characters
          </p>
        </div>

        {/* CV Upload Section */}
        <div className="pt-4 border-t">
          <ResumeUpload initialUrl={profile.resumeUrl} />
        </div>

        <div className="pt-4 border-t flex justify-between items-center gap-3">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Back to dashboard
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 text-white rounded px-6 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
}