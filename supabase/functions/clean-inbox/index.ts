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
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Analyzing ${messages?.length || 0} inbox messages`);

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
            content: `You are an AI assistant for content creators that analyzes collaboration requests. You categorize messages by priority, estimate deal values, identify red flags, and provide actionable recommendations. Always respond with valid JSON.`
          },
          {
            role: "user",
            content: `Analyze these collaboration messages and sort them by priority:

${JSON.stringify(messages, null, 2)}

For each message, provide:
1. Priority score (1-10, 10 being highest)
2. Category (brand, agency, pr, spam, other)
3. Estimated deal value range
4. Red flags (if any)
5. Recommended action (respond, negotiate, decline, investigate)
6. Suggested response template

Return as JSON:
{
  "analysis": [
    {
      "messageId": "...",
      "priorityScore": 8,
      "category": "brand",
      "estimatedValue": "$3,000 - $5,000",
      "redFlags": [],
      "recommendedAction": "respond",
      "responseTemplate": "Hi [Name], thank you for reaching out..."
    }
  ],
  "summary": {
    "totalPotentialValue": "$X - $Y",
    "highPriority": N,
    "spamDetected": N,
    "recommendation": "Focus on..."
  }
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
    console.error("Error in clean-inbox:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
