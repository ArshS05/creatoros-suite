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
  style?: string;
  sections?: string[];
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
