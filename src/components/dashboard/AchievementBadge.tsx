import { LucideIcon, Flame, BookOpen, Code, Rocket, Star, Trophy, Zap, Target, Crown, Sparkles, Brain, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
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
  GraduationCap,
};

interface AchievementBadgeProps {
  iconName?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const rarityStyles = {
  common: "from-muted to-secondary border-border",
  rare: "from-chart-6/20 to-chart-6/5 border-chart-6/50",
  epic: "from-primary/20 to-primary/5 border-primary/50",
  legendary: "from-xp/20 to-streak/10 border-xp/50",
};

const rarityGlow = {
  common: "",
  rare: "shadow-chart-6/20",
  epic: "shadow-primary/20",
  legendary: "shadow-xp/30",
};

const AchievementBadge = ({ icon, iconName, title, description, unlocked, rarity }: AchievementBadgeProps) => {
  const Icon = icon || (iconName ? iconMap[iconName] : Trophy) || Trophy;
  
  return (
    <div
      className={cn(
        "relative group flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300",
        "bg-gradient-to-br",
        unlocked ? rarityStyles[rarity] : "from-muted/50 to-muted/30 border-border/50",
        unlocked && `shadow-lg ${rarityGlow[rarity]}`,
        !unlocked && "opacity-50 grayscale"
      )}
    >
      {/* Glow effect for legendary */}
      {unlocked && rarity === "legendary" && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-xp/10 to-streak/10 animate-pulse" />
      )}
      
      <div
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center mb-3",
          "bg-gradient-to-br shadow-inner",
          unlocked 
            ? rarity === "legendary" 
              ? "from-xp to-streak text-xp-foreground"
              : rarity === "epic"
                ? "from-primary to-primary/70 text-primary-foreground"
                : rarity === "rare"
                  ? "from-chart-6 to-chart-6/70 text-white"
                  : "from-secondary to-muted text-foreground"
            : "from-muted to-muted/70 text-muted-foreground"
        )}
      >
        <Icon className="h-7 w-7" />
      </div>
      
      <h4 className={cn(
        "font-bold text-sm text-center",
        unlocked ? "text-foreground" : "text-muted-foreground"
      )}>
        {title}
      </h4>
      
      <p className="text-xs text-muted-foreground text-center mt-1 line-clamp-2">
        {description}
      </p>

      {/* Rarity indicator */}
      <div className={cn(
        "absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
        rarity === "legendary" && "bg-gradient-to-r from-xp to-streak text-xp-foreground",
        rarity === "epic" && "bg-primary text-primary-foreground",
        rarity === "rare" && "bg-chart-6 text-white",
        rarity === "common" && "bg-muted text-muted-foreground",
        !unlocked && "hidden"
      )}>
        {rarity}
      </div>
    </div>
  );
};

export default AchievementBadge;
