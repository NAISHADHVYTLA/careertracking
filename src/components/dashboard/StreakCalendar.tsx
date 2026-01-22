import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar } from "lucide-react";

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
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            {monthName}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Flame className="h-5 w-5 text-streak" />
              <span className="font-bold text-streak">{currentStreak}</span>
              <span className="text-xs text-muted-foreground">day streak</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((cell, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all
                ${cell.day === null ? '' : 
                  cell.isToday 
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                    : ''
                }
                ${cell.isStudyDay 
                  ? 'bg-gradient-to-br from-success to-accent text-success-foreground shadow-sm' 
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
                <Flame className="absolute h-2.5 w-2.5 text-streak -top-0.5 -right-0.5" />
              )}
            </div>
          ))}
        </div>

        {/* Legend & Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;
