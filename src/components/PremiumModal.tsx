import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Sparkles, 
  Check, 
  Zap,
  Crown,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: "Starter",
    price: 9,
    period: "month",
    icon: Zap,
    description: "Perfect for creators just getting started",
    features: [
      "50 AI content generations/month",
      "7-day content calendar",
      "Basic analytics",
      "Email support",
      "1 website",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: 29,
    period: "month",
    icon: Crown,
    description: "For growing creators who need more power",
    features: [
      "Unlimited AI generations",
      "30-day content calendar",
      "Advanced analytics",
      "Priority support",
      "5 websites",
      "Auto-ReScript feature",
      "Collab Inbox",
      "Custom templates",
    ],
    popular: true,
  },
  {
    name: "Agency",
    price: 79,
    period: "month",
    icon: Rocket,
    description: "For teams and agencies managing multiple brands",
    features: [
      "Everything in Pro",
      "Unlimited websites",
      "Team collaboration",
      "White-label exports",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    popular: false,
  },
];

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [isAnnual, setIsAnnual] = useState(false);

  const handleUpgrade = (planName: string) => {
    toast({
      title: "Coming Soon!",
      description: `${planName} plan will be available soon. We'll notify you when it's ready!`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-5xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Upgrade to Premium</h2>
              <p className="text-muted-foreground">Unlock the full power of CreatorOS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={cn("text-sm", !isAnnual ? "text-foreground font-semibold" : "text-muted-foreground")}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={cn(
              "relative w-14 h-7 rounded-full transition-colors",
              isAnnual ? "bg-primary" : "bg-secondary"
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform",
                isAnnual ? "translate-x-8" : "translate-x-1"
              )}
            />
          </button>
          <span className={cn("text-sm", isAnnual ? "text-foreground font-semibold" : "text-muted-foreground")}>
            Annual
            <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-medium rounded-full">
              Save 20%
            </span>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const displayPrice = isAnnual ? Math.round(plan.price * 0.8) : plan.price;
            
            return (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl p-6 border-2 transition-all cursor-pointer",
                  plan.popular
                    ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                    : "border-border hover:border-primary/50",
                  selectedPlan === plan.name && "ring-2 ring-primary/30"
                )}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "p-2 rounded-xl",
                    plan.popular ? "bg-primary text-primary-foreground" : "bg-secondary"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">${displayPrice}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full rounded-xl",
                    plan.popular
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpgrade(plan.name);
                  }}
                >
                  {plan.popular ? "Get Started" : "Choose Plan"}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. Cancel anytime.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            💳 Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
