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

export async function getJobs() {
  return prisma.job.findMany({
    where: { isActive: true },
    include: { employer: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getJob(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: { employer: { select: { name: true, email: true } } },
  });
}

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

export async function getJobWithApplicants(jobId: string) {
  const session = await auth();
  if (!session?.user) return null;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      employer: { select: { id: true, name: true, email: true } },
      applications: {
        include: {
          seeker: { select: { id: true, name: true, email: true } },
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
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}