import prisma from "@/lib/db";
import { DataTable, Data } from "@/components/register/admin-table";
import { getAuthSession } from "@/lib/authCookie";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  searchParams: Promise<{ event?: string }>;
};

export default async function ParticipantsPage({ searchParams }: Props) {
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

  const { event: eventIdFilter } = await searchParams;

  let allowedCategories: string[] | null = null;
  if (currentUser.role === "TECH_ADMIN") allowedCategories = ["TECHNICAL"];
  else if (currentUser.role === "SPORTS_ADMIN") allowedCategories = ["SPORTS"];
  else if (currentUser.role === "CULTURALS_ADMIN")
    allowedCategories = ["CULTURAL", "DANCE", "FASHION", "FINE_ARTS", "GENERAL_EVENTS", "LITERARY", "MUSIC"];

  // Build registration filter combining event filter + category restriction
  const regWhere: Record<string, unknown> = {};
  if (eventIdFilter) regWhere.eventId = eventIdFilter;
  if (allowedCategories) regWhere.event = { category: { in: allowedCategories } };

  // Fetch only users who have a matching registration
  const users = await prisma.user.findMany({
    where: {
      registrations: { some: regWhere },
    },
    include: {
      registrations: {
        where: regWhere,
        include: {
          event: { select: { id: true, name: true, type: true, category: true } },
        },
      },
    },
    orderBy: [{ usn: "asc" }, { name: "asc" }],
  });

  // If filtering by event, fetch the event name for the heading
  let filteredEventName: string | null = null;
  if (eventIdFilter) {
    const ev = await prisma.event.findUnique({
      where: { id: eventIdFilter },
      select: { name: true },
    });
    filteredEventName = ev?.name ?? null;
  }

  const results: Data[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    collegeName: user.collegeName,
    photo: user.photoUrl ?? "",
    email: user.email,
    phone: user.phone,
    events: user.registrations.map((r) => ({ eventName: r.event.name, role: "Participant" as const })),
    status: "Pending" as const,
  }));

  return (
    <div className="bg-background min-h-screen pt-10">
      <div className="mt-20 flex flex-col gap-4">
        <div className="max-w-4xl mx-auto p-4 w-full">
          <div className="flex items-center gap-4 mb-2">
            <Link href={eventIdFilter ? "/adminDashboard/events" : "/adminDashboard"}>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                {eventIdFilter ? "Events" : "Dashboard"}
              </Button>
            </Link>
            <div>
              <h1 className="text-primary font-bold text-4xl">
                {filteredEventName ? filteredEventName : "Participants"}
              </h1>
              {filteredEventName && (
                <p className="text-muted-foreground text-sm mt-0.5">
                  {results.length} participant{results.length !== 1 ? "s" : ""} registered
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <DataTable data={results} role={currentUser.role} />
    </div>
  );
}
