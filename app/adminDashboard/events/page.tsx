import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/authCookie";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, UserCheck, Download } from "lucide-react";

export default async function EventsDataPage() {
  const newSession = await getAuthSession();
  const legacySession = await verifySession();
  const session = newSession ?? legacySession;

  if (!session?.id) redirect("/auth/signin");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { role: true, emailVerified: true },
  });

  const validRoles = ["SUPER_ADMIN", "REG_ADMIN", "TECH_ADMIN", "SPORTS_ADMIN", "CULTURALS_ADMIN"];
  if (!currentUser || !validRoles.includes(currentUser.role) || !currentUser.emailVerified) {
    redirect("/dashboard?error=unauthorized");
  }

  let allowedCategories: string[] | null = null;
  if (currentUser.role === "TECH_ADMIN") allowedCategories = ["TECHNICAL"];
  else if (currentUser.role === "SPORTS_ADMIN") allowedCategories = ["SPORTS"];
  else if (currentUser.role === "CULTURALS_ADMIN")
    allowedCategories = ["CULTURAL", "DANCE", "FASHION", "FINE_ARTS", "GENERAL_EVENTS", "LITERARY", "MUSIC"];

  const events = await prisma.event.findMany({
    where: allowedCategories ? { category: { in: allowedCategories } } : undefined,
    include: {
      registrations: { select: { id: true } },
      teams: { select: { id: true } },
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <div className="bg-background min-h-screen pt-10">
      <div className="mt-20 max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/adminDashboard">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-primary font-bold text-4xl">Event-wise Data</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Registrations and teams per event — {events.length} events total
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-10">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Domain</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Event Name</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Teams</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Participants</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      No events found.
                    </td>
                  </tr>
                )}
                {events.map((event, idx) => (
                  <tr key={event.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{event.name}</td>
                    <td className="px-4 py-3 text-center">
                      {event.type === "TEAM" ? (
                        <span className="inline-flex items-center gap-1 justify-center font-semibold text-foreground">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {event.teams.length}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 justify-center font-semibold text-foreground">
                        <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                        {event.registrations.length}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                            timeZone: "Asia/Kolkata",
                          })
                        : "TBD"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <Link href={`/adminDashboard/participants?event=${event.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            View Participants
                          </Button>
                        </Link>
                        <a href={`/api/admin/events/${event.id}/download`} download>
                          <Button variant="secondary" size="sm" className="h-7 text-xs gap-1">
                            <Download className="h-3 w-3" />
                            Download CSV
                          </Button>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary footer */}
        <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
          <span>
            Total participants:{" "}
            <strong className="text-foreground">
              {events.reduce((s, e) => s + e.registrations.length, 0)}
            </strong>
          </span>
          <span>
            Total teams:{" "}
            <strong className="text-foreground">
              {events.reduce((s, e) => s + e.teams.length, 0)}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
