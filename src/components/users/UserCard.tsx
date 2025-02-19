import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { User } from "@prisma/client";

type UserCardProps = {
  user: User;
};

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
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
  );
};

export default UserCard;
