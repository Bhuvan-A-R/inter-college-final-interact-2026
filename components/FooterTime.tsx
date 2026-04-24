"use client";

import { useState, useEffect } from "react";
import { Clock, Tag } from "lucide-react";

const FooterTime = () => {
  const [time, setTime] = useState<string>("");
  
  // VERSION CONFIGURATION
  const VERSION_CODE = "v2.0.2";
  
  // Auto-generated build time from next.config.ts
  const buildTimeRaw = process.env.NEXT_PUBLIC_BUILD_TIME;
  const buildDisplay = buildTimeRaw 
    ? new Date(buildTimeRaw).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).toUpperCase()
    : "DEVELOPMENT";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(now.toLocaleString('en-IN', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 font-mono">
      {/* Live Time Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gat-cobalt/10 border border-gat-cobalt/20 shadow-inner group">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>
        <Clock className="w-3 h-3 text-gat-steel group-hover:text-gat-gold transition-colors" />
        <span className="text-[10px] md:text-xs font-bold text-gat-steel/90 tracking-tight whitespace-nowrap">
          {time || "INITIALIZING..."}
        </span>
      </div>

      {/* Version Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gat-gold/5 border border-gat-gold/20 shadow-inner group">
        <Tag className="w-3 h-3 text-gat-gold/70 group-hover:text-gat-gold transition-colors" />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] md:text-xs font-bold text-gat-steel/90 tracking-tight">
            VERSION: <span className="text-gat-gold">{VERSION_CODE}</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-gat-gold text-gat-midnight leading-none">
            {buildDisplay}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FooterTime;
