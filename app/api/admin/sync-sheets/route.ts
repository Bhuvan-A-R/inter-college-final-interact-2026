import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, successResponse, errorResponse } from "@/lib/apiHelpers";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return errorResponse(
        "Google Sheets credentials are not configured in .env",
        500
      );
    }

    // 1. Fetch all events and their verified registrations
    const events = await prisma.event.findMany({
      where: { isActive: true },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                aadharNumber: true,
                usn: true,
                collegeIdNumber: true,
                phone: true,
                email: true,
                collegeName: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // 2. Initialize Google Sheets API
    const authClient = new google.auth.GoogleAuth({
      credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth: authClient });

    // 3. Get existing sheets to avoid duplicates and handle tab management
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    const existingSheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];

    // 4. Prepare batch updates (creating missing sheets)
    const requests: any[] = [];
    const sanitizedEventNames = new Map<string, string>();

    // Ensure "Master List" exists
    const MASTER_SHEET_NAME = "Master List";
    if (!existingSheetTitles.includes(MASTER_SHEET_NAME)) {
      requests.push({ addSheet: { properties: { title: MASTER_SHEET_NAME, index: 0 } } });
    }

    events.forEach((event) => {
      // Sanitize name for sheet title (limit 100 chars, remove forbidden chars)
      let sanitizedName = event.name.replace(/[\[\]\?\*\/\\\:]/g, "").substring(0, 31);
      if (!sanitizedName) sanitizedName = `Event_${event.id.substring(0, 8)}`;
      
      sanitizedEventNames.set(event.id, sanitizedName);

      if (!existingSheetTitles.includes(sanitizedName)) {
        requests.push({
          addSheet: {
            properties: {
              title: sanitizedName,
            },
          },
        });
      }
    });

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: { requests },
      });
    }

    // 5. Prepare data for "Master List"
    const valueData: any[] = [];
    
    // Aggregate unique users and their events
    const masterMap = new Map<string, { user: any; events: string[] }>();
    events.forEach((event) => {
      event.registrations.forEach((reg) => {
        if (!masterMap.has(reg.user.id)) {
          masterMap.set(reg.user.id, { user: reg.user, events: [] });
        }
        masterMap.get(reg.user.id)!.events.push(event.name);
      });
    });

    const masterHeaders = [
      "SL No", "Name", "USN", "College ID", "Aadhaar ID", "Phone", "Email", "College Name", "Registered Events", "Registered At"
    ];
    const masterRows = Array.from(masterMap.values()).map((data, index) => [
      index + 1,
      data.user.name,
      data.user.usn || "N/A",
      data.user.collegeIdNumber || "N/A",
      data.user.aadharNumber || "N/A",
      data.user.phone,
      data.user.email,
      data.user.collegeName,
      data.events.join(", "),
      new Date(data.user.createdAt).toLocaleString("en-IN"),
    ]);

    valueData.push({
      range: `${MASTER_SHEET_NAME}!A1`,
      values: [masterHeaders, ...masterRows],
    });

    // 6. Prepare data for each event sheet
    const eventHeaders = [
      "SL No", 
      "Student Name", 
      "USN", 
      "College ID Number", 
      "Aadhaar ID", 
      "Phone Number", 
      "Email", 
      "College Name", 
      "Registered At"
    ];

    events.forEach((event) => {
      const sanitizedName = sanitizedEventNames.get(event.id)!;
      const rows = event.registrations.map((reg, index) => [
        index + 1,
        reg.user.name,
        reg.user.usn || "N/A",
        reg.user.collegeIdNumber || "N/A",
        reg.user.aadharNumber || "N/A",
        reg.user.phone,
        reg.user.email,
        reg.user.collegeName,
        new Date(reg.user.createdAt).toLocaleString("en-IN"),
      ]);

      valueData.push({
        range: `${sanitizedName}!A1`,
        values: [eventHeaders, ...rows],
      });
    });

    // 7. Execute batch update for values
    // First, clear existing content in all relevant sheets to avoid old data trailing
    const clearRanges = [MASTER_SHEET_NAME, ...Array.from(sanitizedEventNames.values())].map(name => `${name}!A1:Z5000`);
    await sheets.spreadsheets.values.batchClear({
      spreadsheetId: SHEET_ID,
      requestBody: { ranges: clearRanges },
    });

    // Then write new data
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        valueInputOption: "RAW",
        data: valueData,
      },
    });

    return successResponse({ message: `Successfully synced ${events.length} events and Master List to Google Sheets` });
  } catch (error: any) {
    console.error("[POST /api/admin/sync-sheets]", error);
    return errorResponse(
      error.message || "Failed to sync to Google Sheets",
      500
    );
  }
}
