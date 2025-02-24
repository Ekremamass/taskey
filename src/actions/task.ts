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
/* const StatusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE", "BLOCKED"]);
 */
export const TaskSchema = z.object({
  title: z.string().max(255),
  description: z.string().max(255).nullable(),
  /*   status: StatusEnum.default("TODO"),
   */ assignedToId: z.string().nullable(),
  projectId: z.number().int().positive().nullable(),
  teamId: z.number().int().positive().nullable(),
  calendarId: z.number().int().positive().nullable(),
  published: z.boolean().default(false),
});

export async function createTask(formData: FormData) {
  const validatedFields = TaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    assignedToId: formData.get("assignedToId"),
    projectId: formData.get("projectId"),
    teamId: formData.get("teamId"),
    calendarId: formData.get("calendarId"),
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
        ownerId: session.user.id,
        assignedToId: validatedFields.data.assignedToId
          ? validatedFields.data.assignedToId
          : undefined,
        projectId: validatedFields.data.projectId
          ? Number(validatedFields.data.projectId)
          : undefined,
        teamId: validatedFields.data.teamId
          ? Number(validatedFields.data.teamId)
          : undefined,
        calendarId: validatedFields.data.teamId
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
