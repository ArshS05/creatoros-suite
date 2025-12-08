import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Eye, Heart, TrendingUp, Sparkles, Loader2, Briefcase, Lightbulb, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateScript, getDashboardStats } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DashboardData {
  stats: {
    activeCollabs: number;
    totalRevenue: number;
    totalIdeas: number;
    newMessages: number;
    contentPlanCount: number;
  };
  collabs: Array<{
    id: string;
    brand: string;
    status: string;
    value: number | null;
    deadline: string | null;
  }>;
  ideas: Array<{
    id: string;
    title: string;
    category: string | null;
    created_at: string;
  }>;
  contentPlans: Array<{
    id: string;
    niche: string;
    created_at: string;
  }>;
  messages: Array<{
    id: string;
    sender: string;
    subject: string;
    priority: string | null;
  }>;
}

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardStats();
      if (data) {
        setDashboardData(data as DashboardData);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const stats = dashboardData?.stats || {
    activeCollabs: 0,
    totalRevenue: 0,
    totalIdeas: 0,
    newMessages: 0,
    contentPlanCount: 0,
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
              title="Active Collabs"
              value={stats.activeCollabs}
              change={12.5}
              icon={<Briefcase className="w-4 h-4" />}
            />
          </div>
          <div className="opacity-0 animate-in stagger-2">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              change={8.2}
              icon={<TrendingUp className="w-4 h-4" />}
            />
          </div>
          <div className="opacity-0 animate-in stagger-3">
            <StatCard
              title="Ideas Saved"
              value={stats.totalIdeas}
              change={15.3}
              icon={<Lightbulb className="w-4 h-4" />}
            />
          </div>
          <div className="opacity-0 animate-in stagger-4">
            <StatCard
              title="New Messages"
              value={stats.newMessages}
              change={-2.1}
              icon={<Mail className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Active Collabs */}
            <div className="glass-card p-6 opacity-0 animate-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Briefcase className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-foreground">Active Collaborations</h3>
                    <p className="text-xs text-muted-foreground">{stats.activeCollabs} ongoing</p>
                  </div>
                </div>
                <a href="/collab-tracker" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  View All
                </a>
              </div>

              <div className="space-y-2">
                {dashboardData?.collabs.slice(0, 4).map((collab, index) => (
                  <div
                    key={collab.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {collab.brand.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{collab.brand}</p>
                      <p className="text-xs text-muted-foreground">
                        {collab.deadline ? `Due: ${formatDate(collab.deadline)}` : "No deadline"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {collab.value ? formatCurrency(collab.value) : "TBD"}
                      </p>
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-lg capitalize",
                        collab.status === "in-progress" ? "bg-primary/10 text-primary" :
                        collab.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                        "bg-secondary text-muted-foreground"
                      )}>
                        {collab.status}
                      </span>
                    </div>
                  </div>
                ))}

                {(!dashboardData?.collabs || dashboardData.collabs.length === 0) && (
                  <div className="text-center py-8">
                    <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No active collaborations</p>
                    <a href="/collab-tracker" className="text-sm text-primary hover:underline mt-1 inline-block">
                      Add your first collab
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Ideas */}
            <div className="glass-card p-6 opacity-0 animate-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Lightbulb className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-foreground">Recent Ideas</h3>
                    <p className="text-xs text-muted-foreground">{stats.totalIdeas} total</p>
                  </div>
                </div>
                <a href="/idea-scrapbook" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  View All
                </a>
              </div>

              <div className="space-y-2">
                {dashboardData?.ideas.slice(0, 4).map((idea, index) => (
                  <div
                    key={idea.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{idea.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {idea.category || "Uncategorized"} • {formatDate(idea.created_at)}
                      </p>
                    </div>
                  </div>
                ))}

                {(!dashboardData?.ideas || dashboardData.ideas.length === 0) && (
                  <div className="text-center py-8">
                    <Lightbulb className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No ideas saved yet</p>
                    <a href="/idea-scrapbook" className="text-sm text-primary hover:underline mt-1 inline-block">
                      Start capturing ideas
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Inbox Summary */}
          <div className="space-y-6">
            {/* Inbox Summary */}
            <div className="glass-card p-6 opacity-0 animate-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-foreground">Inbox</h3>
                <a href="/collab-inbox" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  View All
                </a>
              </div>

              <div className="space-y-2">
                {dashboardData?.messages.slice(0, 3).map((msg) => (
                  <div key={msg.id} className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        msg.priority === "high" ? "bg-red-500" :
                        msg.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                      )} />
                      <p className="text-sm font-medium text-foreground truncate">{msg.sender}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                  </div>
                ))}

                {(!dashboardData?.messages || dashboardData.messages.length === 0) && (
                  <div className="text-center py-4">
                    <Mail className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No new messages</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistant */}
            <div className="glass-card p-6 opacity-0 animate-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-foreground rounded-xl">
                  <Sparkles className="w-5 h-5 text-background" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-foreground">AI Content Assistant</h2>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Generate scripts, hooks, and captions instantly.
                  </p>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleQuickGenerate("script")}
                      disabled={isGenerating}
                    >
                      Generate Script
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="w-full"
                      onClick={() => handleQuickGenerate("hooks")}
                      disabled={isGenerating}
                    >
                      Create Hooks
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="w-full"
                      onClick={() => handleQuickGenerate("captions")}
                      disabled={isGenerating}
                    >
                      Write Captions
                    </Button>
                  </div>
                  
                  {generatedScript && (
                    <div className="mt-4 p-4 bg-secondary rounded-xl">
                      <p className="text-xs text-muted-foreground mb-2">Generated Content:</p>
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-sans max-h-40 overflow-y-auto">
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
        </div>
      </div>
    </AppLayout>
  );
}