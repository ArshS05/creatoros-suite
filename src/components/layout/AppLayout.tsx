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
      <div className="pl-64 transition-all duration-500">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/60 backdrop-blur-xl border-b border-border">
          <div className="flex h-full items-center justify-between px-6">
            {/* Search */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="input-field w-full h-10 pl-10 pr-4 text-sm"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-foreground rounded-full" />
              </Button>
              
              <div className="h-6 w-px bg-border mx-2" />
              
              <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                  <User className="w-4 h-4 text-background" />
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
