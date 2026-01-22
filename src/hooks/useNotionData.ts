import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Phase {
  name: string;
  progress: number;
  color: string;
  completed: number;
  total: number;
}

interface WeeklyActivity {
  day: string;
  hours: number;
  problems: number;
}

interface Achievement {
  title: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  description: string;
  xpReward: number;
}

export interface NotionData {
  xp: {
    currentXP: number;
    levelXP: number;
    level: number;
    totalXP: number;
  };
  stats: {
    topicsCompleted: number;
    totalTopics: number;
    problemsSolved: number;
    hoursStudied: number;
    currentPhase: string;
    weeklyGoalProgress: number;
    focusScore: number;
  };
  phases: Phase[];
  weeklyActivity: WeeklyActivity[];
  streak: {
    current: number;
    longest: number;
  };
  studyDays: string[];
  achievements: Achievement[];
  lastUpdated: string;
}

const fetchNotionData = async (): Promise<NotionData> => {
  const { data, error } = await supabase.functions.invoke('fetch-notion-data');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as NotionData;
};

export const useNotionData = () => {
  return useQuery({
    queryKey: ['notion-data'],
    queryFn: fetchNotionData,
    staleTime: 1000 * 30, // 30 seconds - data considered fresh
    refetchInterval: 1000 * 60, // Auto-refetch every 1 minute for near real-time
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 3,
  });
};
