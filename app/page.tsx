"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import interactLogo from "@/public/gat-logos/INTERACT2K26.png";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Volume2,
  VolumeX,
  Clapperboard,
  Music,
  Mic,
  Shirt,
  BookOpen,
  Palette,
  Star,
  Dumbbell,
  Cpu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { marqueeItems } from "@/data/homeData";
import { interCollegeEvents } from "@/data/eventCategories";
import ParticlesBackground from "@/components/ParticlesBackground";

const CATEGORY_META: Record<
  string,
  {
    name: string;
    icon: LucideIcon;
    accent: string;
    accentLight: string;
    accentBorder: string;
    order: number;
  }
> = {
  DANCE: {
    name: "Dance",
    icon: Music,
    accent: "hsl(46 90% 51%)",
    accentLight: "hsl(46 90% 51% / 0.08)",
    accentBorder: "hsl(46 90% 51% / 0.25)",
    order: 1,
  },
  FASHION: {
    name: "Fashion",
    icon: Shirt,
    accent: "hsl(258 70% 55%)",
    accentLight: "hsl(258 70% 55% / 0.08)",
    accentBorder: "hsl(258 70% 55% / 0.25)",
    order: 2,
  },
  FINE_ARTS: {
    name: "Fine Arts",
    icon: Palette,
    accent: "hsl(12 76% 50%)",
    accentLight: "hsl(12 76% 50% / 0.08)",
    accentBorder: "hsl(12 76% 50% / 0.22)",
    order: 3,
  },
  GENERAL_EVENTS: {
    name: "General Events",
    icon: Star,
    accent: "hsl(197 70% 45%)",
    accentLight: "hsl(197 70% 45% / 0.08)",
    accentBorder: "hsl(197 70% 45% / 0.22)",
    order: 4,
  },
  LITERARY: {
    name: "Literary",
    icon: BookOpen,
    accent: "hsl(38 90% 46%)",
    accentLight: "hsl(38 90% 46% / 0.08)",
    accentBorder: "hsl(38 90% 46% / 0.22)",
    order: 5,
  },
  MUSIC: {
    name: "Music",
    icon: Mic,
    accent: "hsl(224 68% 30%)",
    accentLight: "hsl(224 68% 30% / 0.08)",
    accentBorder: "hsl(224 68% 30% / 0.2)",
    order: 6,
  },
  SPORTS: {
    name: "Sports",
    icon: Dumbbell,
    accent: "hsl(152 68% 45%)",
    accentLight: "hsl(152 68% 45% / 0.08)",
    accentBorder: "hsl(152 68% 45% / 0.22)",
    order: 7,
  },
  TECHNICAL: {
    name: "Technical",
    icon: Cpu,
    accent: "hsl(193 70% 45%)",
    accentLight: "hsl(193 70% 45% / 0.08)",
    accentBorder: "hsl(193 70% 45% / 0.22)",
    order: 8,
  },
  THEATRE: {
    name: "Theatre",
    icon: Clapperboard,
    accent: "hsl(221 82% 55%)",
    accentLight: "hsl(221 82% 55% / 0.08)",
    accentBorder: "hsl(221 82% 55% / 0.2)",
    order: 9,
  },
};

/* ─────────────────────────────────────────────
    COUNT-UP HOOK
───────────────────────────────────────────── */
function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(ease(p) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { count, ref };
}

function StatItem({
  to,
  label,
  prefix = "",
  suffix = "+",
}: {
  to: number;
  label: string;
  prefix?: string;
  suffix?: string;
}) {
  const { count, ref } = useCountUp(to);
  return (
    <div className="flex flex-col gap-1">
      <span
        ref={ref}
        className="font-display text-5xl md:text-6xl font-extrabold leading-none"
        style={{ color: "hsl(var(--secondary))" }}
      >
        {prefix}
        {count}
        {suffix}
      </span>
      <span
        className="text-xs uppercase tracking-[0.22em] font-semibold"
        style={{ color: "hsl(var(--muted))" }}
      >
        {label}
      </span>
    </div>
  );
}

