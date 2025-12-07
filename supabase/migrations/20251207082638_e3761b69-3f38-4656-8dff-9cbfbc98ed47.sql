-- Content Plans table for AI-generated 30-day calendars
CREATE TABLE public.content_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  niche TEXT NOT NULL,
  platforms TEXT[] DEFAULT '{}',
  style TEXT,
  plan JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Scripts table for generated scripts, hooks, captions
CREATE TABLE public.scripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  topic TEXT,
  platform TEXT,
  script_content TEXT,
  hooks TEXT[] DEFAULT '{}',
  captions TEXT[] DEFAULT '{}',
  hashtags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ideas table for idea scrapbook
CREATE TABLE public.ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'note' CHECK (type IN ('note', 'image', 'audio')),
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  is_favorite BOOLEAN DEFAULT false,
  ai_generated BOOLEAN DEFAULT false,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Collabs table for collab tracker
CREATE TABLE public.collabs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  brand TEXT NOT NULL,
  campaign TEXT,
  value DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'negotiating' CHECK (status IN ('negotiating', 'contracted', 'in-progress', 'delivered', 'paid', 'completed')),
  deliverables TEXT[] DEFAULT '{}',
  deadline DATE,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'invoiced', 'paid')),
  contract_signed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inbox messages for collab inbox
CREATE TABLE public.inbox_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  sender TEXT NOT NULL,
  company TEXT,
  subject TEXT NOT NULL,
  preview TEXT,
  full_content TEXT,
  budget TEXT,
  deadline DATE,
  category TEXT DEFAULT 'other' CHECK (category IN ('brand', 'agency', 'pr', 'other', 'spam')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  starred BOOLEAN DEFAULT false,
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Websites table for website builder
CREATE TABLE public.websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  username TEXT NOT NULL,
  name TEXT,
  bio TEXT,
  headline TEXT,
  about TEXT,
  theme TEXT DEFAULT 'dark',
  links JSONB DEFAULT '[]',
  services JSONB DEFAULT '[]',
  sections JSONB DEFAULT '[]',
  html_content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables (with permissive policies for MVP - no auth required initially)
ALTER TABLE public.content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for MVP (allows all operations without auth)
CREATE POLICY "Allow all access to content_plans" ON public.content_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to scripts" ON public.scripts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to ideas" ON public.ideas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to collabs" ON public.collabs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to inbox_messages" ON public.inbox_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to websites" ON public.websites FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_content_plans_updated_at BEFORE UPDATE ON public.content_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON public.ideas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_collabs_updated_at BEFORE UPDATE ON public.collabs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_websites_updated_at BEFORE UPDATE ON public.websites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();