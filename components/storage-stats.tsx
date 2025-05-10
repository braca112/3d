"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Database } from "lucide-react"

interface StorageData {
  totalMB: number
  count: number
  limit: number
}

export function StorageStats() {
  const [storage, setStorage] = useState<StorageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const response = await fetch("/api/storage")
        if (response.ok) {
          const data = await response.json()
          setStorage(data)
        }
      } catch (error) {
        console.error("Failed to fetch storage data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStorage()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-[100px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading storage data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!storage) {
    return null
  }

  const percentage = Math.min(Math.round((storage.totalMB / storage.limit) * 100), 100)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-primary" />
          <CardTitle>Storage Usage</CardTitle>
        </div>
        <CardDescription>
          {storage.count} models using {storage.totalMB} MB of your {storage.limit} MB limit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{storage.totalMB} MB used</span>
          <span>{(storage.limit - storage.totalMB).toFixed(2)} MB available</span>
        </div>
      </CardContent>
    </Card>
  )
}