function Marquee() {
  const repeated = [...marqueeItems, ...marqueeItems];
  return (
    <div
      className="overflow-hidden py-3 border-y"
      style={{
        borderColor: "hsl(var(--border))",
        background: "hsl(var(--secondary) / 0.05)",
      }}
    >
      <ParticlesBackground />
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 26s linear infinite;
          display: flex;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-3 px-6">
            <span
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: "hsl(var(--foreground) / 0.5)" }}
            >
              {item}
            </span>
            <span style={{ color: "hsl(var(--secondary))", fontSize: 9 }}>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function InteractLogoLaunchVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.6 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("logo-only-navbar", { detail: inView }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("logo-only-navbar", { detail: false }),
      );
    };
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="w-full"
      style={{
        background: "hsl(var(--background))",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div className="w-full bg-black">
        <div className="w-full aspect-video relative">
          {!videoFailed ? (
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              src="https://5r9tznfycn.ufs.sh/f/CYCsZkxUjlfJUBUgWpIvPNB8W5qyhHQKM9Zxop6ns0Dal2iU"
              autoPlay
              muted={muted}
              loop
              playsInline
              poster="/gat-logos/INTERACT2K26.png"
              onError={() => setVideoFailed(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 50% 40%, hsl(var(--primary) / 0.18) 0%, transparent 60%), linear-gradient(120deg, #0b0b0d 0%, #15151c 100%)",
              }}
            >
              <Image
                src={interactLogo}
                alt="Interact 2K26"
                className="w-[60%] max-w-[520px] h-auto object-contain"
                priority
              />
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 18%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.25) 82%, rgba(0,0,0,0.55) 100%)",
            }}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => {
              const nextMuted = !muted;
              setMuted(nextMuted);
              if (videoRef.current) videoRef.current.muted = nextMuted;
            }}
            className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
            style={{
              background: "rgba(0, 0, 0, 0.65)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>
    </section>
  );
}

function IntroSplash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1800);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ fontFamily: "'Outfit', sans-serif" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 30%, hsl(var(--primary) / 0.25) 0%, transparent 60%), radial-gradient(ellipse 55% 55% at 15% 85%, hsl(var(--secondary) / 0.18) 0%, transparent 60%), linear-gradient(120deg, #0b0b0d 0%, #14131a 55%, #0b0b0d 100%)",
        }}
      />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[hsl(var(--secondary))] blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-40px] h-96 w-96 rounded-full bg-[hsl(var(--primary))] blur-[140px]" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-[160px] md:w-[200px]"
        >
          <Image
            src={interactLogo}
            alt="Interact 2K26"
            className="w-full h-auto object-contain"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6"
        >
          <p
            className="text-xs uppercase tracking-[0.4em]"
            style={{ color: "hsl(var(--muted))" }}
          >
            Techno-Cultural Fest
          </p>
          <h1
            className="font-display text-3xl md:text-4xl font-black tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            INTERACT 2K26
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "hsl(var(--foreground) / 0.7)" }}
          >
            Where innovation meets rhythm.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8"
        >
          <div className="mx-auto h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(90deg, hsl(var(--secondary)) 0%, hsl(var(--primary)) 100%)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
    PAGE
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
    RUN FOR HUNGER MODAL
