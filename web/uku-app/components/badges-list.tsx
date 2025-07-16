"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchContributions } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Award, Star, GitCommit, Users, Zap, Trophy } from "lucide-react"

interface BadgeData {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  earned: boolean
  progress?: number
  total?: number
}

export function BadgesList() {
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBadges = async () => {
      try {
        setIsLoading(true)
        const contributions = await fetchContributions()

        // Calculate badge achievements based on contributions
        const totalContributions = contributions.length
        const uniqueRepos = new Set(contributions.map((c: any) => c.repository)).size

        const badgeData: BadgeData[] = [
          {
            id: "first-contribution",
            name: "First Contribution",
            description: "Made your first open source contribution",
            icon: <Star className="h-4 w-4" />,
            earned: totalContributions > 0,
          },
          {
            id: "contributor",
            name: "Active Contributor",
            description: "Made 10+ contributions",
            icon: <GitCommit className="h-4 w-4" />,
            earned: totalContributions >= 10,
            progress: Math.min(totalContributions, 10),
            total: 10,
          },
          {
            id: "collaborator",
            name: "Collaborator",
            description: "Contributed to 5+ different repositories",
            icon: <Users className="h-4 w-4" />,
            earned: uniqueRepos >= 5,
            progress: Math.min(uniqueRepos, 5),
            total: 5,
          },
          {
            id: "streak-master",
            name: "Streak Master",
            description: "Maintained a 7-day contribution streak",
            icon: <Zap className="h-4 w-4" />,
            earned: false, // Would need streak calculation
          },
          {
            id: "champion",
            name: "Open Source Champion",
            description: "Made 100+ contributions",
            icon: <Trophy className="h-4 w-4" />,
            earned: totalContributions >= 100,
            progress: Math.min(totalContributions, 100),
            total: 100,
          },
        ]

        setBadges(badgeData)
      } catch (error) {
        console.error("Failed to load badges:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBadges()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  const earnedBadges = badges.filter((badge) => badge.earned)
  const inProgressBadges = badges.filter((badge) => !badge.earned && badge.progress !== undefined)

  return (
    <div className="space-y-4">
      {earnedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4" />
              Earned Badges ({earnedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="text-yellow-500">{badge.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{badge.name}</div>
                  <div className="text-xs text-muted-foreground">{badge.description}</div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Earned
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {inProgressBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">In Progress ({inProgressBadges.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inProgressBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 p-2 rounded-lg">
                <div className="text-muted-foreground">{badge.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{badge.name}</div>
                  <div className="text-xs text-muted-foreground">{badge.description}</div>
                  {badge.progress !== undefined && badge.total && (
                    <div className="mt-1">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>
                          {badge.progress}/{badge.total}
                        </span>
                        <span>{Math.round((badge.progress / badge.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div
                          className="bg-primary h-1 rounded-full transition-all"
                          style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}