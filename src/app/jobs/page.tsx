// src/app/jobs/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { JobCard, type JobCardJob } from "@/components/JobCard";

type ApiResponse = {
  jobs: JobCardJob[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

const COUNTRIES = ["", "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "Canada", "USA", "UK", "Germany", "Australia", "Singapore", "India", "Pakistan"];
const EXPERIENCE = ["", "INTERN", "ENTRY", "MID", "SENIOR", "LEAD", "EXECUTIVE"];
const JOB_TYPES = ["", "FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY", "INTERNSHIP", "FREELANCE"];
const SORTS = [
  { value: "score", label: "Best Match" },
  { value: "newest", label: "Newest" },
  { value: "salary", label: "Highest Salary" },
];

export default function JobsPage() {
  const [visa, setVisa] = useState(false);
  const [remote, setRemote] = useState(false);
  const [relocation, setRelocation] = useState(false);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [sort, setSort] = useState("score");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (visa) p.set("visa", "true");
    if (remote) p.set("remote", "true");
    if (relocation) p.set("relocation", "true");
    if (q.trim()) p.set("q", q.trim());
    if (country) p.set("country", country);
    if (city.trim()) p.set("city", city.trim());
    if (experience) p.set("experience", experience);
    if (jobType) p.set("job_type", jobType);
    if (salaryMin) p.set("salary_min", salaryMin);
    p.set("sort", sort);
    p.set("page", String(page));
    p.set("pageSize", "20");
    return p.toString();
  }, [visa, remote, relocation, q, country, city, experience, jobType, salaryMin, sort, page]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/jobs?" + params)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [params]);

  useEffect(() => { setPage(1); }, [visa, remote, relocation, q, country, city, experience, jobType, salaryMin, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find your next role</h1>
        <p className="mt-1 text-sm text-gray-600">Visa-sponsored, remote, and relocation jobs — verified employers only.</p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Pill active={visa} onClick={() => setVisa(!visa)}>✅ Visa Sponsorship</Pill>
        <Pill active={remote} onClick={() => setRemote(!remote)}>✅ Remote</Pill>
        <Pill active={relocation} onClick={() => setRelocation(!relocation)}>✅ Relocation</Pill>
        <div className="ml-auto">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 h-fit lg:sticky lg:top-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Search</label>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, skill, company…" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {COUNTRIES.map((c) => <option key={c} value={c}>{c || "Any country"}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dubai, Toronto…" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Experience</label>
            <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {EXPERIENCE.map((e) => <option key={e} value={e}>{e || "Any level"}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Job Type</label>
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t ? t.replace("_", " ") : "Any type"}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Min. Salary</label>
            <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="e.g. 5000" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <button
            onClick={() => { setVisa(false); setRemote(false); setRelocation(false); setQ(""); setCountry(""); setCity(""); setExperience(""); setJobType(""); setSalaryMin(""); setSort("score"); }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >Clear filters</button>
        </aside>

        <section>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />)}
            </div>
          ) : !data || data.jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <p className="mb-3 text-sm text-gray-600"><strong>{data.pagination.total}</strong> jobs found</p>
              <div className="space-y-3">
                {data.jobs.map((j) => <JobCard key={j.id} job={j} />)}
              </div>
              {data.pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40">← Prev</button>
                  <span className="text-sm text-gray-600">Page {data.pagination.page} of {data.pagination.totalPages}</span>
                  <button disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40">Next →</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={"rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition " + (active ? "bg-blue-600 text-white ring-blue-600" : "bg-white text-gray-700 ring-gray-300 hover:ring-blue-400")}>
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
      <p className="text-4xl">🔍</p>
      <p className="mt-3 text-lg font-semibold text-gray-900">No jobs match your filters</p>
      <p className="mt-1 text-sm text-gray-600">Try removing a filter — or check back soon, new jobs are added daily.</p>
    </div>
  );
}


