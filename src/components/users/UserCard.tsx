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
import { User, TeamsOnUsers } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type UserCardProps = {
  user: User & { teams?: TeamsOnUsers[] };
  teamRole?: MemberRole;
};

const UserCard: React.FC<UserCardProps> = ({ user, teamId }) => {
  const teamRole = null;
  if (teamId) {
    teamRole = await prisma.teamsOnUsers.findUnique({
      where: { userId_teamId: { userId: user.id, teamId: teamId } },
    });
  }

  return (
    <Card key={user.id}>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {teamRole && (
          <CardDescription>Role in Team: {teamRole}</CardDescription>
        )}
        <CardDescription>Email: {user.email}</CardDescription>
        <CardDescription>Bio: {user.bio}</CardDescription>
        <CardDescription>Language: {user.language}</CardDescription>
        <CardDescription>Location: {user.location}</CardDescription>
        <CardDescription>Phone: {user.phoneNumber}</CardDescription>
        <CardDescription>Timezone: {user.timezone}</CardDescription>
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
