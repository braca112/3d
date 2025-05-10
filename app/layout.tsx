import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SessionProvider } from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "3D Model Generator",
  description: "Generate 3D models from text descriptions using AI",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://3d-model-generator.vercel.app"),
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
