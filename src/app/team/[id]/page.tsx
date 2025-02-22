import { prisma } from "@/lib/prisma";
import React from "react";
import UserCard from "@/app/users/UserCard";
import { authorizeRole } from "@/lib/permissions";
import { auth } from "@/lib/auth";

export default async function TeamPage({ params }: { params: { id: number } }) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) {
      return <div>Login to access team.</div>;
    }

    const team = await prisma.team.findUnique({ where: { id: params.id } });
    if (!team) {
      return <div>Team not found.</div>;
    }

    const userInTeam = await prisma.teamsOnUsers.findUnique({
      where: { userId_teamId: { userId: user.id, teamId: params.id } },
    });
    if (!userInTeam) {
      return <div>You are not a member of this team.</div>;
    }

    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">Team {`${team.name}`}</h1>
        <TeamCard team={team} />
      </main>
    );
  } catch (error) {
    return <div>Failed to load team</div>;
  }
}
