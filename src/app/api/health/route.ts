import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // DB Check
    await prisma.$queryRaw`SELECT 1`;

    const status = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "up",
        storage: "up", // placeholder for uploadthing check
      },
      system: {
        memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        uptime: `${Math.round(process.uptime())}s`,
      }
    };

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: "Database unreachable" },
      { status: 503 }
    );
  }
}
