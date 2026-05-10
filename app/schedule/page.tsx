"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Filter } from "lucide-react";
import { events } from "@/data/interCollegeSchedule";

// ── Track config ──────────────────────────────────────────────────────────────
const TRACKS = [
  { label: "13-05-2026", dateKey: "13th May", trackNo: 1, color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
  { label: "14-05-2026", dateKey: "14th May", trackNo: 2, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)" },
  { label: "15-05-2026", dateKey: "15th May", trackNo: 3, color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.2)"  },
];

const DOMAIN_COLORS: Record<string, string> = {
  Dance:            "#a855f7",
  Fashion:          "#f43f5e",
  "Fine Arts":      "#84cc16",
  "General Events": "#eab308",
  Literary:         "#06b6d4",
  Music:            "#2563eb",
  Sports:           "#f97316",
  Technical:        "#4f46e5",
  Theatre:          "#f97316",
  Quiz:             "#10b981",
};

function eventMatchesTrack(eventDate: string, trackDateKey: string) {
    if (eventDate === trackDateKey) return true;
    if (eventDate === "13th & 14th May" && (trackDateKey === "13th May" || trackDateKey === "14th May")) return true;
    if (eventDate === "13th, 14th & 15th May" && (trackDateKey === "13th May" || trackDateKey === "14th May" || trackDateKey === "15th May")) return true;
    return false;
}

const ALL_DOMAINS = ["All", ...Array.from(new Set(events.map((e) => e.domain)))];
const ALL_VENUES = ["All", ...Array.from(new Set(events.map((e) => e.venue)))].sort();

export default function SchedulePage() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [activeDomain, setActiveDomain] = useState("All");
  const [activeVenue, setActiveVenue] = useState("All");

  const filtered = events.filter((e) => {
    const selectedTrack = activeTrack !== null ? TRACKS.find(t => t.trackNo === activeTrack) : null;
    const matchTrack = selectedTrack ? eventMatchesTrack(e.date, selectedTrack.dateKey) : true;
    const matchDomain = activeDomain === "All" || e.domain === activeDomain;
    const matchVenue = activeVenue === "All" || e.venue === activeVenue;
    return matchTrack && matchDomain && matchVenue;
  });

  return (
    <div className="relative min-h-screen bg-white text-slate-900">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="relative z-10 py-20 md:py-28 text-center bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.3em] uppercase text-indigo-600 mb-4"
          >
            INTERACT 2K26 · Global Academy of Technology
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-slate-900 text-6xl md:text-8xl font-black tracking-tighter mb-5"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Schedule
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 text-lg max-w-xl mx-auto"
          >
            Three tracks. Forty-eight events. One unforgettable fest.
          </motion.p>
        </div>
        <div className="mt-10 h-px max-w-sm mx-auto bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">

        {/* ── Section heading ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-0.5">Event Category</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              Inter College Events
            </h2>
          </div>
        </motion.div>

        {/* ── Track filter pills ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-5"
        >
          <button
            onClick={() => setActiveTrack(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200"
            style={{
              background: activeTrack === null ? "rgba(0,0,0,0.05)" : "transparent",
              borderColor: activeTrack === null ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.05)",
              color: activeTrack === null ? "#000" : "rgba(0,0,0,0.45)",
            }}
          >
            All Tracks
          </button>
          {TRACKS.map((t) => (
            <button
              key={t.trackNo}
              onClick={() => setActiveTrack(activeTrack === t.trackNo ? null : t.trackNo)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200"
              style={{
                background: activeTrack === t.trackNo ? t.bg : "transparent",
                borderColor: activeTrack === t.trackNo ? t.border : "rgba(0,0,0,0.05)",
                color: activeTrack === t.trackNo ? t.color : "rgba(0,0,0,0.45)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
              Track {t.trackNo} · {t.label}
            </button>
          ))}
        </motion.div>

        {/* ── Domain filter pills ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-wrap gap-2 mb-5"
        >
          <Filter className="w-3.5 h-3.5 text-slate-400 self-center" />
          {ALL_DOMAINS.map((d) => {
            const dc = d === "All" ? "#000000" : DOMAIN_COLORS[d] ?? "#000000";
            const active = activeDomain === d;
            return (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className="px-3 py-1 rounded-full text-[11px] font-semibold border transition-all duration-200"
                style={{
                  background: active ? `${dc}18` : "transparent",
                  borderColor: active ? `${dc}50` : "rgba(0,0,0,0.05)",
                  color: active ? dc : "rgba(0,0,0,0.45)",
                }}
              >
                {d}
              </button>
            );
          })}
        </motion.div>

        {/* ── Venue filter pills ──────────────────────────────────────────── */}
        {/*<motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <MapPin className="w-3.5 h-3.5 text-slate-400 self-center" />
          {ALL_VENUES.map((v) => {
            const active = activeVenue === v;
            return (
              <button
                key={v}
                onClick={() => setActiveVenue(v)}
                className="px-3 py-1 rounded-full text-[11px] font-semibold border transition-all duration-200"
                style={{
                  background: active ? "rgba(0,0,0,0.05)" : "transparent",
                  borderColor: active ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.05)",
                  color: active ? "#000" : "rgba(0,0,0,0.45)",
                }}
              >
                {v}
              </button>
            );
          })}
        </motion.div>*/}

        {/* ── Table ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
          className="hidden md:block rounded-2xl border overflow-hidden bg-white shadow-sm"
          style={{ borderColor: "rgba(0,0,0,0.05)" }}
        >
          <div className="overflow-x-auto">
            {/* Table header */}
            <div
              className="grid text-[10px] font-bold tracking-widest uppercase text-slate-500 border-b"
              style={{
                gridTemplateColumns: "3rem 1fr 8rem 9rem 9rem 11rem",
                borderColor: "rgba(0,0,0,0.05)",
                background: "rgba(0,0,0,0.02)",
                padding: "0.75rem 1.25rem",
              }}
            >
              <span>#</span>
              <span>Event</span>
              <span>Domain</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Date</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Time</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Venue</span>
            </div>

            {/* Table body */}
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No events match the selected filters.
              </div>
            ) : (
              filtered.map((ev, idx) => {
                const domainColor = DOMAIN_COLORS[ev.domain] ?? "#000000";
                const isEven = idx % 2 === 0;

                return (
                  <motion.div
                    key={`${ev.eventId}-${idx}`} // Use index in key to handle any duplicates safely
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.018, 0.4) }}
                    className="grid items-center border-b last:border-b-0 transition-colors duration-150 hover:bg-slate-50"
                    style={{
                      gridTemplateColumns: "3rem 1fr 8rem 9rem 9rem 11rem",
                      borderColor: "rgba(0,0,0,0.05)",
                      background: isEven ? "transparent" : "rgba(0,0,0,0.005)",
                      padding: "0.85rem 1.25rem",
                      gap: "0.5rem",
                    }}
                  >
                    {/* # */}
                    <span className="text-[11px] font-bold text-slate-400">
                      {String(ev.eventId).padStart(2, "0")}
                    </span>

                    {/* Event name */}
                    <span className="text-sm font-semibold text-slate-800 leading-snug pr-4">
                      {ev.eventName}
                    </span>

                    {/* Domain */}
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase"
                      style={{ color: domainColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: domainColor }} />
                      {ev.domain}
                    </span>

                    {/* Date — track pill(s) */}
                    <div className="flex flex-wrap gap-1">
                      {TRACKS.map(t => {
                        if (eventMatchesTrack(ev.date, t.dateKey)) {
                          return (
                            <span
                              key={t.trackNo}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border w-fit"
                              style={{ background: t.bg, borderColor: t.border, color: t.color }}
                            >
                              <span className="w-1 h-1 rounded-full" style={{ background: t.color }} />
                              {t.label}
                            </span>
                          );
                        }
                        return null;
                      })}
                      {/* If it doesn't match any track (like 10th May), show the text */}
                      {!TRACKS.some(t => eventMatchesTrack(ev.date, t.dateKey)) && (
                        <span className="text-xs text-slate-500">{ev.date}</span>
                      )}
                    </div>

                    {/* Time */}
                    <span className="text-xs text-slate-600">{ev.timings}</span>

                    {/* Venue */}
                    <span className="text-xs text-slate-500 leading-snug">{ev.venue}</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Mobile View */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border">
              No events match the selected filters.
            </div>
          ) : (
            filtered.map((ev, idx) => {
              const domainColor = DOMAIN_COLORS[ev.domain] ?? "#000000";
              
              return (
                <motion.div
                  key={`${ev.eventId}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase" style={{ color: domainColor }}>
                      {ev.domain}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      #{String(ev.eventId).padStart(2, "0")}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    {ev.eventName}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    {/* Date Pill */}
                    {TRACKS.map(t => {
                      if (eventMatchesTrack(ev.date, t.dateKey)) {
                        return (
                          <span
                            key={t.trackNo}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                            style={{ background: t.bg, borderColor: t.border, color: t.color }}
                          >
                            <Calendar className="w-3 h-3" />
                            {t.label}
                          </span>
                        );
                      }
                      return null;
                    })}
                    {!TRACKS.some(t => eventMatchesTrack(ev.date, t.dateKey)) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-slate-100 border-slate-200 text-slate-600">
                        <Calendar className="w-3 h-3" />
                        {ev.date}
                      </span>
                    )}
                    
                    {/* Time */}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.timings}</span>
                    </div>
                    
                    {/* Venue */}
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.venue}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Result count */}
        <p className="mt-4 text-xs text-slate-400 text-right">
          Showing {filtered.length} of {events.length} events
        </p>

        {/* Legend */}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          {TRACKS.map((t) => (
            <span
              key={t.trackNo}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold border"
              style={{ background: t.bg, borderColor: t.border, color: t.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
              {t.label} — Event Track {t.trackNo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
