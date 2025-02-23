import { prisma } from "@/lib/prisma";
import React from "react";
import { auth } from "@/lib/auth";
import UserCard from "@/components/users/UserCard";
import { getUserTeamRole } from "@/actions/user";
import { DataTable } from "@/components/ui/data-table";
import { columns as taskColumns } from "@/app/tasks/columns";

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

    const membersWithRoles = await Promise.all(
      members.map(async (member) => {
        const role = await getUserTeamRole(member.user.id, team.id);
        return { ...member, role: role?.role || "VIEWER" };
      })
    );

    const tasks = await prisma.task.findMany({
      where: { teamId: team.id },
    });

    return (
      <main className="max-w-xl">
        <h1 className="mb-4 text-xl md:text-2xl">Team {`${team.name}`}</h1>
        <div className="mb-4">
          <h2 className="mb-4">Members</h2>
          {membersWithRoles.length > 0 ? (
            membersWithRoles.map((member) => (
              <UserCard
                key={member.user.id}
                user={member.user}
                teamRole={member.role}
              />
            ))
          ) : (
            <div>No members</div>
          )}
        </div>
        <div>
          <h2>Tasks</h2>
          {tasks.length > 0 ? (
            <div className="container mx-auto py-10">
              <DataTable columns={taskColumns} data={tasks} />
            </div>
          ) : (
            <div>No tasks</div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading team:", error);
    return <div>Failed to load team</div>;
  }
}
