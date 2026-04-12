import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth, successResponse, errorResponse } from "@/lib/apiHelpers";

type RouteContext = { params: Promise<{ orderId: string }> };

// GET /api/orders/:orderId — Order details
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { orderId } = await context.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
                type: true,
                category: true,
                price: true,
                imageUrl: true,
              },
            },
            Team: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!order) {
      return errorResponse("Order not found.", 404);
    }

    // Only the order owner or an admin can view
    if (
      order.userId !== auth.session.id &&
      auth.session.role !== "SUPER_ADMIN"
    ) {
      return errorResponse("Forbidden.", 403);
    }

    return successResponse({
      order: {
        ...order,
        REJECTED_REASON: order.rejectionReason ?? null,
      },
    });
  } catch (error) {
    console.error("[GET /api/orders/:orderId]", error);
    return errorResponse("Internal server error.", 500);
  }
}

// DELETE /api/orders/:orderId — Cancel a PENDING_PAYMENT order (participant only)
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { orderId } = await context.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true, status: true },
    });

    if (!order) {
      return errorResponse("Order not found.", 404);
    }

    if (order.userId !== auth.session.id) {
      return errorResponse("Forbidden.", 403);
    }

    if (order.status !== "PENDING_PAYMENT") {
      return errorResponse("Only orders with status PENDING_PAYMENT can be cancelled.", 400);
    }

    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { orderId } }),
      prisma.order.delete({ where: { id: orderId } }),
    ]);

    return successResponse({ message: "Order cancelled successfully." });
  } catch (error) {
    console.error("[DELETE /api/orders/:orderId]", error);
    return errorResponse("Internal server error.", 500);
  }
}
