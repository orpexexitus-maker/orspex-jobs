import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginPanel } from "./login-panel";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Gradient Blobs */}
        {/* Top Left Purple/Blue Blob */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/40 to-blue-200/40 rounded-full blur-3xl" />
        
        {/* Center Blue Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-100/30 rounded-full blur-3xl" />
        
        {/* Bottom Right Green/Blue Blob */}
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-100/40 to-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              {/* Custom CSS Logo to match screenshot */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-green-400 rounded-full"></div>
                <div className="absolute inset-1 border-2 border-blue-400 rounded-full"></div>
                <div className="absolute inset-2 bg-blue-600 rounded-full"></div>
                <div className="absolute inset-3 bg-slate-900 rounded-full"></div>
                {/* Dots */}
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <div className="absolute top-1/2 -left-0.5 -translate-y-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <div className="absolute top-1/2 -right-0.5 -translate-y-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Orspex Jobs</span>
            </Link>
            <nav className="flex gap-4 text-sm items-center">
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900 font-medium">
                Browse jobs
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
              >
                Get started
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero — two columns */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Marketing */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 bg-blue-50/80 backdrop-blur text-blue-700 text-sm px-4 py-1.5 rounded-full mb-8 border border-blue-100 font-medium shadow-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Connecting talent with opportunity
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-slate-900">
                Find work.
                <br />
                <span className="text-blue-600">Hire talent.</span>
              </h1>

              <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
                Orspex connects job seekers with employers — no fees, no games,
                no endless forms. Just real work.
              </p>

              {/* Two role cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/register?role=seeker"
                  className="group block bg-white/80 backdrop-blur border-2 border-gray-100 hover:border-blue-500 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold mb-1 text-gray-900">
                    Find work
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    I&apos;m looking for a job
                  </p>
                  <span className="inline-flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Get started as Job Seeker
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>

                <Link
                  href="/register?role=employer"
                  className="group block bg-white/80 backdrop-blur border-2 border-gray-100 hover:border-blue-500 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold mb-1 text-gray-900">
                    Hire talent
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    I&apos;m hiring for my company
                  </p>
                  <span className="inline-flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Get started as Employer
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Right: Login panel */}
            <div className="lg:pl-8 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <LoginPanel />
            </div>
          </div>
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
      </div>
    </div>
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
    <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
      <div className="w-12 h-12 bg-blue-50/50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100/50">
        <div className="w-6 h-6">{icon}</div>
      </div>
      <h3 className="font-bold text-lg mb-2 text-slate-900">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}