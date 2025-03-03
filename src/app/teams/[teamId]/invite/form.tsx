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
import { toast } from "sonner"; // Import toast notifications
import { z } from "zod";
import { inviteMember } from "@/actions/team";

type InviteMemberFormProps = {
  teamId: number;
  assignedBy: string;
};

// Zod schema for email validation
const emailSchema = z.string().email({ message: "Invalid email address" });

const InviteMemberForm: React.FC<InviteMemberFormProps> = ({
  teamId,
  assignedBy,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"LEADER" | "CONTRIBUTOR" | "VIEWER">(
    "CONTRIBUTOR"
  );
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    try {
      emailSchema.parse(email); // Validate email
      setLoading(true); // Set loading state

      const response = await inviteMember(email, teamId, role);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success);
        setEmail(""); // Clear input after success
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message); // Show validation error
      }
    } finally {
      setLoading(false); // Reset loading state
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
            disabled={loading} // Disable input when loading
          />
        </div>
        <div>
          <Label>Role</Label>
          <Select
            onValueChange={(value) =>
              setRole(value as "LEADER" | "CONTRIBUTOR" | "VIEWER")
            }
            defaultValue={role}
            disabled={loading} // Disable select when loading
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LEADER">Leader</SelectItem>
              <SelectItem value="CONTRIBUTOR">Contributor</SelectItem>
              <SelectItem value="VIEWER">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleInvite} disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Invite"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InviteMemberForm;
