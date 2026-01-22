import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Code, Brain, Clock, Target, Zap } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

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

interface StatCardAnimatedProps extends StatCardProps {
  index: number;
}

const StatCard = ({ icon: Icon, label, value, subtext, trend, color, index }: StatCardAnimatedProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.4, 
      delay: index * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    whileHover={{ 
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.98 }}
  >
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <motion.div 
            className={`p-2.5 rounded-xl bg-gradient-to-br ${colorStyles[color]}`}
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
          {trend !== undefined && (
            <motion.span 
              className={`text-xs font-medium ${trend >= 0 ? 'text-success' : 'text-destructive'}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
            >
              {trend >= 0 ? '+' : ''}{trend}%
            </motion.span>
          )}
        </div>
        <div className="mt-3">
          <motion.p 
            className="text-2xl font-bold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {value}
          </motion.p>
          <p className="text-sm text-muted-foreground">{label}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground/70 mt-1">{subtext}</p>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

interface StatsCardsProps {
  stats: {
    topicsCompleted: number;
    totalTopics: number;
    problemsSolved: number;
    hoursStudied: number;
    currentPhase: string;
    weeklyGoalProgress: number;
    focusScore?: number;
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
        index={0}
      />
      <StatCard
        icon={Code}
        label="Problems Solved"
        value={stats.problemsSolved}
        subtext="LeetCode + Practice"
        trend={12}
        color="accent"
        index={1}
      />
      <StatCard
        icon={Clock}
        label="Hours Studied"
        value={stats.hoursStudied}
        subtext="This month"
        trend={8}
        color="chart-6"
        index={2}
      />
      <StatCard
        icon={Brain}
        label="Current Phase"
        value={stats.currentPhase}
        subtext="Keep going!"
        color="xp"
        index={3}
      />
      <StatCard
        icon={Target}
        label="Weekly Goal"
        value={`${stats.weeklyGoalProgress}%`}
        subtext="20hrs target"
        color="streak"
        index={4}
      />
      <StatCard
        icon={Zap}
        label="Focus Score"
        value={stats.focusScore ?? 0}
        subtext={stats.focusScore >= 80 ? "Excellent!" : stats.focusScore >= 50 ? "Good" : "Keep going!"}
        color="success"
        index={5}
      />
    </div>
  );
};

export default StatsCards;
