"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf"];

export async function uploadResume(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("resume") as File | null;

  if (!file || file.size === 0) {
    return { error: "Please select a file." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "File too large. Maximum size is 1 MB." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Only PDF files are allowed." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { resumeUrl: true },
    });

    if (existingUser?.resumeUrl) {
      try {
        await del(existingUser.resumeUrl);
      } catch {
        // Ignore if old file already gone
      }
    }

    const filename = `resumes/${session.user.id}-${Date.now()}.pdf`;
    const blob = await put(filename, file, {
      access: "public",
      contentType: "application/pdf",
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { resumeUrl: blob.url },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Upload failed. Please try again." };
  }
}

export async function deleteResume() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { resumeUrl: true },
  });

  if (user?.resumeUrl) {
    try {
      await del(user.resumeUrl);
    } catch {
      // Ignore
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { resumeUrl: null },
  });

  revalidatePath("/profile");
  return { success: true };
}