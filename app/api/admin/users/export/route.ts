import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, successResponse, errorResponse } from "@/lib/apiHelpers";

/**
 * GET /api/admin/users/export
 * Returns all users with their registrations (event + team info).
 * No payment/order data is included.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        collegeName: true,
        aadharNumber: true,
        photoUrl: true,
        collegeIdNumber: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        registrations: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
                type: true,
                category: true,
              },
            },
          },
        },
        // Fetch teams the user leads
        teamsLed: {
          select: {
            id: true,
            name: true,
            eventId: true,
            members: {
              select: {
                userId: true,
                role: true,
                user: { select: { name: true } },
              },
            },
          },
        },
        // Fetch teams the user is a member of
        teamMemberships: {
          select: {
            role: true,
            team: {
              select: {
                id: true,
                name: true,
                eventId: true,
                leaderId: true,
                leader: { select: { name: true } },
                members: {
                  select: {
                    userId: true,
                    role: true,
                    user: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return successResponse({ users });
  } catch (error) {
    console.error("[GET /api/admin/users/export]", error);
    return errorResponse("Internal server error.", 500);
  }
}
