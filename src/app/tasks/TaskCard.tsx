import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Task } from "@prisma/client";
import {
  FaTasks,
  FaProjectDiagram,
  FaUsers,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskStatusSelector } from "@/components/status-selector";

type TaskCardProps = {
  task: Task;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <Card
      key={task.id}
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg"
    >
      <CardHeader className="flex justify-between items-center p-4">
        <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
        <TaskStatusSelector initialStatus={task.status} taskId={task.id} />
      </CardHeader>
      <CardContent className="p-4">
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          ID: {task.id}
        </CardDescription>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Published: {task.published ? "Yes" : "No"}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <TooltipProvider>
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/tasks/${task.id}`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <FaTasks />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Task Details</TooltipContent>
            </Tooltip>

            {task.projectId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/projects/${task.projectId}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <FaProjectDiagram />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Project</TooltipContent>
              </Tooltip>
            )}

            {task.teamId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/teams/${task.teamId}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <FaUsers />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Team</TooltipContent>
              </Tooltip>
            )}

            {task.calendarId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/calendars/${task.calendarId}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <FaCalendarAlt />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Calendar</TooltipContent>
              </Tooltip>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <FaInfoCircle />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p>Created At: {new Date(task.createdAt).toLocaleString()}</p>
                <p>Updated At: {new Date(task.updatedAt).toLocaleString()}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
