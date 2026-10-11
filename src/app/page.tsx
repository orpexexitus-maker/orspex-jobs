import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Complex animated grid background */}
      <div className="animated-grid-bg">
        <div className="grid-blob grid-blob-1" />
        <div className="grid-blob grid-blob-2" />
        <div className="grid-blob grid-blob-3" />
        <div className="grid-mask" />
      </div>

      {/* Content wrapper — sits above the background */}
      <div className="relative z-10">
        {/* Navbar */}
        <header className="border-b border-white/40 bg-white/60 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 600 600" width={32} height={32} aria-label="Orspex">
                <circle cx="300" cy="300" r="280" fill="none" stroke="#6EE7A0" strokeWidth="18" />
                <circle cx="300" cy="300" r="200" fill="none" stroke="#5BC0EB" strokeWidth="16" />
                <circle cx="300" cy="300" r="160" fill="#2563EB" />
                <circle cx="300" cy="300" r="90" fill="#0F172A" />
                <circle cx="300" cy="100" r="22" fill="#5BC0EB" />
                <circle cx="300" cy="500" r="22" fill="#5BC0EB" />
                <circle cx="100" cy="300" r="22" fill="#22C55E" />
                <circle cx="500" cy="300" r="22" fill="#22C55E" />
              </svg>
              <span className="text-xl font-bold">Orspex Jobs</span>
            </Link>
            <nav className="flex gap-4 text-sm items-center">
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Browse jobs</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Log in</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Get started
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50/80 backdrop-blur text-blue-700 text-sm px-4 py-1 rounded-full mb-6 border border-blue-100">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Connecting talent with opportunity
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Find work.
            <br />
            <span className="text-blue-600">Hire talent.</span>
          </h1>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Orspex connects job seekers with employers — no fees, no games, no
            endless forms. Just real work.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="bg-blue-600 text-white rounded-lg px-8 py-4 font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
              Get started →
            </Link>
            <Link href="/jobs" className="border border-gray-300 bg-white/80 backdrop-blur rounded-lg px-8 py-4 font-medium hover:bg-white transition">
              Browse jobs
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
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

        {/* Bottom CTA */}
        <section className="bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to start?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Free for job seekers and employers. Always.
            </p>
            <Link href="/register" className="inline-block bg-white text-gray-900 rounded-lg px-8 py-3 font-medium hover:bg-gray-100 transition">
              Create your account
            </Link>
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
    <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
        <div className="w-6 h-6">{icon}</div>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}