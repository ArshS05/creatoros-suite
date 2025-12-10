import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Target, 
  Users, 
  TrendingUp, 
  Award,
  X,
  Loader2,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: ContentSetupParams) => Promise<void>;
  isGenerating: boolean;
}

export interface ContentSetupParams {
  niche: string;
  contentType: string;
  audience: string;
  goal: string;
  experience: string;
}

const contentTypes = [
  "Reels",
  "YouTube Shorts", 
  "YouTube Long-form",
  "Instagram Carousels",
  "X Posts",
  "Mixed"
];

const contentGoals = [
  { value: "Growth", label: "Growth", icon: TrendingUp, description: "Maximize followers & reach" },
  { value: "Engagement", label: "Engagement", icon: Users, description: "Boost comments & shares" },
  { value: "Sales", label: "Sales", icon: Zap, description: "Drive conversions" },
  { value: "Branding", label: "Branding", icon: Award, description: "Build authority" },
];

const experienceLevels = ["Beginner", "Intermediate", "Advanced"];

export function ContentSetupModal({ isOpen, onClose, onGenerate, isGenerating }: ContentSetupModalProps) {
  const [niche, setNiche] = useState("");
  const [contentType, setContentType] = useState("Mixed");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("Growth");
  const [experience, setExperience] = useState("Intermediate");

  const handleGenerate = async () => {
    if (!niche.trim()) return;
    await onGenerate({ niche, contentType, audience, goal, experience });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">AI Content Calendar</h2>
              <p className="text-muted-foreground">Generate a personalized 30-day content plan</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
            disabled={isGenerating}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Niche Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Target className="w-4 h-4 text-primary" />
              Your Niche *
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Fitness for busy moms, SaaS marketing, Travel photography..."
              className="w-full h-14 px-5 rounded-2xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground">Be specific! The more detailed, the better your content plan.</p>
          </div>

          {/* Content Type */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Content Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={cn(
                    "py-3 px-4 rounded-xl text-sm font-medium transition-all border-2",
                    contentType === type
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                      : "bg-secondary hover:bg-secondary/80 text-foreground border-transparent hover:border-primary/30"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users className="w-4 h-4 text-primary" />
              Target Audience
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., 25-35 year old entrepreneurs, Gen Z fashion enthusiasts..."
              className="w-full h-14 px-5 rounded-2xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Content Goal */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Content Goal</label>
            <div className="grid grid-cols-2 gap-3">
              {contentGoals.map((g) => {
                const Icon = g.icon;
                return (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl text-left transition-all border-2",
                      goal === g.value
                        ? "bg-primary/10 border-primary"
                        : "bg-secondary hover:bg-secondary/80 border-transparent hover:border-primary/30"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl",
                      goal === g.value ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{g.label}</p>
                      <p className="text-xs text-muted-foreground">{g.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Award className="w-4 h-4 text-primary" />
              Experience Level
            </label>
            <div className="flex gap-2">
              {experienceLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setExperience(level)}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all border-2",
                    experience === level
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary hover:bg-secondary/80 text-foreground border-transparent"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
          <Button 
            variant="outline" 
            className="flex-1 h-14 rounded-2xl text-base"
            onClick={onClose} 
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 h-14 rounded-2xl text-base gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            onClick={handleGenerate} 
            disabled={isGenerating || !niche.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating 30 Days...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate 30-Day Plan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
