"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Save } from "lucide-react"

export default function SettingsPage() {
  const [tokens, setTokens] = useState({
    github: "",
    gitlab: "",
    bitbucket: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    // Load existing tokens
    setTokens({
      github: localStorage.getItem("github_token") || "",
      gitlab: localStorage.getItem("gitlab_token") || "",
      bitbucket: localStorage.getItem("bitbucket_token") || "",
    })
  }, [])

  const handleSaveToken = async (platform: string) => {
    setIsLoading(true)
    try {
      const token = tokens[platform as keyof typeof tokens]
      if (token) {
        localStorage.setItem(`${platform}_token`, token)
        toast({
          title: "Token saved",
          description: `Your ${platform} token has been updated.`,
        })
      }
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

  const handleDeleteToken = (platform: string) => {
    localStorage.removeItem(`${platform}_token`)
    setTokens((prev) => ({ ...prev, [platform]: "" }))
    toast({
      title: "Token removed",
      description: `Your ${platform} token has been removed.`,
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-2xl flex-1">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and connected platforms</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how Uku looks on your device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Platforms</CardTitle>
              <CardDescription>Manage your platform tokens and connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(["github", "gitlab", "bitbucket"] as const).map((platform) => (
                <div key={platform} className="space-y-2">
                  <Label htmlFor={`${platform}-token`} className="capitalize">
                    {platform} Token
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`${platform}-token`}
                      type="password"
                      placeholder={`Enter your ${platform} token`}
                      value={tokens[platform]}
                      onChange={(e) => setTokens((prev) => ({ ...prev, [platform]: e.target.value }))}
                    />
                    <Button
                      onClick={() => handleSaveToken(platform)}
                      disabled={isLoading || !tokens[platform]}
                      size="sm"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteToken(platform)}
                      disabled={isLoading || !tokens[platform]}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}