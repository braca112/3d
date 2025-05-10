"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ModelViewer } from "@/components/model-viewer"
import { Share2, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Model {
  id: string
  prompt: string
  modelUrl: string
  createdAt: string
  isPublic: boolean
  shareId: string | null
}

interface ModelGalleryProps {
  models: Model[]
}

export function ModelGallery({ models }: ModelGalleryProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleShare = async (modelId: string) => {
    try {
      const response = await fetch("/api/share-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ modelId }),
      })

      if (!response.ok) {
        throw new Error("Failed to share model")
      }

      const { shareUrl } = await response.json()
      setShareUrl(shareUrl)
      setIsShareDialogOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share model",
        variant: "destructive",
      })
    }
  }

  const handleExport = async (modelUrl: string) => {
    try {
      const response = await fetch("/api/export-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ modelUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to export model")
      }

      const { exportUrl } = await response.json()
      window.open(exportUrl, "_blank")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export model",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedModelId) return

    try {
      const response = await fetch(`/api/models/${selectedModelId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete model")
      }

      toast({
        title: "Success",
        description: "Model deleted successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete model",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedModelId(null)
    }
  }

  const confirmDelete = (modelId: string) => {
    setSelectedModelId(modelId)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <Card key={model.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg truncate">{model.prompt}</CardTitle>
              <CardDescription>{new Date(model.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[200px] w-full">
                <ModelViewer modelUrl={model.modelUrl} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <Button variant="outline" size="sm" onClick={() => handleShare(model.id)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport(model.modelUrl)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => confirmDelete(model.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share Your 3D Model</AlertDialogTitle>
            <AlertDialogDescription>Anyone with this link can view your 3D model:</AlertDialogDescription>
          </AlertDialogHeader>
          {shareUrl && (
            <div className="flex items-center space-x-2">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={shareUrl}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl)
                  toast({
                    title: "Copied!",
                    description: "Link copied to clipboard",
                  })
                }}
              >
                Copy
              </Button>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction>Done</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your 3D model.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
