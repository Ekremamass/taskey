import { auth } from "@/lib/auth";
import InviteMemberForm from "./form";

export default async function TeamPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const loggedInUserId = session?.user?.id; // Replace with actual logged-in user ID
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
