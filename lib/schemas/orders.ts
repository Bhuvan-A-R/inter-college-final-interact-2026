import { z } from "zod";

export const submitPaymentSchema = z.object({
  upiTransactionId: z.string().min(1, "UPI transaction ID is required"),
  paymentScreenshotUrl: z.string().url("A valid screenshot URL is required"),
});

export const verifyPaymentSchema = z.object({
  // No extra fields needed — action is implicit via the route
});

export const rejectPaymentSchema = z.object({
  REJECTED_REASON: z.string().min(1, "Rejection reason is required"),
});

export const adminVerifySchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  action: z.enum(["APPROVED", "REJECTED"]),
  REJECTED_REASON: z.string().optional(),
});
