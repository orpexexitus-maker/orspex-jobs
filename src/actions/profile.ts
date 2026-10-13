"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  skills: z.array(z.string()).optional(),
  experience: z.coerce.number().int().min(0).max(80).optional(),
  education: z.string().optional(),
});

export type ProfileState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
};

export async function updateProfile(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const skillsRaw = formData.get("skills") as string | null;
  const skills = skillsRaw
    ? skillsRaw
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    bio: formData.get("bio") || undefined,
    skills,
    experience: formData.get("experience") || undefined,
    education: formData.get("education") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { fieldErrors };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id as string },
      data: parsed.data,
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true };
  } catch {
    return { error: "Failed to save profile. Please try again." };
  }
}

export async function getProfile() {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      country: true,
      city: true,
      bio: true,
      skills: true,
      experience: true,
      education: true,
      resumeUrl: true,
    },
  });
}