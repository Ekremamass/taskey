"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTaskStatus } from "../../lib/actions";
import { Status } from "@prisma/client";

export function TaskStatusSelector({
  initialStatus,
  taskId,
}: {
  initialStatus: Status;
  taskId: string;
}) {
  // Use a state to track whether component is mounted to prevent hydration mismatches
  const [isMounted, setIsMounted] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleStatusChange = async (newStatus: Status) => {
    setStatus(newStatus);
    await updateTaskStatus(taskId, newStatus);
  };

  // Render nothing until mounted to prevent hydration issues
  if (!isMounted) return null;

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(Status).map((status) => (
          <SelectItem key={status} value={status}>
            {status.replace(/_/g, " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
