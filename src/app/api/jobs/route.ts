// src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeHireFasterScore } from "@/lib/hireFasterScore";
import { auth } from "@/lib/auth";

// ─────────────────────────────────────────────
// GET /api/jobs?visa=true&remote=true&country=UAE&q=engineer
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q          = searchParams.get("q")?.trim();
  const country    = searchParams.get("country")?.trim();
  const city       = searchParams.get("city")?.trim();
  const visa       = searchParams.get("visa") === "true";
  const remote     = searchParams.get("remote") === "true";
  const relocation = searchParams.get("relocation") === "true";
  const salaryMin  = searchParams.get("salary_min");
  const experience = searchParams.get("experience")?.trim();
  const jobType    = searchParams.get("job_type")?.trim();
  const sortBy     = searchParams.get("sort") ?? "score";
  const page       = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize   = Math.min(50, parseInt(searchParams.get("pageSize") ?? "20"));
  const skip       = (page - 1) * pageSize;

  const where: any = {
    isActive: true,
    ...(country    ? { country } : {}),
    ...(city       ? { city }    : {}),
    ...(visa       ? { visaSponsorship: true }  : {}),
    ...(remote     ? { remote: true }           : {}),
    ...(relocation ? { relocationAssist: true } : {}),
    ...(experience ? { experienceLevel: experience } : {}),
    ...(jobType    ? { jobType }                : {}),
    ...(salaryMin  ? { salaryMax: { gte: parseInt(salaryMin) } } : {}),
    ...(q
      ? {
          OR: [
            { title:       { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { company: { is: { name: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  const orderBy: any =
    sortBy === "newest" ? { createdAt: "desc" }
    : sortBy === "salary" ? { salaryMax: "desc" }
    : { hireFasterScore: "desc" };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            verified: true,
            visaSponsor: true,
            relocationAssist: true,
            remoteFriendly: true,
            fastResponder: true,
          },
        },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return NextResponse.json({
    jobs,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

// ─────────────────────────────────────────────
// POST /api/jobs
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Look up user by email (NextAuth session gives email; your schema uses email @unique)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();

  const required = ["title", "description", "country", "city", "location"];
  for (const f of required) {
    if (!body[f]) {
      return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 });
    }
  }

  // Look up the user's company (for verified badge)
  const company = await prisma.company.findUnique({
    where: { ownerId: user.id },
  });
  const verifiedEmployer = company?.verified ?? false;

  // Compute Hire Faster Score
  const { score } = computeHireFasterScore({
    salaryDisclosed:
      body.salaryDisclosed ?? (body.salaryMin != null || body.salaryMax != null),
    visaSponsorship:  !!body.visaSponsorship,
    verifiedEmployer,
    interviewProcess: body.interviewProcess ?? null,
    responseDays:     body.responseDays ?? null,
  });

  // Slug
  const baseSlug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const job = await prisma.job.create({
    data: {
      title:              body.title,
      description:        body.description,
      country:            body.country,
      city:               body.city,
      location:           body.location,
      slug,
      employerId:         user.id,
      companyId:          company?.id ?? null,

      salaryMin:          body.salaryMin ?? null,
      salaryMax:          body.salaryMax ?? null,
      salaryCurrency:     body.salaryCurrency ?? "USD",
      salaryPeriod:       body.salaryPeriod ?? "year",
      salaryDisclosed:    body.salaryDisclosed ?? (body.salaryMin != null),

      visaSponsorship:    !!body.visaSponsorship,
      relocationAssist:   !!body.relocationAssist,
      freeVisa:           !!body.freeVisa,
      accommodation:      !!body.accommodation,

      remote:             !!body.remote,
      hybrid:             !!body.hybrid,

      jobType:            body.jobType ?? "FULL_TIME",
      experienceLevel:    body.experienceLevel ?? "MID",
      category:           body.category ?? null,
      skills:             body.skills ?? [],
      languages:          body.languages ?? ["en"],

      requirements:       body.requirements ?? null,
      responsibilities:   body.responsibilities ?? null,
      interviewProcess:   body.interviewProcess ?? null,
      responseDays:       body.responseDays ?? null,

      hireFasterScore:    score,

      status:             "ACTIVE",
      publishedAt:        new Date(),
    },
  });

  return NextResponse.json({ job }, { status: 201 });
}