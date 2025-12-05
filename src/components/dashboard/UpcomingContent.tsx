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

const statusStyles = {
  scheduled: "bg-foreground text-background",
  draft: "bg-secondary text-muted-foreground",
  review: "bg-secondary text-foreground",
};

export function UpcomingContent() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <Calendar className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground">Upcoming Content</h3>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </div>
        </div>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">See Calendar</button>
      </div>

      <div className="space-y-2">
        {content.map((item, index) => {
          const Icon = platformIcons[item.platform];
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 cursor-pointer opacity-0 animate-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.scheduledFor}</p>
              </div>
              <span className={cn("text-xs font-medium px-2.5 py-1 rounded-lg capitalize", statusStyles[item.status])}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
