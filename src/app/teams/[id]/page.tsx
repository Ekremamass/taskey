import { prisma } from "@/lib/prisma";
import React from "react";
import { auth } from "@/lib/auth";
import UserCard from "@/components/users/UserCard";

export default async function TeamPage({ params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) {
      return <div>Login to access team.</div>;
    }
    const id = Number((await params).id);

    const team = await prisma.team.findUnique({ where: { id: id } });
    if (!team) {
      return <div>Team not found.</div>;
    }

    const userInTeam = await prisma.teamsOnUsers.findUnique({
      where: { userId_teamId: { userId: user.id, teamId: id } },
    });
    if (!userInTeam) {
      return <div>You are not a member of this team.</div>;
    }

    const members = await prisma.teamsOnUsers.findMany({
      where: { teamId: team.id },
      select: { user: true },
    });
    if (!members) {
      return <div>Team has no members.</div>;
    }

    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">Team {`${team.name}`}</h1>
        <div>
          <h2>Members</h2>
          {members.map((member) => (
            <UserCard user={member.user} />
          ))}
        </div>
      </main>
    );
  } catch (error) {
    return <div>Failed to load team</div>;
  }
}
