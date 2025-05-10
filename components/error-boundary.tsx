"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught error:", error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="mt-2 text-muted-foreground">We apologize for the inconvenience. Please try again.</p>
      <div className="mt-6 flex items-center gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go to homepage
        </Button>
      </div>
    </div>
  )
}
