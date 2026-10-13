"use client";

import { COUNTRIES } from "@/lib/countries";

export function CountrySelect({
  name = "country",
  defaultValue,
  required = false,
}: {
  name?: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? ""}
      required={required}
      className="w-full border rounded px-3 py-2 bg-white"
    >
      <option value="">Select a country...</option>
      {COUNTRIES.map((country) => (
        <option key={country.code} value={country.name}>
          {country.name}
        </option>
      ))}
    </select>
  );
}