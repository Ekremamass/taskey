"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { acceptInvite } from "@/actions/team";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

const AcceptInvitePage = () => {
  const router = useRouter();
  const params = useParams<{ teamId: string; userId: string }>();
  const teamId = Number(params.teamId);
  const userId = params.userId;

  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (session?.user?.id === userId) {
      setIsAuthorized(true);
    } else {
      toast.error("You are not authorized to accept this invite.");
    }
  }, [session, userId, router]);

  const handleAcceptInvite = async () => {
    if (!isAuthorized) return;

    try {
      setLoading(true);
      const response = await acceptInvite(userId, teamId);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Invite accepted successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred while accepting the invite.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) return <div>Please login to the invited account.</div>;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Accept Invite</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">
            You have been invited to join a team. Do you want to accept the
            invite?
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAcceptInvite}
          disabled={loading || !isAuthorized}
          className="w-full"
        >
          {loading ? "Accepting..." : "Accept Invite"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AcceptInvitePage;
