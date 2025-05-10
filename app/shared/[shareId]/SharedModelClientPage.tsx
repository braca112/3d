"use client"

import { ModelViewer } from "@/components/model-viewer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SharedModelPageProps {
  model: {
    prompt: string
    user: { name: string }
    createdAt: Date
    modelUrl: string
  }
}

export default function SharedModelClientPage({ model }: SharedModelPageProps) {
  return (
    <main className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{model.prompt}</CardTitle>
          <CardDescription>
            Created by {model.user.name} on {new Date(model.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[400px] w-full">
            <ModelViewer modelUrl={model.modelUrl} />
          </div>

          <div className="flex justify-between">
            <Link href="/">
              <Button variant="outline">Create Your Own</Button>
            </Link>
            <Button variant="outline" onClick={() => window.open(model.modelUrl, "_blank")}>
              Download Model
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
