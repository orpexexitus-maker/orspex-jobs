// src/components/JobCard.tsx
"use client";
import Link from "next/link";
import { Badge, HireFasterBadge } from "@/components/Badge";

export type JobCardJob = {
  id: string;
  slug?: string | null;
  title: string;
  country: string;
  city: string;
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  salaryPeriod?: string | null;
  salaryDisclosed: boolean;
  remote: boolean;
  visaSponsorship: boolean;
  relocationAssist: boolean;
  experienceLevel?: string | null;
  jobType?: string | null;
  hireFasterScore: number;
  createdAt: string | Date;
  company?: {
    id: string;
    name: string;
    logoUrl?: string | null;
    verified: boolean;
    visaSponsor: boolean;
    relocationAssist: boolean;
    remoteFriendly: boolean;
    fastResponder: boolean;
  } | null;
};

function formatSalary(job: JobCardJob) {
  if (!job.salaryDisclosed || (job.salaryMin == null && job.salaryMax == null)) return "Salary not disclosed";
  const cur = job.salaryCurrency ?? "USD";
  const period = job.salaryPeriod ?? "year";
  const fmt = (n: number) => n.toLocaleString();
  if (job.salaryMin && job.salaryMax && job.salaryMin !== job.salaryMax) {
    return cur + " " + fmt(job.salaryMin) + "-" + fmt(job.salaryMax) + "/" + period;
  }
  return cur + " " + fmt(job.salaryMin ?? job.salaryMax ?? 0) + "/" + period;
}

function timeAgo(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 3600) return Math.floor(sec / 60) + "m ago";
  if (sec < 86400) return Math.floor(sec / 3600) + "h ago";
  return Math.floor(sec / 86400) + "d ago";
}

export function JobCard({ job }: { job: JobCardJob }) {
  const href = "/jobs/" + (job.slug ?? job.id);
  const company = job.company;

  return (
    <Link href={href} className="block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          {company?.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-gray-400">{(company?.name ?? "?").charAt(0)}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-gray-900">{job.title}</h3>
              <p className="mt-0.5 truncate text-sm text-gray-600">
                {(company?.name ?? "Company") + " · " + job.city + ", " + job.country + (job.remote ? " · Remote" : "")}
              </p>
            </div>
            <HireFasterBadge score={job.hireFasterScore} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="font-medium text-gray-700">{formatSalary(job)}</span>
            {job.jobType && <span>· {job.jobType.replace("_", " ")}</span>}
            {job.experienceLevel && <span>· {job.experienceLevel}</span>}
            <span>· {timeAgo(job.createdAt)}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {company?.verified && <Badge variant="verified" />}
            {job.visaSponsorship && <Badge variant="visa" />}
            {job.relocationAssist && <Badge variant="relocation" />}
            {job.remote && <Badge variant="remote" />}
            {company?.fastResponder && <Badge variant="fast" />}
            {job.salaryDisclosed && <Badge variant="salary" />}
          </div>
        </div>
      </div>
    </Link>
  );
}
