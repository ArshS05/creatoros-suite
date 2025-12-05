import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Image,
  Mic,
  FileText,
  Tag,
  MoreHorizontal,
  Sparkles,
  Heart,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Idea {
  id: string;
  title: string;
  description: string;
  type: "note" | "image" | "audio";
  tags: string[];
  createdAt: string;
  isFavorite: boolean;
  aiGenerated?: boolean;
}

const sampleIdeas: Idea[] = [
  {
    id: "1",
    title: "Morning routine hooks",
    description: "5 AM morning routine that changed my life - Start with 'You won't believe what happened when I...'",
    type: "note",
    tags: ["lifestyle", "hook", "morning"],
    createdAt: "2 hours ago",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Product review angles",
    description: "Instead of listing features, show before/after transformation. Focus on emotional impact.",
    type: "note",
    tags: ["review", "strategy"],
    createdAt: "1 day ago",
    isFavorite: false,
    aiGenerated: true,
  },
  {
    id: "3",
    title: "Trending audio ideas",
    description: "Voice memo about using trending sounds creatively for brand content",
    type: "audio",
    tags: ["audio", "trending"],
    createdAt: "2 days ago",
    isFavorite: true,
  },
  {
    id: "4",
    title: "Set design inspiration",
    description: "Minimalist background setup with LED lights and plants",
    type: "image",
    tags: ["aesthetic", "setup"],
    createdAt: "3 days ago",
    isFavorite: false,
  },
  {
    id: "5",
    title: "Collaboration pitch template",
    description: "Template for reaching out to brands: Lead with value, show metrics, propose creative concept",
    type: "note",
    tags: ["business", "template"],
    createdAt: "4 days ago",
    isFavorite: true,
    aiGenerated: true,
  },
  {
    id: "6",
    title: "Story arc structure",
    description: "Hook → Problem → Journey → Solution → CTA. Works for any niche.",
    type: "note",
    tags: ["storytelling", "framework"],
    createdAt: "5 days ago",
    isFavorite: false,
  },
];

const typeIcons = {
  note: FileText,
  image: Image,
  audio: Mic,
};

const typeColors = {
  note: "bg-primary/10 text-primary",
  image: "bg-emerald-500/10 text-emerald-500",
  audio: "bg-amber-500/10 text-amber-500",
};

export default function IdeaScrapbook() {
  const [ideas] = useState(sampleIdeas);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Idea Scrapbook</h1>
            <p className="text-muted-foreground mt-1">Capture and organize your creative ideas</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setShowUpload(true)}>
              <Plus className="w-4 h-4" />
              Add Idea
            </Button>
            <Button variant="gradient" className="gap-2">
              <Sparkles className="w-4 h-4" />
              AI Organize
            </Button>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-card border border-border rounded-3xl p-8 max-w-lg w-full mx-4 shadow-xl">
              <h2 className="text-xl font-bold text-foreground mb-6">Add New Idea</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { type: "note", icon: FileText, label: "Note" },
                  { type: "image", icon: Image, label: "Image" },
                  { type: "audio", icon: Mic, label: "Audio" },
                ].map((item) => (
                  <button
                    key={item.type}
                    className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors border-2 border-transparent hover:border-primary"
                  >
                    <item.icon className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
                  <input
                    type="text"
                    placeholder="Give your idea a title..."
                    className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                  <textarea
                    placeholder="Describe your idea..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
                  <input
                    type="text"
                    placeholder="Add tags separated by commas..."
                    className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="outline" className="flex-1" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" className="flex-1">
                  Save Idea
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ideas..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <div className="flex rounded-xl bg-secondary p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid" ? "bg-card shadow-sm" : "hover:bg-card/50"
                )}
              >
                <Grid3X3 className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list" ? "bg-card shadow-sm" : "hover:bg-card/50"
                )}
              >
                <List className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2">
          {["All", "Notes", "Images", "Audio", "Favorites", "AI Generated"].map((tag) => (
            <button
              key={tag}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                tag === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Ideas Grid */}
        <div className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
        )}>
          {ideas.map((idea, index) => {
            const Icon = typeIcons[idea.type];
            return (
              <div
                key={idea.id}
                className={cn(
                  "bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all cursor-pointer group animate-fade-in",
                  viewMode === "list" && "flex items-start gap-4"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "flex items-center justify-between",
                  viewMode === "list" && "flex-col items-start"
                )}>
                  <div className={cn("p-2 rounded-xl", typeColors[idea.type])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {viewMode === "grid" && (
                    <button className="p-1 rounded-lg hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                
                <div className={cn("flex-1", viewMode === "grid" && "mt-4")}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">{idea.title}</h3>
                    {idea.aiGenerated && (
                      <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{idea.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {idea.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {idea.createdAt}
                    </span>
                    <button className={cn(
                      "p-1 rounded-lg transition-colors",
                      idea.isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                    )}>
                      <Heart className={cn("w-4 h-4", idea.isFavorite && "fill-current")} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Suggestion */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">AI Insight</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your ideas, you seem interested in lifestyle content. Consider creating a series around morning routines - it's trending and aligns with your notes!
              </p>
              <Button variant="ghost" size="sm" className="mt-3 gap-2 text-primary">
                <Sparkles className="w-4 h-4" />
                Generate Content Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
