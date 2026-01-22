import { useState } from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import XPProgressBar from "@/components/dashboard/XPProgressBar";
import StatsCards from "@/components/dashboard/StatsCards";
import ProgressChart from "@/components/dashboard/ProgressChart";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import AchievementsSection from "@/components/dashboard/AchievementsSection";
import WeeklyActivityChart from "@/components/dashboard/WeeklyActivityChart";

// Sample data - in production, this would come from your backend/Notion
const mockData = {
  xp: {
    currentXP: 2450,
    levelXP: 3000,
    level: 12,
    totalXP: 15450,
  },
  stats: {
    topicsCompleted: 23,
    totalTopics: 85,
    problemsSolved: 67,
    hoursStudied: 48,
    currentPhase: "Backend",
    weeklyGoalProgress: 75,
  },
  phases: [
    { name: "Foundation", progress: 85, color: "primary" },
    { name: "CS Fundamentals", progress: 60, color: "accent" },
    { name: "Backend", progress: 35, color: "xp" },
    { name: "System Design", progress: 10, color: "streak" },
    { name: "ML/AI", progress: 5, color: "success" },
    { name: "MLOps", progress: 0, color: "chart-6" },
  ],
  studyDays: [
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
  ],
  streak: {
    current: 4,
    longest: 8,
  },
};

const Index = () => {
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
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open Notion Tracker
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* XP Progress */}
        <XPProgressBar {...mockData.xp} />

        {/* Stats Overview */}
        <StatsCards stats={mockData.stats} />

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ProgressChart phases={mockData.phases} />
          <WeeklyActivityChart />
        </div>

        {/* Streak Calendar */}
        <StreakCalendar
          studyDays={mockData.studyDays}
          currentStreak={mockData.streak.current}
          longestStreak={mockData.streak.longest}
        />

        {/* Achievements */}
        <AchievementsSection />

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
