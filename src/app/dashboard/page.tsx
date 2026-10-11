import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOutAction } from "@/actions/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {session.user.name}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
          <p><strong>Role:</strong> {(session.user as { role?: string }).role}</p>
        </div>

        <form action={signOutAction} className="mt-6">
          <button
            type="submit"
            className="bg-red-600 text-white rounded px-4 py-2 text-sm hover:bg-red-700"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
