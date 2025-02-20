"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function updateTaskStatus(taskId: number, newStatus: Status) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const curr_task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!curr_task) {
    throw new Error("Task not found");
  }

  if (session.user.id !== curr_task.userId) {
    throw new Error("Unauthorized");
  }

  if (!Object.values(Status).includes(newStatus)) {
    throw new Error("Invalid status value");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });
}
