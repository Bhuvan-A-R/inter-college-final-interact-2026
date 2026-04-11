import Image from "next/image";
import { interactTeamSections } from "@/data/interactTeam";

const InteractTeamPage = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-36 pb-24 lg:pt-48 lg:pb-32">
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-100" />

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="md:text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
            <span className="eyebrow mb-2 inline-block">
              Global Academy Of Technology
            </span>
            <h1 className="font-display text-4xl md:text-6xl xl:text-7xl font-black leading-[0.95]">
              INTERACT <span className="text-[hsl(var(--primary))]">TEAM.</span>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Convenors and coordinators driving INTERACT 2026.
            </p>
          </div>
        </div>

        {/* Diagonal Cut */}
        <div className="hero-cut" />
      </section>

      {/* ══ TEAM SECTIONS ═════════════════════════════════════════════════ */}
      <section
        className="py-24"
        style={{
          background: "hsl(var(--card))",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {interactTeamSections.map((section) => (
            <div key={section.title} className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl md:text-4xl font-black">
                  {section.title}
                </h2>
                <span className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--muted))]">
                  {section.members.length} members
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {section.members.map((member) => (
                  <div
                    key={`${section.title}-${member.name}`}
                    className="cat-card rounded-[var(--radius)] p-6 text-center"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <div className="w-full flex justify-center mb-6">
                      <Image
                        src={member.photo}
                        alt={member.name}
                        width={300}
                        height={380}
                        className="w-full max-w-[260px] h-auto object-cover rounded-2xl"
                      />
                    </div>
                    <h3
                      className="font-display text-xl font-bold mb-2"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {member.name}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InteractTeamPage;
