// src/app/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginPanel } from "./login-panel";
import { prisma } from "@/lib/prisma";
import { formatSalary } from "@/lib/format";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const recentJobs = await prisma.job.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { company: true },
  });

  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-4 py-1.5 rounded-full mb-8 border border-blue-100 font-medium">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Connecting talent with opportunity
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-slate-900">
              Find work.
              <br />
              <span className="text-blue-600">Hire talent.</span>
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
              Orspex connects job seekers with employers — no fees, no games, no endless forms. Just real work.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/register?role=seeker" className="group block bg-white border-2 border-gray-100 hover:border-blue-500 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold mb-1 text-gray-900">Find work</h2>
                <p className="text-sm text-gray-500 mb-4">I am looking for a job</p>
                <span className="inline-flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Get started as Job Seeker →
                </span>
              </Link>

              <Link href="/register?role=employer" className="group block bg-white border-2 border-gray-100 hover:border-blue-500 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold mb-1 text-gray-900">Hire talent</h2>
                <p className="text-sm text-gray-500 mb-4">I am hiring for my company</p>
                <span className="inline-flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Get started as Employer →
                </span>
              </Link>
            </div>
          </div>

          <div className="lg:pl-8 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <LoginPanel />
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Latest Opportunities</h2>
            <p className="text-gray-600 mt-2">Discover your next role at top companies.</p>
          </div>
          <Link href="/jobs" className="text-blue-600 font-medium hover:underline">
            View all jobs →
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
            <p className="text-gray-500">No jobs posted yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <Link
                key={job.id}
                href={"/jobs/" + (job.slug ?? job.id)}
                className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    {job.priority}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {job.company?.name ?? "Unknown Company"}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                  </span>
                  <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Apply →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>}
            title="Search jobs"
            description="Browse openings by title, location, or salary — all in one place."
          />
          <FeatureCard
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}
            title="Apply in seconds"
            description="One-click apply. Track every application without digging through email."
          />
          <FeatureCard
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
            title="Post jobs free"
            description="Employers list openings at no cost. Review applicants in one dashboard."
          />
          <FeatureCard
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
            title="Track progress"
            description="Know exactly where you stand — applied, reviewing, interview, or hired."
          />
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
        <div className="w-6 h-6">{icon}</div>
      </div>
      <h3 className="font-bold text-lg mb-2 text-slate-900">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
