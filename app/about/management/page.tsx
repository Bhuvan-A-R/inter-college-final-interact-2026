import Image from "next/image";

const managementTeam = [
  {
    name: "Usha Shivakumar",
    role: "Chairperson Trustee",
    photo: "/management-photos/udks.jpg.jpeg",
  },
  {
    name: "Aisshwarya DKS Hegde",
    role: "Trustee Secretary, National Education Foundation",
    photo: "/management-photos/adks.jpg.jpeg",
  },
  {
    name: "Dr. Nagamani Nagaraja",
    role: "Chief of Strategy & Systems, Global Academy of Technology",
    photo: "/management-photos/nn.png",
  },
  {
    name: "Dr. Balakrishna H B",
    role: "Principal, Global Academy of Technology",
    photo: "/management-photos/bhb.png",
  },
];

const ManagementTeamPage = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-24 pb-4 lg:pt-36 lg:pb-12">
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-100" />

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="md:text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
            <span className="eyebrow mb-2 inline-block">
              Global Academy Of Technology
            </span>

            <h1 className="font-display text-4xl md:text-6xl xl:text-7xl font-black leading-[0.95]">
              MANAGEMENT{" "}
              <span className="text-[hsl(var(--primary))]">TEAM.</span>
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

      {/* ══ TEAM ══════════════════════════════════════════════════════════ */}
      <section
        className="py-24"
        style={{
          background: "hsl(var(--card))",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {managementTeam.map((member) => (
              <div
                key={member.name}
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
                    width={320}
                    height={420}
                    className="w-full max-w-[320px] h-auto object-cover rounded-2xl"
                  />
                </div>
                <h3
                  className="font-display text-2xl font-bold mb-2"
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
      </section>
    </div>
  );
};

export default ManagementTeamPage;
