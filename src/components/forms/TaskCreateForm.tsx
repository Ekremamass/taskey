"use client";

import { useState } from "react";
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
  calendars,
}: {
  projects: Array<{ id: number; name: string }>;
  teams: Array<{ id: number; name: string }>;
  calendars: Array<{ id: number; name: string }>;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const teamIdFromUrl = params?.teamId;
  const projectIdFromUrl = params?.projectId;
  const calendarIdFromUrl = params?.calendarId;

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

          {/* Assign To Select */}
          <div>
            <Label>Assign To</Label>
            <Select name="assignedTo">
              <SelectTrigger>
                <SelectValue placeholder="Select a user to assign the task to" />
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

          {/* Calendar Select - Hide if calendarId is in URL */}
          {!calendarIdFromUrl && (
            <div>
              <Label>Calendar</Label>
              <Select name="calendarId">
                <SelectTrigger>
                  <SelectValue placeholder="Select a calendar" />
                </SelectTrigger>
                <SelectContent>
                  {calendars.map((calendar) => (
                    <SelectItem
                      key={calendar.id}
                      value={calendar.id.toString()}
                    >
                      {calendar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.calendarId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.calendarId[0]}
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
