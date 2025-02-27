import { prisma } from "@/lib/prisma";
import { Task, Project, Team } from "@prisma/client";

// Function to get tasks for a specific user
export async function getTasks(userId: string): Promise<Task[]> {
  return await prisma.task.findMany({
    where: {
      ownerId: userId,
    },
  });
}

// Function to get projects for a specific user
export async function getProjects(
  userId: string
): Promise<{ id: number; name: string }[]> {
  return await prisma.project.findMany({
    where: {
      team: {
        users: {
          some: {
            userId,
          },
        },
      },
    },
    select: { id: true, name: true }, // ✅ Only select needed fields
  });
}

// Function to get teams for a specific user
export async function getTeams(
  userId: string
): Promise<{ id: number; name: string }[]> {
  return await prisma.team.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
    select: { id: true, name: true }, // ✅ Only select needed fields
  });
}

// Function to get tasks for a specific team
export async function getTeamTasks(teamId: number): Promise<Task[]> {
  return await prisma.task.findMany({
    where: {
      teamId: teamId,
    },
  });
}

// Function to get projects for a specific team
export async function getTeamProjects(teamId: number): Promise<Project[]> {
  return await prisma.project.findMany({
    where: {
      teamId: teamId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      teamId: true,
    },
  });
}
