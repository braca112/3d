import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { put } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { modelUrl } = await req.json()

    if (!modelUrl) {
      return NextResponse.json({ message: "Model URL is required" }, { status: 400 })
    }

    // Fetch the model data
    const response = await fetch(modelUrl)
    const modelData = await response.json()

    // In a real implementation, we would convert the model to GLB format here
    // For this demo, we'll just return the original model URL
    // In a production app, you would use a library like Three.js to convert the model

    const filename = `${session.user.id}-${uuidv4()}.glb`

    // This is a placeholder - in a real app, you would generate an actual GLB file
    const blob = await put(filename, JSON.stringify(modelData), {
      access: "public",
      contentType: "model/gltf-binary",
    })

    return NextResponse.json({ exportUrl: blob.url })
  } catch (error) {
    console.error("Error exporting model:", error)
    return NextResponse.json({ message: "Failed to export model" }, { status: 500 })
  }
}
