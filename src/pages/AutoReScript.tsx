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
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratedContent {
  script: string;
  hooks: string[];
  captions: string[];
  hashtags: string[];
}

const sampleGenerated: GeneratedContent = {
  script: `[HOOK - 0-3 seconds]
"This one hack doubled my productivity overnight..."

[INTRO - 3-10 seconds]
You know that feeling when you've been working all day but nothing actually got done? Yeah, me too. Until I discovered this simple system.

[MAIN CONTENT - 10-45 seconds]
Here's the thing - most productivity advice is garbage. They tell you to wake up at 5 AM, cold showers, meditate for an hour. But what actually works?

The 2-minute rule. If something takes less than 2 minutes, do it NOW. Not later, not tomorrow, NOW.

Here's why it works: Your brain loves completion. Every time you finish a small task, you get a dopamine hit. Stack enough of these, and suddenly you're crushing your to-do list.

[CTA - 45-60 seconds]
Try this for one week and watch what happens. Follow for more productivity tips that actually work.`,
  hooks: [
    "This one hack doubled my productivity overnight...",
    "Stop wasting your mornings doing THIS",
    "I tried every productivity tip for 30 days - here's what actually worked",
    "The 2-minute rule changed everything for me",
    "Why 90% of productivity advice is actually making you LESS productive"
  ],
  captions: [
    "🚀 The 2-minute rule is SO underrated.\n\nHere's the deal: If a task takes less than 2 minutes, do it immediately. No scheduling. No adding to your list. Just DO IT.\n\nWhy does this work? Because your brain craves completion. Each small win = dopamine = momentum.\n\nTry it for a week. Thank me later. 💪\n\n#productivity #lifehack #mindset",
    "This simple system helped me go from overwhelmed to organized in one week 📈\n\nThe secret? Stop planning, start doing.\n\nDrop a 🙌 if you're trying this today!"
  ],
  hashtags: [
    "#productivity", "#lifehacks", "#mindset", "#motivation", "#success",
    "#personaldevelopment", "#growthmindset", "#dailyhabits", "#timemanagement",
    "#worksmarter", "#entrepreneurlife", "#selfimprovement"
  ]
};

export default function AutoReScript() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState<"script" | "hooks" | "captions" | "hashtags">("script");

  const handleGenerate = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setGenerated(sampleGenerated);
      setIsProcessing(false);
    }, 2000);
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
        {/* Header */}
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

        {/* Input Section */}
        <div className="bg-card border border-border rounded-3xl p-8">
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
              variant="gradient" 
              size="lg" 
              className="h-14 px-8 gap-2"
              onClick={handleGenerate}
              disabled={isProcessing || !videoUrl}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
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

          {/* Process Steps */}
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

        {/* Generated Content */}
        {generated && (
          <div className="bg-card border border-border rounded-3xl overflow-hidden animate-slide-up">
            {/* Tabs */}
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

            {/* Content */}
            <div className="p-6">
              {activeTab === "script" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Generated Script</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export
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
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Hook Variations</h3>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </Button>
                  </div>
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
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Caption Options</h3>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {generated.captions.map((caption, index) => (
                      <div
                        key={index}
                        className="p-4 bg-secondary rounded-xl group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm text-foreground whitespace-pre-wrap">{caption}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Copy className="w-4 h-4" />
                      Copy All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generated.hashtags.map((tag, index) => (
                      <button
                        key={index}
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

        {/* Empty State */}
        {!generated && !isProcessing && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-3xl gradient-primary flex items-center justify-center mb-6">
              <RefreshCw className="w-10 h-10 text-primary-foreground" />
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
