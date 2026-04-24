import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function restore() {
  console.log("🚀 Starting database restore...");
  
  // Find the latest backup file
  const backupDir = path.join(process.cwd(), "backups");
  const files = fs.readdirSync(backupDir).filter(f => f.startsWith("backup-") && f.endsWith(".json"));
  
  if (files.length === 0) {
    console.error("❌ No backup files found in /backups");
    return;
  }

  const latestFile = files.sort().reverse()[0];
  const filePath = path.join(backupDir, latestFile);
  console.log(`📄 Loading backup from: ${latestFile}`);
  
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  try {
    console.log("🧹 Cleaning up existing data...");
    // Clear in reverse order of dependencies
    await prisma.teamInvite.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.registration.deleteMany({});
    await prisma.teamMember.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.otp.deleteMany({});
    await prisma.pendingRegistration.deleteMany({});
    await prisma.maintenanceSubscriber.deleteMany({});
    await prisma.maintenanceConfig.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("📥 Importing Users...");
    for (const item of data.users) {
      await prisma.user.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("📥 Importing Events...");
    for (const item of data.events) {
      await prisma.event.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("📥 Importing MaintenanceConfig...");
    for (const item of data.maintenanceConfig) {
      await prisma.maintenanceConfig.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("📥 Importing MaintenanceSubscribers...");
    for (const item of data.maintenanceSubscribers) {
      await prisma.maintenanceSubscriber.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("📥 Importing PendingRegistrations...");
    for (const item of data.pendingRegistrations) {
      await prisma.pendingRegistration.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("📥 Importing OTPs...");
    for (const item of data.otps) {
      await prisma.otp.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("📥 Importing Teams...");
    for (const item of data.teams) {
      await prisma.team.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("📥 Importing TeamMembers...");
    for (const item of data.teamMembers) {
      await prisma.teamMember.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("📥 Importing Registrations...");
    for (const item of data.registrations) {
      await prisma.registration.upsert({ where: { userId_eventId: { userId: item.userId, eventId: item.eventId } }, update: item, create: item });
    }

    console.log("📥 Importing Orders...");
    for (const item of data.orders) {
      await prisma.order.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("📥 Importing OrderItems...");
    for (const item of data.orderItems) {
      await prisma.orderItem.upsert({ where: { orderId_eventId: { orderId: item.orderId, eventId: item.eventId } }, update: item, create: item });
    }

    console.log("📥 Importing CartItems...");
    for (const item of data.cartItems) {
      await prisma.cartItem.upsert({ where: { userId_eventId: { userId: item.userId, eventId: item.eventId } }, update: item, create: item });
    }

    console.log("📥 Importing AuditLogs...");
    for (const item of data.auditLogs) {
      await prisma.auditLog.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("📥 Importing TeamInvites...");
    for (const item of data.teamInvites) {
      await prisma.teamInvite.upsert({ where: { id: item.id }, update: item, create: item });
    }

    console.log("\n✅ Database restoration completed successfully!");

  } catch (error) {
    console.error("❌ Restore failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

restore();
