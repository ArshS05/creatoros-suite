import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Link as LinkIcon, 
  Sparkles, 
  Copy, 
  Download,
  ArrowRight,
  CheckCircle2,
  Wand2,
  FileText,
  Hash,
  MessageSquare,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { rescriptVideo } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface GeneratedContent {
  script: string;
  hooks: string[];
  captions: string[];
  hashtags: string[];
}

export default function AutoReScript() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState<"script" | "hooks" | "captions" | "hashtags">("script");

  const handleGenerate = async () => {
    if (!videoUrl.trim()) {
      toast({ title: "Please enter a video URL", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await rescriptVideo({
        videoUrl,
        videoDescription,
      });

      if (result) {
        setGenerated({
          script: result.script || result.rawContent || "",
          hooks: result.hooks || [],
          captions: result.captions || [],
          hashtags: result.hashtags || [],
        });
        toast({ title: "Content generated!", description: "Fresh scripts, hooks, and captions ready" });
      }
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const tabs = [
    { id: "script", label: "Script", icon: FileText },
    { id: "hooks", label: "Hooks", icon: Wand2 },
    { id: "captions", label: "Captions", icon: MessageSquare },
    { id: "hashtags", label: "Hashtags", icon: Hash },
  ] as const;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </div>
          <h1 className="text-4xl font-bold text-foreground">Auto-ReScript</h1>
          <p className="text-lg text-muted-foreground mt-3">
            Transform any video into fresh content. Get new scripts, hooks, captions, and hashtags instantly.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste your video URL (YouTube, TikTok, Instagram)..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                />
              </div>
              <Button 
                variant="default"
                size="lg" 
                className="h-14 px-8 gap-2"
                onClick={handleGenerate}
                disabled={isProcessing || !videoUrl}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            <div>
              <input
                type="text"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Optional: Describe your video topic for better results..."
                className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-border">
            {[
              { step: 1, label: "Paste URL" },
              { step: 2, label: "AI Analyzes" },
              { step: 3, label: "Get Content" },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    generated && item.step <= 3 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {generated && item.step <= 3 ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      item.step
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                {index < 2 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {generated && (
          <div className="bg-card border border-border rounded-3xl overflow-hidden animate-slide-up">
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "script" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Generated Script</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-2" onClick={() => copyToClipboard(generated.script)}>
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <pre className="bg-secondary rounded-xl p-6 text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                    {generated.script}
                  </pre>
                </div>
              )}

              {activeTab === "hooks" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Hook Variations</h3>
                  <div className="space-y-3">
                    {generated.hooks.map((hook, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-secondary rounded-xl group"
                      >
                        <p className="text-foreground">{hook}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(hook)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "captions" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Caption Options</h3>
                  <div className="grid gap-4">
                    {generated.captions.map((caption, index) => (
                      <div key={index} className="p-4 bg-secondary rounded-xl group">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm text-foreground whitespace-pre-wrap">{caption}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(caption)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "hashtags" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Recommended Hashtags</h3>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => copyToClipboard(generated.hashtags.join(" "))}>
                      <Copy className="w-4 h-4" />
                      Copy All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generated.hashtags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => copyToClipboard(tag)}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!generated && !isProcessing && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-foreground flex items-center justify-center mb-6">
              <RefreshCw className="w-10 h-10 text-background" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Ready to ReScript</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Paste a video URL above and let AI generate fresh content ideas based on your existing videos.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
