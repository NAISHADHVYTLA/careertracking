import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AchievementBadge from "./AchievementBadge";
import { 
  Flame, 
  BookOpen, 
  Code, 
  Rocket, 
  Star, 
  Trophy,
  Zap,
  Target,
  Crown,
  Sparkles,
  Brain,
  GraduationCap
} from "lucide-react";

const achievements = [
  {
    icon: Flame,
    title: "First Flame",
    description: "Complete your first study day",
    unlocked: true,
    rarity: "common" as const,
  },
  {
    icon: BookOpen,
    title: "Knowledge Seeker",
    description: "Complete 10 topics",
    unlocked: true,
    rarity: "common" as const,
  },
  {
    icon: Code,
    title: "Code Warrior",
    description: "Solve 50 LeetCode problems",
    unlocked: true,
    rarity: "rare" as const,
  },
  {
    icon: Zap,
    title: "Week Warrior",
    description: "7-day study streak",
    unlocked: true,
    rarity: "rare" as const,
  },
  {
    icon: Target,
    title: "Goal Crusher",
    description: "Hit weekly goal 4 weeks in a row",
    unlocked: false,
    rarity: "epic" as const,
  },
  {
    icon: Brain,
    title: "ML Initiate",
    description: "Complete the ML Mathematics phase",
    unlocked: false,
    rarity: "epic" as const,
  },
  {
    icon: Rocket,
    title: "Ship It!",
    description: "Deploy your first ML project",
    unlocked: false,
    rarity: "epic" as const,
  },
  {
    icon: Crown,
    title: "Consistency King",
    description: "30-day study streak",
    unlocked: false,
    rarity: "legendary" as const,
  },
  {
    icon: Star,
    title: "Century Club",
    description: "Solve 100 LeetCode problems",
    unlocked: false,
    rarity: "legendary" as const,
  },
  {
    icon: GraduationCap,
    title: "ML Engineer",
    description: "Complete the entire roadmap",
    unlocked: false,
    rarity: "legendary" as const,
  },
  {
    icon: Trophy,
    title: "Perfectionist",
    description: "100% completion in all phases",
    unlocked: false,
    rarity: "legendary" as const,
  },
  {
    icon: Sparkles,
    title: "Early Bird",
    description: "Study before 7 AM for 5 days",
    unlocked: false,
    rarity: "rare" as const,
  },
];

const AchievementsSection = () => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-xp" />
            Achievements
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{unlockedCount}</span> / {achievements.length} unlocked
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {achievements.map((achievement, index) => (
            <AchievementBadge key={index} {...achievement} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsSection;
