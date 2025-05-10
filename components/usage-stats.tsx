"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

interface UsageData {
  used: number
  limit: number
  isPremium: boolean
}

export function UsageStats() {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch("/api/usage")
        if (response.ok) {
          const data = await response.json()
          setUsage(data)
        }
      } catch (error) {
        console.error("Failed to fetch usage data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [])

  const handleUpgrade = async () => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-[100px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading usage data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!usage) {
    return null
  }

  const percentage = Math.min(Math.round((usage.used / usage.limit) * 100), 100)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Your Usage</CardTitle>
        <CardDescription>
          {usage.isPremium
            ? "Premium plan with unlimited generations"
            : `${usage.used} of ${usage.limit} free generations used`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!usage.isPremium && (
          <>
            <Progress value={percentage} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground mb-4">
              <span>{usage.used} used</span>
              <span>{usage.limit - usage.used} remaining</span>
            </div>
            {percentage >= 80 && !usage.isPremium && (
              <Button onClick={handleUpgrade} className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            )}
          </>
        )}
        {usage.isPremium && (
          <div className="flex items-center justify-center p-4">
            <span className="text-lg font-medium text-primary">Premium Plan Active ✓</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
