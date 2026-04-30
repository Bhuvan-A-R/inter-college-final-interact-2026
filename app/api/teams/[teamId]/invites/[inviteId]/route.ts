import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth, successResponse, errorResponse } from "@/lib/apiHelpers";

type RouteContext = { params: Promise<{ teamId: string; inviteId: string }> };

// DELETE /api/teams/:teamId/invites/:inviteId — Cancel a pending invite
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { teamId, inviteId } = await context.params;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return errorResponse("Team not found.", 404);
    }

    if (team.leaderId !== auth.session.id && auth.session.role !== "SUPER_ADMIN") {
      return errorResponse("Only the team leader can cancel invites.", 403);
    }

    const invite = await prisma.teamInvite.findUnique({
      where: { id: inviteId },
    });

    if (!invite || invite.teamId !== teamId) {
      return errorResponse("Invite not found.", 404);
    }

    if (invite.status !== "PENDING") {
      return errorResponse("Can only cancel pending invites.", 400);
    }

    await prisma.teamInvite.delete({
      where: { id: inviteId },
    });

    return successResponse(null, 200, "Invite cancelled successfully.");
  } catch (error) {
    console.error("[DELETE /api/teams/:teamId/invites/:inviteId]", error);
    return errorResponse("Internal server error.", 500);
  }
}
