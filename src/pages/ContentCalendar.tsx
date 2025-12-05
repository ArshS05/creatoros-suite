import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Instagram, 
  Youtube, 
  Music2,
  Filter,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface ContentItem {
  id: string;
  title: string;
  platform: "instagram" | "youtube" | "tiktok";
  time: string;
  status: "scheduled" | "draft" | "published";
}

const sampleContent: Record<number, ContentItem[]> = {
  3: [
    { id: "1", title: "Morning Routine", platform: "youtube", time: "9:00 AM", status: "scheduled" },
  ],
  5: [
    { id: "2", title: "GRWM", platform: "tiktok", time: "2:00 PM", status: "scheduled" },
    { id: "3", title: "BTS Photo Dump", platform: "instagram", time: "6:00 PM", status: "draft" },
  ],
  8: [
    { id: "4", title: "Product Review", platform: "youtube", time: "12:00 PM", status: "scheduled" },
  ],
  12: [
    { id: "5", title: "Day in My Life", platform: "tiktok", time: "3:00 PM", status: "draft" },
  ],
  15: [
    { id: "6", title: "Q&A Session", platform: "instagram", time: "7:00 PM", status: "scheduled" },
  ],
  18: [
    { id: "7", title: "Collaboration Reveal", platform: "youtube", time: "10:00 AM", status: "scheduled" },
  ],
  22: [
    { id: "8", title: "Trend Video", platform: "tiktok", time: "4:00 PM", status: "draft" },
  ],
  25: [
    { id: "9", title: "Holiday Special", platform: "youtube", time: "11:00 AM", status: "scheduled" },
    { id: "10", title: "Gift Guide", platform: "instagram", time: "5:00 PM", status: "scheduled" },
  ],
};

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
  const [showGenerator, setShowGenerator] = useState(false);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

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
            <Button variant="gradient" className="gap-2" onClick={() => setShowGenerator(true)}>
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
                <div className="p-3 rounded-xl gradient-primary">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
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
                        className="flex-1 py-3 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium transition-colors border-2 border-transparent hover:border-primary"
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Content Style</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Educational</option>
                    <option>Entertainment</option>
                    <option>Lifestyle</option>
                    <option>Mixed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="outline" className="flex-1" onClick={() => setShowGenerator(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" className="flex-1 gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Plan
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-card rounded-3xl border border-border p-6">
          {/* Calendar Header */}
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

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before the first of the month */}
            {Array.from({ length: adjustedFirstDay }).map((_, index) => (
              <div key={`empty-${index}`} className="h-32 rounded-xl bg-secondary/30" />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const content = sampleContent[day] || [];
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

        {/* Platform Legend */}
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
