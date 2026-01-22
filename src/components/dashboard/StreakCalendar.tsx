import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCalendarProps {
  studyDays: Date[];
  currentStreak: number;
  longestStreak: number;
}

const StreakCalendar = ({ studyDays, currentStreak, longestStreak }: StreakCalendarProps) => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  const studyDatesSet = useMemo(() => {
    return new Set(studyDays.map(d => d.toDateString()));
  }, [studyDays]);

  const calendarDays = useMemo(() => {
    const days = [];
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isStudyDay: false, isToday: false, isPast: false });
    }
    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isStudyDay = studyDatesSet.has(date.toDateString());
      days.push({ day, isStudyDay, isToday, isPast });
    }
    return days;
  }, [daysInMonth, firstDayOfMonth, studyDatesSet, today]);

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar className="h-5 w-5 text-primary" />
              </motion.div>
              {monthName}
            </CardTitle>
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Flame className="h-5 w-5 text-streak" />
                </motion.div>
                <motion.span 
                  className="font-bold text-streak"
                  key={currentStreak}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {currentStreak}
                </motion.span>
                <span className="text-xs text-muted-foreground">day streak</span>
              </div>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <motion.div 
                key={day} 
                className="text-center text-xs font-medium text-muted-foreground py-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.03 }}
              >
                {day}
              </motion.div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.6 + index * 0.015,
                  type: "spring",
                  stiffness: 300
                }}
                whileHover={cell.day !== null ? { 
                  scale: 1.15, 
                  zIndex: 10,
                  transition: { duration: 0.2 }
                } : {}}
                className={`
                  relative aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-colors
                  ${cell.day === null ? '' : 
                    cell.isToday 
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                      : ''
                  }
                  ${cell.isStudyDay 
                    ? 'bg-gradient-to-br from-success to-accent text-success-foreground shadow-sm cursor-pointer' 
                    : cell.isPast && cell.day !== null
                      ? 'bg-muted/50 text-muted-foreground'
                      : cell.day !== null
                        ? 'bg-secondary text-secondary-foreground'
                        : ''
                  }
                `}
              >
                {cell.day}
                {cell.isStudyDay && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.02, type: "spring" }}
                  >
                    <Flame className="h-2.5 w-2.5 text-streak" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Legend & Stats */}
          <motion.div 
            className="flex items-center justify-between mt-4 pt-4 border-t"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-success to-accent" />
                <span className="text-muted-foreground">Study day</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-muted/50" />
                <span className="text-muted-foreground">Missed</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Best streak: <span className="font-bold text-foreground">{longestStreak} days</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StreakCalendar;
