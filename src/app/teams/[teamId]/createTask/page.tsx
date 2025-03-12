// app/tasks/create/page.tsx
import TaskCreateForm from "@/components/forms/TaskCreateForm";
import { auth } from "@/lib/auth";
import { getTeamProjects } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function TaskCreatePage({
  params,
}: {
  params: { teamId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Please sign in to create a task</div>;
  }

  const teamId = Number(params.teamId);
  if (!teamId) {
    return <div>Invalid Team Id</div>;
  }
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    return <div>Invalid Team Id</div>;
  }
  const projects = (await getTeamProjects(teamId)) || null;

  console.log("Projects:", projects);

  return <TaskCreateForm projects={projects}  />;
}
