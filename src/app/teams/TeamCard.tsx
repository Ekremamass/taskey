import { prisma } from "@/lib/prisma";
import { Team } from "@prisma/client";
import React from "react";

type TeamCardProps = {
  team: Team;
};

const TeamCard: React.FC<TeamCardProps> = async ({ team }) => {
  <div></div>;
};

export default TeamCard;
