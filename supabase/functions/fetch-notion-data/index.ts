import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY');

// Database IDs
const ROADMAP_DB_ID = '5a6ef23e8c574890b4d5ebf44823619b';
const DAILY_LOG_DB_ID = 'f57f69acf7c646b7b6b40ba622973baf';
const LEETCODE_DB_ID = '02fbabf965b148be85732aad9535497b';
const ACHIEVEMENT_DB_ID = 'c85882449a7b438e9f77f5972dd55147';

interface NotionRoadmapPage {
  id: string;
  properties: {
    Topic: { title: { plain_text: string }[] };
    Phase: { select: { name: string } | null };
    Status: { select: { name: string } | null };
    Progress: { number: number | null };
  };
}

interface NotionDailyLogPage {
  id: string;
  properties: {
    Name: { title: { plain_text: string }[] };
    Date: { date: { start: string } | null };
    Hours: { number: number | null };
    'LeetCode Problems': { number: number | null };
    'XP Earned': { number: number | null };
    Mood: { select: { name: string } | null };
  };
}

interface NotionLeetCodePage {
  id: string;
  properties: {
    Problem: { title: { plain_text: string }[] };
    Status: { select: { name: string } | null };
    Difficulty: { select: { name: string } | null };
    XP: { number: number | null };
  };
}

interface NotionAchievementPage {
  id: string;
  properties: {
    Achievement: { title: { plain_text: string }[] };
    Status: { select: { name: string } | null };
    Rarity: { select: { name: string } | null };
    Description: { rich_text: { plain_text: string }[] };
    'XP Reward': { number: number | null };
  };
}

