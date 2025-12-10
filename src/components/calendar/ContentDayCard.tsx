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
      "bg-card border border-border rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:border-primary/30 group flex flex-col h-full",
      isExpanded && "ring-2 ring-primary/20"
    )}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg flex-shrink-0">
          {content.day}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Day {content.day}</p>
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors break-words">
            {content.idea}
          </h3>
        </div>
      </div>

      {/* Hook Preview */}
      <div className="mb-3 p-2.5 bg-secondary/50 rounded-xl border border-border/50">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
          <Zap className="w-2.5 h-2.5" /> Hook
        </p>
        <p className="text-xs text-foreground italic break-words line-clamp-2">"{content.hook}"</p>
      </div>

      {/* Quick Info */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-medium rounded-md truncate max-w-[120px]">
          {content.format}
        </span>
        <span className="px-2 py-1 bg-secondary text-muted-foreground text-[10px] font-medium rounded-md flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 flex-shrink-0" />
          <span className="truncate">{content.postingTime.split(' ').slice(0, 2).join(' ')}</span>
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 pt-3 border-t border-border animate-fade-in flex-1">
          {/* Caption */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <MessageSquare className="w-2.5 h-2.5" /> Caption
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] gap-1"
                onClick={() => copyToClipboard(content.caption, 'Caption')}
              >
                {copied === 'Caption' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                Copy
              </Button>
            </div>
            <p className="text-xs text-foreground bg-secondary/50 p-2.5 rounded-xl break-words">
              {content.caption}
            </p>
          </div>

          {/* Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Hash className="w-2.5 h-2.5" /> Hashtags ({content.hashtags.length})
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] gap-1"
                onClick={() => copyToClipboard(content.hashtags.join(' '), 'Hashtags')}
              >
                {copied === 'Hashtags' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                Copy
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {content.hashtags.slice(0, 10).map((tag, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded break-all">
                  #{tag.replace('#', '')}
                </span>
              ))}
              {content.hashtags.length > 10 && (
                <span className="px-1.5 py-0.5 bg-secondary text-muted-foreground text-[10px] rounded">
                  +{content.hashtags.length - 10}
                </span>
              )}
            </div>
          </div>

          {/* Posting Time */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> Best Posting Time
            </p>
            <p className="text-xs text-foreground bg-secondary/50 p-2.5 rounded-xl break-words">
              {content.postingTime}
            </p>
          </div>

          {/* Engagement Strategy */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> Engagement Strategy
            </p>
            <p className="text-xs text-foreground bg-secondary/50 p-2.5 rounded-xl break-words">
              {content.engagementStrategy}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1 rounded-xl text-xs h-8"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {isExpanded ? "Less" : "More"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl h-8 w-8 p-0"
          onClick={copyFullContent}
        >
          {copied === 'all' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl h-8 w-8 p-0"
          onClick={() => onRegenerate(content.day)}
          disabled={isRegenerating}
        >
          {isRegenerating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
        </Button>
      </div>
    </div>
  );
}
