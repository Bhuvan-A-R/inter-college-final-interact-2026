import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function backup() {
  console.log("🚀 Starting database backup...");
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(process.cwd(), "backups");
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

  try {
    const data: any = {};

    // Fetch all models
    console.log("📦 Fetching Users...");
    data.users = await prisma.user.findMany();
    
    console.log("📦 Fetching Events...");
    data.events = await prisma.event.findMany();
    
    console.log("📦 Fetching Teams...");
    data.teams = await prisma.team.findMany();
    
    console.log("📦 Fetching TeamMembers...");
    data.teamMembers = await prisma.teamMember.findMany();
    
    console.log("📦 Fetching Orders...");
    data.orders = await prisma.order.findMany();
    
    console.log("📦 Fetching OrderItems...");
    data.orderItems = await prisma.orderItem.findMany();
    
    console.log("📦 Fetching Registrations...");
    data.registrations = await prisma.registration.findMany();
    
    console.log("📦 Fetching CartItems...");
    data.cartItems = await prisma.cartItem.findMany();
    
    console.log("📦 Fetching AuditLogs...");
    data.auditLogs = await prisma.auditLog.findMany();
    
    console.log("📦 Fetching MaintenanceConfig...");
    data.maintenanceConfig = await prisma.maintenanceConfig.findMany();
    
    console.log("📦 Fetching MaintenanceSubscribers...");
    data.maintenanceSubscribers = await prisma.maintenanceSubscriber.findMany();
    
    console.log("📦 Fetching TeamInvites...");
    data.teamInvites = await prisma.teamInvite.findMany();

    console.log("📦 Fetching OTPs...");
    data.otps = await prisma.otp.findMany();

    console.log("📦 Fetching PendingRegistrations...");
    data.pendingRegistrations = await prisma.pendingRegistration.findMany();

    // Write to file
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
    
    console.log(`\n✅ Backup completed successfully!`);
    console.log(`📄 File saved at: ${backupFile}`);
    console.log(`📊 Total size: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error("❌ Backup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

backup();
