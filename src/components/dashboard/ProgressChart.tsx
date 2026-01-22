import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface PhaseProgress {
  name: string;
  progress: number;
  color: string;
}

interface ProgressChartProps {
  phases: PhaseProgress[];
}

const ProgressChart = ({ phases }: ProgressChartProps) => {
  const chartConfig = {
    progress: {
      label: "Progress",
    },
  };

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <TrendingUp className="h-5 w-5 text-primary" />
            </motion.div>
            Phase Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={phases} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100} 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [`${value}%`, "Progress"]}
              />
              <Bar 
                dataKey="progress" 
                radius={[0, 6, 6, 0]}
                className="drop-shadow-sm"
              >
                {phases.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressChart;
