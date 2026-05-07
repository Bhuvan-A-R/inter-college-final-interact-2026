
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      orders: true,
      cartItems: true,
    },
  });

  const pendingPaymentEmails = [];
  const rejectedEmails = [];
  const noOrderButCartEmails = [];
  const noOrderNoCartEmails = [];

  for (const user of users) {
    const hasVerified = user.orders.some(o => o.status === 'VERIFIED');
    if (hasVerified) continue;

    const hasSubmitted = user.orders.some(o => o.status === 'PAYMENT_SUBMITTED');
    
    const pendingOrders = user.orders.filter(o => o.status === 'PENDING_PAYMENT');
    const rejectedOrders = user.orders.filter(o => o.status === 'REJECTED');

    if (pendingOrders.length > 0) {
      pendingPaymentEmails.push(user.email);
    } else if (rejectedOrders.length > 0) {
      rejectedEmails.push(user.email);
    } else if (user.cartItems.length > 0) {
      noOrderButCartEmails.push(user.email);
    } else {
      noOrderNoCartEmails.push(user.email);
    }
  }

  console.log(`Summary of Unpaid Users (excluding those with ANY verified order):`);
  console.log(`1. Pending Payment (No Submission): ${pendingPaymentEmails.length}`);
  console.log(`2. Rejected: ${rejectedEmails.length}`);
  console.log(`3. Cart Only (No Order): ${noOrderButCartEmails.length}`);
  console.log(`4. Registered Only (No Order, No Cart): ${noOrderNoCartEmails.length}`);

  const targetEmails = [...new Set([...pendingPaymentEmails, ...rejectedEmails])];
  console.log(`\n--- Target Emails (Pending or Rejected) [${targetEmails.length}] ---`);
  console.log(targetEmails.join(", "));

  console.log(`\n--- All Unpaid Emails (Pending, Rejected, Cart Only, or Just Registered) [${pendingPaymentEmails.length + rejectedEmails.length + noOrderButCartEmails.length + noOrderNoCartEmails.length}] ---`);
  console.log([...pendingPaymentEmails, ...rejectedEmails, ...noOrderButCartEmails, ...noOrderNoCartEmails].join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
