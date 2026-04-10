import prisma from "@/lib/db";
import { requireAuth, successResponse, errorResponse } from "@/lib/apiHelpers";
import { eventCategories } from "@/data/eventCategories";

const eventNoByName = new Map(
  eventCategories.map((event) => [event.eventName, event.eventNo])
);

// GET /api/registered-events — Verified events for the logged-in user
export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const orders = await prisma.order.findMany({
      where: { userId: auth.session.id, status: "VERIFIED" },
      include: {
        orderItems: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
                category: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: { verifiedAt: "desc" },
    });

    const items: Array<{
      eventId: string;
      eventName: string;
      eventNo: number | null;
      category: string | null;
      type: string | null;
      status: "VERIFIED";
      transactionId: string | null;
      registrationDate: string | null;
      orderId: string;
    }> = [];

    const seen = new Set<string>();

    for (const order of orders) {
      for (const item of order.orderItems) {
        const eventId = item.event.id;
        if (seen.has(eventId)) continue;
        seen.add(eventId);

        items.push({
          eventId,
          eventName: item.event.name,
          eventNo: eventNoByName.get(item.event.name) ?? null,
          category: item.event.category ?? null,
          type: item.event.type ?? null,
          status: "VERIFIED",
          transactionId: order.upiTransactionId ?? null,
          registrationDate: order.verifiedAt
            ? new Date(order.verifiedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : null,
          orderId: order.id,
        });
      }
    }

    return successResponse({ items });
  } catch (error) {
    console.error("[GET /api/registered-events]", error);
    return errorResponse("Internal server error.", 500);
  }
}
