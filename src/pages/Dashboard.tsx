import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingContent } from "@/components/dashboard/UpcomingContent";
import { Users, Eye, Heart, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, <span className="gradient-text">Creator</span> 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your content today.
            </p>
          </div>
          <Button variant="gradient" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Content
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Followers"
            value="247.5K"
            change={12.5}
            icon={<Users className="w-5 h-5" />}
            gradient="primary"
          />
          <StatCard
            title="Total Views"
            value="1.2M"
            change={8.2}
            icon={<Eye className="w-5 h-5" />}
            gradient="accent"
          />
          <StatCard
            title="Engagement Rate"
            value="4.8%"
            change={-2.1}
            icon={<Heart className="w-5 h-5" />}
            gradient="secondary"
          />
          <StatCard
            title="Revenue (MTD)"
            value="$12,450"
            change={23.4}
            icon={<TrendingUp className="w-5 h-5" />}
            gradient="primary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks & Activity */}
          <div className="lg:col-span-2 space-y-6">
            <UpcomingContent />
            <RecentActivity />
          </div>

          {/* Right Column - Tasks */}
          <div>
            <TaskList />
          </div>
        </div>

        {/* AI Assistant Card */}
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-primary-foreground">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-foreground/20 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">AI Content Assistant</h2>
            </div>
            <p className="text-lg opacity-90 mb-6 max-w-2xl">
              Let AI help you create engaging content. Generate scripts, hooks, captions, and more with just a click.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="glass" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 border-primary-foreground/20 text-primary-foreground">
                Generate Script
              </Button>
              <Button variant="glass" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 border-primary-foreground/20 text-primary-foreground">
                Create Hooks
              </Button>
              <Button variant="glass" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 border-primary-foreground/20 text-primary-foreground">
                Write Captions
              </Button>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-primary-foreground/5 rounded-full blur-2xl" />
        </div>
      </div>
    </AppLayout>
  );
}
