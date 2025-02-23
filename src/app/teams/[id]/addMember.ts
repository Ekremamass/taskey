import { prisma } from "@/lib/prisma";

const addMember = async (userId: string, teamId: number) => {
  await prisma.teamsOnUsers.create({
    data: {
      userId,
      teamId,
      assignedBy: "system", // Assuming assignedBy is required
    },
  });
  // Refresh the page or update state to reflect changes
};

export default addMember;