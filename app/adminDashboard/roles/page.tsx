import prisma from "@/lib/db";
import { RolesTable } from "@/components/admin/roles-table";
import { getAuthSession } from "@/lib/authCookie";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function RoleManagementPage() {
  const newSession = await getAuthSession();
  const legacySession = await verifySession();
  const session = newSession ?? legacySession;

  if (!session?.id) {
    redirect("/auth/signin");
  }

  // Fresh DB check to confirm role
  const currentUser = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { role: true },
  });

  if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "REG_ADMIN")) {
    redirect("/dashboard?error=unauthorized");
  }

  // Fetch all users to display in the table
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: [{ name: "asc" }],
  });

  return (
    <div className="bg-gat-off-white min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/adminDashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gat-steel hover:text-gat-midnight mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>
        
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gat-steel">
            Admin
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gat-midnight">
            Role Management
          </h1>
          <p className="text-sm text-gat-steel mt-1 max-w-2xl">
            Assign or update roles for registered users. Domain Admins (Tech, Sports, Cultural) will only have read access to their respective events.
          </p>
        </div>

        <RolesTable initialUsers={users} />
      </div>
    </div>
  );
}
