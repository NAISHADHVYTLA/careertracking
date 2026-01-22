import { Sparkles, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import XPProgressBar from "@/components/dashboard/XPProgressBar";
import StatsCards from "@/components/dashboard/StatsCards";
import ProgressChart from "@/components/dashboard/ProgressChart";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import AchievementsSection from "@/components/dashboard/AchievementsSection";
import WeeklyActivityChart from "@/components/dashboard/WeeklyActivityChart";
import { useNotionData } from "@/hooks/useNotionData";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback study days (will be replaced when we add Daily Study Log integration)
const studyDays = [
  new Date(2026, 0, 1),
  new Date(2026, 0, 2),
  new Date(2026, 0, 3),
  new Date(2026, 0, 5),
  new Date(2026, 0, 6),
  new Date(2026, 0, 7),
  new Date(2026, 0, 8),
  new Date(2026, 0, 10),
  new Date(2026, 0, 12),
  new Date(2026, 0, 13),
  new Date(2026, 0, 14),
  new Date(2026, 0, 15),
  new Date(2026, 0, 16),
  new Date(2026, 0, 17),
  new Date(2026, 0, 19),
  new Date(2026, 0, 20),
  new Date(2026, 0, 21),
  new Date(2026, 0, 22),
];

const streak = {
  current: 4,
  longest: 8,
};

const Index = () => {
  const { data, isLoading, error, refetch, isFetching } = useNotionData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">AI/ML Journey</h1>
                <p className="text-sm text-muted-foreground">Track your path to ML Engineer</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => refetch()}
                disabled={isFetching}
                className="gap-2"
              >
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Sync
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => window.open('https://notion.so', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Open Notion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-destructive font-medium">Failed to load data from Notion</p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-xl" />
              <Skeleton className="h-80 rounded-xl" />
            </div>
          </div>
        )}

        {/* Data Loaded */}
        {data && !isLoading && (
          <>
            {/* XP Progress */}
            <XPProgressBar {...data.xp} />

            {/* Stats Overview */}
            <StatsCards stats={data.stats} />

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ProgressChart phases={data.phases} />
              <WeeklyActivityChart />
            </div>

            {/* Streak Calendar */}
            <StreakCalendar
              studyDays={studyDays}
              currentStreak={streak.current}
              longestStreak={streak.longest}
            />

            {/* Achievements */}
            <AchievementsSection />

            {/* Last Updated */}
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">
                Last synced: {new Date(data.lastUpdated).toLocaleString()}
              </p>
            </div>
          </>
        )}

        {/* Motivational Footer */}
        <div className="text-center py-8">
          <p className="text-lg font-medium text-muted-foreground">
            "Every expert was once a beginner. Keep pushing forward!"
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            🎯 Stay consistent • 📈 Track progress • 🏆 Earn achievements
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
