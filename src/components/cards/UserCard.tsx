"use client";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MemberRole } from "@prisma/client";

interface User {
  id: string;
  name: string;
  image?: string;
  email?: string;
  role?: string;
}

interface UserCardProps {
  user: User;
  teamRole: MemberRole;
}

export default function UserCard({ user, teamRole }: UserCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="w-40 h-28 flex items-center justify-center p-2 text-center cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex flex-col items-center space-y-2">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={user.image || "/placeholder-avatar.png"}
                alt={user.name}
              />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm truncate w-full">{user.name}</p>
          </CardContent>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="w-64 p-4 bg-white shadow-md rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={user.image || "/placeholder-avatar.png"}
              alt={user.name}
            />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="font-semibold text-lg text-center w-full">
            {user.name}
          </p>
          {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
          {teamRole && <p className="text-sm">{teamRole}</p>}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
