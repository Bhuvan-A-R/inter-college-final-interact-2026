"use client";

import { useState, useEffect } from "react";
import Countdown from "react-countdown";
import { motion } from "framer-motion";
import { Hammer, Mail, Bell, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/admin/maintenance");
        const data = await res.json();
        if (data.success) {
          setConfig(data.config);
        }
      } catch (error) {
        console.error("Failed to fetch maintenance status");
      }
    };
    fetchStatus();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/maintenance/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubscribed(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return (
        <div className="text-2xl font-bold text-white bg-green-500/20 px-6 py-3 rounded-full border border-green-500/50 backdrop-blur-sm">
          We're coming back any moment!
        </div>
      );
    }
    return (
      <div className="flex gap-4 md:gap-8">
        {[
          { label: "Days", value: days },
          { label: "Hours", value: hours },
          { label: "Minutes", value: minutes },
          { label: "Seconds", value: seconds },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
              <span className="text-2xl md:text-4xl font-bold text-white tabular-nums">
                {String(item.value).padStart(2, "0")}
              </span>
            </div>
            <span className="mt-2 text-xs md:text-sm text-gray-400 uppercase tracking-widest font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full text-center z-10"
      >
        <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm shadow-xl">
          <Hammer className="w-8 h-8 text-blue-400 animate-bounce" />
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          Under Maintenance
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          We're upgrading our systems to provide you with a faster, smoother experience for <span className="text-blue-400 font-semibold">INTERACT 2K26</span>. We'll be back shortly!
        </p>

        {config?.endTime && (
          <div className="mb-16">
            <Countdown date={new Date(config.endTime)} renderer={renderer} />
          </div>
        )}

        <div className="max-w-md mx-auto">
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                <div className="pl-4 flex items-center">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your email to get notified"
                  className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder:text-gray-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                  {isSubmitting ? "Subscribing..." : "Notify Me"}
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-500/10 border border-green-500/50 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-3 text-green-400 font-bold mb-2">
                <CheckCircle2 className="w-6 h-6" />
                Subscription Confirmed
              </div>
              <p className="text-green-400/80 text-sm">
                We've added {email} to our list. We'll email you as soon as the portal is live.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-gray-600">
        <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
          <Clock className="w-4 h-4" />
          Scheduled Upgrade
        </div>
        <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
          <ShieldAlert className="w-4 h-4" />
          Secure Process
        </div>
      </div>
    </div>
  );
}
