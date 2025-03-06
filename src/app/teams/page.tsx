import { DataTable } from "../../components/ui/data-table";
import { getUserTeams } from "@/actions/team";
import { columns } from "@/components/columns/teamColumns";

export default async function TeamsPage() {
  try {
    const teamsData = await getUserTeams();

    if (!Array.isArray(teamsData) || teamsData.length === 0) {
      return <div>Failed to load teams</div>;
    }

    // Transform the teams data to match the expected structure
    const teams = teamsData.map((teamData: any) => ({
      name: teamData.team.name,
      id: teamData.team.id,
      createdAt: teamData.team.createdAt,
      updatedAt: teamData.team.updatedAt,
      ownerId: teamData.team.ownerId,
    }));

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
