"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContributions } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AlertCircle } from "lucide-react"

interface ContributionDay {
  date: string
  count: number
  level: number
}

export function ContributionGraph() {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadContributions = async () => {
      try {
        setIsLoading(true)
        const data = await fetchContributions()

        // Generate contribution data for the last year
        const today = new Date()
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
        const contributionData: ContributionDay[] = []

        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split("T")[0]
          const dayContributions = data.filter((c: any) => c.date?.startsWith(dateStr)).length

          contributionData.push({
            date: dateStr,
            count: dayContributions,
            level: Math.min(Math.floor(dayContributions / 2), 4),
          })
        }

        setContributions(contributionData)
      } catch (err) {
        setError("Failed to load contributions")
      } finally {
        setIsLoading(false)
      }
    }

    loadContributions()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </CardContent>
      </Card>
    )
  }

  const weeks = []
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7))
  }

  const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{totalContributions} contributions in the last year</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm border ${
                      day.level === 0
                        ? "bg-muted"
                        : day.level === 1
                          ? "bg-green-200 dark:bg-green-900"
                          : day.level === 2
                            ? "bg-green-300 dark:bg-green-700"
                            : day.level === 3
                              ? "bg-green-400 dark:bg-green-600"
                              : "bg-green-500 dark:bg-green-500"
                    }`}
                    title={`${day.count} contributions on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted border" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900 border" />
            <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700 border" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600 border" />
            <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500 border" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}