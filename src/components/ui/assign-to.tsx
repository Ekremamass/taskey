"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Status } from "@prisma/client";
import { updateAssignedTo, updateTaskStatus } from "@/actions/task";
import { toast } from "sonner";

export function AssignToSelector({
  initAssignedToId,
  taskId,
}: {
  initAssignedToId: string;
  taskId: number;
}) {
  // Use a state to track whether component is mounted to prevent hydration mismatches
  const [isMounted, setIsMounted] = useState(false);
  const [assignedTo, setAssignedTo] = useState(initAssignedToId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  // Render nothing until mounted to prevent hydration issues
  if (!isMounted) return null;

  const getStatusStyles = (status: Status) => {
    switch (status) {
      case "TODO":
        return "bg-blue-100 text-blue-500";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-500";
      case "DONE":
        return "bg-green-100 text-green-500";
      case "BLOCKED":
        return "bg-red-100 text-red-500";
      default:
        return "";
    }
  };

  return (
    <Select value={status} onValueChange={handleAssignedChange}>
      <SelectTrigger className={`w-full ${getStatusStyles(status)}`}>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="TODO" className="bg-blue-100 text-blue-500">
          TODO
        </SelectItem>
        <SelectItem
          value="IN_PROGRESS"
          className="bg-yellow-100 text-yellow-500"
        >
          IN PROGRESS
        </SelectItem>
        <SelectItem value="DONE" className="bg-green-100 text-green-500">
          DONE
        </SelectItem>
        <SelectItem value="BLOCKED" className="bg-red-100 text-red-500">
          BLOCKED
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
