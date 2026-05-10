"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Calendar, Clock, MapPin, Filter, ArrowLeft, Download } from "lucide-react";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users?limit=1000");
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to load users.");
        return;
      }
      setUsers(data.data?.users ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const exportToExcel = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments/export?type=all");
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to fetch export data.");
        return;
      }
      
      const fullUsers = data.data?.users ?? [];
      if (fullUsers.length === 0) {
        toast.error("No data to export.");
        return;
      }

      const exportData = fullUsers.map((user: any) => {
        const row: any = {
          ID: user.id,
          Name: user.name,
          Email: user.email,
          Phone: user.phone,
          College: user.collegeName,
          "Aadhaar Number": user.aadharNumber || "—",
          "Photo URL": user.photoUrl || "—",
          "College ID Number": user.collegeIdNumber || "—",
          Role: user.role,
          "Email Verified": user.emailVerified ? "Yes" : "No",
          "Joined At": new Date(user.createdAt).toLocaleString("en-IN"),
        };

        let eventCount = 0;

        user.cartItems?.forEach((item: any) => {
          eventCount++;
          const teamInfo = item.team ? ` (Team: ${item.team.name})` : "";
          const typeInfo = item.event?.type === "TEAM" ? " [Team]" : " [Solo]";
          row[`Event ${eventCount}`] = `${item.event?.name}${typeInfo}${teamInfo}`;
          row[`Status ${eventCount}`] = "In Cart";
        });

        user.orders?.forEach((order: any) => {
          order.orderItems?.forEach((item: any) => {
            eventCount++;
            let status = "Unknown";
            if (order.status === "PENDING_PAYMENT") status = "Order Created";
            else if (order.status === "PAYMENT_SUBMITTED") status = "Payment Submitted";
            else if (order.status === "VERIFIED") status = "Payment Approved";
            else if (order.status === "REJECTED") status = "Rejected";

            const teamInfo = item.Team ? ` (Team: ${item.Team.name})` : "";
            const typeInfo = item.event?.type === "TEAM" ? " [Team]" : " [Solo]";
            row[`Event ${eventCount}`] = `${item.event?.name}${typeInfo}${teamInfo}`;
            row[`Status ${eventCount}`] = status;
          });
        });

        return row;
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");
      XLSX.writeFile(wb, "full_users_data.xlsx");
      toast.success("Excel file downloaded.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to export data.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";

  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push("/admin")}
              className="mb-2 -ml-2 text-gat-steel hover:text-gat-midnight"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-gat-midnight">
              All Users Data
            </h1>
            <p className="text-sm text-gat-steel mt-1">
              View all registered students and their details.
            </p>
          </div>
          <Button
            onClick={exportToExcel}
            disabled={loading || users.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            <Download className="w-4 h-4 mr-2" /> Download Excel
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-xl bg-white p-8 border border-gat-blue/10 shadow-sm text-gat-steel">
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl bg-white p-12 border border-gat-blue/10 shadow-sm text-center">
            <p className="text-2xl mb-2">👥</p>
            <p className="font-heading font-bold text-gat-midnight">No users found.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-gat-blue/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gat-midnight text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Name</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Email</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Phone</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">College</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Registrations</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Orders</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gat-blue/10">
                  {users.map((user) => (
                    <tr key={user.id} className="bg-white hover:bg-gat-blue/5 transition-colors align-top">
                      <td className="px-4 py-3 font-medium text-gat-midnight">{user.name}</td>
                      <td className="px-4 py-3 text-xs text-gat-steel">{user.email}</td>
                      <td className="px-4 py-3 text-xs text-gat-steel font-mono">{user.phone}</td>
                      <td className="px-4 py-3 text-xs text-gat-steel">{user.collegeName}</td>
                      <td className="px-4 py-3 text-xs text-gat-steel">{user._count?.registrations ?? 0}</td>
                      <td className="px-4 py-3 text-xs text-gat-steel">{user._count?.orders ?? 0}</td>
                      <td className="px-4 py-3 text-xs text-gat-steel">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white border-t border-gat-blue/10 px-4 py-3 text-xs text-gat-steel">
              Total {users.length} user{users.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
