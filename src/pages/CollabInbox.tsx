import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Sparkles, 
  Filter,
  Search,
  Star,
  Trash2,
  Archive,
  Clock,
  DollarSign,
  Building2,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Loader2,
  Plus,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  cleanInbox, 
  getInboxMessages, 
  createInboxMessage, 
  updateInboxMessage, 
  deleteInboxMessage 
} from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

interface Message {
  id: string;
  sender: string;
  company: string;
  subject: string;
  preview: string;
  full_content?: string;
  budget?: string;
  deadline?: string;
  category: "brand" | "agency" | "pr" | "other";
  priority: "high" | "medium" | "low";
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
  starred: boolean;
  ai_analysis?: {
    priorityScore?: number;
    estimatedValue?: string;
    recommendedAction?: string;
    responseTemplate?: string;
  };
}

const sampleMessages = [
  {
    sender: "Sarah M.",
    company: "Nike",
    subject: "Partnership Opportunity - Summer Campaign",
    preview: "Hi! We love your content and would like to discuss a potential partnership for our upcoming summer campaign.",
    full_content: "Hi! We love your content and would like to discuss a potential partnership for our upcoming summer campaign. We're looking for creators who align with our brand values and have an engaged audience. We've been following your work and really appreciate your authentic approach to lifestyle content. Your engagement rates are impressive and your audience demographics align perfectly with our target market. For this campaign, we're looking for 2 Instagram posts and 1 TikTok video. We're open to discussing your creative vision and rates. Let me know if you'd like to schedule a call to discuss further!",
    budget: "$5,000 - $10,000",
    category: "brand" as const,
    priority: "high" as const,
  },
  {
    sender: "Michael K.",
    company: "Talent Agency Pro",
    subject: "Exclusive Brand Deals Available",
    preview: "I represent several major brands looking for lifestyle creators. Your engagement rates are impressive.",
    full_content: "I represent several major brands looking for lifestyle creators. Your engagement rates are impressive and I'd love to connect about some opportunities we have available.",
    budget: "Various",
    category: "agency" as const,
    priority: "medium" as const,
  },
  {
    sender: "Emma L.",
    company: "Glossier",
    subject: "Product Seeding + Potential Paid Collab",
    preview: "We'd love to send you some of our new products! If you like them, we could discuss a paid partnership.",
    full_content: "We'd love to send you some of our new products! If you like them and it feels authentic, we could discuss a paid partnership.",
    budget: "$2,000 - $3,000",
    category: "brand" as const,
    priority: "medium" as const,
  },
];

