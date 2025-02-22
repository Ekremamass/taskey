"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@prisma/client";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FaTasks, FaUsers, FaCalendarAlt } from "react-icons/fa";

export const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span>{row.original.title}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span>{row.original.status}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => (
      <span>{new Date(row.original.updatedAt).toLocaleString()}</span>
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2 w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <FaTasks />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Task Details</TooltipContent>
          </Tooltip>

          {row.original.teamId && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <FaUsers />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Team</TooltipContent>
            </Tooltip>
          )}

          {row.original.calendarId && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <FaCalendarAlt />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Calendar</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    ),
  },
];
