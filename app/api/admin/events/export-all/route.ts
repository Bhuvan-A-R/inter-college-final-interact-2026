import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, successResponse, errorResponse } from "@/lib/apiHelpers";

// GET /api/admin/events/export-all
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    // Based on admin role, filter allowed categories
    let allowedCategories: string[] | undefined = undefined;
    if (auth.user?.role === "TECH_ADMIN") allowedCategories = ["TECHNICAL"];
    else if (auth.user?.role === "SPORTS_ADMIN") allowedCategories = ["SPORTS"];
    else if (auth.user?.role === "CULTURALS_ADMIN")
      allowedCategories = ["CULTURAL", "DANCE", "FASHION", "FINE_ARTS", "GENERAL_EVENTS", "LITERARY", "MUSIC"];

    const events = await prisma.event.findMany({
      where: allowedCategories ? { category: { in: allowedCategories } } : undefined,
      include: {
        registrations: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
                collegeName: true,
                usn: true,
                aadharNumber: true,
                orders: {
                  where: { status: "VERIFIED" },
                  include: {
                    orderItems: true, // Need to match eventId later
                  },
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
                    aadharNumber: true,
                  },
                },
              },
              orderBy: { role: "asc" }, // LEADER first
            },
          },
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return successResponse({ events });
  } catch (error) {
    console.error("[GET /api/admin/events/export-all]", error);
    return errorResponse("Internal server error.", 500);
  }
}
