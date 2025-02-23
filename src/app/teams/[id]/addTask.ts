import { prisma } from "@/lib/prisma";

const addTask = async (task: { title: string; description: string }, teamId: number) => {
  await prisma.task.create({
    data: {
      title: task.title,
      teamId,
      userId: "system", // Assuming userId is required
    },
  });
  // Refresh the page or update state to reflect changes
};

export default addTask;