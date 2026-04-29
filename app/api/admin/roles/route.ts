import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, successResponse, errorResponse } from "@/lib/apiHelpers";
import { z } from "zod";

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum([
    "PARTICIPANT",
    "SUPER_ADMIN",
    "REG_ADMIN",
    "TECH_ADMIN",
    "SPORTS_ADMIN",
    "CULTURALS_ADMIN",
  ]),
});

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await req.json();
    const result = updateRoleSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("Invalid input", 400, result.error.issues);
    }

    const { userId, role } = result.data;

    // Prevent an admin from changing their own role to avoid accidental lockouts
    if (userId === auth.session.id) {
      return errorResponse("You cannot change your own role.", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return successResponse({ user: updatedUser });
  } catch (error: any) {
    console.error("[PATCH /api/admin/roles]", error?.message || String(error));
    return errorResponse("Internal server error.", 500);
  }
}
