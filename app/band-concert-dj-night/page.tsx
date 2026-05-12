"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";

export default function BandConcertDjNightPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl">
        {/* Poster image — full, no zoom */}
        <div
          className="w-full overflow-hidden shadow-2xl"
          style={{
            border: "3px solid rgba(255,255,255,0.12)",
            borderRadius: 0,
          }}
        >
          <Image
            src="/events/BAND-CONCERT-DJ-BANNER.jpg"
            alt="Band Concert DJ Night — Poster"
            width={1200}
            height={900}
            className="w-full h-auto object-contain block"
            priority
          />
        </div>

        {/* Register Now button */}
        <Link
          href="https://ticgetz.com/#/e/interact-2026"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-700"
          style={{
            padding: "14px 36px",
            fontSize: 12,
            background: "hsl(var(--secondary))",
            color: "hsl(var(--background))",
            boxShadow: "0 0 28px hsl(var(--secondary) / 0.45)",
            letterSpacing: "0.05em",
            fontFamily: "'Outfit', sans-serif",
            transition:
              "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.7s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "scale(1.06)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 0 42px hsl(var(--secondary) / 0.65)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 0 28px hsl(var(--secondary) / 0.45)";
          }}
        >
          Register for BAND CONCERT DJ NIGHT
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
