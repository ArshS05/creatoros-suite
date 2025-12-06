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
    const { videoUrl, videoDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Rescripting video: ${videoUrl}`);

    // Since we can't actually scrape video content, we'll use the URL as context
    // and ask the AI to generate fresh content based on the video type/topic
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
            content: `You are an expert content repurposing specialist. You take existing video concepts and create fresh, new scripts while maintaining the core message but with new angles, hooks, and presentation styles. Always respond with valid JSON.`
          },
          {
            role: "user",
            content: `Based on this video: ${videoUrl}
${videoDescription ? `Video description/topic: ${videoDescription}` : ''}

Create completely fresh content based on similar themes. Generate:

1. A new full script (60 seconds) with a different angle
2. 5 viral hook variations
3. 3 different caption options
4. 15 trending hashtags

Return as JSON:
{
  "script": "[HOOK - 0-3 seconds]\\n\\"Fresh hook here...\\"\\n\\n[INTRO - 3-10 seconds]\\nIntro text...\\n\\n[MAIN CONTENT - 10-45 seconds]\\nMain points...\\n\\n[CTA - 45-60 seconds]\\nCall to action...",
  "hooks": ["hook1", "hook2", "hook3", "hook4", "hook5"],
  "captions": ["Full caption 1 with emojis and formatting", "Caption 2", "Caption 3"],
  "hashtags": ["#tag1", "#tag2", "#tag3", ...]
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
    
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { rawContent: content };
      }
    } catch {
      result = { rawContent: content };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in rescript-video:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
