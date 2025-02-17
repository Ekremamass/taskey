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
        <h1 className="mb-4 text-xl md:text-2xl">Users</h1>
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
      </main>
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return <div>Failed to load users</div>;
  }
}
