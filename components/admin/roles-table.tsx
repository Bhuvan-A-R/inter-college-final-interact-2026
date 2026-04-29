"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export type RoleUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function RolesTable({ initialUsers }: { initialUsers: RoleUser[] }) {
  const [users, setUsers] = useState<RoleUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const ROLES = [
    "PARTICIPANT",
    "SUPER_ADMIN",
    "REG_ADMIN",
    "TECH_ADMIN",
    "SPORTS_ADMIN",
    "CULTURALS_ADMIN",
  ];

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/roles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to update role");
        return;
      }
      
      toast.success("Role updated successfully!");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the role");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gat-blue/10 overflow-hidden">
      <div className="p-4 border-b border-gat-blue/10 bg-gray-50">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md bg-white"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gat-midnight text-white">
            <tr>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Name</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Email</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gat-blue/10">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <select
                        value={user.role}
                        disabled={updatingId === user.id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="flex h-10 w-full md:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                      {updatingId === user.id && (
                        <span className="text-xs font-semibold text-primary animate-pulse">
                          Saving...
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
