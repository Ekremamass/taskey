"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateAssignedTo } from "@/actions/task";
import { getTeamMembersByTaskId } from "@/actions/team";
import { usePathname } from "next/navigation";

// Define a type for team members
interface User {
  id: string;
  name: string;
}

export function AssignToSelector({
  initAssignedToId,
  taskId,
}: {
  initAssignedToId: string;
  taskId: number;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [assignedTo, setAssignedTo] = useState(initAssignedToId);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);

    async function fetchTeamMembers() {
      try {
        const members = await getTeamMembersByTaskId(taskId);

        const formattedMembers = members.map((member) => ({
          id: member.user.id,
          name: member.user.name || "Unnamed User",
        }));

        setTeamMembers(formattedMembers);
      } catch (err) {
        setError("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, [taskId]);

  const handleAssignedChange = async (newUserId: string) => {
    try {
      setAssignedTo(newUserId);
      await updateAssignedTo(taskId, newUserId);
      toast("Task assigned to user successfully");
    } catch (error) {
      console.error("Failed to assign task:", error);
      toast("Failed to assign task");
    }
  };

  const pathname = usePathname();

  const isTeamPage = pathname.startsWith("/teams/");

  if (!isMounted) return null;

  if (!isTeamPage) return null;

  return (
    <Select value={assignedTo} onValueChange={handleAssignedChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Assign to" />
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <SelectItem value="loading" disabled>
            Loading...
          </SelectItem>
        ) : error ? (
          <SelectItem value="error" disabled>
            {error}
          </SelectItem>
        ) : teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="noTeamMember" disabled>
            No team members found
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
