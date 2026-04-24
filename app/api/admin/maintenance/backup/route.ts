import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const data: any = {};

    // Fetch all tables
    data.users = await prisma.user.findMany();
    data.events = await prisma.event.findMany();
    data.teams = await prisma.team.findMany();
    data.teamMembers = await prisma.teamMember.findMany();
    data.orders = await prisma.order.findMany();
    data.orderItems = await prisma.orderItem.findMany();
    data.registrations = await prisma.registration.findMany();
    data.cartItems = await prisma.cartItem.findMany();
    data.auditLogs = await prisma.auditLog.findMany();
    data.maintenanceConfig = await prisma.maintenanceConfig.findMany();
    data.maintenanceSubscribers = await prisma.maintenanceSubscriber.findMany();
    data.teamInvites = await prisma.teamInvite.findMany();
    data.otps = await prisma.otp.findMany();
    data.pendingRegistrations = await prisma.pendingRegistration.findMany();

    return NextResponse.json(data, {
      headers: {
        "Content-Disposition": `attachment; filename="backup-${new Date().toISOString()}.json"`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Backup API error:", error);
    return NextResponse.json({ success: false, message: "Backup failed" }, { status: 500 });
  }
}
