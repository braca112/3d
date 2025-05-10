import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserUsage } from "@/lib/models"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const usage = await getUserUsage()

    return NextResponse.json(usage)
  } catch (error) {
    console.error("Error fetching usage:", error)
    return NextResponse.json({ message: "Failed to fetch usage data" }, { status: 500 })
  }
}
