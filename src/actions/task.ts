"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { z } from "zod";

export async function updateTaskStatus(taskId: number, newStatus: Status) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const curr_task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!curr_task) {
    throw new Error("Task not found");
  }

  if (session.user.id !== curr_task.ownerId) {
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

// Zod Schema
const TaskSchema = z.object({
  title: z.string().max(255),
  description: z.string().max(255).nullable(),
  assignedToId: z.string().nullable(),
  projectId: z.preprocess(
    (val) => (val ? Number(val) : null),
    z.number().int().positive().nullable()
  ),
  teamId: z.preprocess(
    (val) => (val ? Number(val) : null),
    z.number().int().positive().nullable()
  ),
  calendarId: z.preprocess(
    (val) => (val ? Number(val) : null),
    z.number().int().positive().nullable()
  ),
  published: z.preprocess((val) => val === "true", z.boolean().default(false)),
});

export async function createTask(formData: FormData) {
  const validatedFields = TaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    assignedToId: formData.get("assignedToId"),
    projectId: formData.get("projectId"),
    teamId: formData.get("teamId"),
    calendarId: formData.get("calendarId"),
    published: formData.get("published"),
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
        title: validatedFields.data.title,
        description: validatedFields.data.description || null,
        assignedToId: validatedFields.data.assignedToId || null,
        projectId: validatedFields.data.projectId,
        teamId: validatedFields.data.teamId,
        calendarId: validatedFields.data.calendarId,
        published: validatedFields.data.published,
        ownerId: session.user.id,
      },
    });

    return {
      success: true,
      task,
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      success: false,
      errors: {
        general: ["Failed to create task"],
      },
    };
  }
}