async function queryNotionDatabase<T>(databaseId: string): Promise<T[]> {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 100 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Notion API error for ${databaseId}: ${response.status} - ${errorText}`);
      return []; // Return empty array instead of throwing
    }

    const data = await response.json();
    return data.results as T[];
  } catch (error) {
    console.error(`Failed to query database ${databaseId}:`, error);
    return []; // Return empty array on error
  }
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY is not configured');
    }

    // Fetch all databases in parallel
    const [roadmapPages, dailyLogPages, leetCodePages, achievementPages] = await Promise.all([
      queryNotionDatabase<NotionRoadmapPage>(ROADMAP_DB_ID),
      queryNotionDatabase<NotionDailyLogPage>(DAILY_LOG_DB_ID),
      queryNotionDatabase<NotionLeetCodePage>(LEETCODE_DB_ID),
      queryNotionDatabase<NotionAchievementPage>(ACHIEVEMENT_DB_ID),
    ]);

    // === ROADMAP DATA ===
    const phases = ['Foundation', 'CS Fundamentals', 'Backend', 'System Design', 'ML/AI', 'MLOps'];
    const phaseData = phases.map((phaseName, index) => {
      const phasePages = roadmapPages.filter(
        (page) => page.properties.Phase?.select?.name === phaseName
      );
      const completedCount = phasePages.filter(
        (page) => page.properties.Status?.select?.name === 'Completed'
      ).length;
      const totalCount = phasePages.length;
      const colors = ['primary', 'accent', 'xp', 'streak', 'success', 'chart-6'];
      
      return {
        name: phaseName,
        progress: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
        color: colors[index],
        completed: completedCount,
        total: totalCount,
      };
    });

    const totalTopics = roadmapPages.length;
    const completedTopics = roadmapPages.filter(
      (page) => page.properties.Status?.select?.name === 'Completed'
    ).length;

    // === DAILY STUDY LOG DATA ===
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    
    // Parse study dates
    const studyDays = dailyLogPages
      .filter(page => page.properties.Date?.date?.start)
      .map(page => page.properties.Date!.date!.start);

    // Calculate weekly activity
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyActivity = weekDays.map((day, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      const dateStr = dayDate.toISOString().split('T')[0];
      
      const dayLogs = dailyLogPages.filter(page => {
        const logDate = page.properties.Date?.date?.start;
        return logDate === dateStr;
      });

      const hours = dayLogs.reduce((sum, log) => sum + (log.properties.Hours?.number || 0), 0);
      const problems = dayLogs.reduce((sum, log) => sum + (log.properties['LeetCode Problems']?.number || 0), 0);

      return { day, hours, problems };
    });

    // Calculate total hours studied (this month)
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthlyHours = dailyLogPages
      .filter(page => {
        const dateStr = page.properties.Date?.date?.start;
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, page) => sum + (page.properties.Hours?.number || 0), 0);

    // Calculate streak
    const sortedDates = studyDays
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().split('T')[0];

    // Check if today or yesterday was a study day for current streak
    if (sortedDates.length > 0) {
      const mostRecentStr = sortedDates[0].toISOString().split('T')[0];
      if (mostRecentStr === todayStr || mostRecentStr === yesterdayStr) {
        for (let i = 0; i < sortedDates.length; i++) {
          const expectedDate = new Date(today);
          expectedDate.setDate(today.getDate() - i);
          if (mostRecentStr === yesterdayStr) {
            expectedDate.setDate(expectedDate.getDate() - 1);
          }
          const expectedStr = expectedDate.toISOString().split('T')[0];
          
          if (sortedDates.some(d => d.toISOString().split('T')[0] === expectedStr)) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const diff = (sortedDates[i - 1].getTime() - sortedDates[i].getTime()) / 86400000;
        if (diff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    // === LEETCODE DATA ===
    const problemsSolved = leetCodePages.filter(
      page => page.properties.Status?.select?.name === '✅ Solved'
    ).length;

    const leetCodeXP = leetCodePages
      .filter(page => page.properties.Status?.select?.name === '✅ Solved')
      .reduce((sum, page) => sum + (page.properties.XP?.number || 0), 0);

    // === ACHIEVEMENT DATA ===
    const achievements = achievementPages.map(page => {
      const title = page.properties.Achievement?.title?.[0]?.plain_text || 'Unknown';
      const rarityRaw = page.properties.Rarity?.select?.name || '⬜ Common';
      const rarity = rarityRaw.includes('Common') ? 'common' 
        : rarityRaw.includes('Rare') ? 'rare'
        : rarityRaw.includes('Epic') ? 'epic' 
        : 'legendary';
      const unlocked = page.properties.Status?.select?.name === '✅ Unlocked';
      const description = page.properties.Description?.rich_text?.[0]?.plain_text || '';
      const xpReward = page.properties['XP Reward']?.number || 0;

      return { title, rarity, unlocked, description, xpReward };
    });

    // === XP CALCULATION ===
    const dailyLogXP = dailyLogPages.reduce(
      (sum, page) => sum + (page.properties['XP Earned']?.number || 0), 0
    );
    const achievementXP = achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.xpReward, 0);
    const topicXP = completedTopics * 10;
    
    const totalXP = dailyLogXP + leetCodeXP + achievementXP + topicXP;
    const level = Math.floor(totalXP / 100) + 1;
    const currentXP = totalXP % 100;
    const levelXP = 100;

    // Calculate focus score based on consistency
    const weeklyHours = weeklyActivity.reduce((sum, day) => sum + day.hours, 0);
    const daysStudiedThisWeek = weeklyActivity.filter(day => day.hours > 0).length;
    const focusScore = Math.min(100, Math.round((daysStudiedThisWeek / 7) * 100));

    // Current phase
    const currentPhase = phaseData.find(p => p.progress < 100)?.name || 'Complete!';
    
    // Weekly goal (assume 20 hours target)
    const weeklyGoalProgress = Math.min(100, Math.round((weeklyHours / 20) * 100));

    const result = {
      xp: { currentXP, levelXP, level, totalXP },
      stats: {
        topicsCompleted: completedTopics,
        totalTopics,
        problemsSolved,
        hoursStudied: Math.round(monthlyHours * 10) / 10,
        currentPhase,
        weeklyGoalProgress,
        focusScore,
      },
      phases: phaseData,
      weeklyActivity,
      streak: { current: currentStreak, longest: longestStreak },
      studyDays,
      achievements,
      lastUpdated: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching Notion data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
