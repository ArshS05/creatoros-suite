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
      username, 
      style, 
      sections,
      businessName,
      businessType,
      colorTheme,
      fontStyle,
      features
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Building website for: ${username || businessName}`);
    console.log(`Style: ${style}, ColorTheme: ${colorTheme}, Font: ${fontStyle}`);

    const sectionsRequested = sections?.join(', ') || 'Hero, About, Services, Testimonials, Contact';
    const featuresRequested = features?.join(', ') || 'Responsive design, Smooth animations, Contact form';

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
            content: `You are an expert personal branding specialist, web designer, and copywriter. You create stunning, high-converting personal websites for content creators and businesses. 

Your websites feature:
- Compelling, benefit-focused copy that converts visitors into followers/customers
- Modern, aesthetic design with attention to visual hierarchy
- Strategic section placement for maximum engagement
- SEO-optimized content with proper meta descriptions

You MUST respond with ONLY valid JSON, no markdown, no explanation, just the JSON object.`
          },
          {
            role: "user",
            content: `Create comprehensive website content for "${businessName || username}".

CONTEXT:
- Business/Creator Type: ${businessType || 'Content Creator'}
- Design Style: ${style || 'Modern and minimal'}
- Color Theme Preference: ${colorTheme || 'Dark professional'}
- Font Style: ${fontStyle || 'Clean sans-serif'}
- Sections to include: ${sectionsRequested}
- Features requested: ${featuresRequested}

Generate DETAILED, PROFESSIONAL content. Be specific, avoid generic filler text.

REQUIRED OUTPUT - Return ONLY this JSON structure:
{
  "website": {
    "name": "Full Professional Name/Brand",
    "headline": "Powerful 5-10 word value proposition",
    "subheadline": "Supporting statement that expands on the headline",
    "bio": "2-3 compelling sentences about expertise and unique value",
    "about": {
      "title": "About section heading",
      "content": "3-4 paragraphs telling the brand story, journey, mission, and what makes them unique",
      "highlights": ["Key achievement 1", "Key achievement 2", "Key achievement 3", "Key achievement 4"]
    },
    "links": [
      { "title": "Primary CTA Button", "url": "#contact", "icon": "arrow-right", "isPrimary": true },
      { "title": "YouTube Channel", "url": "#", "icon": "youtube" },
      { "title": "Latest Podcast", "url": "#", "icon": "headphones" },
      { "title": "Free Resources", "url": "#", "icon": "gift" },
      { "title": "Book a Call", "url": "#", "icon": "calendar" }
    ],
    "services": [
      { 
        "name": "Premium Service Name", 
        "price": "$XXX", 
        "description": "Detailed 2-sentence description of what's included and the transformation/outcome",
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "popular": true
      },
      { 
        "name": "Mid-Tier Service", 
        "price": "$XXX", 
        "description": "Clear description of value provided",
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "popular": false
      },
      { 
        "name": "Entry Service", 
        "price": "$XXX", 
        "description": "Perfect starting point description",
        "features": ["Feature 1", "Feature 2"],
        "popular": false
      }
    ],
    "testimonials": [
      { "name": "Client Name", "role": "Their Title/Company", "content": "Detailed testimonial quote about results achieved", "avatar": "J" },
      { "name": "Client Name", "role": "Their Title", "content": "Another compelling testimonial", "avatar": "S" },
      { "name": "Client Name", "role": "Their Role", "content": "Third testimonial focusing on different benefit", "avatar": "M" }
    ],
    "features": [
      { "icon": "zap", "title": "Key Benefit 1", "description": "Brief explanation" },
      { "icon": "shield", "title": "Key Benefit 2", "description": "Brief explanation" },
      { "icon": "heart", "title": "Key Benefit 3", "description": "Brief explanation" },
      { "icon": "trending-up", "title": "Key Benefit 4", "description": "Brief explanation" }
    ],
    "contactIntro": "Compelling call-to-action paragraph inviting visitors to get in touch",
    "contactFormFields": ["name", "email", "message"],
    "socialLinks": {
      "instagram": "https://instagram.com/username",
      "youtube": "https://youtube.com/@channel",
      "tiktok": "https://tiktok.com/@username",
      "twitter": "https://twitter.com/username"
    },
    "seo": {
      "title": "60-character SEO title with main keyword",
      "description": "155-character meta description that encourages clicks",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    },
    "colorScheme": {
      "primary": "#6366f1",
      "secondary": "#8b5cf6",
      "accent": "#06b6d4",
      "background": "#0f172a",
      "surface": "#1e293b",
      "text": "#f8fafc",
      "muted": "#94a3b8"
    },
    "typography": {
      "heading": "Inter",
      "body": "Inter"
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
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
    
    console.log("Raw AI response length:", content?.length);
    
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        console.error("No JSON found in response");
        result = { rawContent: content };
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      result = { rawContent: content };
    }

    console.log("Successfully generated website content");
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
