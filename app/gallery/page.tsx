import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ModelViewer } from "@/components/model-viewer"

export default async function GalleryPage() {
  // Get public models
  const models = await db.model.findMany({
    where: {
      isPublic: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  })

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Public Gallery</h1>
        <p className="mt-6 text-xl text-muted-foreground">Explore amazing 3D models created by our community.</p>
      </div>

      {models.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">No public models available yet.</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Create Your Own</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <Card key={model.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg truncate">{model.prompt}</CardTitle>
                <CardDescription>
                  By {model.user.name} • {new Date(model.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[200px] w-full">
                  <ModelViewer modelUrl={model.modelUrl} />
                </div>
              </CardContent>
              <div className="p-4">
                <Link href={`/shared/${model.shareId}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
