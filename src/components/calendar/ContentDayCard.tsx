import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Hash,
  MessageSquare,
  Zap,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export interface ContentDay {
  day: number;
  idea: string;
  hook: string;
  format: string;
  caption: string;
  hashtags: string[];
  postingTime: string;
  engagementStrategy: string;
}

interface ContentDayCardProps {
  content: ContentDay;
  onRegenerate: (day: number) => Promise<void>;
  isRegenerating: boolean;
}

export function ContentDayCard({ content, onRegenerate, isRegenerating }: ContentDayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast({ title: `${type} copied!`, description: "Copied to clipboard" });
    setTimeout(() => setCopied(null), 2000);
  };

  const copyFullContent = async () => {
    const fullContent = `📅 Day ${content.day}

💡 Idea: ${content.idea}

🎣 Hook: ${content.hook}

📱 Format: ${content.format}

📝 Caption:
${content.caption}

#️⃣ Hashtags:
${content.hashtags.join(' ')}

⏰ Best Time: ${content.postingTime}

🎯 Engagement Strategy:
${content.engagementStrategy}`;
    
    await navigator.clipboard.writeText(fullContent);
    setCopied('all');
    toast({ title: "Full content copied!", description: "All day content copied to clipboard" });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className={cn(
      "bg-card border border-border rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:border-primary/30 group",
      isExpanded && "ring-2 ring-primary/20"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
            {content.day}
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Day {content.day}</p>
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {content.idea}
            </h3>
          </div>
        </div>
      </div>

      {/* Hook Preview */}
      <div className="mb-4 p-3 bg-secondary/50 rounded-xl border border-border/50">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
          <Zap className="w-3 h-3" /> Hook
        </p>
        <p className="text-sm text-foreground italic">"{content.hook}"</p>
      </div>

      {/* Quick Info */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg">
          {content.format}
        </span>
        <span className="px-3 py-1.5 bg-secondary text-muted-foreground text-xs font-medium rounded-lg flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {content.postingTime.split(' ').slice(0, 2).join(' ')}
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border animate-fade-in">
          {/* Caption */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> Caption
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                onClick={() => copyToClipboard(content.caption, 'Caption')}
              >
                {copied === 'Caption' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                Copy
              </Button>
            </div>
            <p className="text-sm text-foreground bg-secondary/50 p-3 rounded-xl">
              {content.caption}
            </p>
          </div>

          {/* Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Hash className="w-3 h-3" /> Hashtags ({content.hashtags.length})
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                onClick={() => copyToClipboard(content.hashtags.join(' '), 'Hashtags')}
              >
                {copied === 'Hashtags' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                Copy
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {content.hashtags.slice(0, 15).map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                  #{tag.replace('#', '')}
                </span>
              ))}
              {content.hashtags.length > 15 && (
                <span className="px-2 py-1 bg-secondary text-muted-foreground text-xs rounded-md">
                  +{content.hashtags.length - 15} more
                </span>
              )}
            </div>
          </div>

          {/* Posting Time */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Best Posting Time
            </p>
            <p className="text-sm text-foreground bg-secondary/50 p-3 rounded-xl">
              {content.postingTime}
            </p>
          </div>

          {/* Engagement Strategy */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Engagement Strategy
            </p>
            <p className="text-sm text-foreground bg-secondary/50 p-3 rounded-xl">
              {content.engagementStrategy}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 rounded-xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {isExpanded ? "Collapse" : "View Details"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-xl"
          onClick={copyFullContent}
        >
          {copied === 'all' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-xl"
          onClick={() => onRegenerate(content.day)}
          disabled={isRegenerating}
        >
          {isRegenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
