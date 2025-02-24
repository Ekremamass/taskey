import { toast } from "sonner";
import ProfileForm from "../../../../components/forms/TaskCreateForm";

export default async function AddTeamTaskPage() {
  return (
    <div>
      <ProfileForm user={user} />
    </div>
  );
}
