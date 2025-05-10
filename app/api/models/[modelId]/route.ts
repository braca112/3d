import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { deleteModel } from "@/lib/models"

export async function DELETE(req: Request, { params }: { params: { modelId: string } }) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { modelId } = params

    // Delete the model and associated blob
    await deleteModel(modelId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting model:", error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to delete model",
      },
      { status: 500 },
    )
  }
}
