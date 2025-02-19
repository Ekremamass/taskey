import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import React from "react";
import { Task } from "@prisma/client";
import TaskCard from "@/components/tasks/TaskCard";

export default async function Page() {
  try {
    const session = await auth();

    const tasks: Task[] = await prisma.task.findMany({
      where: {
        userId: session?.user?.id,
      },
    });

    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">tasks</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return <div>Failed to load tasks</div>;
  }
}
