import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getGeneratedModels } from "@/lib/models"
import { Card, CardContent } from "@/components/ui/card"
import { UsageStats } from "@/components/usage-stats"
import { StorageStats } from "@/components/storage-stats"
import { ModelGallery } from "@/components/model-gallery"

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  const models = await getGeneratedModels()

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      <div className="grid gap-8">
        <div className="grid gap-6 md:grid-cols-2">
          <UsageStats />
          <StorageStats />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Your Generated Models</h2>
          {models.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  You haven't generated any models yet. Go to the home page to create your first model!
                </p>
              </CardContent>
            </Card>
          ) : (
            <ModelGallery models={models} />
          )}
        </div>
      </div>
    </main>
  )
}
