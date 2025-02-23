"use server";

import { prisma } from "@/lib/prisma";
import { getUserTeamRole } from "@/actions/user";
import { log } from "console";

export const getTeamData = async (teamId: number, userId: string) => {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    throw new Error("Team not found");
  }

  const userInTeam = await prisma.teamsOnUsers.findUnique({
    where: { userId_teamId: { userId, teamId } },
  });
  if (!userInTeam) {
    throw new Error("User not in team");
  }

  const members = await prisma.teamsOnUsers.findMany({
    where: { teamId: team.id },
    select: { user: true },
  });

  const membersWithRoles = await Promise.all(
    members.map(async (member) => {
      const role = await getUserTeamRole(member.user.id, team.id);
      return { ...member, role: role?.role || "VIEWER" };
    })
  );

  const tasks = await prisma.task.findMany({
    where: { teamId: team.id },
  });

  return { teamName: team.name, membersWithRoles, tasks };
};

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
