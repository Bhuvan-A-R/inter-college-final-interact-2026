import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, successResponse, errorResponse, parseBody } from "@/lib/apiHelpers";
import { z } from "zod";
import { sendBulkEmail } from "@/lib/email";

const sendEmailSchema = z.object({
  category: z.enum(["PAID_APPROVED", "PAID_PENDING", "NOT_PAID", "TEST"]),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const [paidApproved, paidPending, notPaid] = await Promise.all([
      prisma.user.count({
        where: {
          role: "PARTICIPANT",
          orders: { some: { status: "VERIFIED" } },
        },
      }),
      prisma.user.count({
        where: {
          role: "PARTICIPANT",
          orders: { some: { status: "PAYMENT_SUBMITTED" } },
        },
      }),
      prisma.user.count({
        where: {
          role: "PARTICIPANT",
          NOT: {
            orders: {
              some: {
                status: { in: ["VERIFIED", "PAYMENT_SUBMITTED"] },
              },
            },
          },
        },
      }),
    ]);

    return successResponse({
      counts: {
        PAID_APPROVED: paidApproved,
        PAID_PENDING: paidPending,
        NOT_PAID: notPaid,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/emails/send]", error);
    return errorResponse("Internal server error.", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await parseBody(req, sendEmailSchema);
    if (body.error) return body.error;

    const { category, subject, content } = body.data;

    let users: { email: string }[] = [];

    if (category === "PAID_APPROVED") {
      users = await prisma.user.findMany({
        where: {
          role: "PARTICIPANT",
          orders: { some: { status: "VERIFIED" } },
        },
        select: { email: true },
      });
    } else if (category === "PAID_PENDING") {
      users = await prisma.user.findMany({
        where: {
          role: "PARTICIPANT",
          orders: { some: { status: "PAYMENT_SUBMITTED" } },
        },
        select: { email: true },
      });
    } else if (category === "NOT_PAID") {
      users = await prisma.user.findMany({
        where: {
          role: "PARTICIPANT",
          NOT: {
            orders: {
              some: {
                status: { in: ["VERIFIED", "PAYMENT_SUBMITTED"] },
              },
            },
          },
        },
        select: { email: true },
      });
    } else if (category === "TEST") {
      users = [{ email: "interact2k26@gmail.com" }];
    }

    const emails = users.map((u) => u.email).filter(Boolean);

    if (emails.length === 0) {
      return errorResponse("No recipients found for the selected category.", 404);
    }

    await sendBulkEmail(emails, subject, content);

    return successResponse({ count: emails.length }, 200, `Successfully sent to ${emails.length} recipients.`);
  } catch (error) {
    console.error("[POST /api/admin/emails/send]", error);
    return errorResponse("Internal server error.", 500);
  }
}
