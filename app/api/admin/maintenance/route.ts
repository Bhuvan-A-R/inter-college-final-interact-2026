import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import redis from "@/lib/upstash";

export async function GET() {
  try {
    const config = await prisma.maintenanceConfig.findUnique({
      where: { id: "singleton" },
    });
    
    // Return a default empty config if not found instead of 500
    if (!config) {
      return NextResponse.json({ 
        success: true, 
        config: { startTime: null, endTime: null, isActive: false } 
      });
    }
    
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error("Maintenance GET error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch config",
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { startTime, endTime, isActive } = await request.json();

    const config = await prisma.maintenanceConfig.upsert({
      where: { id: "singleton" },
      update: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isActive,
      },
      create: {
        id: "singleton",
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isActive,
      },
    });

    // Sync to Redis for middleware if available
    if (redis) {
      await redis.set("maintenance:config", JSON.stringify(config));
    }

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error("Maintenance config error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update config" },
      { status: 500 }
    );
  }
}
