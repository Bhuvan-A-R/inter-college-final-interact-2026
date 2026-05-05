import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/authCookie";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, ShieldCheck, CalendarClock, Megaphone, Mail } from "lucide-react";


export default async function AdminDashboardPage() {
  const newSession = await getAuthSession();
  const legacySession = await verifySession();
  const session = newSession ?? legacySession;

  if (!session?.id) redirect("/auth/signin");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { role: true, emailVerified: true },
  });

  const validRoles = ["SUPER_ADMIN", "REG_ADMIN", "TECH_ADMIN", "SPORTS_ADMIN", "CULTURALS_ADMIN"];
  const isAdmin = validRoles.includes(currentUser?.role || "");

  if (!currentUser || !isAdmin || !currentUser.emailVerified) {
    redirect("/dashboard?error=unauthorized");
  }

  const isSuperOrReg = currentUser.role === "SUPER_ADMIN" || currentUser.role === "REG_ADMIN";

  // Quick stats
  const [totalUsers, totalEvents, totalTeams] = await Promise.all([
    prisma.user.count({ where: { role: "PARTICIPANT" } }),
    prisma.event.count({ where: { isActive: true } }),
    prisma.team.count(),
  ]);

  const navItems = [
    {
      href: "/adminDashboard/participants",
      icon: Users,
      label: "Participants",
      description: "View and manage all registered participants",
      show: true,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      href: "/adminDashboard/events",
      icon: CalendarDays,
      label: "Event-wise Data",
      description: "See registrations and teams per event",
      show: true,
      color: "bg-violet-50 text-violet-600 border-violet-100",
    },
    {
      href: "/adminDashboard/roles",
      icon: ShieldCheck,
      label: "Manage Admin Roles",
      description: "Assign and revoke admin roles for users",
      show: isSuperOrReg,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      href: "/adminDashboard/settings",
      icon: CalendarClock,
      label: "Manage Team Deadline",
      description: "Set the last date for team member editing after payment",
      show: isSuperOrReg,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      href: "/adminDashboard/marquee",
      icon: Megaphone,
      label: "Marquee Settings",
      description: "Manage the dynamic announcement ribbon on the site",
      show: isSuperOrReg,
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      href: "/adminDashboard/emails",
      icon: Mail,
      label: "Email Communicator",
      description: "Bulk email system for participant announcements",
      show: isSuperOrReg,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },


  ].filter((item) => item.show);

  return (
    <div className="bg-background min-h-screen pt-10">
      <div className="mt-20 max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">
            {currentUser.role.replace(/_/g, " ")}
          </p>
          <h1 className="text-primary font-bold text-5xl">Admin Dashboard</h1>
        </div>

        {/* Quick stats — super/reg only */}
        {isSuperOrReg && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Participants", value: totalUsers },
              { label: "Active Events", value: totalEvents },
              { label: "Teams", value: totalTeams },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-5 shadow-sm text-center">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-start gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition-shadow cursor-pointer group`}>
                  <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick actions row for super/reg */}
        {isSuperOrReg && (
          <div className="mt-8 flex gap-3 flex-wrap">
            <Link href="/adminDashboard/payments">
              <Button variant="outline" size="sm">Payments</Button>
            </Link>
            <Link href="/adminDashboard/roles">
              <Button variant="outline" size="sm">Manage Admin Roles</Button>
            </Link>
            <Link href="/adminDashboard/settings">
              <Button variant="outline" size="sm">Manage Team Deadline</Button>
            </Link>
            <Link href="/adminDashboard/marquee">
              <Button variant="outline" size="sm">Marquee Settings</Button>
            </Link>
            <Link href="/adminDashboard/emails">
              <Button variant="outline" size="sm">Email Communicator</Button>
            </Link>

          </div>
        )}
      </div>
    </div>
  );
}
