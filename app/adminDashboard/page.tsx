import prisma from "@/lib/db";
import { DataTable, Data } from "@/components/register/admin-table";
import { getAuthSession } from "@/lib/authCookie";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const newSession = await getAuthSession();
  const legacySession = await verifySession();
  const session = newSession ?? legacySession;

  if (!session?.id) {
    redirect("/auth/signin");
  }

  // Fresh DB check — do not rely on JWT claims alone
  const currentUser = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { role: true, emailVerified: true },
  });

  const validRoles = ["SUPER_ADMIN", "REG_ADMIN", "TECH_ADMIN", "SPORTS_ADMIN", "CULTURALS_ADMIN"];
  const isAdmin = validRoles.includes(currentUser?.role || "");

  if (!currentUser || !isAdmin || !currentUser.emailVerified) {
    redirect("/dashboard?error=unauthorized");
  }

  // Determine allowed categories for Domain Admins
  let allowedCategories: string[] | null = null;
  if (currentUser.role === "TECH_ADMIN") {
    allowedCategories = ["TECHNICAL"];
  } else if (currentUser.role === "SPORTS_ADMIN") {
    allowedCategories = ["SPORTS"];
  } else if (currentUser.role === "CULTURALS_ADMIN") {
    allowedCategories = ["CULTURAL", "DANCE", "FASHION", "FINE_ARTS", "GENERAL_EVENTS", "LITERARY", "MUSIC"];
  }

  const users = await prisma.user.findMany({
    where: allowedCategories ? {
      registrations: {
        some: {
          event: {
            category: { in: allowedCategories }
          }
        }
      }
    } : undefined,
    include: {
      registrations: {
        where: allowedCategories ? {
          event: {
            category: { in: allowedCategories }
          }
        } : undefined,
        include: {
          event: {
            select: { id: true, name: true, type: true, category: true },
          },
        },
      },
    },
    orderBy: [{ usn: "asc" }, { name: "asc" }],
  });

  const results: Data[] = users.map((user) => {
    const events = user.registrations.map((r) => ({
      eventName: r.event.name,
      role: "Participant" as const,
    }));

    return {
      id: user.id,
      name: user.name,
      collegeName: user.collegeName,
      photo: user.photoUrl ?? "",
      email: user.email,
      phone: user.phone,
      events,
      status: "Pending" as const,
    };
  });

  return (
    <div className="bg-background min-h-screen pt-10">
      <div className="mt-20 justify-center flex flex-col gap-4">
        <div className="max-w-4xl mx-auto p-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-primary font-bold text-5xl md:text-5xl xl:text-5xl">
              Admin Dashboard
            </h1>
            {(currentUser.role === "SUPER_ADMIN" || currentUser.role === "REG_ADMIN") && (
              <Link href="/adminDashboard/roles">
                <Button className="font-semibold" variant="default">
                  Manage Admin Roles
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <DataTable data={results} role={currentUser.role} />
    </div>
  );
}
