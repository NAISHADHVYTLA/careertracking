import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Phase {
  name: string;
  progress: number;
  color: string;
  completed: number;
  total: number;
}

interface NotionData {
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
  };
  phases: Phase[];
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
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refetch every 5 minutes
  });
};
