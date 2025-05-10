"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube } from "lucide-react"

export function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Cube className="h-6 w-6" />
          <span className="text-xl font-bold">3D Model Generator</span>
        </Link>
        <nav className="flex items-center gap-4">
          {isLoading ? (
            <Button variant="ghost" disabled>
              Loading...
            </Button>
          ) : session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {session.user?.name?.[0] || "U"}
                </div>
              </div>
            </>
          ) : (
            <Button onClick={() => signIn("google")}>Sign In with Google</Button>
          )}
        </nav>
      </div>
    </header>
  )
}
