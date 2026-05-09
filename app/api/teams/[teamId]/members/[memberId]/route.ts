import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth, successResponse, errorResponse } from "@/lib/apiHelpers";

type RouteContext = { params: Promise<{ teamId: string; memberId: string }> };

// DELETE /api/teams/:teamId/members/:memberId — Remove a member from the team
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { teamId, memberId } = await context.params;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true,
        OrderItem: true,
        event: { select: { deadline: true } },
      },
    });

    if (!team) {
      return errorResponse("Team not found.", 404);
    }

    if (team.event.deadline && new Date() > new Date(team.event.deadline) && auth.session.role !== "SUPER_ADMIN") {
      return errorResponse("The registration deadline for this event has passed. Members can no longer be removed.", 403);
    }

    if (team.leaderId !== auth.session.id && auth.session.role !== "SUPER_ADMIN") {
      return errorResponse("Only the team leader can remove members.", 403);
    }

    if (team.OrderItem.length > 0) {
      return errorResponse("Cannot modify team after an order has been placed.", 400);
    }

    const member = team.members.find((m) => m.id === memberId);
    if (!member) {
      return errorResponse("Member not found in team.", 404);
    }

    if (member.userId === team.leaderId) {
      return errorResponse("Team leader cannot be removed. Delete the team instead.", 400);
    }

    await prisma.teamMember.delete({
      where: { id: memberId },
    });

    return successResponse(null, 200, "Member removed successfully.");
  } catch (error) {
    console.error("[DELETE /api/teams/:teamId/members/:memberId]", error);
    return errorResponse("Internal server error.", 500);
  }
}
