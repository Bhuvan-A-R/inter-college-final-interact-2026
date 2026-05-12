import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";

export async function GET() {
  try {
    const config = await prisma.teamEditConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config) {
      return successResponse({ allowed: true, deadline: null, reason: null });
    }

    const deadlinePassed = config.deadline ? new Date() > config.deadline : false;
    const allowed = config.isOpen && !deadlinePassed;

    let reason = null;
    if (!config.isOpen) reason = "manually closed";
    else if (deadlinePassed) reason = "deadline passed";

    return successResponse({
      allowed,
      deadline: config.deadline ? config.deadline.toISOString() : null,
      reason,
    });
  } catch (error) {
    console.error("[GET /api/team-edit-config]", error);
    return errorResponse("Internal server error.", 500);
  }
}
