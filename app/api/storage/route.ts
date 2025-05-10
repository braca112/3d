import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserStorage } from "@/lib/models"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const storage = await getUserStorage()

    return NextResponse.json(storage)
  } catch (error) {
    console.error("Error fetching storage:", error)
    return NextResponse.json({ message: "Failed to fetch storage data" }, { status: 500 })
  }
}
