"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod Schema


export async function getUserProfile() {
  const session = await auth();
  if (!session?.user || !session?.user?.email) throw new Error("Unauthorized");

  return await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      location: true,
      phoneNumber: true,
      timezone: true,
      language: true,
      twoFactorEnabled: true,
      createdAt: true,
    },
  });
}

export async function updateUserProfile(data: { 
  name?: string; 
  bio?: string; 
  location?: string; 
  phoneNumber?: string; 
  timezone?: string; 
  language?: string; 
}) {
  const session = await auth();
  if (!session?.user || !session?.user?.email) throw new Error("Unauthorized");

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data,
    });

    revalidatePath("/profile");

    return updatedUser;
  } catch (error) {
    throw new Error("Failed to update profile");
  }
}