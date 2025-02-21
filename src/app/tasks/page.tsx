import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Task } from "@prisma/client";
import TaskCard from "@/app/tasks/TaskCard";
import ToggleButton from "@/components/ToggleButton";
import { redirect } from "next/navigation";
import { DataTable } from "../../components/ui/data-table";
import { columns } from "./columns";

export default async function Page({
  searchParams,
}: {
  searchParams: { viewMode?: string };
}) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      redirect("/login");
    }

    const tasks: Task[] = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
    });

    const getViewMode = await searchParams.viewMode;
    const viewMode = getViewMode === "list" ? "list" : "grid";

    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">Tasks</h1>
        <div className="mb-4">
          <ToggleButton viewMode={viewMode} />
        </div>
        {viewMode === "list" ? (
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={tasks} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return <div>Failed to load tasks</div>;
  }
}
