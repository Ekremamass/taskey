import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  assignedToId: z.string().optional(),
  projectId: z.string().optional(),
  teamId: z.string().optional(),
  calendarId: z.string().optional(),
  published: z.boolean().optional(),
});
