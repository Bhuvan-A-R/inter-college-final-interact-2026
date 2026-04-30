import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, successResponse, errorResponse, parseBody } from "@/lib/apiHelpers";
import { z } from "zod";

// GET /api/admin/team-edit-config
export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const config = await prisma.teamEditConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config) {
      return successResponse({ config: { isOpen: true, deadline: null } });
    }

    const toISTString = (date: Date) => {
      const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
      return istDate.toISOString().slice(0, 16);
    };

    return successResponse({
      config: {
        isOpen: config.isOpen,
        deadline: config.deadline ? toISTString(config.deadline) : null,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/team-edit-config]", error);
    return errorResponse("Internal server error.", 500);
  }
}

const configSchema = z.object({
  isOpen: z.boolean(),
  deadline: z.string().nullable().optional(),
});

// POST /api/admin/team-edit-config
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const parsed = await parseBody(req, configSchema);
    if (parsed.error) return parsed.error;

    const { isOpen, deadline } = parsed.data;

    const forceIST = (dateStr: string | null | undefined) => {
      if (!dateStr) return null;
      return dateStr.includes("+") || dateStr.includes("Z")
        ? new Date(dateStr)
        : new Date(`${dateStr}:00+05:30`);
    };

    const config = await prisma.teamEditConfig.upsert({
      where: { id: "singleton" },
      update: { isOpen, deadline: forceIST(deadline) },
      create: { id: "singleton", isOpen, deadline: forceIST(deadline) },
    });

    return successResponse({ config }, 200, "Team edit settings updated.");
  } catch (error) {
    console.error("[POST /api/admin/team-edit-config]", error);
    return errorResponse("Internal server error.", 500);
  }
}
