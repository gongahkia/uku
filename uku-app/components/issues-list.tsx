"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchIssues } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ExternalLink, AlertCircle, Bug, Plus } from "lucide-react"

interface Issue {
  id: string
  title: string
  repository: string
  platform: string
  url: string
  labels: string[]
  createdAt: string
  type: "bug" | "feature" | "enhancement" | "question"
}

export function IssuesList() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setIsLoading(true)
        const data = await fetchIssues()

        // Transform API data to match our interface
        const transformedIssues: Issue[] = data.map((issue: any, index: number) => ({
          id: issue.id || `issue-${index}`,
          title: issue.title || "Untitled Issue",
          repository: issue.repository || "Unknown Repository",
          platform: issue.platform || "github",
          url: issue.url || "#",
          labels: issue.labels || [],
          createdAt: issue.createdAt || new Date().toISOString(),
          type: issue.type || "bug",
        }))

        setIssues(transformedIssues.slice(0, 10)) // Show latest 10 issues
      } catch (err) {
        setError("Failed to load issues")
      } finally {
        setIsLoading(false)
      }
    }

    loadIssues()
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

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </CardContent>
      </Card>
    )
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "bug":
        return <Bug className="h-4 w-4 text-red-500" />
      case "feature":
      case "enhancement":
        return <Plus className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "gitlab":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "bitbucket":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recent Issues ({issues.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No open issues found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div key={issue.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">{issue.title}</h4>
                    <p className="text-xs text-muted-foreground">{issue.repository}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                    <a href={issue.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`text-xs ${getPlatformColor(issue.platform)}`}>
                    {issue.platform}
                  </Badge>
                  {issue.labels.slice(0, 2).map((label) => (
                    <Badge key={label} variant="secondary" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                  {issue.labels.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{issue.labels.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}