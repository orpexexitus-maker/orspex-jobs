// src/app/api/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Please sign in to apply" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { jobId, coverNote } = await req.json();
  if (!jobId) {
    return NextResponse.json({ error: "jobId required" }, { status: 400 });
  }

  const existing = await prisma.application.findUnique({
    where: { jobId_seekerId: { jobId, seekerId: user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already applied" }, { status: 409 });
  }

  const application = await prisma.application.create({
    data: {
      jobId,
      seekerId: user.id,
      coverNote: coverNote ?? null,
      status: "APPLIED",
    },
  });

  // Increment applicants count
  await prisma.job.update({
    where: { id: jobId },
    data: { applicantsCount: { increment: 1 } },
  });

  return NextResponse.json({ application }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { applications: { include: { job: true } } },
  });
  return NextResponse.json({ applications: user?.applications ?? [] });
}