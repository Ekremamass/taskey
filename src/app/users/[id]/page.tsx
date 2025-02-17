import { prisma } from "@/lib/prisma";
import { User } from "@/lib/types";
import React from "react";
import { auth } from "@/auth";
import UserCard from "@/components/ui/users/userCard";

export default async function PostPage({ params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return <div>Unauthorized</div>;
    }

    const user: User = await prisma.user.findUnique({
      where: { id: params.id },
    });

    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">User {`${user.name}`}</h1>
        <UserCard user={user} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return <div>Failed to load user</div>;
  }
}
