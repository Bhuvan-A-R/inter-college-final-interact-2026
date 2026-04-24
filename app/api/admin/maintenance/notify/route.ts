import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendMaintenanceEndEmail } from "@/lib/email";

export async function POST() {
  try {
    const subscribers = await prisma.maintenanceSubscriber.findMany({
      select: { email: true },
    });

    const emails = subscribers.map((s) => s.email);

    if (emails.length > 0) {
      await sendMaintenanceEndEmail(emails);
      // Clear subscribers after notifying
      await prisma.maintenanceSubscriber.deleteMany({});
    }

    return NextResponse.json({
      success: true,
      message: `Notifications sent to ${emails.length} subscribers.`,
    });
  } catch (error: any) {
    console.error("Maintenance notify error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send notifications." },
      { status: 500 }
    );
  }
}
