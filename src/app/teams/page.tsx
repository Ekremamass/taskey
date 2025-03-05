import TaskCard from "@/app/tasks/TaskCard";
import ToggleButton from "@/components/ui/ToggleButton";
import { DataTable } from "../../components/ui/data-table";
import { getUserTeams } from "@/actions/team";

export default async function TeamsPage() {
  try {
    const teams = await getUserTeams();

    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">Teams</h1>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={teams} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching teams:", error);
    return <div>Failed to load teams</div>;
  }
}
