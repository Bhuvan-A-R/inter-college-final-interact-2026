"use client";

import React, { useState, useRef } from "react";
import { Calendar, Clock, User, Volume2, VolumeX, MapPin, Star } from "lucide-react";
import Image from "next/image";

// ─── NATIVE VIDEO PLAYER (FOR MP4s) ────────────────────────────────────
const NativeVideoPlayer = ({ url }: { url: string }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative w-full max-w-[320px] mx-auto aspect-[9/16] bg-gat-midnight rounded-[2rem] overflow-hidden shadow-blue border flex-shrink-0 border-white/10 group">
      <video
        ref={videoRef}
        src={url}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 z-10 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all border border-white/20 shadow-lg"
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────
const FlashmobPage = () => {
  return (
    <div className="min-h-screen bg-gat-off-white text-gat-charcoal font-body flex flex-col items-center justify-start pt-32 pb-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-50" />
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-gat-blue/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl flex flex-col items-center gap-12">

        {/* Header Section */}
        <div className="text-center space-y-6">
          <span className="eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gat-blue/10 text-gat-blue border border-gat-blue/20 font-bold tracking-wider text-sm uppercase shadow-blue">
            <span className="text-lg">🔥</span> Pre-Launch Event
          </span>
          <h1 className="font-heading text-5xl md:text-7xl xl:text-8xl font-black leading-[0.95] text-transparent bg-clip-text bg-hero-gradient tracking-tight drop-shadow-sm">
            FLASHMOB
          </h1>
          <p className="text-gat-steel text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mt-2 text-gat-midnight/80">
            Get ready for an electrifying performance! Watch our talented squads ignite the campus and kick off the GAT INTERACT festivities in style.
          </p>
        </div>

        {/* ── Poster ── */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="/events/Interact 2026 FlashMob Poster.png"
              alt="GAT INTERACT 2026 FlashMob Poster"
              width={1200}
              height={1600}
              className="w-full h-auto object-contain block"
              priority
            />
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {/* Date */}
          <div className="flex flex-col items-center p-8 bg-white border border-gat-blue/10 rounded-3xl backdrop-blur-md shadow-card text-center gap-4 transition-all hover:bg-gat-off-white hover:border-gat-blue/30 hover:shadow-card-hover group">
            <div className="p-4 bg-gat-blue/10 text-gat-blue rounded-2xl group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl mb-1 uppercase tracking-wider text-gat-midnight">Date</h3>
              <p className="text-gat-steel font-bold">16th April 2026</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex flex-col items-center p-8 bg-white border border-gat-blue/10 rounded-3xl backdrop-blur-md shadow-card text-center gap-4 transition-all hover:bg-gat-off-white hover:border-gat-gold/30 hover:shadow-gold group">
            <div className="p-4 bg-gat-gold/10 text-gat-gold rounded-2xl group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl mb-1 uppercase tracking-wider text-gat-midnight">Time</h3>
              <p className="text-gat-steel font-bold">12:45 PM Onwards</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center p-8 bg-white border border-gat-blue/10 rounded-3xl backdrop-blur-md shadow-card text-center gap-4 transition-all hover:bg-gat-off-white hover:border-gat-blue/30 hover:shadow-card-hover group">
            <div className="p-4 bg-gat-blue/10 text-gat-blue rounded-2xl group-hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl mb-1 uppercase tracking-wider text-gat-midnight">Location</h3>
              <p className="text-gat-steel font-bold">Quadrangle, GAT Campus</p>
            </div>
          </div>

          {/* Chief Guest */}
          <div className="flex flex-col items-center p-8 bg-white border border-gat-blue/10 rounded-3xl backdrop-blur-md shadow-card text-center gap-4 transition-all hover:bg-gat-off-white hover:border-gat-navy/30 hover:shadow-navy group">
            <div className="p-4 bg-gat-navy/10 text-gat-navy rounded-2xl group-hover:scale-110 transition-transform">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl mb-1 uppercase tracking-wider text-gat-midnight">Chief Guest</h3>
              <p className="text-gat-midnight font-black text-base leading-tight">Mr. Shreenidhi S Shastry</p>
              <p className="text-gat-steel font-medium text-sm mt-1">Indian Idol Singer</p>
            </div>
          </div>
        </div>

        {/* Presided By */}
        <div className="w-full max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-gat-blue text-center mb-6 flex items-center justify-center gap-2">
            <Star className="w-4 h-4" /> Presided By
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: "Ms. Aisshwarya D K S Hegde",
                role: "Trustee Secretary, NEF",
              },
              {
                name: "Dr. Nagamani Nagaraja",
                role: "Chief of Strategy & Systems, NEF",
              },
              {
                name: "Dr. H. B. Balakrishna",
                role: "Principal, GAT",
              },
            ].map((person) => (
              <div
                key={person.name}
                className="flex flex-col items-center text-center p-7 bg-white border-2 border-gat-blue/10 rounded-3xl shadow-card hover:border-gat-blue/30 hover:shadow-card-hover transition-all relative overflow-hidden backdrop-blur-sm group"
              >
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gat-blue/5 rounded-full blur-2xl pointer-events-none" />
                <div className="w-14 h-14 rounded-2xl bg-gat-blue/10 text-gat-blue flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gat-blue group-hover:text-white transition-all">
                  <User className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-black text-lg text-gat-midnight leading-snug mb-1 relative z-10">
                  {person.name}
                </h3>
                <p className="text-sm font-medium text-gat-steel relative z-10">{person.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Institution tag */}
        <p className="text-center text-xs text-gat-steel/60 font-medium max-w-lg leading-relaxed">
          Global Academy of Technology · An Autonomous Institute, Affiliated to VTU, Approved by AICTE, New Delhi<br />
          Ideal Homes Township, Rajarajeshwari Nagar, Bengaluru – 560098
        </p>

      </div>
    </div>
  );
};

export default FlashmobPage;
