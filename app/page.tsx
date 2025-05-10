import { auth } from "@/lib/auth"
import { ModelGenerator } from "@/components/model-generator"
import { UsageStats } from "@/components/usage-stats"
import { HeroSection } from "@/components/hero-section"

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      {!session ? (
        <HeroSection />
      ) : (
        <div className="w-full max-w-5xl space-y-8">
          <h1 className="text-4xl font-bold text-center">3D Model Generator</h1>
          <UsageStats />
          <ModelGenerator />
        </div>
      )}
    </main>
  )
}
