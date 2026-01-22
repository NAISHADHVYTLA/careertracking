import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Trophy } from "lucide-react";

interface XPProgressBarProps {
  currentXP: number;
  levelXP: number;
  level: number;
  totalXP: number;
}

const XPProgressBar = ({ currentXP, levelXP, level, totalXP }: XPProgressBarProps) => {
  const progress = (currentXP / levelXP) * 100;
  
  const getLevelTitle = (level: number) => {
    if (level < 5) return "Novice";
    if (level < 10) return "Apprentice";
    if (level < 20) return "Developer";
    if (level < 35) return "Engineer";
    if (level < 50) return "Senior Engineer";
    return "ML Master";
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-primary/5 via-card to-accent/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-xp to-streak flex items-center justify-center shadow-lg shadow-xp/30">
                <span className="text-2xl font-black text-xp-foreground">{level}</span>
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-xp animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-xl">{getLevelTitle(level)}</h3>
              <p className="text-sm text-muted-foreground">Level {level}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-xp">
              <Trophy className="h-5 w-5" />
              <span className="font-bold text-lg">{totalXP.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total XP earned</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {level + 1}</span>
            <span className="font-medium">
              <span className="text-xp">{currentXP}</span>
              <span className="text-muted-foreground"> / {levelXP} XP</span>
            </span>
          </div>
          
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-4 bg-muted"
            />
            <div 
              className="absolute inset-0 h-4 rounded-full bg-gradient-to-r from-xp via-streak to-xp overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            {levelXP - currentXP} XP until next level
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default XPProgressBar;
