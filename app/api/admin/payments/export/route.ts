import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, successResponse, errorResponse } from "@/lib/apiHelpers";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    if (type === "all") {
      // Fetch all users with their orders and cart items
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          collegeName: true,
          role: true,
          createdAt: true,
          orders: {
            include: {
              orderItems: {
                include: {
                  event: { select: { id: true, name: true, category: true } },
                  Team: { select: { id: true, name: true } },
                },
              },
            },
          },
          cartItems: {
            include: {
              event: { select: { id: true, name: true, category: true } },
              team: { select: { id: true, name: true } },
            },
          },
        },
      });

      return successResponse({ users });
    }

    if (status) {
      const validStatuses = ["PAYMENT_SUBMITTED", "VERIFIED", "REJECTED"] as const;
      if (!validStatuses.includes(status as any)) {
        return errorResponse("Invalid status parameter", 400);
      }

      const orders = await prisma.order.findMany({
        where: { status: status as any },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              collegeName: true,
            },
          },
          orderItems: {
            include: {
              event: {
                select: { id: true, name: true, type: true, category: true },
              },
              Team: {
                select: { id: true, name: true },
              },
            },
          },
        },
        orderBy: { paymentSubmittedAt: "desc" },
      });

      const responseOrders = orders.map((order) => ({
        ...order,
        REJECTED_REASON: order.rejectionReason ?? null,
      }));

      return successResponse({ orders: responseOrders });
    }

    return errorResponse("Missing type or status parameter", 400);
  } catch (error) {
    console.error("[GET /api/admin/payments/export]", error);
    return errorResponse("Internal server error.", 500);
  }
}
