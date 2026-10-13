"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const companySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  registrationNo: z.string().optional(),
  website: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
});

export type CompanyState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
};

export async function updateCompany(
  prevState: CompanyState,
  formData: FormData
): Promise<CompanyState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated" };

  const role = (session.user as { role?: string }).role;
  if (role !== "EMPLOYER") {
    return { error: "Only employers can manage company info." };
  }

  const parsed = companySchema.safeParse({
    name: formData.get("name"),
    country: formData.get("country"),
    city: formData.get("city"),
    registrationNo: formData.get("registrationNo") || undefined,
    website: formData.get("website") || undefined,
    industry: formData.get("industry") || undefined,
    size: formData.get("size") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    console.error("COMPANY VALIDATION ERRORS:", fieldErrors);
    return { fieldErrors };
  }

  const userId = session.user.id as string;

  try {
    const existing = await prisma.company.findUnique({
      where: { ownerId: userId },
    });

    if (existing) {
      await prisma.company.update({
        where: { ownerId: userId },
        data: parsed.data,
      });
    } else {
      await prisma.company.create({
        data: {
          ...parsed.data,
          ownerId: userId,
        },
      });
    }

    revalidatePath("/company");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("COMPANY SAVE ERROR:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to save company info. Please try again.",
    };
  }
}

export async function getCompany() {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.company.findUnique({
    where: { ownerId: session.user.id as string },
  });
}