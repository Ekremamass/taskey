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
    size: 300, // Increase width for title
    cell: ({ row }) => (
      <div className="font-medium max-w-[300px] truncate">
        {row.original.title}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
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
      <div className="flex space-x-2">
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
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ cell }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center space-x-1">
              <FaInfoCircle className="text-muted-foreground" />
              <span className="text-xs">
                {cell.getValue<Date>().toLocaleDateString()}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Full Date: {cell.getValue<Date>().toLocaleString()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ cell }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center space-x-1">
              <FaInfoCircle className="text-muted-foreground" />
              <span className="text-xs">
                {cell.getValue<Date>().toLocaleDateString()}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Full Date: {cell.getValue<Date>().toLocaleString()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
