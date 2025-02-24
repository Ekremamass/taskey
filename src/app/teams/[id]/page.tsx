import React from "react";
import { auth } from "@/lib/auth";
import { getTeamData } from "@/actions/team";
import UserCard from "@/components/cards/UserCard";
import { DataTable } from "@/components/ui/data-table";
import { columns as taskColumns } from "@/app/tasks/columns";
import { toast } from "sonner";

export default async function TeamPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    return <div>Login to access team.</div>;
  }

  const { team, membersWithRoles, tasks, error } = await getTeamData(
    Number(params.id),
    user.id
  );

  if (error) {
    toast(error);
    return <div>{error}</div>;
  }

  if (!team) {
    return <div>Team not found.</div>;
  }

  return (
    <main className="max-w-xl">
      <h1 className="mb-4 text-xl md:text-2xl">Team {team.name}</h1>

      <div className="mb-4">
        <h2 className="mb-4">Members</h2>
        {membersWithRoles.length > 0 ? (
          <div className="flex-none">
            {membersWithRoles.map((member) => (
              <UserCard
                key={member.user.id}
                user={member.user}
                teamRole={member.role}
              />
            ))}
          </div>
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
}
