"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type OrderItem = {
  id: string;
  event: { id: string; name: string; type: "SOLO" | "TEAM"; category: string };
  Team?: { id: string; name: string } | null;
};

type Order = {
  id: string;
  status: "PAYMENT_SUBMITTED" | "VERIFIED" | "REJECTED";
  totalAmount: number | string;
  upiTransactionId: string | null;
  paymentScreenshotUrl: string | null;
  paymentSubmittedAt: string | null;
  verifiedAt: string | null;
  REJECTED_REASON: string | null;
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
  data?: { orders: Order[]; total: number };
  error?: { message?: string };
};

type Tab = "PAYMENT_SUBMITTED" | "VERIFIED" | "REJECTED";

const TAB_LABELS: Record<Tab, string> = {
  PAYMENT_SUBMITTED: "Pending",
  VERIFIED: "Approved",
  REJECTED: "Rejected",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("PAYMENT_SUBMITTED");
  const [ordersByTab, setOrdersByTab] = useState<Record<Tab, Order[]>>({
    PAYMENT_SUBMITTED: [],
    VERIFIED: [],
    REJECTED: [],
  });
  const [loadedTabs, setLoadedTabs] = useState<Set<Tab>>(new Set());
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  // Modals state
  const [approveModalOpen, setApproveModalOpen] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState<string | null>(null);
  const [rejectReasonSelection, setRejectReasonSelection] = useState<string>("");
  const [rejectReasonOther, setRejectReasonOther] = useState<string>("");

  const REJECTION_OPTIONS = [
    "Invalid or Fake UPI Transaction ID",
    "Incorrect payment amount",
    "Screenshot unclear or does not match",
    "Payment not received in account",
    "Other"
  ];

  const loadTab = async (tab: Tab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?status=${tab}&limit=100`);
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

      setOrdersByTab((prev) => ({ ...prev, [tab]: data.data?.orders ?? [] }));
      setLoadedTabs((prev) => new Set(prev).add(tab));
    } catch (error) {
      console.error(error);
      toast.error("Unable to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTab(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleRefresh = () => loadTab(activeTab);

  const confirmApprove = async () => {
    if (!approveModalOpen) return;
    const orderId = approveModalOpen;
    setApproveModalOpen(null);
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
      setOrdersByTab((prev) => ({
        ...prev,
        PAYMENT_SUBMITTED: prev.PAYMENT_SUBMITTED.filter(
          (o) => o.id !== orderId,
        ),
      }));
      // Invalidate approved tab so it reloads fresh next time
      setLoadedTabs((prev) => {
        const s = new Set(prev);
        s.delete("VERIFIED");
        return s;
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to approve payment.");
    } finally {
      setProcessing(null);
    }
  };

  const confirmReject = async () => {
    if (!rejectModalOpen) return;
    const orderId = rejectModalOpen;
    
    let finalReason = rejectReasonSelection;
    if (finalReason === "Other") {
      finalReason = rejectReasonOther;
    }
    
    if (!finalReason.trim()) {
      toast.error("Rejection reason cannot be empty.");
      return;
    }

    setRejectModalOpen(null);
    setRejectReasonSelection("");
    setRejectReasonOther("");
    setProcessing(orderId);

    try {
      const res = await fetch(`/api/admin/payments/${orderId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ REJECTED_REASON: finalReason.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error?.message || "Failed to reject payment.");
        return;
      }

      toast.success("Payment rejected.");
      setOrdersByTab((prev) => ({
        ...prev,
        PAYMENT_SUBMITTED: prev.PAYMENT_SUBMITTED.filter(
          (o) => o.id !== orderId,
        ),
      }));
      // Invalidate rejected tab so it reloads fresh next time
      setLoadedTabs((prev) => {
        const s = new Set(prev);
        s.delete("REJECTED");
        return s;
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to reject payment.");
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveClick = (orderId: string) => {
    setApproveModalOpen(orderId);
  };

  const handleRejectClick = (orderId: string) => {
    setRejectReasonSelection("");
    setRejectReasonOther("");
    setRejectModalOpen(orderId);
  };

  const orders = ordersByTab[activeTab];

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
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gat-steel">
              Admin
            </p>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-gat-midnight">
              Payment Dashboard
            </h1>
            <p className="text-sm text-gat-steel mt-1">
              Review pending payments and track approved / rejected orders.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="shrink-0"
          >
            {loading ? "Loading…" : "Refresh"}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gat-blue/10 shadow-sm p-1 w-fit">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? tab === "PAYMENT_SUBMITTED"
                    ? "bg-amber-500 text-white shadow"
                    : tab === "VERIFIED"
                      ? "bg-green-600 text-white shadow"
                      : "bg-red-600 text-white shadow"
                  : "text-gat-steel hover:text-gat-midnight"
              }`}
            >
              {TAB_LABELS[tab]}
              {loadedTabs.has(tab) && (
                <span className="ml-2 text-xs opacity-80">
                  ({ordersByTab[tab].length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-xl bg-white p-8 border border-gat-blue/10 shadow-sm text-gat-steel">
            Loading payments…
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl bg-white p-12 border border-gat-blue/10 shadow-sm text-center">
            <p className="text-2xl mb-2">
              {activeTab === "PAYMENT_SUBMITTED"
                ? "✅"
                : activeTab === "VERIFIED"
                  ? "📋"
                  : "📋"}
            </p>
            <p className="font-heading font-bold text-gat-midnight">
              {activeTab === "PAYMENT_SUBMITTED"
                ? "All caught up!"
                : activeTab === "VERIFIED"
                  ? "No approved payments yet."
                  : "No rejected payments."}
            </p>
            <p className="text-sm text-gat-steel mt-1">
              {activeTab === "PAYMENT_SUBMITTED"
                ? "No pending payments to review."
                : "Records will appear here once processed."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-gat-blue/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gat-midnight text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                      Participant
                    </th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                      Event(s)
                    </th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                      UPI Transaction ID
                    </th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                      Screenshot
                    </th>
                    {activeTab === "PAYMENT_SUBMITTED" && (
                      <th className="text-center px-4 py-3 font-semibold whitespace-nowrap">
                        Actions
                      </th>
                    )}
                    {activeTab === "VERIFIED" && (
                      <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                        Approved At
                      </th>
                    )}
                    {activeTab === "REJECTED" && (
                      <>
                        <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                          Rejected At
                        </th>
                        <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                          Reason
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gat-blue/10">
                  {orders.map((order) => {
                    const isProcessing = processing === order.id;
                    const eventNames = order.orderItems
                      .map(
                        (item) =>
                          `${item.event.name}${item.Team ? ` (Team: ${item.Team.name})` : ""}`,
                      )
                      .join(", ");

                    return (
                      <tr
                        key={order.id}
                        className={`bg-white hover:bg-gat-blue/5 transition-colors align-top ${
                          activeTab === "VERIFIED"
                            ? "border-l-4 border-green-500"
                            : activeTab === "REJECTED"
                              ? "border-l-4 border-red-400"
                              : ""
                        }`}
                      >
                        {/* Participant */}
                        <td className="px-4 py-3">
                          <p className="font-medium text-gat-midnight">
                            {order.user.name}
                          </p>
                          <p className="text-xs text-gat-steel">
                            {order.user.email}
                          </p>
                          <p className="text-xs text-gat-steel">
                            {order.user.collegeName}
                          </p>
                        </td>

                        {/* Events */}
                        <td className="px-4 py-3 max-w-[200px]">
                          <p className="text-xs text-gat-midnight leading-relaxed">
                            {eventNames}
                          </p>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-gat-dark-gold">
                          ₹{Number(order.totalAmount).toFixed(2)}
                        </td>

                        {/* UPI Txn ID */}
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
                              className="inline-flex items-center gap-1 text-gat-blue underline text-xs hover:text-gat-midnight font-semibold"
                            >
                              View Photo ↗
                            </a>
                          ) : (
                            <span className="text-gat-steel italic text-xs">
                              Not uploaded
                            </span>
                          )}
                        </td>

                        {/* Pending: Actions */}
                        {activeTab === "PAYMENT_SUBMITTED" && (
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                disabled={isProcessing}
                                onClick={() => handleApproveClick(order.id)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-4 font-semibold"
                              >
                                {isProcessing ? "…" : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isProcessing}
                                onClick={() => handleRejectClick(order.id)}
                                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 text-xs h-8 px-4 font-semibold"
                              >
                                {isProcessing ? "…" : "Reject"}
                              </Button>
                            </div>
                          </td>
                        )}

                        {/* Approved: timestamp */}
                        {activeTab === "VERIFIED" && (
                          <td className="px-4 py-3 text-xs text-green-700 font-semibold whitespace-nowrap">
                            {formatDate(order.verifiedAt)}
                          </td>
                        )}

                        {/* Rejected: timestamp + reason */}
                        {activeTab === "REJECTED" && (
                          <>
                            <td className="px-4 py-3 text-xs text-red-600 font-semibold whitespace-nowrap">
                              {formatDate(order.verifiedAt)}
                            </td>
                            <td className="px-4 py-3 text-xs text-gat-midnight max-w-[180px]">
                              {order.REJECTED_REASON ?? (
                                <span className="text-gat-steel italic">—</span>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-white border-t border-gat-blue/10 px-4 py-3 text-xs text-gat-steel">
              {orders.length} {TAB_LABELS[activeTab].toLowerCase()} payment
              {orders.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gat-midnight mb-2">Confirm Approval</h2>
            <p className="text-sm text-gat-steel mb-6">
              Are you sure you want to approve this payment? This will create registrations for the selected event(s) and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setApproveModalOpen(null)}
                className="font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApprove}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Confirm Approve
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-red-600 mb-2">Reject Payment</h2>
            <p className="text-sm text-gat-steel mb-4">
              Please select or enter a reason for rejecting this payment.
            </p>
            
            <div className="mb-4 space-y-2">
              <label className="text-sm font-semibold text-gat-midnight">Select Reason <span className="text-red-500">*</span></label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={rejectReasonSelection}
                onChange={(e) => setRejectReasonSelection(e.target.value)}
              >
                <option value="" disabled>Select a reason...</option>
                {REJECTION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {rejectReasonSelection === "Other" && (
              <div className="mb-6 space-y-2">
                <label className="text-sm font-semibold text-gat-midnight">Specify Reason <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter rejection reason..."
                  value={rejectReasonOther}
                  onChange={(e) => setRejectReasonOther(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectModalOpen(null);
                  setRejectReasonSelection("");
                  setRejectReasonOther("");
                }}
                className="font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReject}
                disabled={!rejectReasonSelection || (rejectReasonSelection === "Other" && !rejectReasonOther.trim())}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
