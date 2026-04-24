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

    // Convert back to IST string for the input fields
    const toISTString = (date: Date) => {
      const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
      return istDate.toISOString().slice(0, 16);
    };
    
    return NextResponse.json({ 
      success: true, 
      config: {
        ...config,
        startTime: config.startTime ? toISTString(config.startTime) : null,
        endTime: config.endTime ? toISTString(config.endTime) : null,
      } 
    });
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

    // Force IST offset (+05:30) if not provided
    const forceIST = (dateStr: string) => {
      if (!dateStr) return null;
      return dateStr.includes("+") || dateStr.includes("Z") 
        ? new Date(dateStr) 
        : new Date(`${dateStr}:00+05:30`);
    };

    const config = await prisma.maintenanceConfig.upsert({
      where: { id: "singleton" },
      update: {
        startTime: forceIST(startTime)!,
        endTime: forceIST(endTime)!,
        isActive,
      },
      create: {
        id: "singleton",
        startTime: forceIST(startTime)!,
        endTime: forceIST(endTime)!,
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
