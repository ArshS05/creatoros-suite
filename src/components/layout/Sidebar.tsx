import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Lightbulb,
  RefreshCw,
  Globe,
  MessageSquare,
  FileText,
  Settings,
  ChevronLeft,
  Sparkles,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Content Calendar", href: "/calendar", icon: Calendar },
  { name: "Idea Scrapbook", href: "/ideas", icon: Lightbulb },
  { name: "Auto-ReScript", href: "/rescript", icon: RefreshCw },
  { name: "Website Builder", href: "/website", icon: Globe },
  { name: "Collab Inbox", href: "/inbox", icon: MessageSquare },
  { name: "Collab Tracker", href: "/tracker", icon: FileText },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-foreground">CreatorOS</span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 text-sidebar-foreground transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "nav-item",
                  isActive && "nav-item-active",
                  collapsed && "justify-center px-3"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Pro Badge */}
        {!collapsed && (
          <div className="p-4">
            <div className="rounded-2xl gradient-primary p-4 text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Upgrade to Pro</span>
              </div>
              <p className="text-sm opacity-90 mb-3">
                Unlock AI-powered features and unlimited content generation.
              </p>
              <button className="w-full py-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-xl text-sm font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="p-3 border-t border-sidebar-border">
          <Link
            to="/settings"
            className={cn(
              "nav-item",
              location.pathname === "/settings" && "nav-item-active",
              collapsed && "justify-center px-3"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}
