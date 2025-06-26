"use client";

import { useState } from "react";
import { deleteTeam } from "@/actions/team";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export default function DeleteTeam() {
  const params = useParams<{ teamId: string }>();
  const teamId = Number(params.teamId);

  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!session?.user?.id) {
    return <div className="text-center p-4">Login to delete team.</div>;
  }

  const handleDelete = async () => {
    setError(null);
    setIsLoading(true);
    try {
      console.log("Deleting team", teamId);
      await deleteTeam(teamId);
      toast.success("Team deleted successfully.");
      router.push("/teams");
    } catch (error) {
      console.error("Error deleting team:", error);
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (confirmText === "DELETE TEAM") {
      await handleDelete();
      setIsModalOpen(false);
      setConfirmText("");
    } else {
      toast.error("Confirm text does not match.");
    }
  };

  return (
    <div className="text-center p-4">
      <p>Are you sure you want to delete this team?</p>
      <p className="text-red-500">
        This action will delete all tasks associated with the team and cannot be
        undone.
      </p>
      <Button variant="destructive" onClick={() => setIsModalOpen(true)}>
        Yes, delete team
      </Button>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Confirm Team Deletion</h2>
          <p>Please enter "DELETE TEAM" to confirm deletion:</p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Enter DELETE TEAM"
            className="mt-2 mb-4"
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
