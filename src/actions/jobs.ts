"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
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