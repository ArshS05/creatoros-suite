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
    const { username, style, sections } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Building website for Instagram user: ${username}`);

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
            content: `You are a personal branding expert and web designer. You create compelling personal websites for content creators based on their Instagram presence. Generate professional, engaging content that converts visitors into followers and customers. Always respond with valid JSON.`
          },
          {
            role: "user",
            content: `Create website content for Instagram creator @${username}.

Style preference: ${style || 'Modern and minimal'}
Sections requested: ${sections?.join(', ') || 'Profile, Links, Content Grid, Services, Contact'}

Generate:
1. Professional bio (2-3 sentences)
2. Tagline/headline
3. About section (paragraph)
4. 4 link button suggestions with titles
5. 3 service offerings with names, prices, and descriptions
6. Contact form intro text
7. SEO meta title and description
8. Color scheme suggestion

Return as JSON:
{
  "website": {
    "name": "Creator Name",
    "headline": "Short catchy tagline",
    "bio": "Professional bio text...",
    "about": "Longer about section...",
    "links": [
      { "title": "Link 1", "url": "#", "icon": "youtube" },
      { "title": "Link 2", "url": "#", "icon": "tiktok" }
    ],
    "services": [
      { "name": "Service 1", "price": "$99", "description": "..." }
    ],
    "contactIntro": "Let's work together...",
    "seo": {
      "title": "...",
      "description": "..."
    },
    "colorScheme": {
      "primary": "#...",
      "secondary": "#...",
      "accent": "#..."
    }
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
    console.error("Error in build-website:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
