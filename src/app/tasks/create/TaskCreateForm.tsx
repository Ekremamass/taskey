// app/tasks/create/TaskCreateForm.tsx
"use client";

import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask } from "./actions";

// Zod Schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  projectId: z.string().optional(),
  teamId: z.string().optional(),
  published: z.boolean().default(false),
});

export default function TaskCreateForm({
  projects,
  teams,
}: {
  projects: Array<{ id: number; name: string }>;
  teams: Array<{ id: number; name: string }>;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrors({});

    const result = await createTask(formData);

    if (!result.success) {
      setErrors(result.errors || {});
      toast.error((result.errors as string) || "Failed to create task");
    } else {
      toast.success("Task created successfully");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <form action={handleSubmit}>
        <div className="space-y-4">
          {/* Title Field */}
          <div>
            <Label>Title</Label>
            <Input name="title" placeholder="Enter task title" required />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
            )}
          </div>

          {/* Project Select */}
          <div>
            <Label>Project</Label>
            <Select name="projectId">
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectId && (
              <p className="text-red-500 text-sm mt-1">{errors.projectId[0]}</p>
            )}
          </div>

          {/* Team Select */}
          <div>
            <Label>Team</Label>
            <Select name="teamId">
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teamId && (
              <p className="text-red-500 text-sm mt-1">{errors.teamId[0]}</p>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="text-red-500 text-sm mt-2">{errors.general[0]}</div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </div>
  );
}
