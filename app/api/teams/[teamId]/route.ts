import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth, successResponse, errorResponse, parseBody } from "@/lib/apiHelpers";
import { generateTeamNameSuggestions } from "@/lib/teamUtils";
import { z } from "zod";


type RouteContext = { params: Promise<{ teamId: string }> };

// GET /api/teams/:teamId — Team details with members
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { teamId } = await context.params;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            type: true,
            category: true,
            price: true,
            minTeamSize: true,
            maxTeamSize: true,
          },
        },
        leader: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, collegeName: true },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        TeamInvite: {
          where: { status: { in: ["PENDING", "REJECTED"] } },
          select: {
            id: true,
            invitedUserId: true,
            status: true,
            createdAt: true,
            respondedAt: true,
            User_TeamInvite_invitedUserIdToUser: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!team) {
      return errorResponse("Team not found.", 404);
    }

    // Only team members or admins can view details
    const isMember = team.members.some((m) => m.userId === auth.session.id);
    if (!isMember && auth.session.role !== "SUPER_ADMIN") {
      return errorResponse("Forbidden.", 403);
    }

    return successResponse({ team });
  } catch (error) {
    console.error("[GET /api/teams/:teamId]", error);
    return errorResponse("Internal server error.", 500);
  }
}

const updateTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
});

// PATCH /api/teams/:teamId — Update team name
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { teamId } = await context.params;
    const parsed = await parseBody(req, updateTeamSchema);
    if (parsed.error) return parsed.error;

    const { name } = parsed.data;

    // Verify team exists and user is leader
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { id: true, leaderId: true, name: true },
    });

    if (!team) {
      return errorResponse("Team not found.", 404);
    }

    if (team.leaderId !== auth.session.id) {
      return errorResponse("Only the team leader can rename the team.", 403);
    }

    // If name is the same, just return success
    if (team.name.toLowerCase() === name.toLowerCase()) {
      return successResponse({ team });
    }

    // Check for team name uniqueness
    const existingTeamByName = await prisma.team.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existingTeamByName) {
      const suggestions = await generateTeamNameSuggestions(name);
      return errorResponse(
        "A team with this name already exists.",
        409,
        { suggestions }
      );
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: { name },
    });

    return successResponse({ team: updatedTeam }, 200, "Team renamed successfully.");
  } catch (error) {
    console.error("[PATCH /api/teams/:teamId]", error);
    return errorResponse("Internal server error.", 500);
  }
}

