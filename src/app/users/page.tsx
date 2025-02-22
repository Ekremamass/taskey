import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import React from "react";
import UserCard from "@/app/users/UserCard";
import { User } from "@prisma/client";

export default async function Page() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return <div>Unauthorized</div>;
    }

    const users: User[] = await prisma.user.findMany();

    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">Users</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return <div>Failed to load users</div>;
  }
}
