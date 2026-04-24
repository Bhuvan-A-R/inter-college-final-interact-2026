import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await prisma.maintenanceConfig.findUnique({
      where: { id: "singleton" },
    });
    
    if (!config) {
      return NextResponse.json({ 
        isActive: false, 
        startTime: null, 
        endTime: null 
      });
    }
    
    return NextResponse.json({ 
      isActive: config.isActive, 
      startTime: config.startTime, 
      endTime: config.endTime 
    });
  } catch (error) {
    return NextResponse.json({ isActive: false }, { status: 500 });
  }
}
