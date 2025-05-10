import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ModelNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-bold tracking-tight">Model Not Found</h2>
      <p className="mt-4 text-lg text-muted-foreground">
        The 3D model you're looking for doesn't exist or has been removed.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/gallery">
          <Button variant="outline">Browse Gallery</Button>
        </Link>
        <Link href="/">
          <Button>Create Your Own</Button>
        </Link>
      </div>
    </div>
  )
}
