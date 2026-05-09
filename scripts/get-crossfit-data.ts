import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function main() {
  // Find the event
  const event = await prisma.event.findFirst({
    where: {
      name: {
        contains: "Crossfit",
        mode: "insensitive",
      },
    },
  });

  if (!event) {
    console.error("Crossfit event not found");
    return;
  }

  console.log(`Found event: ${event.name} (${event.id})`);

  // ── 1. Students with Crossfit in their CART (not yet in any order) ──────────
  const cartItems = await prisma.cartItem.findMany({
    where: { eventId: event.id },
    include: { user: true },
  });

  // ── 2. Students who have a Crossfit OrderItem ────────────────────────────────
  const orderItems = await prisma.orderItem.findMany({
    where: { eventId: event.id },
    include: {
      order: {
        include: { user: true },
      },
    },
  });

  // Map userId → best payment status from orders
  const orderStatusMap = new Map<
    string,
    { status: string; orderId: string; user: typeof orderItems[number]["order"]["user"] }
  >();

  const statusPriority: Record<string, number> = {
    VERIFIED: 1,
    PAYMENT_SUBMITTED: 2,
    PENDING_PAYMENT: 3,
    REJECTED: 4,
  };

  for (const item of orderItems) {
    const { order } = item;
    const existing = orderStatusMap.get(order.userId);
    const newPriority = statusPriority[order.status] ?? 99;
    const existingPriority = existing
      ? statusPriority[existing.status] ?? 99
      : 99;

    if (!existing || newPriority < existingPriority) {
      orderStatusMap.set(order.userId, {
        status: order.status,
        orderId: order.id,
        user: order.user,
      });
    }
  }

  // ── 3. Build the combined student list (de-duped by userId) ──────────────────
  type Row = {
    name: string;
    email: string;
    phone: string;
    college: string;
    source: string; // "Cart" | "Order"
    paymentStatus: string; // human-readable
  };

  const seen = new Set<string>();
  const data: Row[] = [];

  // Students with order items first
  for (const [userId, { status, user }] of orderStatusMap.entries()) {
    if (seen.has(userId)) continue;
    seen.add(userId);

    const humanStatus =
      status === "VERIFIED"
        ? "Paid"
        : status === "PAYMENT_SUBMITTED"
        ? "In Review"
        : status === "REJECTED"
        ? "Rejected"
        : "Pending Payment";

    data.push({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      college: user.collegeName,
      source: "Order",
      paymentStatus: humanStatus,
    });
  }

  // Students with only a cart item (no order for this event)
  for (const item of cartItems) {
    const { user } = item;
    if (seen.has(user.id)) continue; // already captured via an order
    seen.add(user.id);

    data.push({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      college: user.collegeName,
      source: "Cart",
      paymentStatus: "Not Ordered",
    });
  }

  // ── 4. Sort: Paid → In Review → Pending Payment → Rejected → Not Ordered ────
  const sortOrder: Record<string, number> = {
    Paid: 1,
    "In Review": 2,
    "Pending Payment": 3,
    Rejected: 4,
    "Not Ordered": 5,
  };

  data.sort((a, b) => {
    const diff =
      (sortOrder[a.paymentStatus] ?? 9) - (sortOrder[b.paymentStatus] ?? 9);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });

  // ── 5. Print summary ─────────────────────────────────────────────────────────
  const counts = data.reduce(
    (acc, r) => {
      acc[r.paymentStatus] = (acc[r.paymentStatus] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log(`\nTotal students (cart + order): ${data.length}`);
  console.log("\nSummary:");
  for (const [status, count] of Object.entries(counts)) {
    console.log(`  ${status}: ${count}`);
  }

  // ── 6. Write CSV ─────────────────────────────────────────────────────────────
  const csvRows = ["Name,Email,Phone,College,Source,Payment Status"];
  for (const row of data) {
    csvRows.push(
      `"${row.name}","${row.email}","${row.phone}","${row.college}","${row.source}","${row.paymentStatus}"`
    );
  }

  const csvContent = csvRows.join("\n");
  const outputPath = "crossfit_participants.csv";
  fs.writeFileSync(outputPath, csvContent);
  console.log(`\nData saved to ${outputPath}`);

  // Print preview
  console.log("\n--- Data Preview ---");
  console.log(csvContent);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
