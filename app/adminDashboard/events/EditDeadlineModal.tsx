"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarClock, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function EditDeadlineModal({
  eventId,
  eventName,
  currentDeadline,
}: {
  eventId: string;
  eventName: string;
  currentDeadline: Date | null;
}) {
  const [open, setOpen] = useState(false);
  const [deadline, setDeadline] = useState(
    currentDeadline ? new Date(currentDeadline.getTime() - currentDeadline.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""
  );
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deadline: deadline ? new Date(deadline).toISOString() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to update deadline.");
        return;
      }
      toast.success("Deadline updated successfully.");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to update deadline.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" />
          {currentDeadline ? "Edit Deadline" : "Set Deadline"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Deadline</DialogTitle>
          <DialogDescription>
            Set a registration and team editing deadline for <strong>{eventName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Deadline (IST)</label>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="flex-1"
              />
              {deadline && (
                <Button variant="ghost" onClick={() => setDeadline("")} className="text-muted-foreground hover:text-red-500">
                  Clear
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              If cleared, the global team editing rules will apply instead.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
