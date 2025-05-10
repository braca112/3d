import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { modelId } = await req.json()

    if (!modelId) {
      return NextResponse.json({ message: "Model ID is required" }, { status: 400 })
    }

    // Check if the model exists and belongs to the user
    const model = await db.model.findFirst({
      where: {
        id: modelId,
        userId: session.user.id,
      },
    })

    if (!model) {
      return NextResponse.json({ message: "Model not found" }, { status: 404 })
    }

    // Generate a unique share ID
    const shareId = Math.random().toString(36).substring(2, 15)

    // Update the model with the share ID
    await db.model.update({
      where: {
        id: modelId,
      },
      data: {
        shareId,
        isPublic: true,
      },
    })

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareId}`

    return NextResponse.json({ shareUrl })
  } catch (error) {
    console.error("Error sharing model:", error)
    return NextResponse.json({ message: "Failed to share model" }, { status: 500 })
  }
}
