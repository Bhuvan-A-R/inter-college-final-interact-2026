import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setTimezone() {
  console.log("🌍 Setting database timezone to IST (Asia/Kolkata)...");
  
  try {
    // This sets the timezone for the entire database globally
    await prisma.$executeRawUnsafe(`ALTER DATABASE neondb SET timezone TO 'Asia/Kolkata';`);
    
    // This sets it for the current user (just in case)
    await prisma.$executeRawUnsafe(`ALTER ROLE neondb_owner SET timezone TO 'Asia/Kolkata';`);
    
    console.log("✅ Timezone updated successfully!");
    
    // Verify
    const result = await prisma.$queryRaw`SHOW TIMEZONE;`;
    console.log("📊 Current Database Timezone:", result);

  } catch (error) {
    console.error("❌ Failed to update timezone:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setTimezone();
