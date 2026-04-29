"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isFuture, isPast } from "date-fns";

export default function MaintenanceBanner() {
  const [config, setConfig] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/admin/maintenance");
        const data = await res.json();
        if (data.success && data.config) {
          setConfig(data.config);
        }
      } catch (error) {
        // Silent catch to prevent Next.js dev server error overlay
        // console.warn("Failed to fetch maintenance status for banner");
      }
    };
    fetchStatus();
  }, []);

  if (!config || !config.startTime || !isVisible) return null;

  const startTime = new Date(config.startTime);
  
  // Only show if the maintenance is in the future (within next 24 hours maybe)
  const isScheduled = isFuture(startTime);
  
  if (!isScheduled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-20 left-0 right-0 z-[100] bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
            <p className="text-sm font-medium">
              <span className="font-bold">System Maintenance:</span> The website will be under maintenance at {" "}
              <span className="underline decoration-white/50 underline-offset-2">
                {format(startTime, "h:mm a")}
              </span>. 
              All the Features Like ( Sign IN , Sign UP & more) will be unavailable during this time.
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
