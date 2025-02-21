"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// User actions

export async function fetchUserProfile() {
  const session = await auth();

  if(!session || !session.user){
    throw new Error("User not authenticated");
  }
  return prisma.user.findUnique({
    where: { id: session.user.id }, 
  });

}

export async function updateUserProfile(params: 
  { name: string, email: string, image: string, bio: string, location: string, phoneNumber: string, timezone: string, language: string, twoFactorEnabled: boolean}){
  const session = await auth();

  if(!session || !session.user){
    throw new Error("User not authenticated");
  }
  return prisma.user.update({
    where: { id: session.user.id },
    data: { name:params.name, email:params.email, image:params.image, bio:params.bio, location:params.location, phoneNumber:params.phoneNumber, timezone:params.timezone, language:params.language, twoFactorEnabled:params.twoFactorEnabled },
  });
} 