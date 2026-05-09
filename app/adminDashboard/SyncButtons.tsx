"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export function SyncButtons() {
  const [syncingMaster, setSyncingMaster] = useState(false);
  const [syncingMarketing, setSyncingMarketing] = useState(false);

  const handleSyncMaster = async () => {
    setSyncingMaster(true);
    try {
      const res = await fetch("/api/admin/sync-sheets", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Sync failed");
      toast.success(data.data?.message || "Successfully synced master sheets");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSyncingMaster(false);
    }
  };

  const handleSyncMarketing = async () => {
    setSyncingMarketing(true);
    try {
      const res = await fetch("/api/admin/sync-colleges", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Sync failed");
      toast.success(data.data?.message || "Successfully synced marketing data");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSyncingMarketing(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSyncMaster}
        disabled={syncingMaster}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${syncingMaster ? "animate-spin" : ""}`} />
        {syncingMaster ? "Syncing Master..." : "Sync Master Sheets"}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSyncMarketing}
        disabled={syncingMarketing}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${syncingMarketing ? "animate-spin" : ""}`} />
        {syncingMarketing ? "Syncing Marketing..." : "Sync Marketing Data"}
      </Button>
    </>
  );
}
