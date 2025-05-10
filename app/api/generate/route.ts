import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserUsage, incrementUsage, saveGeneratedModel } from "@/lib/models"
import { generateModel } from "@/lib/model-generator"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ message: "Invalid prompt" }, { status: 400 })
    }

    // Check usage limits
    const usage = await getUserUsage()

    if (usage.used >= usage.limit && !usage.isPremium) {
      return NextResponse.json(
        { message: "You've reached your free tier limit. Please upgrade to continue." },
        { status: 403 },
      )
    }

    // Generate the 3D model
    const modelUrl = await generateModel(prompt)

    // Save the model to the database
    await saveGeneratedModel(prompt, modelUrl)

    // Increment usage count
    await incrementUsage()

    return NextResponse.json({ modelUrl })
  } catch (error) {
    console.error("Error generating model:", error)
    return NextResponse.json({ message: "Failed to generate model" }, { status: 500 })
  }
}
