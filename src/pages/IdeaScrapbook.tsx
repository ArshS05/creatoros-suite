import { useState, useEffect } from "react";
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
  Clock,
  Loader2,
  Trash2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createIdea, getIdeas, updateIdea, deleteIdea, organizeIdeas } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Idea {
  id: string;
  title: string;
  description: string | null;
  type: string;
  tags: string[] | null;
  category: string | null;
  created_at: string;
  is_favorite: boolean | null;
  ai_generated: boolean | null;
}

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
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Form state
  const [newIdea, setNewIdea] = useState({
    title: "",
    description: "",
    type: "note" as "note" | "image" | "audio",
    tags: "",
  });

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const data = await getIdeas();
      setIdeas(data || []);
    } catch (error) {
      console.error("Failed to load ideas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateIdea = async () => {
    if (!newIdea.title.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = newIdea.tags.split(",").map(t => t.trim()).filter(Boolean);
      await createIdea({
        title: newIdea.title,
        description: newIdea.description,
        type: newIdea.type,
        tags: tagsArray,
      });
      toast({ title: "Idea saved!" });
      setShowUpload(false);
      setNewIdea({ title: "", description: "", type: "note", tags: "" });
      loadIdeas();
    } catch (error) {
      console.error("Failed to create idea:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFavorite = async (id: string, currentValue: boolean | null) => {
    try {
      await updateIdea(id, { is_favorite: !currentValue });
      setIdeas(ideas.map(idea => 
        idea.id === id ? { ...idea, is_favorite: !currentValue } : idea
      ));
    } catch (error) {
      console.error("Failed to update idea:", error);
    }
  };

  const handleDeleteIdea = async (id: string) => {
    try {
      await deleteIdea(id);
      setIdeas(ideas.filter(idea => idea.id !== id));
      toast({ title: "Idea deleted" });
    } catch (error) {
      console.error("Failed to delete idea:", error);
    }
  };

  const handleOrganizeWithAI = async () => {
    if (ideas.length === 0) {
      toast({ title: "No ideas to organize", variant: "destructive" });
      return;
    }

    setIsOrganizing(true);
    try {
      const result = await organizeIdeas(
        ideas.map(i => ({
          id: i.id,
          title: i.title,
          description: i.description || undefined,
          tags: i.tags || undefined,
        }))
      );

      if (result?.suggestions?.length > 0) {
        setAiInsight(result.suggestions[0].suggestion);
      }

      if (result?.categories?.length > 0) {
        // Update ideas with AI-assigned categories
        for (const category of result.categories) {
          for (const ideaId of category.ideaIds || []) {
            await updateIdea(ideaId, { category: category.name });
          }
        }
        loadIdeas();
        toast({ title: "Ideas organized!", description: `${result.categories.length} categories created` });
      }
    } catch (error) {
      console.error("Failed to organize ideas:", error);
    } finally {
      setIsOrganizing(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === "All" ||
      (filterType === "Notes" && idea.type === "note") ||
      (filterType === "Images" && idea.type === "image") ||
      (filterType === "Audio" && idea.type === "audio") ||
      (filterType === "Favorites" && idea.is_favorite) ||
      (filterType === "AI Generated" && idea.ai_generated);
    return matchesSearch && matchesFilter;
  });

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
            <Button 
              variant="default" 
              className="gap-2" 
              onClick={handleOrganizeWithAI}
              disabled={isOrganizing || ideas.length === 0}
            >
              {isOrganizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Organizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI Organize
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-card border border-border rounded-3xl p-8 max-w-lg w-full mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Add New Idea</h2>
                <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { type: "note" as const, icon: FileText, label: "Note" },
                  { type: "image" as const, icon: Image, label: "Image" },
                  { type: "audio" as const, icon: Mic, label: "Audio" },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setNewIdea({ ...newIdea, type: item.type })}
                    className={cn(
                      "flex flex-col items-center gap-2 p-6 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors border-2",
                      newIdea.type === item.type ? "border-primary" : "border-transparent"
                    )}
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
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                    placeholder="Give your idea a title..."
                    className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                  <textarea
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                    placeholder="Describe your idea..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
                  <input
                    type="text"
                    value={newIdea.tags}
                    onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })}
                    placeholder="Add tags separated by commas..."
                    className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="outline" className="flex-1" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1 gap-2" 
                  onClick={handleCreateIdea}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Idea"
                  )}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={() => setFilterType(tag)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                filterType === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Lightbulb className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No ideas yet</h3>
            <p className="text-muted-foreground mb-4">Start capturing your creative ideas!</p>
            <Button onClick={() => setShowUpload(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Idea
            </Button>
          </div>
        ) : (
          <div className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          )}>
            {filteredIdeas.map((idea, index) => {
              const Icon = typeIcons[idea.type as keyof typeof typeIcons] || FileText;
              const color = typeColors[idea.type as keyof typeof typeColors] || typeColors.note;
              return (
                <div
                  key={idea.id}
                  className={cn(
                    "bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all group animate-fade-in",
                    viewMode === "list" && "flex items-start gap-4"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "flex items-center justify-between",
                    viewMode === "list" && "flex-col items-start"
                  )}>
                    <div className={cn("p-2 rounded-xl", color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {viewMode === "grid" && (
                      <button 
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="p-1 rounded-lg hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                      </button>
                    )}
                  </div>
                  
                  <div className={cn("flex-1", viewMode === "grid" && "mt-4")}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground line-clamp-1">{idea.title}</h3>
                      {idea.ai_generated && (
                        <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{idea.description}</p>
                    
                    {idea.category && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-xs text-primary font-medium">
                          {idea.category}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {idea.tags?.slice(0, 3).map((tag) => (
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
                        {formatTimeAgo(idea.created_at)}
                      </span>
                      <button 
                        onClick={() => handleToggleFavorite(idea.id, idea.is_favorite)}
                        className={cn(
                          "p-1 rounded-lg transition-colors",
                          idea.is_favorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", idea.is_favorite && "fill-current")} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AI Suggestion */}
        {(aiInsight || ideas.length > 0) && (
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">AI Insight</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {aiInsight || "Click 'AI Organize' to get personalized suggestions based on your ideas!"}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-3 gap-2 text-primary"
                  onClick={handleOrganizeWithAI}
                  disabled={isOrganizing}
                >
                  <Sparkles className="w-4 h-4" />
                  {isOrganizing ? "Analyzing..." : "Generate Insights"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
