"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { z } from "zod";


// Zod Schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  projectId: z.string().optional(),
  teamId: z.string().optional(),
  published: z.boolean().default(false),
});


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



export async function createTask(formData: FormData) {
  const validatedFields = taskSchema.safeParse({
    title: formData.get("title"),
    projectId: formData.get("projectId"),
    teamId: formData.get("teamId"),
    published: formData.get("published") === "true",
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      errors: { general: ["User not authenticated"] },
    };
  }

  try {
    const task = await prisma.task.create({
      data: {
        ...validatedFields.data,
        userId: session.user.id,
        projectId: validatedFields.data.projectId
          ? Number(validatedFields.data.projectId)
          : undefined,
        teamId: validatedFields.data.teamId
          ? Number(validatedFields.data.teamId)
          : undefined,
      },
    });

    return {
      success: true,
      task,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        general: ["Failed to create task"],
      },
    };
  }
}
