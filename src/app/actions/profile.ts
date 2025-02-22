"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Zod Schema
const userProfileSchema = z.object({
  name: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
});

export async function getUserProfile() {
  const session = await auth();

  if (!session?.user || !session.user.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, image: true, bio: true, location: true, phoneNumber: true, timezone: true, language: true, twoFactorEnabled: true },
  });

  if (!user) {
    throw new Error("Failed to load user");
  }

  if (user.id !== session.user.id || user.email !== session.user.email) {
    throw new Error("Found user doesn't match with session");
  }

  return user;
}

export async function updateUserProfile(formData: FormData) {
  const validatedFields = userProfileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio"),
    location: formData.get("location"),
    phoneNumber: formData.get("phoneNumber"),
    timezone: formData.get("timezone"),
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      errors: { general: ["User not authenticated"] },
    };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...validatedFields.data,
      },
    });

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      errors: { general: ["Failed to update user profile"] },
    };
  }
}