import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Sparkles, 
  Instagram,
  ExternalLink,
  Palette,
  Layout,
  Mail,
  DollarSign,
  Link as LinkIcon,
  Eye,
  Download,
  CheckCircle2,
  Grid3X3,
  User,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWebsiteFromInstagram } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface WebsiteData {
  name: string;
  bio: string;
  headline?: string;
  about?: string;
  links: { title: string; url: string }[];
  services?: { name: string; price: string; description: string }[];
}

export default function WebsiteBuilder() {
  const [username, setUsername] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("dark");

  const handleBuild = async () => {
    if (!username.trim()) {
      toast({ title: "Please enter a username", variant: "destructive" });
      return;
    }

    setIsBuilding(true);
    try {
      const result = await buildWebsiteFromInstagram({
        username,
        style: selectedTheme,
        sections: ["Profile", "Links", "Content Grid", "Services", "Contact"],
      });

      if (result?.website) {
        setWebsite({
          name: result.website.name || username,
          bio: result.website.bio || "",
          headline: result.website.headline,
          about: result.website.about,
          links: result.website.links || [],
          services: result.website.services || [],
        });
        toast({ title: "Website generated!", description: "Your personal website is ready" });
      }
    } catch (error) {
      console.error("Build error:", error);
    } finally {
      setIsBuilding(false);
    }
  };

  const themes = [
    { id: "dark", name: "Dark", bg: "bg-foreground", accent: "bg-primary" },
    { id: "light", name: "Light", bg: "bg-secondary", accent: "bg-primary" },
    { id: "gradient", name: "Gradient", bg: "gradient-primary", accent: "bg-accent" },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            One-Click Builder
          </div>
          <h1 className="text-4xl font-bold text-foreground">Website Builder</h1>
          <p className="text-lg text-muted-foreground mt-3">
            Turn your Instagram into a stunning personal website in seconds.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your Instagram username..."
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              />
            </div>
            <Button 
              variant="default"
              size="lg" 
              className="h-14 px-8 gap-2 w-full md:w-auto"
              onClick={handleBuild}
              disabled={isBuilding || !username}
            >
              {isBuilding ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Building...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Build Website
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
            {[
              { icon: User, label: "Bio & Profile" },
              { icon: Grid3X3, label: "Content Grid" },
              { icon: LinkIcon, label: "All Links" },
              { icon: Mail, label: "Contact Form" },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {website && (
          <div className="grid lg:grid-cols-3 gap-6 animate-slide-up">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-3xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {username.toLowerCase().replace(/[^a-z0-9]/g, "")}.creatorsite.com
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </Button>
                  </div>
                </div>

                <div className={cn(
                  "p-8 min-h-[600px]",
                  selectedTheme === "dark" ? "bg-foreground" : selectedTheme === "gradient" ? "gradient-primary" : "bg-secondary"
                )}>
                  <div className="max-w-md mx-auto text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground mb-4">
                      {website.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <h2 className={cn(
                      "text-2xl font-bold mb-2",
                      selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background" : "text-foreground"
                    )}>
                      {website.name}
                    </h2>
                    {website.headline && (
                      <p className={cn(
                        "text-lg font-medium mb-2",
                        selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background/90" : "text-foreground"
                      )}>
                        {website.headline}
                      </p>
                    )}
                    <p className={cn(
                      "text-sm mb-6",
                      selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background/70" : "text-muted-foreground"
                    )}>
                      {website.bio}
                    </p>

                    <div className="space-y-3 mb-8">
                      {website.links.map((link, idx) => (
                        <button
                          key={idx}
                          className={cn(
                            "w-full py-3 rounded-xl font-medium transition-colors",
                            selectedTheme === "dark" 
                              ? "bg-background/10 text-background hover:bg-background/20" 
                              : selectedTheme === "gradient"
                              ? "bg-background/20 text-background hover:bg-background/30"
                              : "bg-card text-foreground hover:bg-card/80"
                          )}
                        >
                          {link.title}
                        </button>
                      ))}
                    </div>

                    {website.services && website.services.length > 0 && (
                      <div className="space-y-3">
                        <h3 className={cn(
                          "text-sm font-semibold uppercase tracking-wider",
                          selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background/60" : "text-muted-foreground"
                        )}>
                          Services
                        </h3>
                        {website.services.map((service, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "p-4 rounded-xl text-left",
                              selectedTheme === "dark" || selectedTheme === "gradient"
                                ? "bg-background/10"
                                : "bg-card"
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <span className={cn(
                                "font-medium",
                                selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background" : "text-foreground"
                              )}>
                                {service.name}
                              </span>
                              <span className={cn(
                                "font-bold",
                                selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background" : "text-primary"
                              )}>
                                {service.price}
                              </span>
                            </div>
                            <p className={cn(
                              "text-xs mt-1",
                              selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background/60" : "text-muted-foreground"
                            )}>
                              {service.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-primary" />
                  Theme
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-colors",
                        selectedTheme === theme.id
                          ? "border-primary"
                          : "border-transparent hover:border-border"
                      )}
                    >
                      <div className={cn("w-full h-12 rounded-lg mb-2", theme.bg)} />
                      <p className="text-xs text-muted-foreground">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Layout className="w-5 h-5 text-primary" />
                  Sections
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: User, label: "Profile Header", enabled: true },
                    { icon: LinkIcon, label: "Link Buttons", enabled: true },
                    { icon: Grid3X3, label: "Content Grid", enabled: true },
                    { icon: DollarSign, label: "Services/Pricing", enabled: true },
                    { icon: Mail, label: "Contact Form", enabled: false },
                  ].map((section) => (
                    <div
                      key={section.label}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{section.label}</span>
                      </div>
                      <div className={cn(
                        "w-10 h-6 rounded-full p-1 transition-colors cursor-pointer",
                        section.enabled ? "bg-primary" : "bg-secondary"
                      )}>
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-card transition-transform",
                          section.enabled && "translate-x-4"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="default" className="w-full gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Publish Website
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Export Code
                </Button>
              </div>
            </div>
          </div>
        )}

        {!website && !isBuilding && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-foreground flex items-center justify-center mb-6">
              <Globe className="w-10 h-10 text-background" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Create Your Website</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter your Instagram username above and we'll create a beautiful personal website with your bio, content, and links.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
