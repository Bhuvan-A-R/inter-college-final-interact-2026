import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, successResponse, errorResponse } from "@/lib/apiHelpers";
import { google } from "googleapis";

export const maxDuration = 60; // Allow more time for Google Sheets API

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const SHEET_ID = "1aVhpkcvCdCHHtiUZlD2jHrWjxpbf22TfBrDfvwSIF-o";
    const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!CLIENT_EMAIL || !PRIVATE_KEY) {
      return errorResponse("Missing Google Sheets credentials in .env", 500);
    }

    const users = await prisma.user.findMany({
      select: { 
        collegeName: true,
        id: true,
        orders: {
          select: {
            status: true
          }
        }
      },
    });

    const collegeStats = new Map<string, { totalUsers: number, approvedPayments: number, pendingPayments: number }>();

    for (const user of users) {
      if (!user.collegeName) continue;
      const college = user.collegeName.trim().replace(/\s+/g, " ").toUpperCase();
      if (!college) continue;

      if (!collegeStats.has(college)) {
        collegeStats.set(college, { totalUsers: 0, approvedPayments: 0, pendingPayments: 0 });
      }

      const stats = collegeStats.get(college)!;
      stats.totalUsers++;

      let hasApproved = false;

      for (const order of user.orders) {
        if (order.status === "VERIFIED") hasApproved = true;
      }

      if (hasApproved) {
        stats.approvedPayments++;
      } else {
        stats.pendingPayments++;
      }
    }

    const uniqueColleges = Array.from(collegeStats.keys()).sort();

    const authClient = new google.auth.GoogleAuth({
      credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth: authClient });

    const rows = [
      ["Interact 2026 Inter College MARKETING Dashboard Data"],
      [`Last Synced: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true, dateStyle: "medium", timeStyle: "short" })} IST`],
      [],
      ["SL No", "College Name", "Total Registrations", "Approved Payments", "Pending / Left to Pay"]
    ];

    uniqueColleges.forEach((c, index) => {
      const stats = collegeStats.get(c)!;
      rows.push([
        (index + 1).toString(),
        c,
        stats.totalUsers.toString(),
        stats.approvedPayments.toString(),
        stats.pendingPayments.toString()
      ]);
    });

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title || "Sheet1";
    const sheetId = spreadsheet.data.sheets?.[0]?.properties?.sheetId;

    // Clear sheet first
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SHEET_ID,
      range: `'${sheetTitle}'!A1:Z1000`
    });

    // Write new data
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `'${sheetTitle}'!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rows
      }
    });

    if (sheetId !== undefined) {
      try {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          requestBody: {
            requests: [
              {
                autoResizeDimensions: {
                  dimensions: {
                    sheetId: sheetId,
                    dimension: "COLUMNS",
                    startIndex: 0,
                    endIndex: 5
                  }
                }
              },
              {
                mergeCells: {
                  range: {
                    sheetId: sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: 5,
                  },
                  mergeType: "MERGE_ALL",
                }
              },
              {
                mergeCells: {
                  range: {
                    sheetId: sheetId,
                    startRowIndex: 1,
                    endRowIndex: 2,
                    startColumnIndex: 0,
                    endColumnIndex: 5,
                  },
                  mergeType: "MERGE_ALL",
                }
              }
            ]
          }
        });
      } catch(e) {
        console.log("Failed to resize/merge columns, but data was written.");
      }
    }

    return successResponse({ message: `Successfully synced marketing data for ${uniqueColleges.length} colleges` });
  } catch (error: any) {
    console.error("[POST /api/admin/sync-colleges]", error);
    return errorResponse(error.message || "Failed to sync to Google Sheets", 500);
  }
}
