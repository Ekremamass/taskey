"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { inviteMember } from "@/actions/team";

type InviteMemberFormProps = {
  teamId: number;
  assignedBy: string; // ID of the logged-in user
};

const InviteMemberForm: React.FC<InviteMemberFormProps> = ({
  teamId,
  assignedBy,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"LEADER" | "CONTRIBUTOR" | "VIEWER">(
    "CONTRIBUTOR"
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleInvite = async () => {
    if (!email) {
      setMessage("Please enter an email.");
      return;
    }

    const response = await inviteMember(email, teamId, assignedBy, role);

    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage(response.success ?? null);
      setEmail(""); // Clear input after success
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Invite a Member</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label>Role</Label>
          <Select
            onValueChange={(value) =>
              setRole(value as "LEADER" | "CONTRIBUTOR" | "VIEWER")
            }
            defaultValue={role}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LEADER">Leader</SelectItem>
              <SelectItem value="CONTRIBUTOR">Contributer</SelectItem>
              <SelectItem value="VIEWER">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {message && <p className="text-sm text-red-500">{message}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleInvite} className="w-full">
          Send Invite
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InviteMemberForm;
