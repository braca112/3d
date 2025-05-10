import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { list, del } from "@vercel/blob"

export async function getGeneratedModels() {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  const models = await db.model.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return models
}

export async function saveGeneratedModel(prompt: string, modelUrl: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  return db.model.create({
    data: {
      prompt,
      modelUrl,
      userId: session.user.id,
    },
  })
}

export async function deleteModel(modelId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  // Get the model to find the blob URL
  const model = await db.model.findFirst({
    where: {
      id: modelId,
      userId: session.user.id,
    },
  })

  if (!model) {
    throw new Error("Model not found or you don't have permission to delete it")
  }

  // Delete the blob from Vercel Blob storage
  try {
    // Extract the blob URL path from the full URL
    const url = new URL(model.modelUrl)
    const pathname = url.pathname
    const blobPath = pathname.startsWith("/") ? pathname.substring(1) : pathname

    await del(blobPath)
  } catch (error) {
    console.error("Error deleting blob:", error)
    // Continue with database deletion even if blob deletion fails
  }

  // Delete the model from the database
  return db.model.delete({
    where: {
      id: modelId,
    },
  })
}

export async function getUserUsage() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      isPremium: true,
      usageCount: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  return {
    used: user.usageCount,
    limit: 5, // Free tier limit
    isPremium: user.isPremium,
  }
}

export async function incrementUsage() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  return db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      usageCount: {
        increment: 1,
      },
    },
  })
}

export async function getUserStorage() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  // List all blobs for this user
  const blobs = await list({
    prefix: `${session.user.id}/`,
  })

  // Calculate total storage used in bytes
  const totalBytes = blobs.blobs.reduce((total, blob) => total + blob.size, 0)

  // Convert to MB for easier reading
  const totalMB = totalBytes / (1024 * 1024)

  return {
    totalMB: Number.parseFloat(totalMB.toFixed(2)),
    count: blobs.blobs.length,
    // 100MB free storage limit (this is an example, adjust based on your actual limits)
    limit: 100,
  }
}
