import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Link as LinkIcon,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Instagram,
  Youtube,
  Music2,
  Mail,
  Smartphone,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", description: "Manage your personal information" },
      { icon: Bell, label: "Notifications", description: "Configure notification preferences" },
      { icon: Shield, label: "Privacy & Security", description: "Password, 2FA, and security settings" },
    ],
  },
  {
    title: "Connected Accounts",
    items: [
      { icon: Instagram, label: "Instagram", description: "Connected as @creator", connected: true },
      { icon: Youtube, label: "YouTube", description: "Connected as Creator Channel", connected: true },
      { icon: Music2, label: "TikTok", description: "Not connected", connected: false },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Palette, label: "Appearance", description: "Theme and display settings" },
      { icon: Globe, label: "Language & Region", description: "English (US)" },
      { icon: Mail, label: "Email Preferences", description: "Manage email communications" },
    ],
  },
  {
    title: "Billing",
    items: [
      { icon: CreditCard, label: "Subscription", description: "Free Plan - Upgrade for more features" },
      { icon: LinkIcon, label: "Payment Methods", description: "Manage payment options" },
    ],
  },
];

export default function Settings() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground">
              C
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">Creator</h2>
              <p className="text-muted-foreground">creator@example.com</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Free Plan
                </span>
                <span className="text-sm text-muted-foreground">
                  Member since Dec 2024
                </span>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
            </div>
            <div className="divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className={cn(
                    "p-2.5 rounded-xl",
                    "connected" in item && item.connected
                      ? "bg-emerald-500/10"
                      : "bg-secondary"
                  )}>
                    <item.icon className={cn(
                      "w-5 h-5",
                      "connected" in item && item.connected
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {"connected" in item ? (
                    <span className={cn(
                      "text-sm font-medium",
                      item.connected ? "text-emerald-500" : "text-muted-foreground"
                    )}>
                      {item.connected ? "Connected" : "Connect"}
                    </span>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Upgrade Banner */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl gradient-primary">
              <CreditCard className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">Upgrade to Pro</h3>
              <p className="text-muted-foreground mt-1">
                Unlock unlimited AI generations, advanced analytics, and priority support.
              </p>
            </div>
            <Button variant="gradient">Upgrade Now</Button>
          </div>
        </div>

        {/* Support & Logout */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="ghost" className="gap-2 text-muted-foreground">
            <HelpCircle className="w-4 h-4" />
            Help & Support
          </Button>
          <Button variant="ghost" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
