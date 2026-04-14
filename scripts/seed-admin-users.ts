import bcrypt from "bcrypt";
import prisma from "../lib/db";
import { adminDepartmentSeed } from "../data/adminSeed";

async function main() {
  for (const dept of adminDepartmentSeed) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: dept.email }, { phone: dept.phone }, { collegeName: dept.collegeName }],
      },
    });

    if (existingUser) {
      console.log(`Skipping existing admin account for ${dept.deptName} (${dept.email})`);
      continue;
    }

    const password = dept.password ?? "Admin@1234";
    const hashedPassword = await bcrypt.hash(password, 13);
    const role = dept.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "REG_ADMIN";

    await prisma.user.create({
      data: {
        name: dept.spocName ?? dept.deptName,
        collegeName: dept.collegeName,
        email: dept.email,
        phone: dept.phone,
        password: hashedPassword,
        role,
      },
    });

    console.log(`Created ADMIN user for ${dept.deptName} (${dept.email})`);
  }
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
