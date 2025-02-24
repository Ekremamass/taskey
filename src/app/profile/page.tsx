import { auth } from "@/lib/auth";
import { getUserProfile } from "../../actions/user";
import { toast } from "sonner";
import ProfileForm from "./form";

export default async function ProfilePage() {
  try {
    const user = await getUserProfile();
    return (
      <div>
        <ProfileForm user={user} />
      </div>
    );
  } catch (error) {
    toast("Unauthorized");
    return <div>Sign in to show profile.</div>;
  }
}
