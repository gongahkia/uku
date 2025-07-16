"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContributions, fetchIssues } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { GitCommit, GitPullRequest, Bug, Award } from "lucide-react"

interface Stats {
  totalContributions: number
  totalRepositories: number
  openIssues: number
  earnedBadges: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalContributions: 0,
    totalRepositories: 0,
    openIssues: 0,
    earnedBadges: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true)
        const [contributions, issues] = await Promise.all([fetchContributions(), fetchIssues()])

        const uniqueRepos = new Set(contributions.map((c: any) => c.repository)).size
        const totalContributions = contributions.length

        // Calculate earned badges (simplified logic)
        let earnedBadges = 0
        if (totalContributions > 0) earnedBadges++
        if (totalContributions >= 10) earnedBadges++
        if (uniqueRepos >= 5) earnedBadges++
        if (totalContributions >= 100) earnedBadges++

        setStats({
          totalContributions,
          totalRepositories: uniqueRepos,
          openIssues: issues.length,
          earnedBadges,
        })
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center h-24">
              <LoadingSpinner />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Contributions",
      value: stats.totalContributions,
      icon: <GitCommit className="h-4 w-4" />,
      description: "Across all platforms",
    },
    {
      title: "Repositories",
      value: stats.totalRepositories,
      icon: <GitPullRequest className="h-4 w-4" />,
      description: "Contributed to",
    },
    {
      title: "Open Issues",
      value: stats.openIssues,
      icon: <Bug className="h-4 w-4" />,
      description: "Currently tracking",
    },
    {
      title: "Badges Earned",
      value: stats.earnedBadges,
      icon: <Award className="h-4 w-4" />,
      description: "Achievements unlocked",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}