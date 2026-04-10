import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/authCookie";
import { errorResponse, successResponse } from "@/lib/apiHelpers";
import { sendPaymentUploadReceivedEmail } from "@/lib/email";
import { utapi } from "@/app/api/uploadthing/uploadthing";

function getFieldValue(formData: FormData, keys: string[]): string {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

// POST /upload-transaction — Submit payment proof by email
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    const formData = await req.formData();

    const email = getFieldValue(formData, ["email"])
      .toLowerCase()
      .trim();
    const upiTransactionId = getFieldValue(formData, [
      "transaction_id",
      "transactionId",
      "upiTransactionId",
    ]);

    if (!email) {
      return errorResponse("Email is required.", 400);
    }
    if (!upiTransactionId) {
      return errorResponse("Transaction ID is required.", 400);
    }

    if (session?.email && session.email.toLowerCase() !== email) {
      return errorResponse("Forbidden.", 403);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      return errorResponse("User not found.", 404);
    }

    const order = await prisma.order.findFirst({
      where: { userId: user.id, status: "PENDING_PAYMENT" },
      orderBy: { createdAt: "desc" },
    });

    if (!order) {
      return errorResponse("No pending order found for this user.", 404);
    }

    const fileEntry = formData.get("screenshot");
    let paymentScreenshotUrl = getFieldValue(formData, ["screenshotUrl"]);

    if (!paymentScreenshotUrl && fileEntry instanceof File) {
      const uploadResult = await (utapi as any).uploadFiles([fileEntry]);
      const first = Array.isArray(uploadResult) ? uploadResult[0] : uploadResult;
      paymentScreenshotUrl =
        first?.data?.ufsUrl ||
        first?.data?.url ||
        first?.data?.fileUrl ||
        first?.url ||
        "";
    }

    if (!paymentScreenshotUrl) {
      return errorResponse("Payment screenshot is required.", 400);
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        upiTransactionId,
        paymentScreenshotUrl,
        paymentSubmittedAt: new Date(),
        status: "PAYMENT_SUBMITTED",
      },
    });

    if (user.email) {
      try {
        await sendPaymentUploadReceivedEmail(user.email);
      } catch (emailError) {
        console.error("[upload-transaction email]", emailError);
      }
    }

    return successResponse(
      { orderId: updated.id, status: updated.status },
      201,
      "Payment submitted successfully."
    );
  } catch (error) {
    console.error("[POST /upload-transaction]", error);
    return errorResponse("Internal server error.", 500);
  }
}
