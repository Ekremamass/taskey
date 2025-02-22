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
import { Team } from "@prisma/client";

type TeamCardProps = {
  team: Team;
};

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <Card key={team.id} className="bg-zinc-950 dark:bg-white">
      <CardHeader>
        <CardTitle>{team.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>Team ID: {team.id}</CardDescription>
        <CardDescription>
          Created At: {new Date(team.createdAt).toLocaleDateString()}
        </CardDescription>
        <CardDescription>
          Updated At: {new Date(team.updatedAt).toLocaleDateString()}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex space-x-4">
        <Link
          href={`/team/${team.id}`}
          className={buttonVariants({ variant: "outline" })}
        >
          View Team
        </Link>
        <Link
          href={`/team/${team.id}/tasks`}
          className={buttonVariants({ variant: "outline" })}
        >
          View Tasks
        </Link>
        <Link
          href={`/team/${team.id}/projects`}
          className={buttonVariants({ variant: "outline" })}
        >
          View Projects
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;
