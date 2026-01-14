import { NextResponse } from "next/server";
import { testConnection } from "@/lib/db/connection";

export async function GET() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        database: dbConnected ? "connected" : "disconnected",
      },
      { status: dbConnected ? 200 : 503 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
