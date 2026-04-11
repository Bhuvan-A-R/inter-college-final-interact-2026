import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  requireAdmin,
  parseBody,
  successResponse,
  errorResponse,
} from "@/lib/apiHelpers";
import { adminVerifySchema } from "@/lib/schemas/orders";
import {
  sendPaymentRejectedEmail,
  sendPaymentVerifiedEmail,
} from "@/lib/email";

// POST /api/admin/verify — Verify or reject a payment
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const parsed = await parseBody(req, adminVerifySchema);
    if (parsed.error) return parsed.error;

    const { orderId, action, REJECTED_REASON } = parsed.data;

    if (action === "REJECTED" && !REJECTED_REASON?.trim()) {
      return errorResponse("Rejection reason is required.", 400);
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { email: true } },
        orderItems: {
          include: {
            Team: { include: { members: { select: { userId: true } } } },
          },
        },
      },
    });

    if (!order) {
      return errorResponse("Order not found.", 404);
    }

    if (order.status !== "PAYMENT_SUBMITTED") {
      return errorResponse(
        `Order cannot be processed. Current status: ${order.status}.`,
        400
      );
    }

    if (action === "APPROVED") {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "VERIFIED",
            verifiedAt: new Date(),
            verifiedBy: auth.session.id,
          },
        });

        for (const item of order.orderItems) {
          if (item.Team && item.Team.members.length > 0) {
            for (const member of item.Team.members) {
              await tx.registration.upsert({
                where: {
                  userId_eventId: {
                    userId: member.userId,
                    eventId: item.eventId,
                  },
                },
                create: {
                  userId: member.userId,
                  eventId: item.eventId,
                  teamId: item.teamId,
                },
                update: {},
              });
            }
          } else {
            await tx.registration.upsert({
              where: {
                userId_eventId: {
                  userId: order.userId,
                  eventId: item.eventId,
                },
              },
              create: {
                userId: order.userId,
                eventId: item.eventId,
                teamId: null,
              },
              update: {},
            });
          }
        }

        await tx.auditLog.create({
          data: {
            userId: auth.session.id,
            action: "PAYMENT_VERIFIED",
            entityType: "Order",
            entityId: orderId,
            details: {
              orderUserId: order.userId,
              totalAmount: order.totalAmount.toString(),
              itemCount: order.orderItems.length,
            },
          },
        });
      });

      if (order.user?.email) {
        try {
          await sendPaymentVerifiedEmail(order.user.email);
        } catch (emailError) {
          console.error("[admin verify email]", emailError);
        }
      }

      return successResponse({ message: "Payment verified and registrations created." });
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: "REJECTED",
          rejectionReason: REJECTED_REASON ?? "Rejected by admin",
          verifiedBy: auth.session.id,
          verifiedAt: new Date(),
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: auth.session.id,
          action: "PAYMENT_REJECTED",
          entityType: "Order",
          entityId: orderId,
          details: {
            orderUserId: order.userId,
            totalAmount: order.totalAmount.toString(),
            reason: REJECTED_REASON ?? "Rejected by admin",
          },
        },
      }),
    ]);

    if (order.user?.email) {
      try {
        await sendPaymentRejectedEmail(order.user.email, REJECTED_REASON ?? "Rejected by admin");
      } catch (emailError) {
        console.error("[admin reject email]", emailError);
      }
    }

    return successResponse({ message: "Payment rejected." });
  } catch (error) {
    console.error("[POST /api/admin/verify]", error);
    return errorResponse("Internal server error.", 500);
  }
}
