import { prisma } from "@/lib/prisma";
import { User } from "@/lib/types";
import Link from "next/link";
import React from "react";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default async function PostsPage() {
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
                <Link
                  href={`/users/${user.id}`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  View
                </Link>
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
