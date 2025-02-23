import { prisma } from "@/lib/prisma";
import { getUserTeamRole } from "@/actions/user";

const fetchTeamData = async (teamId: number, userId: string) => {
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

export default fetchTeamData;