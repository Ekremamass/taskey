"use client";

import { useState, useEffect } from "react";
import { getAllUsers, updateUserRole } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

type User = {
  id: string;
  name?: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        toast.error("Failed to fetch users.");
      }
    }
    fetchUsers();
  }, []);

  async function handleRoleChange(userId: string, newRole: string) {
    if (loading) return; // Prevent multiple updates

    setLoading(true);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update role.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">User Management</h1>
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No users found.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
            >
              <span className="font-medium">{user.name || "No Name"}</span>
              <Select
                defaultValue={user.role}
                onValueChange={(value) => handleRoleChange(user.id, value)}
                disabled={loading}
              >
                <SelectTrigger className="w-[150px]" disabled={loading}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="w-[150px]">
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