───────────────────────────────────────────── */
function RunForHungerModal() {
  const [showModal, setShowModal] = useState(false);
  const [modalShown, setModalShown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const closeModal = useCallback(() => {
    setShowModal(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (modalShown) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !modalShown) {
          setShowModal(true);
          setModalShown(true);
        }
      },
      { threshold: 0.4 }
    );
    const el = triggerRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [modalShown]);

  useEffect(() => {
    if (!showModal) return;
    setCountdown(10);
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    timerRef.current = setTimeout(() => {
      setShowModal(false);
    }, 10000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showModal]);

  return (
    <>
      {/* Invisible scroll trigger — placed just below the video */}
      <div ref={triggerRef} className="w-full h-px" />

      {showModal && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{ animation: "rfhFadeIn 0.35s ease forwards" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(5,5,10,0.78)",
              backdropFilter: "blur(10px)",
            }}
            onClick={closeModal}
          />

          {/* Modal */}
          <div
            className="relative z-10 flex flex-col items-center w-full max-w-sm"
            style={{ animation: "rfhSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards" }}
          >
            {/* Close button — large, prominent */}
            <button
              onClick={closeModal}
              aria-label="Close"
              className="absolute -top-4 -right-4 z-20 flex items-center justify-center w-11 h-11 rounded-full text-white font-bold shadow-lg transition-transform hover:scale-110"
              style={{
                background: "hsl(var(--primary))",
                border: "2px solid rgba(255,255,255,0.25)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Countdown progress bar */}
            <div className="w-full mb-3 rounded-full overflow-hidden h-1" style={{ background: "rgba(255,255,255,0.15)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(countdown / 5) * 100}%`,
                  background: "hsl(var(--secondary))",
                  transition: "width 0.9s linear",
                }}
              />
            </div>

            {/* Poster image — full, no zoom */}
            <div
              className="w-full overflow-hidden shadow-2xl"
              style={{ border: "3px solid rgba(255,255,255,0.12)", borderRadius: 0 }}
            >
              <Image
                src="/events/Interact 2026 FlashMob Poster.png"
                alt="Run for Hunger 4.0 — Poster"
                width={1200}
                height={900}
                className="w-full h-auto object-contain block"
                priority
              />
            </div>

            {/* Register Now button */}
            {/* <Link
              href="https://linktr.ee/runforhunger4.0"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeModal}
              className="mt-5 inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-700"
              style={{
                padding: "14px 36px",
                fontSize: 15,
                background: "hsl(var(--secondary))",
                color: "hsl(var(--background))",
                boxShadow: "0 0 28px hsl(var(--secondary) / 0.45)",
                letterSpacing: "0.05em",
                fontFamily: "'Outfit', sans-serif",
                transition: "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.7s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.06)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 42px hsl(var(--secondary) / 0.65)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 28px hsl(var(--secondary) / 0.45)";
              }}
            >
              🏃‍♂️ Register for Run for Hunger 4.0
              <ArrowRight size={16} />
            </Link> */}

            <p className="mt-2.5 text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif" }}>
              Closes in {countdown}s · Click outside to dismiss
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes rfhFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rfhSlideUp { from { opacity: 0; transform: translateY(36px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const categories = useMemo(() => {
    const grouped = interCollegeEvents.reduce(
      (acc, event) => {
        if (!acc[event.category]) acc[event.category] = [];
        acc[event.category].push(event);
        return acc;
      },
      {} as Record<string, typeof interCollegeEvents>,
    );

    return Object.entries(grouped)
      .map(([key, items]) => {
        const meta = CATEGORY_META[key] ?? {
          name: key,
          icon: Star,
          accent: "hsl(var(--primary))",
          accentLight: "hsl(var(--primary) / 0.08)",
          accentBorder: "hsl(var(--primary) / 0.2)",
          order: 999,
        };

        return {
          key,
          name: meta.name,
          count: items.length,
          icon: meta.icon,
          accent: meta.accent,
          accentLight: meta.accentLight,
          accentBorder: meta.accentBorder,
          tags: items.map((item) => item.eventName).slice(0, 3),
          order: meta.order,
        };
      })
      .sort((a, b) => a.order - b.order);
  }, []);

  return (
    <>
      {showSplash ? (
        <IntroSplash onDone={() => setShowSplash(false)} />
      ) : (
        <>
          <InteractLogoLaunchVideo />
          {/* <RunForHungerModal /> */}
          <div
            className="min-h-screen"
            style={{
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
            }}
          >
            {/* ══ HERO ══════════════════════════════════════════════════════════ */}
            <section
              className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-10 pb-10"
              style={{
                background: `
            radial-gradient(ellipse 65% 55% at 60% 35%, hsl(var(--primary) / 0.09) 0%, transparent 65%),
            radial-gradient(ellipse 45% 45% at 5% 85%,  hsl(var(--secondary) / 0.07) 0%, transparent 55%),
            hsl(var(--background))
          `,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {/* dot grid */}
              <div className="dot-grid absolute inset-0 pointer-events-none opacity-100" />

              {/* ghost year watermark */}
              {/* <div
                className="absolute top-auto bottom-[6%] select-none pointer-events-none transition-all duration-500 max-[550px]:left-1/2 max-[550px]:-translate-x-1/2 max-[550px]:opacity-[0.05] max-[550px]:bottom-[2%] min-[551px]:right-[-2%] min-[551px]:opacity-[0.9]"
                style={{ width: "clamp(280px, 40vw, 700px)" }}
                aria-hidden
              >
                <Image
                  src={interactLogo}
                  alt="Interact Logo Watermark"
                  className="w-full h-auto object-contain"
                  priority
                />
              </div> */}

              <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-14 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
                  <div className="order-2 lg:order-1">
                    {/* badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45 }}
                    >
                      <span className="pill-badge mb-8 inline-flex">
                        Global Academy of Technology Presents
                      </span>
                    </motion.div>

                    {/* headline */}
                    <motion.h1
                      className="font-display leading-[0.92] mb-5"
                      style={{
                        // Reduced from clamp(2.5rem, 8vw, 6.5rem)
                        fontSize: "clamp(1.5rem, 6vw, 4rem)",
                        letterSpacing: "-0.02em",
                        color: "hsl(var(--foreground))",
                      }}
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      NATIONAL LEVEL
                      <br />
                      <span style={{ color: "hsl(var(--primary))" }}>
                        INTER-COLLEGE
                      </span>
                      <br />
                      <span
                        style={{
                          WebkitTextStroke: "1.5px hsl(var(--secondary))", // Slightly thinner stroke for smaller text
                          color: "transparent",
                        }}
                      >
                        INTERACT 2026
                      </span>
                    </motion.h1>

                    {/* tagline */}
                    <motion.p
                      className="font-mono-jb text-sm uppercase tracking-[0.28em] mb-12"
                      style={{ color: "hsl(var(--muted))" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.45, delay: 0.3 }}
                    >
                      Inter-collegiate Event <br /> Registration Portal
                    </motion.p>

                    {/* stats */}
                    <motion.div
                      className="stats-row flex flex-wrap gap-y-8 mb-12"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <StatItem
                        to={categories.reduce((acc, c) => acc + c.count, 0)}
                        label="Events"
                      />
                      <StatItem to={3} label="Days" />
                      <StatItem to={5000} label="Participants" />
                      {/* <div className="flex flex-col gap-1">
                  <span
                    className="font-display text-5xl md:text-4xl font-extrabold leading-none"
                    style={{ color: "hsl(var(--secondary))" }}
                  >
                    ₹2L+
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.22em] font-semibold"
                    style={{ color: "hsl(var(--muted))" }}
                  >
                    Prize Pool
                  </span>
                </div> */}
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                      className="flex flex-wrap gap-3 mb-10"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.52 }}
                    >
                      <Link href="/events" className="btn-primary">
                        Explore Events <ArrowRight size={16} />
                      </Link>
                    </motion.div>

                    {/* meta */}
                    <motion.div
                      className="flex flex-wrap items-center gap-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.68 }}
                    >
                      <span
                        className="font-mono-jb text-xs flex items-center gap-2"
                        style={{ color: "hsl(var(--muted))" }}
                      >
                        <Calendar size={12} />
                        May 13–15, 2026
                      </span>
                      <span
                        className="w-px h-3"
                        style={{ background: "hsl(var(--border))" }}
                      />
                      <span
                        className="font-mono-jb text-xs flex items-center gap-2"
                        style={{ color: "hsl(var(--muted))" }}
                      >
                        <MapPin size={12} />
                        GAT Campus, Bengaluru
                      </span>
                    </motion.div>
                  </div>

                  {/* theme card */}
                  <motion.aside
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="order-1 lg:order-2 rounded-3xl p-5 md:p-6"
                    style={{
                      background:
                        "radial-gradient(ellipse 90% 90% at 50% 10%, hsl(var(--primary) / 0.12) 0%, transparent 60%), hsl(var(--secondary) / 0.05)",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="rounded-2xl p-2.5"
                        style={{
                          background: "hsl(var(--secondary) / 0.12)",
                          border: "1px solid hsl(var(--border))",
                        }}
                      >
                        <Image
                          src={interactLogo}
                          alt="Interact 2K26"
                          className="w-12 h-auto object-contain"
                          priority
                        />
                      </div>
                      <div className="leading-tight">
                        <span
                          className="block text-[10px] uppercase tracking-[0.28em] font-semibold"
                          style={{ color: "hsl(var(--muted))" }}
                        >
                          INTERACT 2026 THEME
                        </span>
                        <span
                          className="font-display text-2xl md:text-3xl font-black"
                          style={{ color: "hsl(var(--secondary))" }}
                        >
                          PRAGNYA
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Every edition of INTERACT is driven by a central theme
                        that defines its identity and experience. In 2025, the
                        theme was "Brand Karnataka" - a celebration of the
                        state’s rich culture, traditions, and artistic heritage,
                        while also embracing the modern, progressive energy of
                        Bengaluru.
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        The theme brought together classical and contemporary
                        expressions, highlighting Karnataka as both a cultural
                        powerhouse and a hub of innovation. From folk traditions
                        to modern performances, the fest created a unified
                        narrative of identity, pride, and collective cultural
                        expression.
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Building on this strong foundation of identity and
                        collective celebration, INTERACT 2026 shifts the focus
                        inward with its new theme - "PRAGNYA." Pragnya
                        represents the moment of realisation - the belief in
                        oneself, the clarity of purpose, and the awakening of
                        one’s true capabilities. It is about going beyond
                        participation and stepping into self-discovery. When
                        effort aligns with belief, and passion is driven by
                        purpose, that transformation is Pragnya.
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        From celebrating a collective identity in 2025 to
                        igniting individual awakening in 2026, INTERACT evolves
                        into more than a fest - it becomes a space where belief
                        turns into performance, and performance into purpose.
                      </p>
                    </div>
                  </motion.aside>
                </div>
              </div>

              {/* diagonal cut to next section */}
              <div className="hero-cut" />
            </section>

            {/* ══ MARQUEE ══════════════════════════════════════════════════════ */}
            <Marquee />

            {/* ══ CATEGORIES ═══════════════════════════════════════════════════ */}
            <section
              className="py-28"
              style={{
                background: "hsl(var(--card))",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* section header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
                  <div>
                    <span className="eyebrow">
                      {categories.reduce((acc, c) => acc + c.count, 0)} events
                      across {categories.length} domains
                    </span>
                    <h2
                      className="font-display text-5xl md:text-6xl font-black leading-[0.95]"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      CHOOSE YOUR
                      <br />
                      <span style={{ color: "hsl(var(--primary))" }}>
                        DOMAIN
                      </span>
                    </h2>
                  </div>
                  <p
                    className="text-base leading-relaxed md:max-w-xs"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    From high-stakes hackathons to mesmerizing musical
                    performances — find your stage.
                  </p>
                </div>

                {/* cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                      <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.08, duration: 0.42 }}
                      >
                        <Link
                          href={`/events?category=${cat.key}`}
                          className="cat-card group block rounded-[var(--radius)] p-6"
                          style={{
                            background: "hsl(var(--background))",
                            border: `1px solid ${cat.accentBorder}`,
                            textDecoration: "none",
                          }}
                        >
                          {/* icon box */}
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                            style={{
                              background: cat.accentLight,
                              color: cat.accent,
                            }}
                          >
                            <Icon size={22} />
                          </div>

                          {/* name */}
                          <h3
                            className="font-display text-2xl font-bold mb-1 tracking-tight"
                            style={{ color: "hsl(var(--foreground))" }}
                          >
                            {cat.name}
                          </h3>

                          {/* count */}
                          <p
                            className="font-mono-jb text-xs mb-4"
                            style={{ color: cat.accent, fontWeight: 500 }}
                          >
                            {cat.count} events
                          </p>

                          {/* tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {cat.tags.map((t) => (
                              <span key={t} className="tag-chip">
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* arrow reveal */}
                          <div
                            className="flex items-center gap-1 mt-5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ color: cat.accent }}
                          >
                            Browse events <ArrowRight size={12} />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ══ SCHEDULE ═════════════════════════════════════════════════════ */}
            <section
              className="py-28 relative overflow-hidden"
              style={{
                background: "hsl(var(--background))",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {/* ghost watermark */}
              <div
                className="font-display absolute left-[-2%] bottom-[4%] font-black leading-none select-none pointer-events-none"
                style={{
                  fontSize: "clamp(90px,14vw,170px)",
                  color: "hsl(var(--primary) / 0.1)",
                  letterSpacing: "-0.02em",
                }}
                aria-hidden
              >
                INTERACT
              </div>
              {/* ghost watermark */}
              <div
                className="font-display absolute right-[-2%] top-[4%] font-black leading-none select-none pointer-events-none"
                style={{
                  fontSize: "clamp(90px,14vw,170px)",
                  color: "hsl(var(--primary) / 0.1)",
                  letterSpacing: "-0.02em",
                }}
                aria-hidden
              >
                2K26
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
                  {/* left col — sticky */}
                  <div className="lg:sticky lg:top-28">
                    <span className="eyebrow">The Itinerary</span>
                    <h2
                      className="font-display text-5xl md:text-6xl font-black leading-[0.93] mb-6"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      3 DAYS.
                      <br />
                      {categories.reduce((acc, c) => acc + c.count, 0)}+ EVENTS.
                      <br />
                      <span style={{ color: "hsl(var(--primary))" }}>
                        YOUR CALL.
                      </span>
                    </h2>
                    <p
                      className="text-base leading-relaxed mb-8 max-w-sm"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      Plan your days ahead to make the most of INTERACT 2026.
                      Every slot is a story — pick yours.
                    </p>
                    <button
                      disabled
                      className="btn-primary"
                      style={{
                        opacity: 1,
                        cursor: "not-allowed",
                        pointerEvents: "none",
                      }}
                    >
                      Full Schedule ( Coming Soon... )
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ══ BOTTOM CTA ═══════════════════════════════════════════════════ */}
            <section
              className="py-20 relative overflow-hidden"
              style={{
                background: `
            radial-gradient(ellipse 80% 80% at 50% 50%, hsl(var(--primary) / 0.12) 0%, transparent 70%),
            hsl(var(--accent))
          `,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
                <span
                  className="font-mono-jb text-xs uppercase tracking-[0.22em] mb-4 block"
                  style={{ color: "hsl(var(--secondary))" }}
                >
                  Registration are Live Now.
                </span>
                <h2
                  className="font-display text-4xl md:text-6xl font-black leading-[0.93] mb-6"
                  style={{ color: "hsl(var(--accent-foreground))" }}
                >
                  READY TO
                  <br />
                  <span style={{ color: "hsl(var(--secondary))" }}>
                    INTERACT?
                  </span>
                </h2>
                <p
                  className="text-base leading-relaxed mb-8"
                  style={{ color: "hsl(var(--accent-foreground) / 0.6)" }}
                >
                  Join 1000+ students across{" "}
                  {categories.reduce((acc, c) => acc + c.count, 0)}+ events.
                  Just bring your best game.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/auth/signin"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "13px 28px",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      borderRadius: "var(--radius)",
                      background: "transparent",
                      color: "hsl(46 90% 51%)",
                      border: "1.5px solid hsl(46 90% 51% / 0.45)",
                      cursor: "pointer",
                      textDecoration: "none",
                      fontFamily: "'Outfit', sans-serif",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                  >
                    Register Now
                  </Link>
                  <Link
                    href="/events"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "13px 28px",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      borderRadius: "var(--radius)",
                      background: "transparent",
                      color: "hsl(46 90% 51%)",
                      border: "1.5px solid hsl(46 90% 51% / 0.45)",
                      cursor: "pointer",
                      textDecoration: "none",
                      fontFamily: "'Outfit', sans-serif",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                  >
                    Browse All Events
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
}