const categoryColors = {
  brand: "bg-primary/10 text-primary",
  agency: "bg-amber-500/10 text-amber-500",
  pr: "bg-emerald-500/10 text-emerald-500",
  other: "bg-secondary text-muted-foreground",
};

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export default function CollabInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "starred" | "brands">("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getInboxMessages();
      if (data && data.length > 0) {
        const mappedMessages: Message[] = data.map(m => ({
          id: m.id,
          sender: m.sender,
          company: m.company || "",
          subject: m.subject,
          preview: m.preview || "",
          full_content: m.full_content || "",
          budget: m.budget || undefined,
          deadline: m.deadline || undefined,
          category: (m.category as Message["category"]) || "other",
          priority: (m.priority as Message["priority"]) || "medium",
          status: (m.status as Message["status"]) || "new",
          created_at: m.created_at,
          starred: m.starred || false,
          ai_analysis: m.ai_analysis as Message["ai_analysis"] || undefined,
        }));
        setMessages(mappedMessages);
        if (mappedMessages.length > 0) {
          setSelectedMessage(mappedMessages[0]);
        }
      } else {
        // Load sample messages if no data
        await seedSampleMessages();
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({ title: "Error loading messages", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const seedSampleMessages = async () => {
    try {
      for (const msg of sampleMessages) {
        await createInboxMessage(msg);
      }
      await loadMessages();
      toast({ title: "Sample messages added!" });
    } catch (error) {
      console.error("Error seeding messages:", error);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesFilter = 
      filter === "all" ? true :
      filter === "new" ? msg.status === "new" :
      filter === "starred" ? msg.starred :
      filter === "brands" ? msg.category === "brand" :
      true;
    
    const matchesSearch = searchQuery === "" || 
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const toggleStar = async (id: string) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;

    try {
      await updateInboxMessage(id, { starred: !msg.starred });
      setMessages(messages.map(m => 
        m.id === id ? { ...m, starred: !m.starred } : m
      ));
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteInboxMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(messages.find(m => m.id !== id) || null);
      }
      toast({ title: "Message deleted" });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleArchiveMessage = async (id: string) => {
    try {
      await updateInboxMessage(id, { status: "archived" });
      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: "archived" as const } : m
      ));
      toast({ title: "Message archived" });
    } catch (error) {
      console.error("Error archiving message:", error);
    }
  };

  const handleAnalyzeAll = async () => {
    setIsAnalyzing(true);
    try {
      const messagesToAnalyze = messages.map(m => ({
        id: m.id,
        sender: m.sender,
        company: m.company,
        subject: m.subject,
        preview: m.preview,
        budget: m.budget,
      }));

      const result = await cleanInbox(messagesToAnalyze);

      if (result?.analysis) {
        const updatedMessages = await Promise.all(messages.map(async (msg) => {
          const analysis = result.analysis.find((a: { messageId: string }) => a.messageId === msg.id);
          if (analysis) {
            const newPriority = analysis.priorityScore >= 7 ? "high" : analysis.priorityScore >= 4 ? "medium" : "low";
            const aiAnalysis = {
              priorityScore: analysis.priorityScore,
              estimatedValue: analysis.estimatedValue,
              recommendedAction: analysis.recommendedAction,
              responseTemplate: analysis.responseTemplate,
            };
            
            await updateInboxMessage(msg.id, { 
              priority: newPriority,
              ai_analysis: aiAnalysis as unknown as Json
            });

            return {
              ...msg,
              priority: newPriority as Message["priority"],
              ai_analysis: aiAnalysis,
            };
          }
          return msg;
        }));

        setMessages(updatedMessages);
        if (selectedMessage) {
          const updated = updatedMessages.find(m => m.id === selectedMessage.id);
          if (updated) setSelectedMessage(updated);
        }

        toast({ 
          title: "Analysis complete!", 
          description: `${result.summary?.highPriority || 0} high priority messages found` 
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
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

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Collab Inbox</h1>
            <p className="text-muted-foreground mt-1">AI-sorted collaboration requests and brand messages</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={loadMessages}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="default" className="gap-2" onClick={handleAnalyzeAll} disabled={isAnalyzing || messages.length === 0}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI Analyze All
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "New Messages", value: messages.filter(m => m.status === "new").length.toString(), icon: MessageSquare, color: "text-primary" },
            { label: "High Priority", value: messages.filter(m => m.priority === "high").length.toString(), icon: Star, color: "text-amber-500" },
            { label: "Potential Revenue", value: `$${messages.reduce((sum, m) => {
              if (m.budget) {
                const match = m.budget.match(/\$?([\d,]+)/);
                return sum + (match ? parseInt(match[1].replace(",", "")) : 0);
              }
              return sum;
            }, 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
            { label: "Response Rate", value: `${messages.length > 0 ? Math.round((messages.filter(m => m.status === "replied").length / messages.length) * 100) : 0}%`, icon: CheckCircle2, color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-secondary border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "new", label: "New" },
                  { id: "starred", label: "Starred" },
                  { id: "brands", label: "Brands" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id as typeof filter)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      filter === f.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-secondary/50 transition-colors",
                      selectedMessage?.id === msg.id && "bg-primary/5",
                      msg.status === "new" && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("w-2 h-2 rounded-full mt-2", priorityColors[msg.priority])} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn(
                            "text-sm truncate",
                            msg.status === "new" ? "font-semibold text-foreground" : "text-foreground"
                          )}>
                            {msg.company}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground truncate mt-0.5">{msg.subject}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">{msg.preview}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full", categoryColors[msg.category])}>
                            {msg.category}
                          </span>
                          {msg.budget && (
                            <span className="text-xs text-emerald-500">
                              {msg.ai_analysis?.estimatedValue || msg.budget}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(msg.id);
                        }}
                        className="p-1"
                      >
                        <Star className={cn(
                          "w-4 h-4",
                          msg.starred ? "fill-amber-500 text-amber-500" : "text-muted-foreground"
                        )} />
                      </button>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-3 bg-card border border-border rounded-2xl">
            {selectedMessage ? (
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-background" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">{selectedMessage.company}</h2>
                          <p className="text-sm text-muted-foreground">{selectedMessage.sender}</p>
                        </div>
                      </div>
                      <h3 className="text-xl font-medium text-foreground mt-4">{selectedMessage.subject}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleArchiveMessage(selectedMessage.id)}>
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">AI Analysis</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Est. Value</p>
                        <p className="font-semibold text-emerald-500">
                          {selectedMessage.ai_analysis?.estimatedValue || selectedMessage.budget || "TBD"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deadline</p>
                        <p className="font-medium text-foreground">{selectedMessage.deadline || "Flexible"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Priority</p>
                        <p className={cn(
                          "font-medium capitalize",
                          selectedMessage.priority === "high" ? "text-red-500" :
                          selectedMessage.priority === "medium" ? "text-amber-500" : "text-emerald-500"
                        )}>
                          {selectedMessage.priority}
                          {selectedMessage.ai_analysis?.priorityScore && ` (${selectedMessage.ai_analysis.priorityScore}/10)`}
                        </p>
                      </div>
                    </div>
                    {selectedMessage.ai_analysis?.recommendedAction && (
                      <div className="mt-3 pt-3 border-t border-primary/20">
                        <p className="text-xs text-muted-foreground">Recommended Action</p>
                        <p className="text-sm font-medium text-foreground capitalize">
                          {selectedMessage.ai_analysis.recommendedAction}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.full_content || selectedMessage.preview}
                  </p>
                </div>

                <div className="p-6 border-t border-border">
                  <div className="flex gap-3">
                    <Button 
                      variant="default" 
                      className="flex-1 gap-2"
                      onClick={async () => {
                        await updateInboxMessage(selectedMessage.id, { status: "replied" });
                        setMessages(messages.map(m => 
                          m.id === selectedMessage.id ? { ...m, status: "replied" as const } : m
                        ));
                        toast({ title: "Marked as replied!" });
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Accept & Reply
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Clock className="w-4 h-4" />
                      Negotiate
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="gap-2"
                      onClick={() => handleArchiveMessage(selectedMessage.id)}
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No message selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a message from the list to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}