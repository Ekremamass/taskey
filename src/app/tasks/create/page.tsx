// app/tasks/create/page.tsx
import { auth } from "@/auth";
import TaskCreateForm from "./TaskCreateForm";
import { getProjects, getTeams } from "@/lib/data";

export default async function TaskCreatePage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Please sign in to create a task</div>;
  }

  const projects = await getProjects(session.user.id);
  const teams = await getTeams(session.user.id);

  return <TaskCreateForm projects={projects} teams={teams} />;
}
