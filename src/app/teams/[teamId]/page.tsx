import React from "react";
import { auth } from "@/lib/auth";
import { getTeamData } from "@/actions/team";
import UserCard from "@/components/cards/UserCard";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/columns/taskColumns";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function TeamPage({
  params,
}: {
  params: { teamId: string };
}) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    return <div className="text-center p-4">Login to access team.</div>;
  }

  const teamId = Number(await params.teamId);
  const { team, membersWithRoles, tasks, error } = await getTeamData(
    teamId,
    user.id
  );

  if (error) {
    return <div className="text-center p-4">{error}</div>;
  }

  if (!team) {
    return <div className="text-center p-4">Team not found.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4">
      <h1 className="mb-4 text-xl sm:text-2xl font-semibold">
        Team {team.name}
      </h1>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-medium">Members</h2>
        {membersWithRoles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {membersWithRoles.map((member) => (
              <UserCard
                key={member.user.id}
                user={member.user}
                teamRole={member.role}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No members</div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Tasks</h2>
        <Link
          href={`/teams/${teamId}/createTask`}
          className={`${buttonVariants({
            variant: "outline",
          })} w-full sm:w-auto`}
        >
          Add Task
        </Link>
        {tasks.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <DataTable columns={columns} data={tasks} />
          </div>
        ) : (
          <div className="text-gray-500 mt-2">No tasks</div>
        )}
      </div>
    </main>
  );
}
