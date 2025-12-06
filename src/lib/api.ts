import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
