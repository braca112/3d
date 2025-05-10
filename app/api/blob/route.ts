import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { filename, contentType } = await request.json()

    // Create a unique filename to avoid collisions
    const uniqueFilename = `${session.user.id}/${filename}`

    // Get a URL for uploading to Vercel Blob
    const { url, blob } = await put(uniqueFilename, {
      access: "public",
      contentType,
    })

    return NextResponse.json({ url, blob })
  } catch (error) {
    console.error("Error in blob route:", error)
    return NextResponse.json({ error: "Failed to get upload URL" }, { status: 500 })
  }
}
