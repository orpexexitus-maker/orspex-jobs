"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  location: z.string().min(2, "Location is required"),
  salaryMin: z.coerce.number().int().positive().optional(),
  salaryMax: z.coerce.number().int().positive().optional(),
});

export type JobState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export type JobFilters = {
  q?: string;
  country?: string;
  city?: string;
  title?: string;
};

// ─── Create Job ──────────────────────────────────────────────────────────
export async function createJob(
  prevState: JobState,
  formData: FormData
): Promise<JobState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated" };

  const role = (session.user as { role?: string }).role;
  if (role !== "EMPLOYER") {
    return { error: "Only employers can post jobs." };
  }

  const parsed = jobSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    country: formData.get("country"),
    city: formData.get("city"),
    location: formData.get("location"),
    salaryMin: formData.get("salaryMin") || undefined,
    salaryMax: formData.get("salaryMax") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { fieldErrors };
  }

  await prisma.job.create({
    data: {
      ...parsed.data,
      employerId: session.user.id as string,
    },
  });

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// ─── Fetch Jobs (with filters) ───────────────────────────────────────────
export async function getJobs(filters: JobFilters = {}) {
  const where: Record<string, unknown> = { isActive: true };

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { location: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.country) where.country = filters.country;
  if (filters.city) where.city = filters.city;
  if (filters.title) {
    where.title = { contains: filters.title, mode: "insensitive" };
  }

  return prisma.job.findMany({
    where,
    include: {
      employer: { select: { name: true, email: true } },
      company: {
        select: {
          id: true,
          name: true,
          industry: true,
          size: true,
          website: true,
          verified: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Fetch Filter Options ────────────────────────────────────────────────
export async function getJobFilterOptions() {
  const [countries, cities, titles] = await Promise.all([
    prisma.job.findMany({
      where: { isActive: true },
      select: { country: true },
      distinct: ["country"],
      orderBy: { country: "asc" },
    }),
    prisma.job.findMany({
      where: { isActive: true },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    }),
    prisma.job.findMany({
      where: { isActive: true },
      select: { title: true },
      distinct: ["title"],
      orderBy: { title: "asc" },
    }),
  ]);

  return {
    countries: countries.map((c) => c.country).filter(Boolean),
    cities: cities.map((c) => c.city).filter(Boolean),
    titles: titles.map((t) => t.title).filter(Boolean),
  };
}

// ─── Fetch Single Job ────────────────────────────────────────────────────
export async function getJob(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: {
      employer: { select: { name: true, email: true } },
      company: {
        select: {
          id: true,
          name: true,
          industry: true,
          size: true,
          website: true,
          verified: true,
        },
      },
    },
  });
}

// ─── Apply to Job ────────────────────────────────────────────────────────
export async function applyToJob(jobId: string, coverNote?: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated" };

  const role = (session.user as { role?: string }).role;
  if (role !== "SEEKER") {
    return { error: "Only job seekers can apply." };
  }

  try {
    await prisma.application.create({
      data: {
        jobId,
        seekerId: session.user.id as string,
        coverNote: coverNote || null,
      },
    });
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "You have already applied to this job." };
  }
}

// ─── Employer: Job + Applicants ──────────────────────────────────────────
export async function getJobWithApplicants(jobId: string) {
  const session = await auth();
  if (!session?.user) return null;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      employer: { select: { id: true, name: true, email: true } },
      company: {
        select: {
          id: true,
          name: true,
          industry: true,
          size: true,
          website: true,
          verified: true,
        },
      },
      applications: {
        include: {
          seeker: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              country: true,
              city: true,
              skills: true,
              resumeUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!job) return null;

  const userId = session.user.id as string;
  const role = (session.user as { role?: string }).role;

  if (role !== "EMPLOYER" || job.employer.id !== userId) {
    return null;
  }

  return job;
}

// ─── Update Application Status ───────────────────────────────────────────
export async function updateApplicationStatus(
  applicationId: string,
  status: "APPLIED" | "REVIEWING" | "INTERVIEW" | "HIRED" | "REJECTED"
) {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated" };

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application) return { error: "Application not found" };

  if (application.job.employerId !== session.user.id) {
    return { error: "Not authorized" };
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  revalidatePath(`/jobs/${application.jobId}/applicants`);
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Dashboard Queries ───────────────────────────────────────────────────
export async function getMyApplications() {
  const session = await auth();
  if (!session?.user) return [];

  const role = (session.user as { role?: string }).role;
  if (role !== "SEEKER") return [];

  return prisma.application.findMany({
    where: { seekerId: session.user.id as string },
    include: {
      job: {
        include: {
          employer: { select: { name: true } },
          company: { select: { name: true, verified: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyJobs() {
  const session = await auth();
  if (!session?.user) return [];

  const role = (session.user as { role?: string }).role;
  if (role !== "EMPLOYER") return [];

  return prisma.job.findMany({
    where: { employerId: session.user.id as string },
    include: {
      company: { select: { name: true, verified: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}