import { prisma } from "@/lib/prisma";
import { Task, Project, Team } from "@prisma/client";

// Function to get tasks for a specific user
export async function getTasks(userId: string): Promise<Task[]> {
  return await prisma.task.findMany({
    where: {
      userId,
    },
  });
}

// Function to get projects for a specific user
export async function getProjects(userId: string): Promise<Project[]> {
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
  });
}

// Function to get teams for a specific user
export async function getTeams(userId: string): Promise<Team[]> {
  return await prisma.team.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
  });
}

await prisma.teamsOnUsers.