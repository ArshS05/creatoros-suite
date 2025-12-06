import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { niche, platforms, style, days = 30 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating ${days}-day content plan for niche: ${niche}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a content strategist for social media creators. Generate detailed, actionable content plans with specific ideas, hooks, and posting times. Always respond with valid JSON.`
          },
          {
            role: "user",
            content: `Create a ${days}-day content plan for a ${niche} creator on ${platforms?.join(', ') || 'Instagram, TikTok, YouTube'}.
            
Style preference: ${style || 'Mixed - Educational and Entertainment'}

For each day, provide:
1. Content title
2. Platform (Instagram/TikTok/YouTube)
3. Content type (Reel, Post, Story, Video)
4. Hook (first 3 seconds)
5. Brief script outline (3-4 bullet points)
6. Caption idea
7. 5 relevant hashtags
8. Best posting time

Return as JSON array with this structure:
{
  "plan": [
    {
      "day": 1,
      "title": "...",
      "platform": "...",
      "contentType": "...",
      "hook": "...",
      "scriptOutline": ["...", "...", "..."],
      "caption": "...",
      "hashtags": ["...", "...", "...", "...", "..."],
      "postingTime": "..."
    }
  ]
}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    // Try to parse JSON from the response
    let plan;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0]);
      } else {
        plan = { rawContent: content };
      }
    } catch {
      plan = { rawContent: content };
    }

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in generate-content-plan:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
