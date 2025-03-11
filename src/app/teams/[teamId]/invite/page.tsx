import { getSessionUser } from "@/lib/auth";
import InviteMemberForm from "./form";

export default async function TeamPage({
  params,
}: {
  params: { teamId: string };
}) {
  const user = await getSessionUser();
  const loggedInUserId = user?.id;
  const teamId = Number(await params.teamId);

  if (loggedInUserId) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Team {teamId}</h1>
        <InviteMemberForm
          teamId={teamId}
          assignedBy={loggedInUserId as string}
        />
      </div>
    );
  }

  return <div></div>;
}
