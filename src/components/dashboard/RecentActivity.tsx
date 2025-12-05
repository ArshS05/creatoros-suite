import { Instagram, Youtube, Music2, MessageSquare, DollarSign, TrendingUp } from "lucide-react";

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
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music2,
  collab: MessageSquare,
  payment: DollarSign,
  milestone: TrendingUp,
};

export function RecentActivity() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-medium text-foreground">Recent Activity</h3>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">View All</button>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => {
          const Icon = iconConfig[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-accent/30 transition-all duration-300 opacity-0 animate-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="p-2 rounded-lg bg-secondary text-foreground">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
