"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export function ExportAllEventsButton() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/events/export-all");
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error?.message || "Failed to fetch event data.");
        return;
      }

      const events = data.data.events;
      if (!events || events.length === 0) {
        toast.error("No events found to export.");
        return;
      }

      const exportData: any[] = [];

      events.forEach((event: any) => {
        if (event.type === "SOLO") {
          // Only include registrations where the user has a VERIFIED order for this event
          event.registrations.forEach((reg: any) => {
            const u = reg.user;
            const hasApprovedPayment = u.orders?.some((o: any) =>
              o.orderItems.some((oi: any) => oi.eventId === event.id)
            );

            if (!hasApprovedPayment) return; // Skip non-approved

            exportData.push({
              "Event Name": event.name,
              "Category": event.category,
              "Type": "Solo",
              "Team Name": "—",
              "Role": "Solo",
              "Participant Name": u.name,
              "Email": u.email,
              "Phone": u.phone,
              "College": u.collegeName,
              "USN": u.usn || "—",
              "Aadhar Number": u.aadharNumber || "—",
            });
          });
        } else {
          // TEAM — only include teams with a VERIFIED order
          event.teams.forEach((team: any) => {
            const hasApprovedPayment = team.OrderItem?.some(
              (oi: any) => oi.order.status === "VERIFIED"
            );

            if (!hasApprovedPayment) return; // Skip non-approved

            team.members.forEach((member: any) => {
              const u = member.user;
              exportData.push({
                "Event Name": event.name,
                "Category": event.category,
                "Type": "Team",
                "Team Name": team.name,
                "Role": member.role === "LEADER" ? "Leader" : "Member",
                "Participant Name": u.name,
                "Email": u.email,
                "Phone": u.phone,
                "College": u.collegeName,
                "USN": u.usn || "—",
                "Aadhar Number": u.aadharNumber || "—",
              });
            });
          });
        }
      });

      if (exportData.length === 0) {
        toast.info("No approved registrations found.");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Approved Registrations");
      XLSX.writeFile(wb, "Approved_Event_Registrations.xlsx");
      toast.success("Export successful.");
    } catch (error) {
      console.error(error);
      toast.error("Export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={exporting}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold gap-2"
    >
      <Download className="h-4 w-4" />
      {exporting ? "Exporting..." : "Download Approved Registrations"}
    </Button>
  );
}
