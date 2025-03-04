"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { createTeam } from "@/actions/team";

const TeamCreateForm: React.FC = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleCreateTeam = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("name", name);

    const result = await createTeam(formData);

    if (!result.success) {
      setErrors(result.errors || {});
      toast.error(result.errors?.general?.[0] || "Failed to create team");
    } else {
      toast.success("Team created successfully");
      setName(""); // Clear input after success
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Create a New Team</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
            )}
          </div>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamCreateForm;
