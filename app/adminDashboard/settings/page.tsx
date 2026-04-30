"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarClock, LockOpen, Lock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Config = {
  isOpen: boolean;
  deadline: string | null;
};

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<Config>({ isOpen: true, deadline: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team-edit-config");
      const data = await res.json();
      if (data.success) {
        setConfig(data.data.config);
      }
    } catch {
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadConfig(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/team-edit-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: config.isOpen, deadline: config.deadline || null }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error?.message || "Failed to save."); return; }
      toast.success("Settings saved successfully.");
    } catch {
      toast.error("Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const deadlinePassed = config.deadline ? new Date() > new Date(config.deadline) : false;
  const effectivelyOpen = config.isOpen && !deadlinePassed;

  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/adminDashboard" className="inline-flex items-center gap-1.5 text-xs text-gat-steel hover:text-gat-blue">
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-heading font-black text-gat-midnight mt-3">Admin Settings</h1>
          <p className="text-sm text-gat-steel mt-1">Configure global settings for team management.</p>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white border border-gat-blue/10 shadow-sm p-8 text-center text-gat-steel text-sm">
            Loading settings...
          </div>
        ) : (
          <div className="rounded-xl bg-white border border-gat-blue/10 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <CalendarClock className="h-5 w-5 text-gat-blue" />
              <h2 className="text-lg font-heading font-bold text-gat-midnight">Team Member Editing Window</h2>
            </div>

            <p className="text-sm text-gat-steel mb-6">
              Control when participants can add or remove team members. You can set a hard deadline (in IST) 
              and/or manually toggle access on or off at any time.
            </p>

            {/* Status banner */}
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-6 text-sm font-semibold ${effectivelyOpen ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
              {effectivelyOpen
                ? <><CheckCircle2 className="h-4 w-4" /> Team editing is currently <span className="ml-1 underline">OPEN</span></>
                : <><XCircle className="h-4 w-4" /> Team editing is currently <span className="ml-1 underline">CLOSED</span>
                    {deadlinePassed && config.isOpen && " (deadline has passed)"}
                    {!config.isOpen && " (manually closed)"}
                  </>
              }
            </div>

            {/* IST Deadline picker */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gat-midnight mb-1">
                Last date to edit team members (IST)
              </label>
              <p className="text-xs text-gat-steel mb-3">
                Participants will see this date on the Teams page. Once it passes, editing is automatically blocked — even if the toggle below is set to Open.
              </p>
              <div className="flex gap-3">
                <Input
                  type="datetime-local"
                  value={config.deadline ?? ""}
                  onChange={(e) => setConfig((c) => ({ ...c, deadline: e.target.value || null }))}
                  className="flex-1"
                />
                {config.deadline && (
                  <Button variant="ghost" onClick={() => setConfig((c) => ({ ...c, deadline: null }))} className="text-gat-steel hover:text-red-500">
                    Clear
                  </Button>
                )}
              </div>
              {config.deadline && deadlinePassed && (
                <p className="text-xs text-red-600 font-medium mt-2">
                  ⚠ This deadline has already passed — editing is closed for participants.
                </p>
              )}
              {config.deadline && !deadlinePassed && (
                <p className="text-xs text-amber-600 font-medium mt-2">
                  Editing will automatically close on{" "}
                  <strong>
                    {new Date(config.deadline).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })} IST
                  </strong>.
                </p>
              )}
              {!config.deadline && (
                <p className="text-xs text-gat-steel mt-2">No deadline set — access is controlled by the toggle below only.</p>
              )}
            </div>

            {/* Manual toggle */}
            <div className="flex items-center justify-between p-4 bg-gat-off-white rounded-lg border border-gat-blue/10 mb-6">
              <div>
                <p className="text-sm font-semibold text-gat-midnight">Manual Override</p>
                <p className="text-xs text-gat-steel mt-0.5">Instantly open or close editing, regardless of the deadline above.</p>
              </div>
              <button
                onClick={() => setConfig((c) => ({ ...c, isOpen: !c.isOpen }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${config.isOpen ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
              >
                {config.isOpen ? <><LockOpen className="h-4 w-4" /> Open</> : <><Lock className="h-4 w-4" /> Closed</>}
              </button>
            </div>

            <Button onClick={handleSave} disabled={saving} className="bg-gat-blue text-white hover:bg-gat-midnight w-full">
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
