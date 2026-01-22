import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

interface WeeklyActivityData {
  day: string;
  hours: number;
  problems: number;
}

interface WeeklyActivityChartProps {
  data?: WeeklyActivityData[];
}

const WeeklyActivityChart = ({ data }: WeeklyActivityChartProps) => {
  const chartConfig = {
    hours: {
      label: "Study Hours",
      color: "hsl(var(--chart-1))",
    },
    problems: {
      label: "Problems Solved",
      color: "hsl(var(--chart-2))",
    },
  };

  const weeklyData = data || [
    { day: "Sun", hours: 0, problems: 0 },
    { day: "Mon", hours: 0, problems: 0 },
    { day: "Tue", hours: 0, problems: 0 },
    { day: "Wed", hours: 0, problems: 0 },
    { day: "Thu", hours: 0, problems: 0 },
    { day: "Fri", hours: 0, problems: 0 },
    { day: "Sat", hours: 0, problems: 0 },
  ];

  const totalHours = weeklyData.reduce((sum, d) => sum + d.hours, 0);
  const totalProblems = weeklyData.reduce((sum, d) => sum + d.problems, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Activity className="h-5 w-5 text-accent" />
              </motion.div>
              This Week's Activity
            </div>
            <div className="flex gap-4 text-sm font-normal">
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{totalHours.toFixed(1)}</span> hrs
              </span>
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{totalProblems}</span> problems
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={weeklyData} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="problemsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#hoursGradient)"
              />
              <Area
                type="monotone"
                dataKey="problems"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#problemsGradient)"
              />
            </AreaChart>
          </ChartContainer>
          
          <div className="flex items-center justify-center gap-6 mt-2">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 rounded-full bg-chart-1" />
              <span className="text-xs text-muted-foreground">Study Hours</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 rounded-full bg-chart-2" />
              <span className="text-xs text-muted-foreground">Problems Solved</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeeklyActivityChart;
