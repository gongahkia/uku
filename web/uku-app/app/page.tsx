import { Suspense } from "react"
import { ContributionGraph } from "@/components/contribution-graph"
import { BadgesList } from "@/components/badges-list"
import { IssuesList } from "@/components/issues-list"
import { StatsCards } from "@/components/stats-cards"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-8 flex-1">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Uku</h1>
          <p className="text-muted-foreground">Your unified open-source contribution dashboard</p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <StatsCards />
        </Suspense>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Contribution Activity</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <ContributionGraph />
            </Suspense>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section>
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              <Suspense fallback={<LoadingSpinner />}>
                <BadgesList />
              </Suspense>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Open Issues</h2>
              <Suspense fallback={<LoadingSpinner />}>
                <IssuesList />
              </Suspense>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}