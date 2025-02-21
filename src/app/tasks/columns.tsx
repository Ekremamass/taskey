"use client";

import { Task } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaCalendarAlt, FaTasks, FaUsers, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { TaskStatusSelector } from "./status-selector";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    size: 400, // Increase width for title
    cell: ({ row }) => <div className="truncate">{row.original.title}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100, // Decrease width for status selector
    cell: ({ row }) => (
      <TaskStatusSelector
        initialStatus={row.original.status}
        taskId={row.original.id}
      />
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2 w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/projects/${row.original.projectId}`}>
                <Button variant="outline" size="icon">
                  <FaTasks />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Project</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/teams/${row.original.teamId}`}>
                <Button variant="outline" size="icon">
                  <FaUsers />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Team</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/calendars/${row.original.calendarId}`}>
                <Button variant="outline" size="icon">
                  <FaCalendarAlt />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Calendar</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
  {
    header: "Info",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <FaInfoCircle />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <p>
                Created At: {new Date(row.original.createdAt).toLocaleString()}
              </p>
              <p>
                Updated At: {new Date(row.original.updatedAt).toLocaleString()}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
