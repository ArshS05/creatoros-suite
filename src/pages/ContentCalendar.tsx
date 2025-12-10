import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Sparkles, 
  Download,
  Loader2,
  LayoutGrid,
  CalendarDays,
  FileText,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { saveContentPlan, getContentPlans, deleteContentPlan } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContentSetupModal, ContentSetupParams } from "@/components/calendar/ContentSetupModal";
import { ContentDayCard, ContentDay } from "@/components/calendar/ContentDayCard";

type ViewMode = "grid" | "calendar" | "list";

export default function ContentCalendar() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  const [contentDays, setContentDays] = useState<ContentDay[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentParams, setCurrentParams] = useState<ContentSetupParams | null>(null);
  const [savedPlans, setSavedPlans] = useState<Array<{ id: string; niche: string; created_at: string }>>([]);

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    try {
      const plans = await getContentPlans();
      if (plans && plans.length > 0) {
        setSavedPlans(plans.map(p => ({ 
          id: p.id, 
          niche: p.niche, 
          created_at: p.created_at 
        })));
        
        // Load the latest plan
        const latestPlan = plans[0];
        const planData = latestPlan.plan as unknown;
        if (Array.isArray(planData) && planData.length > 0 && typeof planData[0] === 'object' && planData[0] !== null && 'idea' in planData[0]) {
          setContentDays(planData as ContentDay[]);
        }
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
    }
  };

  const handleGenerate = async (params: ContentSetupParams) => {
    setIsGenerating(true);
    setCurrentParams(params);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-content-plan', {
        body: params
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        toast({ 
          title: "Generation failed", 
          description: data.error, 
          variant: "destructive" 
        });
        return;
      }

      if (data?.days && Array.isArray(data.days)) {
        setContentDays(data.days);
        
        // Save to database
        await saveContentPlan({
          niche: params.niche,
          platforms: [params.contentType],
          style: `${params.goal} - ${params.experience}`,
          plan: data.days,
        });

        await loadSavedPlans();
        toast({ 
          title: `${params.numberOfDays}-Day Plan Generated!`, 
          description: `Created ${data.days.length} days of content for ${params.niche}` 
        });
        setShowGenerator(false);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({ 
        title: "Generation failed", 
        description: "Please try again", 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateDay = async (day: number) => {
    if (!currentParams) {
      toast({ 
        title: "Missing context", 
        description: "Please generate a full plan first", 
        variant: "destructive" 
      });
      return;
    }

    setRegeneratingDay(day);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-content-plan', {
        body: { ...currentParams, regenerateDay: day }
      });

      if (error) throw error;

      if (data && !data.error) {
        setContentDays(prev => prev.map(d => d.day === day ? { ...data, day } : d));
        toast({ title: `Day ${day} regenerated!` });
      }
    } catch (error) {
      console.error("Regeneration error:", error);
      toast({ 
        title: "Regeneration failed", 
        description: "Please try again", 
        variant: "destructive" 
      });
    } finally {
      setRegeneratingDay(null);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deleteContentPlan(planId);
      await loadSavedPlans();
      if (savedPlans.length === 1) {
        setContentDays([]);
      }
      toast({ title: "Plan deleted" });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const exportPlan = () => {
    if (contentDays.length === 0) {
      toast({ title: "No content to export", variant: "destructive" });
      return;
    }

    let content = `# 30-Day Content Calendar\n\n`;
    content += `Generated for: ${currentParams?.niche || 'Your Niche'}\n`;
    content += `Content Type: ${currentParams?.contentType || 'Mixed'}\n`;
    content += `Goal: ${currentParams?.goal || 'Growth'}\n\n`;
    content += `---\n\n`;

    contentDays.forEach(day => {
      content += `## Day ${day.day}\n\n`;
      content += `**💡 Idea:** ${day.idea}\n\n`;
      content += `**🎣 Hook:** ${day.hook}\n\n`;
      content += `**📱 Format:** ${day.format}\n\n`;
      content += `**📝 Caption:**\n${day.caption}\n\n`;
      content += `**#️⃣ Hashtags:** ${day.hashtags.join(' ')}\n\n`;
      content += `**⏰ Best Time:** ${day.postingTime}\n\n`;
      content += `**🎯 Engagement Strategy:** ${day.engagementStrategy}\n\n`;
      content += `---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-calendar-${currentParams?.niche?.replace(/\s+/g, '-') || 'plan'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Calendar exported!", description: "Downloaded as Markdown file" });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Calendar</h1>
            <p className="text-muted-foreground mt-1">AI-powered 30-day content planning</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-secondary rounded-xl p-1">
              {[
                { mode: "grid" as ViewMode, icon: LayoutGrid },
                { mode: "calendar" as ViewMode, icon: CalendarDays },
                { mode: "list" as ViewMode, icon: FileText },
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    viewMode === mode 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={exportPlan}
              disabled={contentDays.length === 0}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
              onClick={() => setShowGenerator(true)}
            >
              <Sparkles className="w-4 h-4" />
              Generate Plan
            </Button>
          </div>
        </div>

        {/* Setup Modal */}
        <ContentSetupModal
          isOpen={showGenerator}
          onClose={() => setShowGenerator(false)}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Empty State */}
        {contentDays.length === 0 && (
          <div className="bg-card border border-border rounded-3xl p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Content Plan Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Generate a personalized 30-day content calendar tailored to your niche, audience, and goals.
            </p>
            <Button 
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={() => setShowGenerator(true)}
            >
              <Sparkles className="w-5 h-5" />
              Generate 30-Day Plan
            </Button>
          </div>
        )}

        {/* Content Grid View */}
        {contentDays.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentDays.map((day) => (
              <ContentDayCard
                key={day.day}
                content={day}
                onRegenerate={handleRegenerateDay}
                isRegenerating={regeneratingDay === day.day}
              />
            ))}
          </div>
        )}

        {/* Calendar View */}
        {contentDays.length > 0 && viewMode === "calendar" && (
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {contentDays.slice(0, 28).map((content) => (
                <div
                  key={content.day}
                  className="h-32 rounded-xl border border-border bg-secondary/20 p-2 hover:border-primary/50 transition-colors cursor-pointer group"
                  title={content.idea}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {content.day}
                  </span>
                  <p className="mt-1 text-xs text-foreground line-clamp-3">{content.idea}</p>
                </div>
              ))}
            </div>
            {contentDays.length > 28 && (
              <div className="grid grid-cols-7 gap-2 mt-2">
                {contentDays.slice(28).map((content) => (
                  <div
                    key={content.day}
                    className="h-32 rounded-xl border border-border bg-secondary/20 p-2 hover:border-primary/50 transition-colors cursor-pointer group"
                    title={content.idea}
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {content.day}
                    </span>
                    <p className="mt-1 text-xs text-foreground line-clamp-3">{content.idea}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* List View */}
        {contentDays.length > 0 && viewMode === "list" && (
          <div className="space-y-3">
            {contentDays.map((day) => (
              <div 
                key={day.day}
                className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0">
                  {day.day}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{day.idea}</h3>
                  <p className="text-sm text-muted-foreground truncate">{day.hook}</p>
                </div>
                <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg flex-shrink-0">
                  {day.format}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Saved Plans */}
        {savedPlans.length > 0 && (
          <div className="bg-card border border-border rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Saved Plans</h2>
            <div className="space-y-2">
              {savedPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-foreground">{plan.niche}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
