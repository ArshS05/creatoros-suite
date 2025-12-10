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
  User,
} from "lucide-react";
import { PremiumModal } from "@/components/PremiumModal";

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
  const [showPremium, setShowPremium] = useState(false);
  const location = useLocation();

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border transition-all duration-500 ease-out",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center transition-transform duration-300 hover:scale-105">
                <span className="text-background font-semibold text-sm">C</span>
              </div>
              {!collapsed && (
                <span className="text-base font-semibold text-foreground tracking-tight">CreatorOS</span>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-all duration-300"
            >
              <ChevronLeft
                className={cn(
                  "w-4 h-4 text-sidebar-foreground transition-transform duration-500",
                  collapsed && "rotate-180"
                )}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "nav-item opacity-0 animate-in",
                    isActive && "nav-item-active",
                    collapsed && "justify-center px-2"
                  )}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive && "text-foreground")} />
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Pro Badge */}
          {!collapsed && (
            <div className="p-4">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-foreground" />
                  <span className="text-sm font-medium text-foreground">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Unlock AI-powered features and unlimited generation.
                </p>
                <button 
                  onClick={() => setShowPremium(true)}
                  className="w-full py-2 bg-foreground text-background rounded-lg text-xs font-medium transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
                >
                  Learn More
                </button>
              </div>
            </div>
          )}

          {/* Profile & Settings */}
          <div className="p-3 border-t border-sidebar-border space-y-1">
            <Link
              to="/profile"
              className={cn(
                "nav-item",
                location.pathname === "/profile" && "nav-item-active",
                collapsed && "justify-center px-2"
              )}
            >
              <User className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span className="text-sm">My Profile</span>}
            </Link>
            <Link
              to="/settings"
              className={cn(
                "nav-item",
                location.pathname === "/settings" && "nav-item-active",
                collapsed && "justify-center px-2"
              )}
            >
              <Settings className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span className="text-sm">Settings</span>}
            </Link>
          </div>
        </div>
      </aside>
      
      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </>
  );
}
