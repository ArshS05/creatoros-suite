import { Calendar, Instagram, Youtube, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduledContent {
  id: string;
  title: string;
  platform: "instagram" | "youtube" | "tiktok";
  scheduledFor: string;
  status: "scheduled" | "draft" | "review";
}

const content: ScheduledContent[] = [
  {
    id: "1",
    title: "Morning Routine 2024",
    platform: "youtube",
    scheduledFor: "Today, 3:00 PM",
    status: "scheduled",
  },
  {
    id: "2",
    title: "Get Ready With Me",
    platform: "tiktok",
    scheduledFor: "Today, 6:00 PM",
    status: "scheduled",
  },
  {
    id: "3",
    title: "Behind the Scenes",
    platform: "instagram",
    scheduledFor: "Tomorrow, 10:00 AM",
    status: "draft",
  },
  {
    id: "4",
    title: "Product Review",
    platform: "youtube",
    scheduledFor: "Dec 8, 2:00 PM",
    status: "review",
  },
];

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music2,
};

const platformColors = {
  instagram: "text-pink-500",
  youtube: "text-red-500",
  tiktok: "text-foreground",
};

const statusColors = {
  scheduled: "bg-emerald-500/10 text-emerald-500",
  draft: "bg-amber-500/10 text-amber-500",
  review: "bg-primary/10 text-primary",
};

export function UpcomingContent() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Upcoming Content</h3>
            <p className="text-sm text-muted-foreground">Next 7 days</p>
          </div>
        </div>
        <button className="text-sm text-primary hover:underline">See Calendar</button>
      </div>

      <div className="space-y-3">
        {content.map((item) => {
          const Icon = platformIcons[item.platform];
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <Icon className={cn("w-5 h-5", platformColors[item.platform])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.scheduledFor}</p>
              </div>
              <span className={cn("text-xs font-medium px-2 py-1 rounded-lg capitalize", statusColors[item.status])}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
