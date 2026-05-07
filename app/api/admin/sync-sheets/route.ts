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
        teams: {
          select: {
            id: true,
            name: true,
            members: {
              select: {
                userId: true,
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

    // Ensure "Dashboard" and "Master List" exist
    const INDEX_SHEET_NAME = "Dashboard";
    const MASTER_SHEET_NAME = "Master List";
    if (!existingSheetTitles.includes(INDEX_SHEET_NAME)) {
      requests.push({ addSheet: { properties: { title: INDEX_SHEET_NAME, index: 0 } } });
    }
    if (!existingSheetTitles.includes(MASTER_SHEET_NAME)) {
      requests.push({ addSheet: { properties: { title: MASTER_SHEET_NAME, index: 1 } } });
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

    // Refetch the spreadsheet to get all sheet IDs including newly created ones
    const updatedSpreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    const allSheets = updatedSpreadsheet.data.sheets || [];
    
    // Create a map from sheet Title to sheetId
    const titleToIdMap = new Map<string, number>();
    allSheets.forEach(s => {
      if (s.properties?.title && s.properties?.sheetId !== undefined) {
        titleToIdMap.set(s.properties.title, s.properties.sheetId);
      }
    });

    // 5. Prepare data for "Dashboard" (Index)
    const valueData: any[] = [];
    
    const indexHeaders = ["SL No", "Event Name", "Event Type", "Total Registrations", "Total Teams", "Link to Sheet"];
    const indexRows = events.map((event, index) => {
      const sanitizedName = sanitizedEventNames.get(event.id)!;
      const sheetId = titleToIdMap.get(sanitizedName);
      const linkFormula = sheetId !== undefined 
        ? `=HYPERLINK("#gid=${sheetId}", "View Event")` 
        : "View Event";
      
      return [
        index + 1,
        event.name,
        event.type,
        event.registrations.length,
        event.type === "TEAM" ? event.teams.length : "N/A",
        linkFormula
      ];
    });

    valueData.push({
      range: `'${INDEX_SHEET_NAME}'!A1`,
      values: [
        ["Interact 2026 Inter College Event Dashboard Data"],
        [`Last Synced: ${new Date().toLocaleString("en-IN")}`],
        [],
        [],
        indexHeaders,
        ...indexRows
      ],
    });

    // 6. Prepare data for "Master List"
    const masterHeaders = [
      "SL No", "Event Name", "Event Type", "Team Name", "Participant Name", "USN", "College ID", "Aadhaar ID", "Phone", "Email", "College Name", "Registered At"
    ];
    
    const masterRows: any[] = [];
    let masterSlNo = 1;
    
    events.forEach(event => {
      event.registrations.forEach(reg => {
        const team = event.teams.find(t => t.members.some(m => m.userId === reg.user.id));
        const teamName = team ? team.name : (event.type === "TEAM" ? "Pending/No Team" : "N/A");
        
        masterRows.push([
          masterSlNo++,
          event.name,
          event.type,
          teamName,
          reg.user.name,
          reg.user.usn || "N/A",
          reg.user.collegeIdNumber || "N/A",
          reg.user.aadharNumber || "N/A",
          reg.user.phone,
          reg.user.email,
          reg.user.collegeName,
          new Date(reg.user.createdAt).toLocaleString("en-IN"),
        ]);
      });
    });

    valueData.push({
      range: `'${MASTER_SHEET_NAME}'!A1`,
      values: [masterHeaders, ...masterRows],
    });

    // 7. Prepare data for each event sheet
    const eventHeaders = [
      "SL No", 
      "Team Name",
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
      const rows = event.registrations.map((reg, index) => {
        const team = event.teams.find(t => t.members.some(m => m.userId === reg.user.id));
        const teamName = team ? team.name : (event.type === "TEAM" ? "Pending/No Team" : "N/A");
        
        return [
          index + 1,
          teamName,
          reg.user.name,
          reg.user.usn || "N/A",
          reg.user.collegeIdNumber || "N/A",
          reg.user.aadharNumber || "N/A",
          reg.user.phone,
          reg.user.email,
          reg.user.collegeName,
          new Date(reg.user.createdAt).toLocaleString("en-IN"),
        ];
      });

      valueData.push({
        range: `'${sanitizedName}'!A1`,
        values: [eventHeaders, ...rows],
      });
    });

    // 8. Execute batch update for values
    // First, clear existing content in all relevant sheets to avoid old data trailing
    const clearRanges = [INDEX_SHEET_NAME, MASTER_SHEET_NAME, ...Array.from(sanitizedEventNames.values())].map(name => `'${name}'!A1:Z5000`);
    await sheets.spreadsheets.values.batchClear({
      spreadsheetId: SHEET_ID,
      requestBody: { ranges: clearRanges },
    });

    // Then write new data
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: valueData,
      },
    });

    // 9. Auto-resize columns and merge Dashboard title
    const autoResizeRequests: any[] = allSheets.map(sheet => {
      return {
        autoResizeDimensions: {
          dimensions: {
            sheetId: sheet.properties?.sheetId,
            dimension: "COLUMNS",
            startIndex: 0,
            endIndex: 15 // Resize first 15 columns
          }
        }
      };
    });

    const dashboardSheetId = titleToIdMap.get(INDEX_SHEET_NAME);
    if (dashboardSheetId !== undefined) {
      autoResizeRequests.push({
        mergeCells: {
          range: {
            sheetId: dashboardSheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 6,
          },
          mergeType: "MERGE_ALL",
        }
      });
      autoResizeRequests.push({
        mergeCells: {
          range: {
            sheetId: dashboardSheetId,
            startRowIndex: 1,
            endRowIndex: 2,
            startColumnIndex: 0,
            endColumnIndex: 6,
          },
          mergeType: "MERGE_ALL",
        }
      });
    }

    if (autoResizeRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: { requests: autoResizeRequests },
      });
    }

    return successResponse({ message: `Successfully synced ${events.length} events and Master List to Google Sheets` });
  } catch (error: any) {
    console.error("[POST /api/admin/sync-sheets]", error);
    return errorResponse(
      error.message || "Failed to sync to Google Sheets",
      500
    );
  }
}
