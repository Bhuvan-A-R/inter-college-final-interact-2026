import React from "react";
import Image from "next/image";

const AboutFestPage = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-body-out">
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-36 pb-24 lg:pt-48 lg:pb-32">
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-100" />

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="md:text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
            <span className="eyebrow mb-2 inline-block">
              Global Academy Of Technology
            </span>

            <h1 className="font-display text-5xl md:text-7xl xl:text-8xl font-black leading-[0.95]">
              ABOUT{" "}
              <span className="text-[hsl(var(--primary))]">INTERACT.</span>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              A flagship inter-collegiate platform celebrating talent,
              creativity, and competitive excellence across Karnataka.
            </p>
          </div>
        </div>

        {/* Diagonal Cut */}
        <div className="hero-cut" />
      </section>

      {/* ══ CONTENT ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[hsl(var(--card))]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <div className="w-full lg:w-2/3 space-y-6 text-lg leading-relaxed text-[hsl(var(--muted-foreground))] text-justify">
              <p>
                INTERACT is not just a college fest — it is part of the larger
                legacy of the GAT, one of the most significant inter-collegiate
                platforms in Karnataka. Over the years, it has evolved into a
                large-scale celebration of talent, creativity, and competitive
                excellence, bringing together students from diverse disciplines
                onto a single stage.
              </p>
              <p>
                With participation from 100+ colleges, over 4,000 students, and
                a footfall exceeding 20,000, INTERACT operates at a scale that
                places it among the most impactful student-driven festivals in
                the region. The fest spans multiple domains, including cultural,
                technical, literary, and sports, creating a multidimensional
                platform where students don’t just compete — they collaborate,
                perform, and innovate.
              </p>
              <p>
                Each edition of INTERACT is designed as an immersive, multi-day
                experience featuring 25+ competitions, live performances,
                workshops, and large-format showcases, continuously setting new
                benchmarks for collegiate events. From music, dance, and theatre
                to innovation-driven challenges and interactive sessions, the
                fest captures the full spectrum of student expression.
              </p>
              <p>
                Beyond competitions, INTERACT functions as a high-impact
                engagement platform. It attracts brands, artists, and
                collaborators, offering direct access to a young, dynamic
                audience. For participants, it is a space to gain recognition
                and build networks; for partners, it is a strategic opportunity
                for visibility, activation, and meaningful connection with the
                student community.
              </p>
              <p>
                With every edition, INTERACT continues to expand in scale,
                reach, and influence — positioning itself not just as an event,
                but as a defining experience in the collegiate ecosystem.
              </p>
            </div>
            <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
              <Image
                src="/gat-logos/INTERACT2K26.png"
                alt="GAT Interact 2K26 logo"
                width={640}
                height={640}
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutFestPage;
