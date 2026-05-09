import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching order items...");
  const orderItems = await prisma.orderItem.findMany({
    include: {
      order: {
        include: { user: true }
      },
      event: true
    }
  });

  console.log("Fetching cart items...");
  const cartItems = await prisma.cartItem.findMany({
    include: {
      user: true,
      event: true
    }
  });

  type Row = {
    "User Name": string;
    "Email": string;
    "Phone": string;
    "College": string;
    "Event": string;
    "Status": string;
  };

  const rows: Row[] = [];
  const seenUserEvents = new Set<string>(); // "userId|eventId"

  // Process Orders first (higher priority)
  for (const item of orderItems) {
    const user = item.order.user;
    const college = user.collegeName.trim().replace(/\s+/g, " ").toUpperCase();
    if (!college) continue;

    const eventName = item.event.name;
    const status = item.order.status;

    let humanStatus = status;
    if (status === "VERIFIED") humanStatus = "Paid";
    else if (status === "PAYMENT_SUBMITTED") humanStatus = "In Review";
    else if (status === "PENDING_PAYMENT") humanStatus = "Pending";
    else if (status === "REJECTED") humanStatus = "Rejected";

    const key = `${user.id}|${item.eventId}`;
    seenUserEvents.add(key);

    rows.push({
      "User Name": user.name,
      "Email": user.email,
      "Phone": user.phone || "",
      "College": college,
      "Event": eventName,
      "Status": humanStatus
    });
  }

  // Process Cart Items
  for (const item of cartItems) {
    const user = item.user;
    const college = user.collegeName.trim().replace(/\s+/g, " ").toUpperCase();
    if (!college) continue;

    const eventName = item.event.name;
    const key = `${user.id}|${item.eventId}`;

    // If we already saw this user-event in orders, skip the cart item
    if (seenUserEvents.has(key)) continue;

    rows.push({
      "User Name": user.name,
      "Email": user.email,
      "Phone": user.phone || "",
      "College": college,
      "Event": eventName,
      "Status": "In Cart"
    });
  }

  // Sort by College, then Event, then User Name
  rows.sort((a, b) => {
    const collegeCompare = a.College.localeCompare(b.College);
    if (collegeCompare !== 0) return collegeCompare;
    
    const eventCompare = a.Event.localeCompare(b.Event);
    if (eventCompare !== 0) return eventCompare;
    
    return a["User Name"].localeCompare(b["User Name"]);
  });

  console.log(`Processing ${rows.length} records...`);

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Participation Details");

  // Define output path
  const outputPath = path.join(process.cwd(), "college_participation.xlsx");
  
  // Write file
  XLSX.writeFile(workbook, outputPath);
  
  console.log(`\nExcel file generated successfully at: ${outputPath}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
