"use client";

import { Team } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaUsers, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { getUserNameById } from "@/actions/user";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useSession } from "next-auth/react";

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "id",
    header: "Id",
    size: 400,
    cell: ({ row }) => <div className="truncate">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 400,
    cell: ({ row }) => <div className="truncate">{row.original.name}</div>,
  },
  {
    accessorKey: "owner",
    header: "Owner",
    size: 100,
    cell: ({ row }) => {
      const [ownerName, setOwnerName] = useState<string>("");

      useEffect(() => {
        const fetchOwnerName = async () => {
          const result = await getUserNameById(row.original.ownerId);
          const name = result?.name ?? "Unknown";
          setOwnerName(name);
        };

        fetchOwnerName();
      }, [row.original.ownerId]);

      return <div className="truncate">{ownerName}</div>;
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const { data: session } = useSession();

      const user = session?.user;

      return (
        <div className="flex space-x-2 w-full">
          <TooltipProvider>
            {row.original.ownerId === user?.id && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/teams/delete/${row.original.id}`}>
                    <Button variant="destructive" size="icon">
                      <MdDelete />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Delete Team</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/teams/${row.original.id}`}>
                  <Button variant="outline" size="icon">
                    <FaUsers />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Show Team</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    header: "Info",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <FaInfoCircle />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <p>
                Created At: {new Date(row.original.createdAt).toLocaleString()}
              </p>
              <p>
                Updated At: {new Date(row.original.updatedAt).toLocaleString()}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
