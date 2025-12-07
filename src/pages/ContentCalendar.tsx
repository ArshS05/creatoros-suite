import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Instagram, 
  Youtube, 
  Music2,
  Filter,
  Download,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateContentPlan, saveContentPlan, getContentPlans } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface ContentItem {
  id: string;
  title: string;
  platform: "instagram" | "youtube" | "tiktok";
  time: string;
  status: "scheduled" | "draft" | "published";
}

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music2,
};

const platformColors = {
  instagram: "bg-gradient-to-br from-pink-500 to-orange-400",
  youtube: "bg-red-500",
  tiktok: "bg-foreground",
};

export default function ContentCalendar() {
  const [currentDate] = useState(new Date());
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram", "YouTube", "TikTok"]);
  const [selectedStyle, setSelectedStyle] = useState("Mixed");
  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [calendarContent, setCalendarContent] = useState<Record<number, ContentItem[]>>({});

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    try {
      const plans = await getContentPlans();
      if (plans && plans.length > 0) {
        const latestPlan = plans[0];
        const planData = latestPlan.plan as Array<{ day: number; title: string; platform: string; postingTime: string }>;
        if (Array.isArray(planData)) {
          const content: Record<number, ContentItem[]> = {};
          planData.forEach((item) => {
            const platformLower = item.platform?.toLowerCase() as "instagram" | "youtube" | "tiktok";
            if (!content[item.day]) content[item.day] = [];
            content[item.day].push({
              id: `saved-${item.day}-${content[item.day].length}`,
              title: item.title,
              platform: platformLower || "instagram",
              time: item.postingTime || "12:00 PM",
              status: "draft",
            });
          });
          setCalendarContent(content);
        }
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleGenerate = async () => {
    if (!selectedNiche.trim()) {
      toast({ title: "Please enter your niche", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateContentPlan({
        niche: selectedNiche,
        platforms: selectedPlatforms,
        style: selectedStyle,
        days: 30,
      });

      if (result?.plan) {
        const newContent: Record<number, ContentItem[]> = {};
        result.plan.forEach((item: { day: number; title: string; platform: string; postingTime: string }) => {
          const platformLower = item.platform?.toLowerCase() as "instagram" | "youtube" | "tiktok";
          if (!newContent[item.day]) newContent[item.day] = [];
          newContent[item.day].push({
            id: `gen-${item.day}-${newContent[item.day].length}`,
            title: item.title,
            platform: platformLower || "instagram",
            time: item.postingTime || "12:00 PM",
            status: "draft",
          });
        });
        setCalendarContent(newContent);

        // Save to database
        await saveContentPlan({
          niche: selectedNiche,
          platforms: selectedPlatforms,
          style: selectedStyle,
          plan: result.plan,
        });

        toast({ title: "Content plan generated & saved!", description: "30-day plan added to calendar" });
      }
      setShowGenerator(false);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Calendar</h1>
            <p className="text-muted-foreground mt-1">Plan and schedule your content across all platforms</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="default" className="gap-2" onClick={() => setShowGenerator(true)}>
              <Sparkles className="w-4 h-4" />
              AI Generate 30-Day Plan
            </Button>
          </div>
        </div>

        {/* AI Generator Modal */}
        {showGenerator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-card border border-border rounded-3xl p-8 max-w-lg w-full mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-foreground">
                  <Sparkles className="w-6 h-6 text-background" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">AI Content Generator</h2>
                  <p className="text-sm text-muted-foreground">Generate a 30-day content plan</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Niche</label>
                  <input
                    type="text"
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    placeholder="e.g., Fitness, Beauty, Tech, Gaming..."
                    className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Platforms</label>
                  <div className="flex gap-2">
                    {["Instagram", "YouTube", "TikTok"].map((platform) => (
                      <button
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        className={cn(
                          "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors border-2",
                          selectedPlatforms.includes(platform)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary hover:bg-secondary/80 text-foreground border-transparent"
                        )}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Content Style</label>
                  <select 
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Educational</option>
                    <option>Entertainment</option>
                    <option>Lifestyle</option>
                    <option>Mixed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="outline" className="flex-1" onClick={() => setShowGenerator(false)} disabled={isGenerating}>
                  Cancel
                </Button>
                <Button variant="default" className="flex-1 gap-2" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-card rounded-3xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-foreground">{monthName}</h2>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              Today
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: adjustedFirstDay }).map((_, index) => (
              <div key={`empty-${index}`} className="h-32 rounded-xl bg-secondary/30" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const content = calendarContent[day] || [];
              const isToday = day === currentDate.getDate();
              
              return (
                <div
                  key={day}
                  className={cn(
                    "h-32 rounded-xl border p-2 transition-colors cursor-pointer hover:border-primary/50",
                    isToday ? "border-primary bg-primary/5" : "border-border bg-secondary/20"
                  )}
                >
                  <span className={cn(
                    "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium",
                    isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                  )}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {content.slice(0, 2).map((item) => {
                      const Icon = platformIcons[item.platform];
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-white truncate",
                            platformColors[item.platform]
                          )}
                        >
                          <Icon className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </div>
                      );
                    })}
                    {content.length > 2 && (
                      <div className="text-xs text-muted-foreground pl-2">
                        +{content.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {Object.entries(platformColors).map(([platform, color]) => (
            <div key={platform} className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", color)} />
              <span className="text-sm text-muted-foreground capitalize">{platform}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
