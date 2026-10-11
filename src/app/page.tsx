import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Orspex Jobs</h1>
        <p className="text-gray-600 mb-8">
          Connect job seekers with employers. Find work, hire talent.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white rounded px-6 py-3 font-medium hover:bg-blue-700"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 rounded px-6 py-3 font-medium hover:bg-gray-100"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}