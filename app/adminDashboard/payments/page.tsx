"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from "xlsx";

type OrderItem = {
  id: string;
  event: { id: string; name: string; type: "SOLO" | "TEAM"; category: string };
  Team?: { id: string; name: string } | null;
};

type PendingOrder = {
  id: string;
  totalAmount: number | string;
  upiTransactionId: string | null;
  paymentScreenshotUrl: string | null;
  paymentSubmittedAt: string | null;
  status: "PAYMENT_SUBMITTED" | "VERIFIED" | "REJECTED";
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    collegeName: string;
  };
  orderItems: OrderItem[];
};

type PaymentsResponse = {
  success: boolean;
  data?: { 
    orders: PendingOrder[]; 
    total: number;
    counts?: { pending: number; approved: number; rejected: number };
  };
  error?: { message?: string };
};

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"PAYMENT_SUBMITTED" | "VERIFIED" | "REJECTED">("PAYMENT_SUBMITTED");
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadOrders = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?status=${status}`);
      const data: PaymentsResponse = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          toast.error("Access denied.");
          router.push("/auth/signin");
          return;
        }
        toast.error(data.error?.message || "Failed to load payments.");
        return;
      }

      setOrders(data.data?.orders ?? []);
      if (data.data?.counts) {
        setCounts(data.data.counts);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleApprove = async (orderId: string) => {
    setProcessing(orderId);
    try {
      const res = await fetch(`/api/admin/payments/${orderId}/verify`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error?.message || "Failed to verify payment.");
        return;
      }

      toast.success("Payment approved and registrations created.");
      loadOrders(activeTab); // Reload to update counts and list
    } catch (error) {
      console.error(error);
      toast.error("Unable to approve payment.");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = window.prompt("Enter rejection reason (required):");

    if (reason === null) return; // user cancelled
    if (!reason.trim()) {
      toast.error("Rejection reason cannot be empty.");
      return;
    }

    setProcessing(orderId);
    try {
      const res = await fetch(`/api/admin/payments/${orderId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ REJECTED_REASON: reason.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error?.message || "Failed to reject payment.");
        return;
      }

      toast.success("Payment rejected.");
      loadOrders(activeTab); // Reload to update counts and list
    } catch (error) {
      console.error(error);
      toast.error("Unable to reject payment.");
    } finally {
      setProcessing(null);
    }
  };

  const handleExportTab = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/admin/payments/export?status=${activeTab}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error("Failed to fetch export data.");
        return;
      }

      const exportOrders = data.data.orders;
      const wsData = exportOrders.map((o: any) => ({
        "Order ID": o.id,
        "User Name": o.user.name,
        "Email": o.user.email,
        "Phone": o.user.phone,
        "College": o.user.collegeName,
        "Amount": o.totalAmount,
        "Status": o.status,
        "Events": o.orderItems.map((i: any) => `${i.event.name}${i.Team ? ` (${i.Team.name})` : ''}`).join(", "),
        "UPI Txn ID": o.upiTransactionId || "N/A",
        "Submitted At": o.paymentSubmittedAt ? new Date(o.paymentSubmittedAt).toLocaleString() : "N/A",
        "Rejection Reason": o.REJECTED_REASON || "N/A"
      }));

      const ws = XLSX.utils.json_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, activeTab);
      XLSX.writeFile(wb, `GAT_Interact_Orders_${activeTab}.xlsx`);
      toast.success("Export successful.");
    } catch (error) {
      console.error(error);
      toast.error("Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/payments/export?type=all");
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error("Failed to fetch full export data.");
        return;
      }

      const users = data.data.users;
      
      const ordersData: any[] = [];
      const noPaymentsData: any[] = [];

      users.forEach((u: any) => {
        const userInfo = {
          "User ID": u.id,
          "Name": u.name,
          "Email": u.email,
          "Phone": u.phone,
          "College": u.collegeName,
        };

        if (u.orders && u.orders.length > 0) {
          u.orders.forEach((o: any) => {
            ordersData.push({
              ...userInfo,
              "Order ID": o.id,
              "Amount": o.totalAmount,
              "Status": o.status,
              "Events": o.orderItems.map((i: any) => `${i.event.name}${i.Team ? ` (${i.Team.name})` : ''}`).join(", "),
            });
          });
        } 
        
        if (u.cartItems && u.cartItems.length > 0) {
          // If they have items in cart, put them in the "No Payments / Cart" sheet
          u.cartItems.forEach((c: any) => {
            noPaymentsData.push({
              ...userInfo,
              "Cart Item ID": c.id,
              "Event": `${c.event.name}${c.team ? ` (${c.team.name})` : ''}`
            });
          });
        }

        if ((!u.orders || u.orders.length === 0) && (!u.cartItems || u.cartItems.length === 0)) {
          // No orders, no cart, just registered
          noPaymentsData.push({
            ...userInfo,
            "Cart Item ID": "N/A",
            "Event": "No Events Selected"
          });
        }
      });

      const wb = XLSX.utils.book_new();
      
      if (ordersData.length > 0) {
        const wsOrders = XLSX.utils.json_to_sheet(ordersData);
        XLSX.utils.book_append_sheet(wb, wsOrders, "Orders");
      }
      
      if (noPaymentsData.length > 0) {
        const wsNoPayments = XLSX.utils.json_to_sheet(noPaymentsData);
        XLSX.utils.book_append_sheet(wb, wsNoPayments, "No Payments (Cart)");
      }

      XLSX.writeFile(wb, "GAT_Interact_Full_Users_Export.xlsx");
      toast.success("Full export successful.");
    } catch (error) {
      console.error(error);
      toast.error("Full export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gat-steel">
              Admin
            </p>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-gat-midnight">
              Payments Dashboard
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => loadOrders(activeTab)} disabled={loading || exporting}>
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportTab} disabled={loading || exporting}>
              Download {activeTab.replace('_', ' ')}
            </Button>
            <Button variant="default" onClick={handleExportAll} disabled={loading || exporting}>
              Download Full Details
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gat-blue/10 pb-2 overflow-x-auto">
          <Button 
            variant={activeTab === "PAYMENT_SUBMITTED" ? "default" : "outline"}
            onClick={() => setActiveTab("PAYMENT_SUBMITTED")}
            className="rounded-full"
          >
            Pending ({counts.pending})
          </Button>
          <Button 
            variant={activeTab === "VERIFIED" ? "default" : "outline"}
            onClick={() => setActiveTab("VERIFIED")}
            className="rounded-full"
          >
            Approved ({counts.approved})
          </Button>
          <Button 
            variant={activeTab === "REJECTED" ? "default" : "outline"}
            onClick={() => setActiveTab("REJECTED")}
            className="rounded-full"
          >
            Rejected ({counts.rejected})
          </Button>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-6 border border-gat-blue/10 shadow-sm">
            Loading payments...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl bg-white p-10 border border-gat-blue/10 shadow-sm text-center">
            <p className="text-gat-steel">
              No orders found for this status.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-gat-blue/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gat-midnight text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">User</th>
                    <th className="text-left px-4 py-3 font-semibold">
                      College
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Events
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      UPI Txn ID
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Screenshot
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Submitted
                    </th>
                    {activeTab === "PAYMENT_SUBMITTED" && (
                      <th className="text-center px-4 py-3 font-semibold">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gat-blue/10">
                  {orders.map((order) => {
                    const isProcessing = processing === order.id;
                    const eventNames = order.orderItems
                      .map(
                        (item) =>
                          `${item.event.name}${item.Team ? ` (${item.Team.name})` : ""}`,
                      )
                      .join(", ");

                    return (
                      <tr
                        key={order.id}
                        className="bg-white hover:bg-gat-blue/5 transition-colors"
                      >
                        {/* User */}
                        <td className="px-4 py-3">
                          <p className="font-medium text-gat-midnight">
                            {order.user.name}
                          </p>
                          <p className="text-xs text-gat-steel">
                            {order.user.email}
                          </p>
                          <p className="text-xs text-gat-steel">
                            {order.user.phone}
                          </p>
                        </td>

                        {/* College */}
                        <td className="px-4 py-3 text-gat-steel max-w-[160px]">
                          <p className="truncate">{order.user.collegeName}</p>
                        </td>

                        {/* Events */}
                        <td className="px-4 py-3 text-gat-midnight max-w-[220px]">
                          <p className="text-xs leading-relaxed">
                            {eventNames}
                          </p>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 font-mono font-bold text-gat-dark-gold whitespace-nowrap">
                          ₹{Number(order.totalAmount).toFixed(2)}
                        </td>

                        {/* UPI ID */}
                        <td className="px-4 py-3 font-mono text-xs text-gat-midnight">
                          {order.upiTransactionId ?? (
                            <span className="text-gat-steel italic">—</span>
                          )}
                        </td>

                        {/* Screenshot */}
                        <td className="px-4 py-3">
                          {order.paymentScreenshotUrl ? (
                            <a
                              href={order.paymentScreenshotUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gat-blue underline text-xs hover:text-gat-midnight"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-gat-steel italic text-xs">
                              None
                            </span>
                          )}
                        </td>

                        {/* Submitted At */}
                        <td className="px-4 py-3 text-xs text-gat-steel whitespace-nowrap">
                          {order.paymentSubmittedAt
                            ? new Date(order.paymentSubmittedAt).toLocaleString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "—"}
                        </td>

                        {/* Actions */}
                        {activeTab === "PAYMENT_SUBMITTED" && (
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                disabled={isProcessing}
                                onClick={() => handleApprove(order.id)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-3"
                              >
                                {isProcessing ? "…" : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isProcessing}
                                onClick={() => handleReject(order.id)}
                                className="text-red-600 border-red-300 hover:bg-red-50 text-xs h-8 px-3"
                              >
                                {isProcessing ? "…" : "Reject"}
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-white border-t border-gat-blue/10 px-4 py-3 text-xs text-gat-steel">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
