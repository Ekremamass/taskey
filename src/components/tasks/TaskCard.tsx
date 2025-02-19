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
import {
  FaTasks,
  FaProjectDiagram,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";

type TaskCardProps = {
  task: Task;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <Card key={task.id} className="bg-gray-200">
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
          <FaTasks className="mr-2" />
        </Link>
        {task.projectId && (
          <Link
            href={`/projects/${task.projectId}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <FaProjectDiagram className="mr-2" />
          </Link>
        )}
        {task.teamId && (
          <Link
            href={`/teams/${task.teamId}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <FaUsers className="mr-2" />
          </Link>
        )}
        {task.calendarId && (
          <Link
            href={`/calendars/${task.calendarId}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <FaCalendarAlt className="mr-2" />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
