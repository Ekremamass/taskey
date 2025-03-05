"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import TeamCreateForm from "../forms/TeamCreateForm";
import { Modal } from "@/components/ui/modal";
import { getTeamsNames } from "@/actions/team";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const [teams, setTeams] = React.useState<{ name: string; id: number }[]>([]);
  const [activeTeam, setActiveTeam] = React.useState<{
    name: string;
    id: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchTeams() {
      const teams = await getTeamsNames();
      setTeams(teams);
      setActiveTeam(teams[0]);
    }

    fetchTeams();
  }, []);

  const handleAddTeamClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const getTeamIcon = (teamName: string) => {
    // Generate an icon based on the team name
    const initials = teamName
      .split(" ")
      .map((word: string) => word[0])
      .join("");
    return (
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        {initials}
      </div>
    );
  };

  if (!activeTeam) {
    return null;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {getTeamIcon(activeTeam.name)}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Teams
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  {getTeamIcon(team.name)}
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={handleAddTeamClick}
              >
                <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add team
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Create a New Team</h2>
          <TeamCreateForm />
        </div>
      </Modal>
    </>
  );
}
