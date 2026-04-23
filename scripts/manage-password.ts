// scripts/manage-password.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const action = process.argv[2]; // 'verify' or 'reset'
  const email = process.argv[3];
  const value = process.argv[4]; // password to check OR new password to set

  if (!action || !email || !value) {
    console.log("Usage:");
    console.log("  Check if a password matches a hash: npx ts-node scripts/manage-password.ts verify <email> <password_to_check>");
    console.log("  Reset a user's password:          npx ts-node scripts/manage-password.ts reset <email> <new_password>");
    return;
  }

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User with email ${email} not found.`);
    return;
  }

  if (action === "verify") {
    const isMatch = await bcrypt.compare(value, user.password);
    if (isMatch) {
      console.log("✅ MATCH! The password is correct.");
    } else {
      console.log("❌ NO MATCH. That is not the password.");
    }
  } else if (action === "reset") {
    const hashedPassword = await bcrypt.hash(value, 13);
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });
    console.log(`✅ SUCCESS! Password for ${email} has been updated to: ${value}`);
  } else {
    console.log("Unknown action. Use 'verify' or 'reset'.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
