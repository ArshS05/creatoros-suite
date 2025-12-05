import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  gradient?: "primary" | "accent" | "secondary";
}

export function StatCard({ title, value, change, icon, gradient = "primary" }: StatCardProps) {
  const gradientClasses = {
    primary: "from-primary/10 to-primary/5 border-primary/20",
    accent: "from-accent/10 to-accent/5 border-accent/20",
    secondary: "from-secondary to-secondary/50 border-border",
  };

  const iconBgClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    secondary: "bg-secondary text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "stat-card bg-gradient-to-br border",
        gradientClasses[gradient]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", iconBgClasses[gradient])}>
          {icon}
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg",
              change >= 0
                ? "text-emerald-500 bg-emerald-500/10"
                : "text-red-500 bg-red-500/10"
            )}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}
