"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { createTask } from "@/actions/task";

export default function TaskCreateForm({
  projects,
  teams,
}: {
  projects: Array<{ id: number; name: string }>;
  teams?: Array<{ id: number; name: string }>;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const teamIdFromUrl = params?.teamId;
  const projectIdFromUrl = params?.projectId;

  useEffect(() => {
    console.log("params:", params);
    console.log("teamIdFromUrl:", teamIdFromUrl);
  }, [params]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);

    // Add teamId to formData if it exists in the URL
    if (teamIdFromUrl) {
      formData.append("teamId", teamIdFromUrl);
    }

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
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Title Field */}
          <div>
            <Label>Title</Label>
            <Input name="title" placeholder="Enter task title" required />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <Label>Description</Label>
            <Input
              name="description"
              placeholder="Enter task description"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description[0]}
              </p>
            )}
          </div>

          {/* Team Select - Hide if teamId is in URL */}
          {!teamIdFromUrl && (
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
          )}

          {/* Project Select - Hide if projectId is in URL */}
          {!projectIdFromUrl && (
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.projectId[0]}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create Task"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
