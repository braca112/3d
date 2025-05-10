"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, Lightbulb } from "lucide-react"
import { ModelViewer } from "@/components/model-viewer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ModelGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedModel, setGeneratedModel] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Example prompts to help users
  const examplePrompts = [
    "A sleek modern sports car with aerodynamic design",
    "A medieval castle with tall towers and a moat",
    "A futuristic robot with glowing elements",
    "A cozy cottage in the woods with a smoking chimney",
    "An alien spaceship with unusual geometry",
  ]

  const generateModel = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for your 3D model",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to generate model")
      }

      const data = await response.json()
      setGeneratedModel(data.modelUrl)
      toast({
        title: "Model generated!",
        description: "Your 3D model has been successfully created",
      })

      // Refresh to update usage stats
      router.refresh()
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const useExamplePrompt = useCallback(
    (example: string) => {
      setPrompt(example)
    },
    [setPrompt],
  )

  return (
    <div className="space-y-8">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Generate a 3D Model</CardTitle>
              <CardDescription>Describe what you want to create</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter a description of the 3D model you want to generate (e.g., 'A modern sports car with sleek lines')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
              />

              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1" /> Try one of these examples:
                </p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => useExamplePrompt(example)}
                      className="text-xs"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={generateModel} disabled={isGenerating || !prompt.trim()} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate 3D Model
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced 3D Model Generation</CardTitle>
              <CardDescription>Provide detailed specifications for your model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="object-type">Object Type</Label>
                  <Input
                    id="object-type"
                    placeholder="e.g., Car, Building, Character, Furniture"
                    onChange={(e) => setPrompt((prev) => `${e.target.value}, ${prev}`)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Input
                    id="style"
                    placeholder="e.g., Modern, Fantasy, Sci-fi, Cartoon"
                    onChange={(e) => setPrompt((prev) => `${prev} in ${e.target.value} style`)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Details</Label>
                  <Textarea
                    id="details"
                    placeholder="Describe colors, materials, specific features, etc."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={generateModel} disabled={isGenerating || !prompt.trim()} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Advanced 3D Model
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {generatedModel && (
        <Card>
          <CardHeader>
            <CardTitle>Your Generated Model</CardTitle>
            <CardDescription>Based on: {prompt}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full h-[400px]">
              <ModelViewer modelUrl={generatedModel} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.open(generatedModel, "_blank")}>
              Download Model
            </Button>
            <Button variant="outline" onClick={() => setGeneratedModel(null)}>
              Clear
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
