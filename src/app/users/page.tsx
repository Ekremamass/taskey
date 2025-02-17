import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { User } from "@/lib/types";
import React from "react";

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
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.email}</CardDescription>
              </CardContent>
              <CardFooter>
                <a href={`/users/${user.id}`} className="btn">
                  View
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return <div>Failed to load users</div>;
  }
}
