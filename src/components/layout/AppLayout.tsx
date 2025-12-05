import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background dark">
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-64 transition-all duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex h-full items-center justify-between px-6">
            {/* Search */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-secondary border-none text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs bg-muted rounded-md text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
              </Button>
              
              <div className="h-8 w-px bg-border" />
              
              <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">Creator</p>
                  <p className="text-xs text-muted-foreground">Free Plan</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
