import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  requireAdmin,
  parseBody,
  successResponse,
  errorResponse,
} from "@/lib/apiHelpers";
import { z } from "zod";

const updateMarqueeSchema = z.object({
  text: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    console.log("Fetching marquee config...");
    const config = await prisma.marqueeConfig.upsert({
      where: { id: "singleton" },
      update: {},
      create: {
        id: "singleton",
        text: "Welcome to GAT Interact 2026!",
        isActive: true,
      },
    });
    return successResponse({ config });
  } catch (error: any) {
    console.error("[GET /api/marquee] ERROR:", error.message, error.stack);
    return errorResponse(`Internal server error: ${error.message}`, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const parsed = await parseBody(req, updateMarqueeSchema);
    if (parsed.error) return parsed.error;

    const config = await prisma.marqueeConfig.update({
      where: { id: "singleton" },
      data: parsed.data,
    });

    return successResponse({ config });
  } catch (error: any) {
    console.error("[PATCH /api/marquee] ERROR:", error.message, error.stack);
    return errorResponse(`Internal server error: ${error.message}`, 500);
  }
}
