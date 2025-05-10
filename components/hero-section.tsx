"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube, Sparkles, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Generate Amazing 3D Models with AI</h1>
        <p className="text-muted-foreground max-w-[700px] text-lg">
          Turn your ideas into 3D models with a simple text description. Perfect for designers, developers, and
          creators.
        </p>
      </div>

      <Button size="lg" onClick={() => signIn("google")}>
        Sign In with Google to Start
      </Button>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-4xl">
        <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
          <Sparkles className="h-10 w-10 text-primary" />
          <h3 className="text-xl font-bold">AI-Powered</h3>
          <p className="text-muted-foreground text-center">
            Leveraging advanced AI to transform text into detailed 3D models
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
          <Cube className="h-10 w-10 text-primary" />
          <h3 className="text-xl font-bold">High Quality</h3>
          <p className="text-muted-foreground text-center">
            Generate professional-grade 3D models ready for your projects
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
          <Zap className="h-10 w-10 text-primary" />
          <h3 className="text-xl font-bold">Fast & Simple</h3>
          <p className="text-muted-foreground text-center">
            Get your 3D models in seconds with our streamlined process
          </p>
        </div>
      </div>
    </div>
  )
}
