// app/tasks/create/page.tsx
import TaskCreateForm from "@/components/forms/TaskCreateForm";
import { getSessionUser } from "@/lib/auth";
import { getTeamProjects } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function TaskCreatePage() {
  const user = await getSessionUser();
  if (!user?.id) {
    return <div>Please sign in to create a team</div>;
  }

  return <TeamCreateForm user={user} />;
}
