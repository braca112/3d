import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h2>
      <p className="mt-4 text-xl text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
      <div className="mt-8">
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </div>
  )
}
