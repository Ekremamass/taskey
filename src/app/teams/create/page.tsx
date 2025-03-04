// app/teams/create/page.tsx
import TeamCreateForm from "@/components/forms/TeamCreateForm";
import { auth, getSessionUser } from "@/lib/auth";

export default async function TaskCreatePage() {
  const user = await getSessionUser();
  if (!user?.id) {
    return <div>Please sign in to create a team</div>;
  }

  return <TeamCreateForm />;
}
