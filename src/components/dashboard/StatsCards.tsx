import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Code, Brain, Clock, Target, Zap } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: number;
  color: "primary" | "accent" | "xp" | "streak" | "success" | "chart-6";
}

const colorStyles = {
  primary: "from-primary/20 to-primary/5 text-primary",
  accent: "from-accent/20 to-accent/5 text-accent",
  xp: "from-xp/20 to-xp/5 text-xp",
  streak: "from-streak/20 to-streak/5 text-streak",
  success: "from-success/20 to-success/5 text-success",
  "chart-6": "from-chart-6/20 to-chart-6/5 text-chart-6",
};

const StatCard = ({ icon: Icon, label, value, subtext, trend, color }: StatCardProps) => (
  <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorStyles[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {subtext && (
          <p className="text-xs text-muted-foreground/70 mt-1">{subtext}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

interface StatsCardsProps {
  stats: {
    topicsCompleted: number;
    totalTopics: number;
    problemsSolved: number;
    hoursStudied: number;
    currentPhase: string;
    weeklyGoalProgress: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const completionPercent = Math.round((stats.topicsCompleted / stats.totalTopics) * 100);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard
        icon={BookOpen}
        label="Topics Done"
        value={`${stats.topicsCompleted}/${stats.totalTopics}`}
        subtext={`${completionPercent}% complete`}
        color="primary"
      />
      <StatCard
        icon={Code}
        label="Problems Solved"
        value={stats.problemsSolved}
        subtext="LeetCode + Practice"
        trend={12}
        color="accent"
      />
      <StatCard
        icon={Clock}
        label="Hours Studied"
        value={stats.hoursStudied}
        subtext="This month"
        trend={8}
        color="chart-6"
      />
      <StatCard
        icon={Brain}
        label="Current Phase"
        value={stats.currentPhase}
        subtext="Keep going!"
        color="xp"
      />
      <StatCard
        icon={Target}
        label="Weekly Goal"
        value={`${stats.weeklyGoalProgress}%`}
        subtext="20hrs target"
        color="streak"
      />
      <StatCard
        icon={Zap}
        label="Focus Score"
        value="92"
        subtext="Excellent!"
        color="success"
      />
    </div>
  );
};

export default StatsCards;
