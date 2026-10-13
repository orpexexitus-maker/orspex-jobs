"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Filters = {
  q: string;
  country: string;
  city: string;
  title: string;
};

type Options = {
  countries: string[];
  cities: string[];
  titles: string[];
};

export function JobsFilters({
  options,
  currentFilters,
}: {
  options: Options;
  currentFilters: Filters;
}) {
  const router = useRouter();

  const [q, setQ] = useState(currentFilters.q);

  useEffect(() => {
    setQ(currentFilters.q);
  }, [currentFilters.q]);

  function navigate(overrides: Partial<Filters>) {
    const next = {
      q: currentFilters.q,
      country: currentFilters.country,
      city: currentFilters.city,
      title: currentFilters.title,
      ...overrides,
    };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.country) params.set("country", next.country);
    if (next.city) params.set("city", next.city);
    if (next.title) params.set("title", next.title);
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ q });
  }

  function clearAll() {
    setQ("");
    router.push("/jobs");
  }

  const hasActiveFilters =
    currentFilters.q ||
    currentFilters.country ||
    currentFilters.city ||
    currentFilters.title;

  return (
    <div className="space-y-5 mb-8">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, description, or keyword..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          aria-label="Search"
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {/* Country pills */}
      <FilterRow
        label="Country"
        options={options.countries}
        value={currentFilters.country}
        onChange={(v) => navigate({ country: v })}
      />

      {/* City pills */}
      <FilterRow
        label="City"
        options={options.cities}
        value={currentFilters.city}
        onChange={(v) => navigate({ city: v })}
      />

      {/* Position pills */}
      <FilterRow
        label="Position"
        options={options.titles}
        value={currentFilters.title}
        onChange={(v) => navigate({ title: v })}
      />

      {/* Active filter summary + clear */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex flex-wrap gap-2 text-xs">
            {currentFilters.q && (
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                &ldquo;{currentFilters.q}&rdquo;
              </span>
            )}
            {currentFilters.country && (
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                {currentFilters.country}
              </span>
            )}
            {currentFilters.city && (
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                {currentFilters.city}
              </span>
            )}
            {currentFilters.title && (
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                {currentFilters.title}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-gray-600 hover:text-gray-900 underline whitespace-nowrap"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap pt-1.5 min-w-[68px]">
        {label}:
      </span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("")}
          className={`px-3 py-1.5 text-xs rounded-full border transition ${
            !value
              ? "bg-blue-600 text-white border-blue-600 font-medium"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          All
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-xs rounded-full border transition ${
              value === opt
                ? "bg-blue-600 text-white border-blue-600 font-medium"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}