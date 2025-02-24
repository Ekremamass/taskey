"use server";

import { prisma } from "@/lib/prisma";
import { getUserTeamRole } from "@/actions/user";
import { log } from "console";

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
 * @param assignedBy - ID of the user sending the invite.
 * @param role - Role in the team (default: CONTRIBUTOR).
 * @returns Invitation result or error message.
 */
export const inviteMember = async (
  email: string,
  teamId: number,
  assignedBy: string,
  role: "LEADER" | "CONTRIBUTOR" | "VIEWER" = "CONTRIBUTOR"
) => {
  try {
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

    log("user.id: " + user.id);
    log("teamId: " + teamId);
    log("assignedBy: " + assignedBy);
    log("role: " + role);

    // Add the user to the team
    await prisma.teamsOnUsers.create({
      data: {
        userId: user.id,
        teamId: teamId,
        assignedBy: assignedBy,
        role: role,
      },
    });

    // TODO: Send an invitation email here (use nodemailer, SendGrid, etc.)

    return { success: `User ${email} has been invited to the team.` };
  } catch (error) {
    console.error("Error inviting user:", error);
    return { error: "An error occurred while inviting the user." };
  }
};
