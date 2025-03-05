"use server";

import { prisma } from "@/lib/prisma";
import { getUserTeamRole } from "@/actions/user";
import { getSessionUser } from "@/lib/auth";
import { cache } from "react";
import { TeamSchema } from "@/schemas/teamSchema";
import { Team } from "@prisma/client";

/**
 * Create a new team.
 * @param formData - Form data containing the team name.
 * @returns The created team or an error message.
 */
export async function createTeam(formData: FormData) {
  const validatedFields = TeamSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const user = await getSessionUser();
  if (!user?.id) {
    return {
      success: false,
      errors: { general: ["User not authenticated"] },
    };
  }

  if (user.teamsCount >= user.teamsMax) {
    return {
      success: false,
      errors: { general: ["You have reached the maximum number of teams"] },
    };
  }

  try {
    const team = await prisma.team.create({
      data: {
        name: validatedFields.data.name,
        ownerId: user.id,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { teamsCount: { increment: 1 } },
    });

    await prisma.teamsOnUsers.create({
      data: {
        userId: user.id,
        teamId: team.id,
        role: "LEADER",
        assignedBy: user.id,
      },
    });

    return {
      success: true,
      team,
    };
  } catch (error) {
    console.error("Error creating team:", error);
    return {
      success: false,
      errors: {
        general: ["Failed to create team"],
      },
    };
  }
}

/**
 * Get data for a specific team.
 * @param teamId - ID of the team.
 * @param userId - ID of the user requesting the data.
 * @returns The team data or an error message.
 */
export async function getTeamData(teamId: number, userId: string) {
  try {
    const team = await prisma.team.findUnique({ where: { id: teamId } });

    if (!team) {
      return { error: "Team not found." };
    }

    const userInTeam = await prisma.teamsOnUsers.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });

    if (!userInTeam) {
      return { error: "You are not a member of this team." };
    }

    const members = await prisma.teamsOnUsers.findMany({
      where: { teamId },
      select: { user: true },
    });

    const membersWithRoles = await Promise.all(
      members.map(async (member) => {
        const role = await getUserTeamRole(member.user.id, teamId);
        return { ...member, role: role?.role || "VIEWER" };
      })
    );

    const tasks = await prisma.task.findMany({ where: { teamId } });

    return { team, membersWithRoles, tasks };
  } catch (error) {
    console.error("Error fetching team data:", error);
    return { error: "Failed to load team data." };
  }
}

/**
 * Invite a user to a team via email.
 * @param email - Email of the user to invite.
 * @param teamId - ID of the team.
 * @param memberRole - Role in the team (default: CONTRIBUTOR).
 * @returns Invitation result or error message.
 */
export const inviteMember = async (
  email: string,
  teamId: number,
  memberRole: "LEADER" | "CONTRIBUTOR" | "VIEWER" = "CONTRIBUTOR"
) => {
  try {
    const assignedBy = await getSessionUser();

    // Check if the user sending the invite is a leader
    if (!assignedBy?.id || !isMemberLeader(assignedBy?.id, teamId)) {
      return { error: "Login to show your teams." };
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "User not found. Please ask them to register first." };
    }

    // Check if the user is already in the team
    const existingMembership = await prisma.teamsOnUsers.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: teamId,
        },
      },
    });

    if (existingMembership) {
      return { error: "User is already a member of this team." };
    }

    // Add the user to the team
    await prisma.teamsOnUsers.create({
      data: {
        userId: user.id,
        teamId: teamId,
        assignedBy: assignedBy.id,
        role: memberRole,
      },
    });

    // TODO: Send an invitation email here (use nodemailer, SendGrid, etc.)
    return { success: `User ${email} has been invited to the team.` };
  } catch (error) {
    console.error("Error inviting user:", error);
    return { error: "An error occurred while inviting the user." };
  }
};

/**
 * Check if a user is a leader of a team.
 * @param userId - ID of the user.
 * @param teamId - ID of the team.
 * @returns True if the user is a leader, false otherwise.
 */
export const isMemberLeader = async (userId: string, teamId: number) => {
  try {
    const member = await prisma.teamsOnUsers.findUnique({
      where: {
        userId_teamId: {
          userId: userId,
          teamId: teamId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!member || member.role !== "LEADER") {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking if user is a leader:", error);
    return false;
  }
};

/**
 * Fetches the team members associated with a given task.
 * Ensures that the task exists and belongs to a valid team before querying.
 * @param taskId - The ID of the task to retrieve team members for.
 * @returns List of team members or an empty array if no team is found.
 */
export const getTeamMembersByTaskId = cache(async (taskId: number) => {
  if (!taskId || isNaN(taskId)) {
    throw new Error("Invalid task ID");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { teamId: true },
  });

  if (!task || !task.teamId) {
    return []; // No team associated with the task
  }

  return await prisma.teamsOnUsers.findMany({
    where: { teamId: task.teamId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
});

/**
 * Get the teams of the current user.
 * @returns The teams of the user or an error message.
 */
export async function getUserTeams() {
  const user = await getSessionUser();

  if (!user?.id) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  try {
    const teams = await prisma.teamsOnUsers.findMany({
      where: { userId: user.id },
      include: { team: true },
    });
    return teams;
  } catch (error) {
    console.error("Error fetching user teams:", error);
    return {
      success: false,
      error: (error as any).message,
    };
  }
}

/**
 * Get the names of the teams the current user is a member of.
 * @returns The names of the teams.
 */
export async function getTeamsNames() {
  const user = await getSessionUser();

  if (!user?.id) {
    return [];
  }

  try {
    const teams = await prisma.team.findMany({
      where: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return teams;
  } catch (error) {
    console.error("Error fetching team names:", error);
    return [];
  }
}

/**
 * Delete a team.
 * @param teamId - ID of the team to delete.
 * @returns Success or error message.
 */
export async function deleteTeam(teamId: number) {
  const user = await getSessionUser();

  if (!user?.id) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  // Check if the user is the owner of the team
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    return {
      success: false,
      error: "Team not found",
    };
  }

  if (team.ownerId !== user.id) {
    return {
      success: false,
      error: "You are not authorized to delete this team",
    };
  }

  try {
    // Delete the team
    await prisma.team.delete({
      where: { id: teamId },
    });

    // Update the user's teams count
    await prisma.user.update({
      where: { id: user.id },
      data: { teamsCount: { decrement: 1 } },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting team:", error);
    return {
      success: false,
      error: "Failed to delete team",
    };
  }
}