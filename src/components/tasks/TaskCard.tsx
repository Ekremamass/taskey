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
import { buttonVariants } from "@/components/ui/button";
import { Task } from "@prisma/client";
import { IoEnterOutline } from "react-icons/io5";
import { FaProjectDiagram, FaUsers, FaCalendarAlt } from "react-icons/fa";

type TaskCardProps = {
  task: Task;
  viewMode: "grid" | "list";
};

const TaskCard: React.FC<TaskCardProps> = ({ task, viewMode }) => {
  return (
    <Card
      key={task.id}
      className={`${
        viewMode === "list"
          ? "flex flex-col md:flex-row p-4"
          : "bg-gray-200 dark:bg-gray-800"
      }`}
    >
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>ID: {task.id}</CardDescription>
        <CardDescription>
          Created At: {task.createdAt.toString()}
        </CardDescription>
        <CardDescription>
          Updated At: {task.updatedAt.toString()}
        </CardDescription>
        <CardDescription>
          Published: {task.published ? "Yes" : "No"}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link
          href={`/tasks/${task.id}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <IoEnterOutline />
        </Link>
        {task.projectId && (
          <Link
            href={`/projects/${task.projectId}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <FaProjectDiagram />
          </Link>
        )}
        {task.teamId && (
          <Link
            href={`/teams/${task.teamId}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <FaUsers />
          </Link>
        )}
        {task.calendarId && (
          <Link
            href={`/calendars/${task.calendarId}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <FaCalendarAlt />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
