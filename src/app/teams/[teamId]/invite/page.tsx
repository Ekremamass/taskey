import { auth, getSessionUser } from "@/lib/auth";
import InviteMemberForm from "./form";

export default async function TeamPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  const loggedInUserId = user?.id;
  if (loggedInUserId) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Team {params.id}</h1>
        <InviteMemberForm
          teamId={parseInt(params.id)}
          assignedBy={loggedInUserId as string}
        />
      </div>
    );
  }
  return <div></div>;
}
