import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

interface ContentPlanRequest {
  niche: string;
  platforms?: string[];
  style?: string;
  days?: number;
}

interface ScriptRequest {
  topic: string;
  platform?: string;
  duration?: string;
  style?: string;
}

interface RescriptRequest {
  videoUrl: string;
  videoDescription?: string;
}

interface InboxMessage {
  id: string;
  sender: string;
  company: string;
  subject: string;
  preview: string;
  budget?: string;
}

interface WebsiteRequest {
  username: string;
  businessName?: string;
  businessType?: string;
  style?: string;
  colorTheme?: string;
  fontStyle?: string;
  sections?: string[];
  features?: string[];
}

interface IdeaInput {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
}

const handleApiError = (error: unknown, context: string) => {
  console.error(`${context} error:`, error);
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
  throw error;
};

export async function generateContentPlan(request: ContentPlanRequest) {
  try {
    const { data, error } = await supabase.functions.invoke("generate-content-plan", {
      body: request,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Content plan generation");
  }
}

export async function generateScript(request: ScriptRequest) {
  try {
    const { data, error } = await supabase.functions.invoke("generate-script", {
      body: request,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Script generation");
  }
}

export async function rescriptVideo(request: RescriptRequest) {
  try {
    const { data, error } = await supabase.functions.invoke("rescript-video", {
      body: request,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Video rescript");
  }
}

export async function cleanInbox(messages: InboxMessage[]) {
  try {
    const { data, error } = await supabase.functions.invoke("clean-inbox", {
      body: { messages },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Inbox analysis");
  }
}

export async function buildWebsiteFromInstagram(request: WebsiteRequest) {
  try {
    const { data, error } = await supabase.functions.invoke("build-website", {
      body: request,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Website building");
  }
}

export async function organizeIdeas(ideas: IdeaInput[]) {
  try {
    const { data, error } = await supabase.functions.invoke("organize-ideas", {
      body: { ideas },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Ideas organization");
  }
}

// Dashboard Stats
export async function getDashboardStats() {
  try {
    // Get collabs stats
    const { data: collabs, error: collabsError } = await supabase
      .from("collabs")
      .select("*");
    if (collabsError) throw collabsError;

    // Get ideas count
    const { data: ideas, error: ideasError } = await supabase
      .from("ideas")
      .select("*");
    if (ideasError) throw ideasError;

    // Get content plans
    const { data: contentPlans, error: plansError } = await supabase
      .from("content_plans")
      .select("*");
    if (plansError) throw plansError;

    // Get inbox messages
    const { data: messages, error: messagesError } = await supabase
      .from("inbox_messages")
      .select("*");
    if (messagesError) throw messagesError;

    // Calculate stats
    const activeCollabs = collabs?.filter(c => c.status !== "completed").length || 0;
    const totalRevenue = collabs?.reduce((sum, c) => sum + (c.value || 0), 0) || 0;
    const totalIdeas = ideas?.length || 0;
    const newMessages = messages?.filter(m => m.status === "new").length || 0;

    return {
      collabs: collabs || [],
      ideas: ideas || [],
      contentPlans: contentPlans || [],
      messages: messages || [],
      stats: {
        activeCollabs,
        totalRevenue,
        totalIdeas,
        newMessages,
        contentPlanCount: contentPlans?.length || 0,
      }
    };
  } catch (error) {
    handleApiError(error, "Dashboard stats");
    return null;
  }
}

// Database CRUD operations

// Content Plans
export async function saveContentPlan(plan: {
  niche: string;
  platforms: string[];
  style: string;
  plan: Json;
}) {
  const { data, error } = await supabase
    .from("content_plans")
    .insert(plan)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getContentPlans() {
  const { data, error } = await supabase
    .from("content_plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteContentPlan(id: string) {
  const { error } = await supabase
    .from("content_plans")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Scripts
export async function saveScript(script: {
  title: string;
  topic?: string;
  platform?: string;
  script_content?: string;
  hooks?: string[];
  captions?: string[];
  hashtags?: string[];
}) {
  const { data, error } = await supabase
    .from("scripts")
    .insert(script)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getScripts() {
  const { data, error } = await supabase
    .from("scripts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteScript(id: string) {
  const { error } = await supabase
    .from("scripts")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Ideas
export async function createIdea(idea: {
  title: string;
  description?: string;
  type: string;
  tags?: string[];
  category?: string;
  is_favorite?: boolean;
  ai_generated?: boolean;
  file_url?: string;
}) {
  const { data, error } = await supabase
    .from("ideas")
    .insert(idea)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getIdeas() {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateIdea(id: string, updates: {
  title?: string;
  description?: string;
  type?: string;
  tags?: string[];
  category?: string;
  is_favorite?: boolean;
}) {
  const { data, error } = await supabase
    .from("ideas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteIdea(id: string) {
  const { error } = await supabase
    .from("ideas")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Collabs
export async function createCollab(collab: {
  brand: string;
  campaign?: string;
  value?: number;
  status?: string;
  deliverables?: string[];
  deadline?: string;
  payment_status?: string;
  contract_signed?: boolean;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("collabs")
    .insert(collab)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCollabs() {
  const { data, error } = await supabase
    .from("collabs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateCollab(id: string, updates: {
  brand?: string;
  campaign?: string;
  value?: number;
  status?: string;
  deliverables?: string[];
  deadline?: string;
  payment_status?: string;
  contract_signed?: boolean;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("collabs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCollab(id: string) {
  const { error } = await supabase
    .from("collabs")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Inbox Messages
export async function createInboxMessage(message: {
  sender: string;
  company?: string;
  subject: string;
  preview?: string;
  full_content?: string;
  budget?: string;
  category?: string;
  priority?: string;
}) {
  const { data, error } = await supabase
    .from("inbox_messages")
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getInboxMessages() {
  const { data, error } = await supabase
    .from("inbox_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateInboxMessage(id: string, updates: {
  status?: string;
  starred?: boolean;
  priority?: string;
  category?: string;
  ai_analysis?: Json;
}) {
  const { data, error } = await supabase
    .from("inbox_messages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInboxMessage(id: string) {
  const { error } = await supabase
    .from("inbox_messages")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Websites
export async function saveWebsite(website: {
  username: string;
  name?: string;
  bio?: string;
  headline?: string;
  about?: string;
  theme?: string;
  links?: Json;
  services?: Json;
  sections?: Json;
  html_content?: string;
  published?: boolean;
}) {
  const { data, error } = await supabase
    .from("websites")
    .insert(website)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWebsites() {
  const { data, error } = await supabase
    .from("websites")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateWebsite(id: string, updates: {
  name?: string;
  bio?: string;
  headline?: string;
  about?: string;
  theme?: string;
  links?: Json;
  services?: Json;
  sections?: Json;
  html_content?: string;
  published?: boolean;
}) {
  const { data, error } = await supabase
    .from("websites")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWebsite(id: string) {
  const { error } = await supabase
    .from("websites")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// HTML Export utility
export function generateWebsiteHTML(website: {
  name: string;
  bio: string;
  headline?: string;
  about?: string;
  links: { title: string; url: string }[];
  services?: { name: string; price: string; description: string }[];
  theme: string;
}): string {
  const isDark = website.theme === "dark" || website.theme === "gradient";
  const bgColor = website.theme === "gradient" 
    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    : website.theme === "dark" ? "#0f0f0f" : "#f5f5f5";
  const textColor = isDark ? "#ffffff" : "#0f0f0f";
  const mutedColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
  const cardBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.9)";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${website.name} - Creator Website</title>
  <meta name="description" content="${website.bio}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${bgColor};
      min-height: 100vh;
      color: ${textColor};
      padding: 2rem;
    }
    .container { max-width: 480px; margin: 0 auto; text-align: center; }
    .avatar {
      width: 96px; height: 96px; border-radius: 50%;
      background: #667eea; margin: 0 auto 1rem;
      display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem; font-weight: bold; color: white;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .headline { font-size: 1.1rem; margin-bottom: 0.5rem; }
    .bio { color: ${mutedColor}; margin-bottom: 2rem; font-size: 0.9rem; }
    .links { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
    .link-btn {
      display: block; padding: 1rem; background: ${cardBg};
      border-radius: 12px; text-decoration: none; color: ${textColor};
      font-weight: 500; transition: transform 0.2s, opacity 0.2s;
    }
    .link-btn:hover { transform: scale(1.02); opacity: 0.9; }
    .services { margin-top: 2rem; }
    .services h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: ${mutedColor}; margin-bottom: 1rem; }
    .service-card { background: ${cardBg}; border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem; text-align: left; }
    .service-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .service-name { font-weight: 600; }
    .service-price { font-weight: 700; color: #667eea; }
    .service-desc { font-size: 0.8rem; color: ${mutedColor}; }
    .footer { margin-top: 3rem; font-size: 0.75rem; color: ${mutedColor}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="avatar">${website.name.charAt(0).toUpperCase()}</div>
    <h1>${website.name}</h1>
    ${website.headline ? `<p class="headline">${website.headline}</p>` : ""}
    <p class="bio">${website.bio}</p>
    
    <div class="links">
      ${website.links.map(link => `<a href="${link.url}" class="link-btn" target="_blank">${link.title}</a>`).join("\n      ")}
    </div>
    
    ${website.services && website.services.length > 0 ? `
    <div class="services">
      <h2>Services</h2>
      ${website.services.map(s => `
      <div class="service-card">
        <div class="service-header">
          <span class="service-name">${s.name}</span>
          <span class="service-price">${s.price}</span>
        </div>
        <p class="service-desc">${s.description}</p>
      </div>`).join("")}
    </div>` : ""}
    
    <p class="footer">Made with CreatorOS</p>
  </div>
</body>
</html>`;
}