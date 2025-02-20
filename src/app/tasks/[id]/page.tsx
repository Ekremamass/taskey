import { prisma } from "@/lib/prisma";
import React from "react";
import { auth } from "@/auth";
import UserCard from "@/components/users/UserCard";
import { Task } from "@prisma/client";
import TaskCard from "@/components/tasks/TaskCard";

export default async function TaskPage({ params }: { params: { id: number } }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return <div>Sign in to view task</div>;
    }

    const task: Task = await prisma.task.findUnique({
      where: { id: params.id },
    });

    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">Task: {`${task.title}`}</h1>
        <TaskCard task={task} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching task:", error);
    return <div>Failed to load task</div>;
  }
}
