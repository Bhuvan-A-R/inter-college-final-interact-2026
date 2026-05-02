"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Megaphone, CheckCircle2, XCircle, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type MarqueeConfig = {
  text: string;
  isActive: boolean;
};

export default function AdminMarqueePage() {
  const [config, setConfig] = useState<MarqueeConfig>({ text: "", isActive: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marquee");
      const data = await res.json();
      if (data.success) {
        setConfig(data.data.config);
      }
    } catch {
      toast.error("Failed to load marquee settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadConfig(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/marquee", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) { 
        toast.error(data.error?.message || "Failed to save marquee."); 
        return; 
      }
      toast.success("Marquee settings updated successfully.");
    } catch {
      toast.error("Unable to update marquee settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/adminDashboard" className="inline-flex items-center gap-1.5 text-xs text-gat-steel hover:text-gat-blue">
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-heading font-black text-gat-midnight mt-3 uppercase tracking-tight">Marquee Settings</h1>
          <p className="text-sm text-gat-steel mt-1">Manage the dynamic announcement ribbon on the site.</p>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white border border-gat-blue/10 shadow-sm p-8 text-center text-gat-steel text-sm">
            Loading settings...
          </div>
        ) : (
          <div className="rounded-xl bg-white border border-gat-blue/10 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Megaphone className="h-5 w-5 text-gat-gold" />
              <h2 className="text-lg font-heading font-bold text-gat-midnight">Marquee Configuration</h2>
            </div>

            <div className="space-y-6">
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-gat-off-white rounded-lg border border-gat-blue/10">
                <div>
                  <Label htmlFor="active-toggle" className="text-sm font-bold text-gat-midnight">Enable Marquee</Label>
                  <p className="text-xs text-gat-steel mt-0.5">Toggle the visibility of the announcement ribbon.</p>
                </div>
                <Switch
                  id="active-toggle"
                  checked={config.isActive}
                  onCheckedChange={(checked) => setConfig((c) => ({ ...c, isActive: checked }))}
                />
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <Label htmlFor="marquee-text" className="text-sm font-bold text-gat-midnight">Marquee Text</Label>
                <Input
                  id="marquee-text"
                  placeholder="Enter announcement text..."
                  value={config.text}
                  onChange={(e) => setConfig((c) => ({ ...c, text: e.target.value }))}
                  className="bg-white"
                />
                <p className="text-[10px] text-gat-steel">
                  Tip: This text will loop infinitely on all pages once the user scrolls down.
                </p>
              </div>

              {/* Status Preview */}
              <div className={`flex items-center gap-2 p-3 rounded-lg text-xs font-bold uppercase tracking-wider ${config.isActive ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                {config.isActive ? (
                  <><CheckCircle2 className="h-4 w-4" /> Live on Site</>
                ) : (
                  <><XCircle className="h-4 w-4" /> Currently Hidden</>
                )}
              </div>

              <Button 
                onClick={handleSave} 
                disabled={saving} 
                className="w-full bg-gat-blue text-white hover:bg-gat-midnight font-bold py-6 rounded-xl shadow-lg transition-all"
              >
                {saving ? "Saving Changes..." : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Update Marquee</span>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
