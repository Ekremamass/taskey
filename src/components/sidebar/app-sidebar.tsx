"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  List,
  CheckSquare,
  Calendar,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Updated data for the tasks app
const data = {
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/john_doe.jpg",
  },
  teams: [
    {
      name: "Development Team",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Marketing Team",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Support Team",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [],
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: List,
      items: [
        {
          title: "My Tasks",
          url: "/tasks/my-tasks",
        },
        {
          title: "Assigned Tasks",
          url: "/tasks/assigned-tasks",
        },
        {
          title: "Completed Tasks",
          url: "/tasks/completed-tasks",
        },
      ],
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Frame,
      items: [
        {
          title: "Active Projects",
          url: "/projects/active",
        },
        {
          title: "Archived Projects",
          url: "/projects/archived",
        },
      ],
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      items: [],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Website Redesign",
      url: "/projects/website-redesign",
      icon: Frame,
    },
    {
      name: "Marketing Campaign",
      url: "/projects/marketing-campaign",
      icon: PieChart,
    },
    {
      name: "Customer Support",
      url: "/projects/customer-support",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="" collapsible="icon" {...props}>
      <SidebarHeader className="bg-muted/50">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-muted/100">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="bg-muted/50">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
