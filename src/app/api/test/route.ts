import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
        role: "SEEKER",
      },
    });
    const count = await prisma.user.count();
    return NextResponse.json({ ok: true, user, totalUsers: count });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}