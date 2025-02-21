import { getProjects, getTasks, getTeams } from "@/lib/data";
import Link from "next/link";
import { auth } from "@/auth";
import { Project, Task, Team } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";

const HomePage = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  const tasks = await getTasks(session.user.id);
  const projects = await getProjects(session.user.id);
  const teams = await getTeams(session.user.id);
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">My Tasks</h2>
        <Link
          href="/tasks/create"
          className={buttonVariants({ variant: "outline" })}
        >
          Create Task
        </Link>
        <ul>
          {tasks.map((task: Task) => (
            <li key={task.id} className="mb-2">
              <Link href={`/tasks/${task.id}`}>{task.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">My Projects</h2>
        <Link
          href="/projects/create"
          className={buttonVariants({ variant: "outline" })}
        >
          Create Project
        </Link>
        <ul>
          {projects.map((project: Project) => (
            <li key={project.id} className="mb-2">
              <Link href={`/projects/${project.id}`}>{project.name}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">My Teams</h2>
        <Link
          href="/teams/create"
          className={buttonVariants({ variant: "outline" })}
        >
          Create Team
        </Link>
        <ul>
          {teams.map((team: Team) => (
            <li key={team.id} className="mb-2">
              <Link href={`/teams/${team.id}`}>{team.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
