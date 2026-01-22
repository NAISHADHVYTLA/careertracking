import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY');
const DATABASE_ID = '5a6ef23e8c574890b4d5ebf44823619b';

interface NotionPage {
  id: string;
  properties: {
    Topic: { title: { plain_text: string }[] };
    Phase: { select: { name: string } | null };
    Status: { select: { name: string } | null };
    Progress: { number: number | null };
    Priority: { select: { name: string } | null };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY is not configured');
    }

    // Fetch all pages from the database
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Notion API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const pages = data.results as NotionPage[];

    // Calculate phase progress
    const phases = ['Foundation', 'CS Fundamentals', 'Backend', 'System Design', 'ML/AI', 'MLOps'];
    const phaseData = phases.map((phaseName, index) => {
      const phasePages = pages.filter(
        (page) => page.properties.Phase?.select?.name === phaseName
      );
      
      const completedCount = phasePages.filter(
        (page) => page.properties.Status?.select?.name === 'Completed'
      ).length;
      
      const totalCount = phasePages.length;
      const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      
      const colors = ['primary', 'accent', 'xp', 'streak', 'success', 'chart-6'];
      
      return {
        name: phaseName,
        progress,
        color: colors[index],
        completed: completedCount,
        total: totalCount,
      };
    });

    // Calculate overall stats
    const totalTopics = pages.length;
    const completedTopics = pages.filter(
      (page) => page.properties.Status?.select?.name === 'Completed'
    ).length;
    const inProgressTopics = pages.filter(
      (page) => page.properties.Status?.select?.name === 'In Progress'
    ).length;

    // Calculate XP (10 XP per completed topic, 5 XP per in-progress)
    const totalXP = completedTopics * 10 + inProgressTopics * 5;
    const level = Math.floor(totalXP / 100) + 1;
    const currentXP = totalXP % 100;
    const levelXP = 100;

    // Determine current phase (first non-completed phase)
    const currentPhase = phaseData.find(p => p.progress < 100)?.name || 'Complete!';

    // Calculate weekly goal progress (assume 3 topics per week goal)
    const weeklyGoalProgress = Math.min(100, Math.round((completedTopics % 3) / 3 * 100));

    const result = {
      xp: {
        currentXP,
        levelXP,
        level,
        totalXP,
      },
      stats: {
        topicsCompleted: completedTopics,
        totalTopics,
        problemsSolved: 0, // Would need LeetCode tracker
        hoursStudied: 0, // Would need Daily Study Log
        currentPhase,
        weeklyGoalProgress,
      },
      phases: phaseData,
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
