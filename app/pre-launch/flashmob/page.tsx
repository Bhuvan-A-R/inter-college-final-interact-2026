"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, Clock, User, Volume2, VolumeX, Instagram, Film, PlayCircle, MapPin } from "lucide-react";

// ─── VIDEO DATA ────────────────────────────────────────────────────────
// Add new Instagram links or native MP4 links here.
const videoData = [
  {
    id: 1,
    type: "instagram", // "instagram" or "native"
    url: "https://5r9tznfycn.ufs.sh/f/CYCsZkxUjlfJCInb0ZaxUjlfJXF6iPGhY0BmdtD1Vg9vrq5u",
  },
  // Example for future native MP4 video:
  // {
  //   id: 2,
  //   type: "native",
  //   url: "/videos/example.mp4",
  // }
];

// ─── NATIVE VIDEO PLAYER (FOR MP4s) ────────────────────────────────────
// This perfectly handles the requested "Mute/Unmute with Autoplay" natively.
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
      {/* Custom Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 z-10 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all border border-white/20 shadow-lg"
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>
    </div>
  );
};

const InstagramPlayer = ({ url }: { url: string }) => {
  useEffect(() => {
    // Wait for a brief moment to ensure the DOM is ready, then process IG embeds
    const processIG = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      } else {
        const script = document.createElement("script");
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      }
    };
    
    // Slight timeout avoids React hydration/layout mismatches before the script runs
    const timer = setTimeout(processIG, 100);
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="relative w-full max-w-[340px] mx-auto bg-white rounded-[2rem] overflow-hidden shadow-blue border flex-shrink-0 border-gat-blue/10 flex items-center justify-center p-2">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px",
          maxWidth: "340px",
          minWidth: "326px",
          padding: 0,
          width: "calc(100% - 2px)"
        }}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <div className="animate-pulse flex flex-col items-center justify-center h-64 gap-4">
            <Instagram className="w-8 h-8 text-gat-steel opacity-50" />
            <p className="font-bold text-gat-steel text-sm opacity-50">
              Loading Instagram Video...
            </p>
          </div>
        </div>
      </blockquote>
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

        {/* Video Reels Section (TikTok/Reels Style) */}
        {/* <div className="w-full flex flex-col items-center bg-white border border-gat-blue/10 rounded-[2.5rem] p-8 md:p-12 shadow-card backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gat-blue/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gat-gold/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-10 relative z-10">
            <PlayCircle className="w-8 h-8 text-gat-blue" />
            <h2 className="font-heading text-3xl font-black uppercase tracking-wider text-gat-midnight">Hype Reels</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8 w-full relative z-10">
            {videoData.map((video) => (
              video.type === "instagram" ? (
                <InstagramPlayer key={video.id} url={video.url} />
              ) : (
                <NativeVideoPlayer key={video.id} url={video.url} />
              )
            ))}
          </div>
          
          <p className="mt-12 text-center text-gat-steel font-medium flex items-center gap-2 bg-gat-off-white px-6 py-3 rounded-full border border-gat-blue/10">
            <Instagram className="w-5 h-5 text-gat-blue" />
            More electrifying videos dropping soon!
          </p>
        </div> */}

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-6">
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
              <p className="text-gat-steel font-bold">12:30 PM Onwards</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center p-8 bg-white border border-gat-blue/10 rounded-3xl backdrop-blur-md shadow-card text-center gap-4 transition-all hover:bg-gat-off-white hover:border-gat-blue/30 hover:shadow-card-hover group">
            <div className="p-4 bg-gat-blue/10 text-gat-blue rounded-2xl group-hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl mb-1 uppercase tracking-wider text-gat-midnight">Location</h3>
              <p className="text-gat-steel font-bold">GAT Quadrangle</p>
            </div>
          </div>

          {/* Guest Details */}
          <div className="flex flex-col items-center p-8 bg-white border border-gat-blue/10 rounded-3xl backdrop-blur-md shadow-card text-center gap-4 transition-all hover:bg-gat-off-white hover:border-gat-navy/30 hover:shadow-navy group">
            <div className="p-4 bg-gat-navy/10 text-gat-navy rounded-2xl group-hover:scale-110 transition-transform">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl mb-1 uppercase tracking-wider text-gat-midnight">Special Guest</h3>
              <p className="text-gat-steel font-bold">TBA Soon</p>
            </div>
          </div>
        </div>

        <p className="text-gat-steel font-bold">Other Details Coming Soon...</p>


      </div>
    </div>
  );
};

export default FlashmobPage;
