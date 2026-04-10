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
                Global Academy of Technology (GAT), established in 2001 in
                Bengaluru, is an autonomous institution affiliated with VTU and
                approved by AICTE, with NAAC ‘A’ grade accreditation. Positioned
                in India’s leading technology hub, the institution has evolved
                into a reputed centre for engineering, management, and research
                education. 
              </p>
              <p>
                Spread across a well-developed campus in
                Rajarajeshwari Nagar, GAT supports a vibrant academic ecosystem
                with over 3,000 students and a strong faculty base. The
                institution offers a wide spectrum of undergraduate,
                postgraduate, and doctoral programs across core and emerging
                disciplines, including Computer Science, Artificial
                Intelligence, Electronics, Mechanical, and Management studies.
              </p>
              <p>
                 GAT is recognised for its strong academic framework combined
                with industry-oriented learning. The curriculum is designed in
                alignment with evolving industry needs, supported by modern
                laboratories, digital learning systems, and research-driven
                initiatives. Students are actively engaged in technical events,
                innovation platforms, and interdisciplinary projects, creating a
                culture that extends beyond conventional classroom education.
              </p>
              <p>
                Ranked among notable engineering colleges in Bengaluru, GAT
                emphasises holistic development through academics,
                extracurricular activities, and large-scale student-driven
                initiatives. Its ecosystem encourages leadership, creativity,
                and competitive excellence, making it not just an academic
                institution but a dynamic hub for talent development.
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
