"use server";

import { auth } from "@/lib/auth";
import { authorizeRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod Schema

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

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
  if (!session?.user?.email) throw new Error("Unauthorized");

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

// ADMINS ONLY
export async function getAllUsers() {
  await authorizeRole(["ADMIN"]);
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      location: true,
      phoneNumber: true,
      twoFactorEnabled: true,
    },
  });
}

// ADMINS ONLY
export async function updateUserRole(
  userId: string,
  newRole: "ADMIN" | "MANAGER" | "MEMBER"
) {
  await authorizeRole(["ADMIN"]);

  return prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
}

export async function getUserTeamRole(userId: string, teamId: number) {
  return prisma.teamsOnUsers.findUnique({
    where: { userId_teamId: { userId, teamId } },
    select: { role: true },
  });
}
