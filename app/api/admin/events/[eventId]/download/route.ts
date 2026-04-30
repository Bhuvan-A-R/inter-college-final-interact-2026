import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/apiHelpers";

// GET /api/admin/events/[eventId]/download
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { eventId } = await context.params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                collegeName: true,
                usn: true,
                aadharNumber: true,
                orders: {
                  where: { status: "VERIFIED" },
                  include: {
                    orderItems: { where: { eventId } },
                  },
                  take: 1,
                },
              },
            },
          },
        },
        teams: {
          include: {
            OrderItem: {
              include: {
                order: { select: { status: true } },
              },
              take: 1,
            },
            members: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    phone: true,
                    collegeName: true,
                    usn: true,
                  },
                },
              },
              orderBy: { role: "asc" }, // LEADER first
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const rows: string[][] = [];

    if (event.type === "SOLO") {
      rows.push(["#", "Payment Status", "Name", "Email", "Phone", "College", "USN", "Aadhar Number"]);

      // Sort: approved first, rest below
      const sorted = [...event.registrations].sort((a, b) => {
        const aApproved = a.user.orders.some((o) => o.orderItems.length > 0);
        const bApproved = b.user.orders.some((o) => o.orderItems.length > 0);
        return aApproved === bApproved ? 0 : aApproved ? -1 : 1;
      });

      sorted.forEach((reg, idx) => {
        const u = reg.user;
        const paymentApproved = u.orders.some((o) => o.orderItems.length > 0);
        rows.push([
          String(idx + 1),
          paymentApproved ? "Approved" : "Pending",
          u.name,
          u.email,
          u.phone,
          u.collegeName,
          u.usn ?? "",
          u.aadharNumber ?? "",
        ]);
      });
    } else {
      // TEAM — one row per team, members side by side
      const maxMembers = Math.max(...event.teams.map((t) => t.members.length), 1);

      // Build header
      const header = ["#", "Payment Status", "Team Name"];
      for (let i = 1; i <= maxMembers; i++) {
        const label = i === 1 ? " (Leader)" : ` (Member ${i - 1})`;
        header.push(
          `Name${label}`,
          `Email${label}`,
          `Phone${label}`,
          `College${label}`,
          `USN${label}`
        );
      }
      rows.push(header);

      // Sort: teams with a verified order item first
      const sorted = [...event.teams].sort((a, b) => {
        const aApproved = a.OrderItem.some((oi) => oi.order.status === "VERIFIED");
        const bApproved = b.OrderItem.some((oi) => oi.order.status === "VERIFIED");
        return aApproved === bApproved ? 0 : aApproved ? -1 : 1;
      });

      sorted.forEach((team, idx) => {
        const paymentApproved = team.OrderItem.some((oi) => oi.order.status === "VERIFIED");
        const row: string[] = [String(idx + 1), paymentApproved ? "Approved" : "Pending", team.name];
        team.members.forEach((m) => {
          row.push(m.user.name, m.user.email, m.user.phone, m.user.collegeName, m.user.usn ?? "");
        });
        // Pad if fewer members than max
        const missing = maxMembers - team.members.length;
        for (let i = 0; i < missing; i++) {
          row.push("", "", "", "", "");
        }
        rows.push(row);
      });
    }

    // Convert to CSV
    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => {
            const safe = String(cell).replace(/"/g, '""');
            return /[,"\n\r]/.test(safe) ? `"${safe}"` : safe;
          })
          .join(",")
      )
      .join("\n");

    const filename = `${event.name.replace(/[^a-z0-9]/gi, "_")}_${event.type}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/events/:eventId/download]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
