"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/footer"
import { Github, GitBranch, Key } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [tokens, setTokens] = useState({
    github: "",
    gitlab: "",
    bitbucket: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleOAuthLogin = async (platform: string) => {
    setIsLoading(true)
    try {
      // Simulate OAuth flow - replace with actual OAuth implementation
      window.location.href = `/api/auth/${platform}`
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTokenSubmit = async (platform: string) => {
    setIsLoading(true)
    try {
      const token = tokens[platform as keyof typeof tokens]
      if (!token) {
        toast({
          title: "Token required",
          description: `Please enter your ${platform} token.`,
          variant: "destructive",
        })
        return
      }

      // Store token securely - replace with actual implementation
      localStorage.setItem(`${platform}_token`, token)

      toast({
        title: "Token saved",
        description: `Your ${platform} token has been saved successfully.`,
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Failed to save token",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connect Your Accounts</CardTitle>
            <CardDescription>Connect your development platforms to start tracking contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="oauth" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="oauth">OAuth</TabsTrigger>
                <TabsTrigger value="token">Personal Token</TabsTrigger>
              </TabsList>

              <TabsContent value="oauth" className="space-y-4">
                <Button
                  onClick={() => handleOAuthLogin("github")}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Connect GitHub
                </Button>
                <Button
                  onClick={() => handleOAuthLogin("gitlab")}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  <GitBranch className="mr-2 h-4 w-4" />
                  Connect GitLab
                </Button>
                <Button
                  onClick={() => handleOAuthLogin("bitbucket")}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Connect Bitbucket
                </Button>
              </TabsContent>

              <TabsContent value="token" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github-token">GitHub Token</Label>
                    <Input
                      id="github-token"
                      type="password"
                      placeholder="ghp_..."
                      value={tokens.github}
                      onChange={(e) => setTokens((prev) => ({ ...prev, github: e.target.value }))}
                    />
                    <Button
                      onClick={() => handleTokenSubmit("github")}
                      disabled={isLoading || !tokens.github}
                      size="sm"
                      className="w-full"
                    >
                      Save GitHub Token
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gitlab-token">GitLab Token</Label>
                    <Input
                      id="gitlab-token"
                      type="password"
                      placeholder="glpat-..."
                      value={tokens.gitlab}
                      onChange={(e) => setTokens((prev) => ({ ...prev, gitlab: e.target.value }))}
                    />
                    <Button
                      onClick={() => handleTokenSubmit("gitlab")}
                      disabled={isLoading || !tokens.gitlab}
                      size="sm"
                      className="w-full"
                    >
                      Save GitLab Token
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bitbucket-token">Bitbucket Token</Label>
                    <Input
                      id="bitbucket-token"
                      type="password"
                      placeholder="ATBB..."
                      value={tokens.bitbucket}
                      onChange={(e) => setTokens((prev) => ({ ...prev, bitbucket: e.target.value }))}
                    />
                    <Button
                      onClick={() => handleTokenSubmit("bitbucket")}
                      disabled={isLoading || !tokens.bitbucket}
                      size="sm"
                      className="w-full"
                    >
                      Save Bitbucket Token
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}