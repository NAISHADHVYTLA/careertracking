import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AchievementBadge from "./AchievementBadge";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface Achievement {
  title: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  description: string;
  xpReward: number;
}

interface AchievementsSectionProps {
  achievements?: Achievement[];
}

// Icon mapping based on achievement title keywords
const getIconForAchievement = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('flame') || lowerTitle.includes('fire')) return 'Flame';
  if (lowerTitle.includes('knowledge') || lowerTitle.includes('seeker')) return 'BookOpen';
  if (lowerTitle.includes('code') || lowerTitle.includes('warrior')) return 'Code';
  if (lowerTitle.includes('week')) return 'Zap';
  if (lowerTitle.includes('goal') || lowerTitle.includes('crusher')) return 'Target';
  if (lowerTitle.includes('initiate') || lowerTitle.includes('brain')) return 'Brain';
  if (lowerTitle.includes('ship') || lowerTitle.includes('rocket')) return 'Rocket';
  if (lowerTitle.includes('king') || lowerTitle.includes('consistency')) return 'Crown';
  if (lowerTitle.includes('century') || lowerTitle.includes('club') || lowerTitle.includes('star')) return 'Star';
  if (lowerTitle.includes('engineer') || lowerTitle.includes('ml')) return 'GraduationCap';
  if (lowerTitle.includes('perfect')) return 'Trophy';
  if (lowerTitle.includes('early') || lowerTitle.includes('bird')) return 'Sparkles';
  return 'Trophy';
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
    }
  },
};

const AchievementsSection = ({ achievements }: AchievementsSectionProps) => {
  // Default achievements if none provided
  const defaultAchievements: Achievement[] = [
    { title: "First Flame", description: "Complete your first study day", unlocked: false, rarity: "common", xpReward: 10 },
    { title: "Knowledge Seeker", description: "Complete 10 topics", unlocked: false, rarity: "common", xpReward: 25 },
    { title: "Code Warrior", description: "Solve 50 LeetCode problems", unlocked: false, rarity: "rare", xpReward: 50 },
    { title: "Week Warrior", description: "7-day study streak", unlocked: false, rarity: "rare", xpReward: 50 },
    { title: "Goal Crusher", description: "Hit weekly goal 4 weeks in a row", unlocked: false, rarity: "epic", xpReward: 100 },
    { title: "ML Initiate", description: "Complete the ML Mathematics phase", unlocked: false, rarity: "epic", xpReward: 100 },
    { title: "Ship It!", description: "Deploy your first ML project", unlocked: false, rarity: "epic", xpReward: 100 },
    { title: "Consistency King", description: "30-day study streak", unlocked: false, rarity: "legendary", xpReward: 200 },
    { title: "Century Club", description: "Solve 100 LeetCode problems", unlocked: false, rarity: "legendary", xpReward: 200 },
    { title: "ML Engineer", description: "Complete the entire roadmap", unlocked: false, rarity: "legendary", xpReward: 500 },
    { title: "Perfectionist", description: "100% completion in all phases", unlocked: false, rarity: "legendary", xpReward: 500 },
    { title: "Early Bird", description: "Study before 7 AM for 5 days", unlocked: false, rarity: "rare", xpReward: 50 },
  ];

  const displayAchievements = achievements && achievements.length > 0 ? achievements : defaultAchievements;
  const unlockedCount = displayAchievements.filter(a => a.unlocked).length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="h-5 w-5 text-xp" />
              </motion.div>
              Achievements
            </CardTitle>
            <motion.span 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="font-bold text-foreground">{unlockedCount}</span> / {displayAchievements.length} unlocked
            </motion.span>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {displayAchievements.map((achievement, index) => (
              <motion.div key={index} variants={item}>
                <AchievementBadge 
                  title={achievement.title}
                  description={achievement.description}
                  unlocked={achievement.unlocked}
                  rarity={achievement.rarity}
                  iconName={getIconForAchievement(achievement.title)}
                />
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AchievementsSection;
