import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

const weeklyData = [
  { day: "Mon", hours: 3.5, problems: 5 },
  { day: "Tue", hours: 2.0, problems: 3 },
  { day: "Wed", hours: 4.0, problems: 7 },
  { day: "Thu", hours: 1.5, problems: 2 },
  { day: "Fri", hours: 3.0, problems: 4 },
  { day: "Sat", hours: 5.0, problems: 8 },
  { day: "Sun", hours: 4.5, problems: 6 },
];

const WeeklyActivityChart = () => {
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-accent" />
          This Week's Activity
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-1" />
            <span className="text-xs text-muted-foreground">Study Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Problems Solved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivityChart;
