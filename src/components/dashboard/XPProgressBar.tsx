import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="overflow-hidden bg-gradient-to-r from-primary/5 via-card to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-xp to-streak flex items-center justify-center shadow-lg shadow-xp/30">
                  <motion.span 
                    className="text-2xl font-black text-xp-foreground"
                    key={level}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {level}
                  </motion.span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-xp" />
                </motion.div>
              </motion.div>
              <div>
                <motion.h3 
                  className="font-bold text-xl"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {getLevelTitle(level)}
                </motion.h3>
                <p className="text-sm text-muted-foreground">Level {level}</p>
              </div>
            </div>
            
            <motion.div 
              className="text-right"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-1 text-xp">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Trophy className="h-5 w-5" />
                </motion.div>
                <AnimatedCounter value={totalXP} className="font-bold text-lg" />
              </div>
              <p className="text-xs text-muted-foreground">Total XP earned</p>
            </motion.div>
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
                value={0} 
                className="h-4 bg-muted"
              />
              <motion.div 
                className="absolute inset-0 h-4 rounded-full bg-gradient-to-r from-xp via-streak to-xp overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
            
            <motion.p 
              className="text-xs text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {levelXP - currentXP} XP until next level
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default XPProgressBar;
