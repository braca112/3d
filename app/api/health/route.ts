import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`

    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Service unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
