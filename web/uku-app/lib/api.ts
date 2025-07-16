// API client for backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface ApiResponse<T> {
  data: T
  error?: string
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  }

  async getContributions(platform?: string): Promise<any[]> {
    const params = platform ? `?platform=${platform}` : ""
    return this.request(`/api/contributions${params}`)
  }

  async getIssues(platform?: string): Promise<any[]> {
    const params = platform ? `?platform=${platform}` : ""
    return this.request(`/api/issues${params}`)
  }
}

const apiClient = new ApiClient()

// Wrapper functions for easier usage
export async function fetchContributions(platform?: string): Promise<any[]> {
  try {
    return await apiClient.getContributions(platform)
  } catch (error) {
    console.error("Failed to fetch contributions:", error)
    // Return mock data for development
    return generateMockContributions()
  }
}

export async function fetchIssues(platform?: string): Promise<any[]> {
  try {
    return await apiClient.getIssues(platform)
  } catch (error) {
    console.error("Failed to fetch issues:", error)
    // Return mock data for development
    return generateMockIssues()
  }
}

// Mock data generators for development
function generateMockContributions(): any[] {
  const contributions = []
  const platforms = ["github", "gitlab", "bitbucket"]
  const repositories = [
    "user/awesome-project",
    "org/web-framework",
    "community/docs",
    "team/mobile-app",
    "open-source/library",
  ]

  for (let i = 0; i < 50; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 365))

    contributions.push({
      id: `contrib-${i}`,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      repository: repositories[Math.floor(Math.random() * repositories.length)],
      type: ["commit", "pull_request", "issue"][Math.floor(Math.random() * 3)],
      date: date.toISOString(),
      title: `Sample contribution ${i + 1}`,
      url: `https://github.com/example/repo/commit/${i}`,
    })
  }

  return contributions
}

function generateMockIssues(): any[] {
  const issues = []
  const platforms = ["github", "gitlab", "bitbucket"]
  const repositories = ["user/awesome-project", "org/web-framework", "community/docs"]
  const types = ["bug", "feature", "enhancement", "question"]
  const labels = [
    ["bug", "high-priority"],
    ["feature", "enhancement"],
    ["documentation", "good-first-issue"],
    ["question", "help-wanted"],
  ]

  for (let i = 0; i < 15; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    issues.push({
      id: `issue-${i}`,
      title: `Sample issue ${i + 1}: Fix important bug in component`,
      repository: repositories[Math.floor(Math.random() * repositories.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      url: `https://github.com/example/repo/issues/${i + 1}`,
      labels: labels[Math.floor(Math.random() * labels.length)],
      createdAt: date.toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
    })
  }

  return issues
}