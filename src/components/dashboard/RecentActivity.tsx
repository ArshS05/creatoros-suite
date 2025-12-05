import { Instagram, Youtube, Music2, MessageSquare, DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "instagram" | "youtube" | "tiktok" | "collab" | "payment" | "milestone";
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "instagram",
    title: "New Reel Performance",
    description: "Your latest reel reached 50K views",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "collab",
    title: "Brand Partnership",
    description: "Nike sent you a collaboration request",
    time: "4 hours ago",
  },
  {
    id: "3",
    type: "youtube",
    title: "Video Published",
    description: "Day in my life vlog is now live",
    time: "6 hours ago",
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Received",
    description: "$2,500 from Adidas campaign",
    time: "1 day ago",
  },
  {
    id: "5",
    type: "milestone",
    title: "Milestone Reached",
    description: "You've crossed 100K followers on TikTok!",
    time: "2 days ago",
  },
];

const iconConfig = {
  instagram: { icon: Instagram, bg: "bg-gradient-to-br from-pink-500 to-orange-400" },
  youtube: { icon: Youtube, bg: "bg-red-500" },
  tiktok: { icon: Music2, bg: "bg-foreground" },
  collab: { icon: MessageSquare, bg: "bg-primary" },
  payment: { icon: DollarSign, bg: "bg-emerald-500" },
  milestone: { icon: TrendingUp, bg: "bg-amber-500" },
};

export function RecentActivity() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const { icon: Icon, bg } = iconConfig[activity.type];
          return (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-4 animate-fade-in",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn("p-2 rounded-xl text-white", bg)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
