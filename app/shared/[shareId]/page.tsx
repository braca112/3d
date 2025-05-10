import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import SharedModelClientPage from "./SharedModelClientPage"
import type { Metadata } from "next"

interface SharedModelPageProps {
  params: { shareId: string }
}

export async function generateMetadata({ params }: SharedModelPageProps): Promise<Metadata> {
  const { shareId } = params

  const model = await db.model.findFirst({
    where: {
      shareId,
      isPublic: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!model) {
    return {
      title: "Model Not Found",
      description: "The requested 3D model could not be found.",
    }
  }

  return {
    title: `${model.prompt} - 3D Model by ${model.user.name}`,
    description: `View this 3D model created by ${model.user.name} using AI.`,
    openGraph: {
      title: `${model.prompt} - 3D Model by ${model.user.name}`,
      description: `View this 3D model created by ${model.user.name} using AI.`,
      type: "website",
    },
  }
}

export default async function SharedModelPage({ params }: SharedModelPageProps) {
  const { shareId } = params

  // Find the shared model
  const model = await db.model.findFirst({
    where: {
      shareId,
      isPublic: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!model) {
    notFound()
  }

  return <SharedModelClientPage model={model} />
}
