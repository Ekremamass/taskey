"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { auth } from "@/lib/auth";
import UserCard from "@/components/users/UserCard";
import { DataTable } from "@/components/ui/data-table";
import { taskColumns } from "./taskColumns";
import fetchTeamData from "./fetchTeamData";
import addMember from "./addMember";
import addTask from "./addTask";

export default function TeamPage() {
  const { id } = useParams();
  const [newMemberId, setNewMemberId] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "TODO", projectId: null, calendarId: null, published: false });
  const [membersWithRoles, setMembersWithRoles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await auth();
        const user = session?.user;
        if (!user?.id) {
          return;
        }
        const teamId = Number(id);

        const { teamName, membersWithRoles, tasks } = await fetchTeamData(teamId, user.id);
        setTeamName(teamName);
        setMembersWithRoles(membersWithRoles);
        setTasks(tasks);
      } catch (error) {
        console.error("Error loading team:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Team {teamName}</h1>
      <div className="mb-8">
        <h2>Members</h2>
        {membersWithRoles.length > 0 ? (
          membersWithRoles.map((member) => (
            <UserCard
              key={member.user.id}
              user={member.user}
              teamRole={member.role}
            />
          ))
        ) : (
          <div>No members</div>
        )}
        <div>
          <input
            type="text"
            value={newMemberId}
            onChange={(e) => setNewMemberId(e.target.value)}
            placeholder="New member ID"
          />
          <button onClick={() => addMember(newMemberId, Number(id))}>Add Member</button>
        </div>
      </div>
      <div>
        <h2>Tasks</h2>
        {tasks.length > 0 ? (
          <div className="container mx-auto py-10">
            <DataTable columns={taskColumns} data={tasks} />
          </div>
        ) : (
          <div>No tasks</div>
        )}
        <div>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title"
          />
          <input
            type="text"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Task description"
          /> 
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
          <input
            type="number"
            value={newTask.projectId || ""}
            onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value ? Number(e.target.value) : null })}
            placeholder="Project ID"
          />
          <input
            type="number"
            value={newTask.calendarId || ""}
            onChange={(e) => setNewTask({ ...newTask, calendarId: e.target.value ? Number(e.target.value) : null })}
            placeholder="Calendar ID"
          />
          <label>
            <input
              type="checkbox"
              checked={newTask.published}
              onChange={(e) => setNewTask({ ...newTask, published: e.target.checked })}
            />
            Published
          </label>
          <button onClick={() => addTask(newTask, Number(id))}>Add Task</button>
        </div>
      </div>
    </main>
  );
}