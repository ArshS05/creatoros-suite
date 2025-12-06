import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingContent } from "@/components/dashboard/UpcomingContent";
import { Users, Eye, Heart, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateScript } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const handleQuickGenerate = async (type: "script" | "hooks" | "captions") => {
    setIsGenerating(true);
    try {
      const result = await generateScript({
        topic: "trending content in my niche",
        platform: "TikTok/Instagram Reel",
        duration: "60 seconds",
        style: type === "hooks" ? "Hook-focused" : type === "captions" ? "Caption-focused" : "Full script",
      });

      if (result) {
        if (type === "script" && result.script) {
          const scriptText = typeof result.script === "string" 
            ? result.script 
            : `${result.script.hook}\n\n${result.script.intro}\n\n${result.script.mainContent}\n\n${result.script.cta}`;
          setGeneratedScript(scriptText);
        } else if (type === "hooks" && result.alternativeHooks?.length) {
          setGeneratedScript(result.alternativeHooks.join("\n\n"));
        } else if (type === "captions" && result.captions?.length) {
          setGeneratedScript(result.captions.join("\n\n---\n\n"));
        }
        toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} generated!` });
      }
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 opacity-0 animate-in">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Welcome back, Creator
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Here's what's happening with your content today.
            </p>
          </div>
          <Button className="gap-2" onClick={() => handleQuickGenerate("script")} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Content
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="opacity-0 animate-in stagger-1">
            <StatCard
              title="Total Followers"
              value="247.5K"
              change={12.5}
              icon={<Users className="w-4 h-4" />}
            />
          </div>
          <div className="opacity-0 animate-in stagger-2">
            <StatCard
              title="Total Views"
              value="1.2M"
              change={8.2}
              icon={<Eye className="w-4 h-4" />}
            />
          </div>
          <div className="opacity-0 animate-in stagger-3">
            <StatCard
              title="Engagement Rate"
              value="4.8%"
              change={-2.1}
              icon={<Heart className="w-4 h-4" />}
            />
          </div>
          <div className="opacity-0 animate-in stagger-4">
            <StatCard
              title="Revenue (MTD)"
              value="$12,450"
              change={23.4}
              icon={<TrendingUp className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="opacity-0 animate-in" style={{ animationDelay: '0.3s' }}>
              <UpcomingContent />
            </div>
            <div className="opacity-0 animate-in" style={{ animationDelay: '0.4s' }}>
              <RecentActivity />
            </div>
          </div>

          <div className="opacity-0 animate-in" style={{ animationDelay: '0.5s' }}>
            <TaskList />
          </div>
        </div>

        <div className="glass-card p-8 opacity-0 animate-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-foreground rounded-xl">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-foreground">AI Content Assistant</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Let AI help you create engaging content. Generate scripts, hooks, captions, and more with just a click.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleQuickGenerate("script")}
                  disabled={isGenerating}
                >
                  Generate Script
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleQuickGenerate("hooks")}
                  disabled={isGenerating}
                >
                  Create Hooks
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleQuickGenerate("captions")}
                  disabled={isGenerating}
                >
                  Write Captions
                </Button>
              </div>
              
              {generatedScript && (
                <div className="mt-4 p-4 bg-secondary rounded-xl">
                  <p className="text-xs text-muted-foreground mb-2">Generated Content:</p>
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                    {generatedScript}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedScript);
                      toast({ title: "Copied to clipboard!" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
