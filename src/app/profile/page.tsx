import { auth } from "@/auth";
import { getUserProfile } from "../actions/profile";
import { toast } from "sonner";
import ProfileForm from "./form";

export default async function ProfilePage () {
    const session = await auth();
      if (!session?.user) {
        return <div>Please sign in to show profile</div>;
      }
      try{
        const user = await getUserProfile();
        <div>
            <ProfileForm user={user} />
        </div>
    } catch (error) {
        toast("Unauthorized");
        return <div>Failed to load user</div>
      }

      


}