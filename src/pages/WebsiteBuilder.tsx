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
  Type,
  Image,
  Mail,
  DollarSign,
  Link as LinkIcon,
  Eye,
  Download,
  RefreshCw,
  CheckCircle2,
  Grid3X3,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WebsitePreview {
  name: string;
  bio: string;
  avatar: string;
  posts: number;
  followers: string;
  links: { title: string; url: string }[];
  content: { type: string; thumbnail: string }[];
  services: { name: string; price: string; description: string }[];
}

const sampleWebsite: WebsitePreview = {
  name: "Alex Creator",
  bio: "Content Creator • Lifestyle & Tech 📱 Helping you level up your content game. Based in LA 🌴",
  avatar: "AC",
  posts: 847,
  followers: "247K",
  links: [
    { title: "YouTube", url: "#" },
    { title: "TikTok", url: "#" },
    { title: "Merch Store", url: "#" },
    { title: "Podcast", url: "#" },
  ],
  content: [
    { type: "reel", thumbnail: "📱" },
    { type: "photo", thumbnail: "🎨" },
    { type: "reel", thumbnail: "🎬" },
    { type: "photo", thumbnail: "✨" },
    { type: "reel", thumbnail: "🚀" },
    { type: "photo", thumbnail: "💡" },
  ],
  services: [
    { name: "1:1 Coaching Call", price: "$150", description: "30-minute strategy session" },
    { name: "Content Review", price: "$75", description: "Detailed feedback on your content" },
    { name: "Brand Consultation", price: "$300", description: "Full brand strategy session" },
  ],
};

export default function WebsiteBuilder() {
  const [username, setUsername] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [website, setWebsite] = useState<WebsitePreview | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("dark");

  const handleBuild = () => {
    setIsBuilding(true);
    setTimeout(() => {
      setWebsite(sampleWebsite);
      setIsBuilding(false);
    }, 2500);
  };

  const themes = [
    { id: "dark", name: "Dark", bg: "bg-foreground", accent: "bg-primary" },
    { id: "light", name: "Light", bg: "bg-secondary", accent: "bg-primary" },
    { id: "gradient", name: "Gradient", bg: "gradient-primary", accent: "bg-accent" },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
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

        {/* Input Section */}
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
              variant="gradient" 
              size="lg" 
              className="h-14 px-8 gap-2 w-full md:w-auto"
              onClick={handleBuild}
              disabled={isBuilding || !username}
            >
              {isBuilding ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
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

          {/* Features */}
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

        {/* Website Preview */}
        {website && (
          <div className="grid lg:grid-cols-3 gap-6 animate-slide-up">
            {/* Preview */}
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

                {/* Website Content */}
                <div className={cn(
                  "p-8 min-h-[600px]",
                  selectedTheme === "dark" ? "bg-foreground" : selectedTheme === "gradient" ? "gradient-primary" : "bg-secondary"
                )}>
                  <div className="max-w-md mx-auto text-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 mx-auto rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground mb-4">
                      {website.avatar}
                    </div>
                    
                    {/* Name & Bio */}
                    <h2 className={cn(
                      "text-2xl font-bold mb-2",
                      selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background" : "text-foreground"
                    )}>
                      {website.name}
                    </h2>
                    <p className={cn(
                      "text-sm mb-6",
                      selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background/70" : "text-muted-foreground"
                    )}>
                      {website.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 mb-6">
                      <div>
                        <p className={cn(
                          "text-xl font-bold",
                          selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background" : "text-foreground"
                        )}>{website.posts}</p>
                        <p className={cn(
                          "text-xs",
                          selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background/60" : "text-muted-foreground"
                        )}>Posts</p>
                      </div>
                      <div>
                        <p className={cn(
                          "text-xl font-bold",
                          selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background" : "text-foreground"
                        )}>{website.followers}</p>
                        <p className={cn(
                          "text-xs",
                          selectedTheme === "dark" || selectedTheme === "gradient" ? "text-background/60" : "text-muted-foreground"
                        )}>Followers</p>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-3 mb-8">
                      {website.links.map((link) => (
                        <button
                          key={link.title}
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

                    {/* Content Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {website.content.map((item, index) => (
                        <div
                          key={index}
                          className={cn(
                            "aspect-square rounded-xl flex items-center justify-center text-2xl",
                            selectedTheme === "dark" || selectedTheme === "gradient"
                              ? "bg-background/10"
                              : "bg-card"
                          )}
                        >
                          {item.thumbnail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customization Panel */}
            <div className="space-y-4">
              {/* Theme Selection */}
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

              {/* Sections */}
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
                    { icon: DollarSign, label: "Services/Pricing", enabled: false },
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

              {/* Actions */}
              <div className="space-y-2">
                <Button variant="gradient" className="w-full gap-2">
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

        {/* Empty State */}
        {!website && !isBuilding && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-3xl gradient-primary flex items-center justify-center mb-6">
              <Globe className="w-10 h-10 text-primary-foreground" />
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
