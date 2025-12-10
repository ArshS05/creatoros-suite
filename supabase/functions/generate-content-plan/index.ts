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

    const systemPrompt = `You are a Content Strategist AI creating targeted 30-day content calendars. Output ONLY valid JSON - no markdown, no code blocks, no explanations.`;

    let userPrompt = "";
    
    if (regenerateDay !== null) {
      userPrompt = `Create ONE content day for:
Niche: ${niche} | Type: ${contentType} | Audience: ${audience} | Goal: ${goal}

Return ONLY this JSON (no markdown):
{"day":${regenerateDay},"idea":"specific idea","hook":"3-sec hook","format":"format type","caption":"caption with emojis","hashtags":["tag1","tag2","tag3","tag4","tag5"],"postingTime":"Day Time","engagementStrategy":"CTA strategy"}`;
    } else {
      userPrompt = `Create 30-day content calendar:
Niche: ${niche}
Type: ${contentType}
Audience: ${audience}
Goal: ${goal}
Level: ${experience}

RULES:
- Each day unique, no repeats
- Specific ideas, not generic
- 5 hashtags per day (no # symbol)
- Short captions (under 150 chars)

Return ONLY valid JSON array (no markdown, no code blocks):
{"days":[{"day":1,"idea":"specific idea","hook":"attention hook","format":"content format","caption":"short caption","hashtags":["tag1","tag2","tag3","tag4","tag5"],"postingTime":"Day Time EST","engagementStrategy":"CTA tip"},{"day":2,...},...all 30 days]}`;
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
    let content = data.choices?.[0]?.message?.content || "";
    
    console.log("AI Response received, parsing JSON...");
    
    // Clean the response - remove markdown code blocks
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    // Try to find JSON object in the response
    let result;
    try {
      // First try direct parse
      result = JSON.parse(content);
    } catch (e1) {
      console.log("Direct parse failed, trying to extract JSON...");
      
      // Try to find JSON object pattern
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          // Try to fix incomplete JSON by closing arrays and objects
          let jsonStr = jsonMatch[0];
          
          // Count open/close brackets
          const openBrackets = (jsonStr.match(/\[/g) || []).length;
          const closeBrackets = (jsonStr.match(/\]/g) || []).length;
          const openBraces = (jsonStr.match(/\{/g) || []).length;
          const closeBraces = (jsonStr.match(/\}/g) || []).length;
          
          // If truncated, try to close it properly
          if (openBrackets > closeBrackets || openBraces > closeBraces) {
            console.log("JSON appears truncated, attempting to fix...");
            
            // Remove any trailing incomplete elements
            jsonStr = jsonStr.replace(/,\s*"[^"]*"?\s*:?\s*"?[^"]*$/, '');
            jsonStr = jsonStr.replace(/,\s*\{[^}]*$/, '');
            jsonStr = jsonStr.replace(/,\s*"[^"]*$/, '');
            
            // Close arrays and objects
            for (let i = 0; i < openBrackets - closeBrackets; i++) jsonStr += ']';
            for (let i = 0; i < openBraces - closeBraces; i++) jsonStr += '}';
          }
          
          result = JSON.parse(jsonStr);
        } catch (e2) {
          console.error("JSON extraction failed:", e2);
          throw new Error("Failed to parse AI response");
        }
      } else {
        throw new Error("No JSON found in response");
      }
    }

    // Validate and normalize the result
    if (regenerateDay !== null) {
      // Single day response
      if (!result.day) result.day = regenerateDay;
      if (!result.hashtags) result.hashtags = [];
      if (!Array.isArray(result.hashtags)) result.hashtags = [result.hashtags];
    } else {
      // Full 30-day response
      if (!result.days) {
        // Maybe it's just an array
        if (Array.isArray(result)) {
          result = { days: result };
        } else {
          throw new Error("Invalid response structure");
        }
      }
      
      // Normalize each day
      result.days = result.days.map((day: any, index: number) => ({
        day: day.day || index + 1,
        idea: day.idea || "Content idea",
        hook: day.hook || "Attention-grabbing hook",
        format: day.format || contentType,
        caption: day.caption || "",
        hashtags: Array.isArray(day.hashtags) ? day.hashtags.slice(0, 10) : [],
        postingTime: day.postingTime || "6 PM EST",
        engagementStrategy: day.engagementStrategy || "Engage with comments"
      }));
    }

    console.log(`Successfully parsed ${regenerateDay ? '1 day' : result.days?.length + ' days'}`);
    
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
