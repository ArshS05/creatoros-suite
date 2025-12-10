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
    const { 
      niche, 
      contentType = "Mixed", 
      audience = "General audience", 
      goal = "Growth", 
      experience = "Intermediate",
      regenerateDay = null 
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating content plan for niche: ${niche}, type: ${contentType}, goal: ${goal}`);

    const systemPrompt = `You are a Content Strategist AI who creates ultra-targeted, trend-aware, platform-optimized 30-day content calendars.

You are an expert in:
- Social media algorithms and what content performs best
- Trending topics and trendjacking strategies
- Hook psychology and attention-grabbing techniques
- Platform-specific formatting (Reels, Shorts, Carousels, Long-form, X Posts)
- Engagement optimization and community building
- Hashtag research and strategic tagging

Your responsibilities:
1. Analyze top-performing trends in this niche (trendjacking opportunities)
2. Provide platform-specific formatting ideas based on content type
3. Create highly specific, non-generic content ideas
4. Each day must be unique - NO repeated ideas or similar concepts
5. Ideas must be actionable, specific, and designed for high performance
6. Include psychological hooks that stop the scroll
7. Provide strategic posting times based on platform and audience behavior

CRITICAL: Generate DETAILED, SPECIFIC content. No generic advice. Each idea should feel like it was researched specifically for this niche.`;

    let userPrompt = "";
    
    if (regenerateDay !== null) {
      userPrompt = `Regenerate ONLY day ${regenerateDay} of a content calendar for:
- Niche: ${niche}
- Content Type: ${contentType}
- Target Audience: ${audience}
- Goal: ${goal}
- Experience Level: ${experience}

Create a FRESH, UNIQUE idea that is different from typical content in this niche. Be creative and specific.

Output strictly in JSON:
{
  "day": ${regenerateDay},
  "idea": "Specific, detailed content idea",
  "hook": "Attention-grabbing first 3 seconds script",
  "format": "Specific format recommendation",
  "caption": "Full caption with emojis, story, and CTA",
  "hashtags": ["10-20 niche-specific hashtags"],
  "postingTime": "Optimal time with timezone consideration",
  "engagementStrategy": "Specific CTA, comment bait, share incentive strategy"
}`;
    } else {
      userPrompt = `Create a HIGHLY detailed 30-day content calendar for:

**Inputs:**
- Niche: ${niche}
- Content Type: ${contentType}
- Target Audience: ${audience}
- Content Goal: ${goal}
- Experience Level: ${experience}

**Your Task:**
Generate 30 days of content where each day includes:

1. **idea**: A specific, unique content idea (not generic). Include the exact angle, story, or approach.
2. **hook**: The first 3 seconds - what will you say/show to stop the scroll? Be specific.
3. **format**: Exact format based on content type (e.g., "Talking head with B-roll", "Text overlay Reel", "Carousel with 7 slides")
4. **caption**: Full caption (150-300 characters) with storytelling, emojis, and clear CTA
5. **hashtags**: Array of 10-20 highly relevant, niche-specific hashtags (mix of popular and niche)
6. **postingTime**: Best time to post (e.g., "Tuesday 7:00 PM EST - peak engagement for ${niche}")
7. **engagementStrategy**: Specific strategy to boost engagement (comment prompts, share incentives, story polls, etc.)

**Content Strategy by Week:**
- Week 1 (Days 1-7): Introduction & Authority Building
- Week 2 (Days 8-14): Value & Education
- Week 3 (Days 15-21): Engagement & Community
- Week 4 (Days 22-30): Growth & Viral Push

**Rules:**
- NO generic content like "share your journey" or "tips video"
- Each idea must be SPECIFIC with exact topics, angles, or stories
- Vary content formats throughout the month
- Include trending formats and sounds references
- Make hooks attention-grabbing and specific
- Hashtags should be researched-quality, not generic

Output strictly in structured JSON:
{
  "days": [
    {
      "day": 1,
      "idea": "Specific detailed idea with exact angle",
      "hook": "Exact words/visuals for first 3 seconds",
      "format": "Detailed format specification",
      "caption": "Full engaging caption with emojis and CTA",
      "hashtags": ["hashtag1", "hashtag2", "...10-20 total"],
      "postingTime": "Day Time Timezone - reason",
      "engagementStrategy": "Specific engagement tactic"
    }
  ]
}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a few moments." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI Response received, parsing JSON...");
    
    // Parse JSON from response
    let result;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Raw content:", content?.substring(0, 500));
      return new Response(JSON.stringify({ 
        error: "Failed to parse AI response. Please try again.",
        rawContent: content?.substring(0, 1000)
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Successfully generated content plan");
    
    return new Response(JSON.stringify(result), {
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
