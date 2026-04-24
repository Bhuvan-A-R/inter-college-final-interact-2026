"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Settings, 
  Clock, 
  Calendar, 
  Bell, 
  ShieldAlert, 
  Save, 
  Power,
  Users,
  SendHorizontal,
  Info
} from "lucide-react";
import { format } from "date-fns";

export default function AdminMaintenancePage() {
  const [config, setConfig] = useState({
    startTime: "",
    endTime: "",
    isActive: false,
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    fetchConfig();
    fetchSubscribers();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/admin/maintenance");
      const data = await res.json();
      if (data.success && data.config) {
        setConfig({
          startTime: data.config.startTime ? format(new Date(data.config.startTime), "yyyy-MM-dd'T'HH:mm") : "",
          endTime: data.config.endTime ? format(new Date(data.config.endTime), "yyyy-MM-dd'T'HH:mm") : "",
          isActive: data.config.isActive,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch config");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    // We don't have a direct count API yet, so let's just fetch it from notify route conceptually 
    // or we could add a dedicated GET for count. For now, let's keep it simple.
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Maintenance settings updated and synced to Redis.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotify = async () => {
    if (!confirm("Are you sure you want to send notification emails to all subscribers? This will also clear the subscriber list.")) return;
    
    setIsNotifying(true);
    try {
      const res = await fetch("/api/admin/maintenance/notify", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to send notifications");
    } finally {
      setIsNotifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mt-20 font-bold flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            Maintenance Management
          </h1>
          <p className="text-muted-foreground mt-2">Control the website's availability and schedule maintenance windows.</p>
        </div>
        <div className="flex gap-4">
          <a
            href="/api/admin/maintenance/backup"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border"
          >
            <Save className="w-4 h-4" />
            Download Full Backup
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Configuration Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Scheduling settings
              </h2>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${config.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {config.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <button
                  onClick={() => setConfig({ ...config, isActive: !config.isActive })}
                  className={`p-1 rounded-lg transition-colors ${config.isActive ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Power className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={config.startTime}
                    onChange={(e) => setConfig({ ...config, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={config.endTime}
                    onChange={(e) => setConfig({ ...config, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  When active, all non-admin users will be redirected to the maintenance page. 
                  Make sure to set the correct timing to show the countdown timer accurately.
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Settings"}
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Card */}
        <div className="space-y-6">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                Notifications
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Subscribers</span>
                </div>
                <span className="text-2xl font-bold">Concept</span>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Send an email to everyone who registered their email on the maintenance page.
              </p>

              <button
                onClick={handleNotify}
                disabled={isNotifying}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isNotifying ? "Sending..." : "Notify & Go Live"}
                <SendHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex gap-4">
            <ShieldAlert className="w-6 h-6 text-yellow-600 shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-800 text-sm">Security Note</h3>
              <p className="text-xs text-yellow-700 mt-1">
                Admins with SUPER_ADMIN, REG_ADMIN, or ADMIN roles will bypass maintenance mode automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
