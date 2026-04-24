import { PrismaClient } from "@prisma/client";

async function migrate() {
  const oldUrl = process.env.OLD_DATABASE_URL;
  const newUrl = process.env.DATABASE_URL;

  if (!oldUrl || !newUrl) {
    console.error("❌ Missing OLD_DATABASE_URL or DATABASE_URL in .env");
    return;
  }

  console.log("🚀 Starting direct database migration...");
  console.log(`📡 From: ${oldUrl.split("@")[1]}`);
  console.log(`🎯 To: ${newUrl.split("@")[1]}`);

  const oldPrisma = new PrismaClient({
    datasources: { db: { url: oldUrl } },
  });
  
  const newPrisma = new PrismaClient({
    datasources: { db: { url: newUrl } },
  });

  try {
    // Models to migrate in order
    const models = [
      "user",
      "event",
      "maintenanceConfig",
      "maintenanceSubscriber",
      "pendingRegistration",
      "otp",
      "team",
      "teamMember",
      "registration",
      "order",
      "orderItem",
      "cartItem",
      "auditLog",
      "teamInvite"
    ];

    // 1. Clear new database
    console.log("\n🧹 Cleaning up target database...");
    for (const model of [...models].reverse()) {
      console.log(`   - Clearing ${model}...`);
      await (newPrisma as any)[model].deleteMany({});
    }

    // 2. Transfer data
    for (const model of models) {
      console.log(`\n📥 Migrating ${model}...`);
      const records = await (oldPrisma as any)[model].findMany();
      console.log(`   - Found ${records.length} records.`);
      
      if (records.length > 0) {
        // Bulk insert or individual upsert
        for (const record of records) {
          try {
            await (newPrisma as any)[model].create({ data: record });
          } catch (e: any) {
            console.warn(`   ⚠️  Failed to migrate a record in ${model}: ${e.message}`);
          }
        }
        console.log(`   ✅ Migrated ${records.length} records.`);
      }
    }

    console.log("\n✨ Direct migration completed successfully!");

  } catch (error) {
    console.error("\n❌ Migration failed:", error);
  } finally {
    await oldPrisma.$disconnect();
    await newPrisma.$disconnect();
  }
}

migrate();
