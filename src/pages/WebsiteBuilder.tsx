import { useState, useEffect } from "react";
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
  Loader2,
  Save,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  buildWebsiteFromInstagram, 
  saveWebsite, 
  getWebsites, 
  updateWebsite,
  generateWebsiteHTML 
} from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WebsiteData {
  id?: string;
  username: string;
  name: string;
  bio: string;
  headline?: string;
  about?: string;
  links: { title: string; url: string }[];
  services?: { name: string; price: string; description: string }[];
  theme: string;
  published: boolean;
}

export default function WebsiteBuilder() {
  const [username, setUsername] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [savedWebsites, setSavedWebsites] = useState<WebsiteData[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [sections, setSections] = useState({
    profile: true,
    links: true,
    grid: true,
    services: true,
    contact: false,
  });

  useEffect(() => {
    loadSavedWebsites();
  }, []);

  const loadSavedWebsites = async () => {
    try {
      const data = await getWebsites();
      if (data) {
        const mapped = data.map(w => ({
          id: w.id,
          username: w.username,
          name: w.name || "",
          bio: w.bio || "",
          headline: w.headline || undefined,
          about: w.about || undefined,
          links: (w.links as { title: string; url: string }[]) || [],
          services: (w.services as { name: string; price: string; description: string }[]) || [],
          theme: w.theme || "dark",
          published: w.published || false,
        }));
        setSavedWebsites(mapped);
        if (mapped.length > 0 && !website) {
          setWebsite(mapped[0]);
          setSelectedTheme(mapped[0].theme);
        }
      }
    } catch (error) {
      console.error("Error loading websites:", error);
    }
  };

  const handleBuild = async () => {
    if (!username.trim()) {
      toast({ title: "Please enter a username", variant: "destructive" });
      return;
    }

    setIsBuilding(true);
    try {
      const activeSections = Object.entries(sections)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

      const result = await buildWebsiteFromInstagram({
        username,
        style: selectedTheme,
        sections: activeSections,
      });

      if (result?.website) {
        const newWebsite: WebsiteData = {
          username,
          name: result.website.name || username,
          bio: result.website.bio || "",
          headline: result.website.headline,
          about: result.website.about,
          links: result.website.links || [],
          services: result.website.services || [],
          theme: selectedTheme,
          published: false,
        };
        setWebsite(newWebsite);
        toast({ title: "Website generated!", description: "Your personal website is ready" });
      }
    } catch (error) {
      console.error("Build error:", error);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleSave = async () => {
    if (!website) return;

    setIsSaving(true);
    try {
      const html = generateWebsiteHTML({
        name: website.name,
        bio: website.bio,
        headline: website.headline,
        about: website.about,
        links: website.links,
        services: website.services,
        theme: website.theme,
      });

      if (website.id) {
        await updateWebsite(website.id, {
          name: website.name,
          bio: website.bio,
          headline: website.headline,
          about: website.about,
          theme: website.theme,
          links: website.links,
          services: website.services,
          html_content: html,
        });
        toast({ title: "Website updated!" });
      } else {
        const saved = await saveWebsite({
          username: website.username,
          name: website.name,
          bio: website.bio,
          headline: website.headline,
          about: website.about,
          theme: website.theme,
          links: website.links,
          services: website.services,
          html_content: html,
        });
        setWebsite({ ...website, id: saved.id });
        toast({ title: "Website saved!" });
      }
      await loadSavedWebsites();
    } catch (error) {
      console.error("Save error:", error);
      toast({ title: "Error saving website", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!website) return;

    const html = generateWebsiteHTML({
      name: website.name,
      bio: website.bio,
      headline: website.headline,
      about: website.about,
      links: website.links,
      services: website.services,
      theme: website.theme,
    });

    setHtmlContent(html);
    setShowExport(true);
  };

  const downloadHTML = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${website?.username || "website"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "HTML file downloaded!" });
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(htmlContent);
    toast({ title: "HTML copied to clipboard!" });
  };

  const themes = [
    { id: "dark", name: "Dark", bg: "bg-foreground", accent: "bg-primary" },
    { id: "light", name: "Light", bg: "bg-secondary", accent: "bg-primary" },
    { id: "gradient", name: "Gradient", bg: "gradient-primary", accent: "bg-accent" },
  ];

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
                      {website.username.toLowerCase().replace(/[^a-z0-9]/g, "")}.creatorsite.com
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => setShowPreview(true)}>
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={handleExport}>
                      <Code className="w-4 h-4" />
                      View Code
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
                      onClick={() => {
                        setSelectedTheme(theme.id);
                        setWebsite(prev => prev ? { ...prev, theme: theme.id } : null);
                      }}
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
                    { key: "profile" as const, icon: User, label: "Profile Header" },
                    { key: "links" as const, icon: LinkIcon, label: "Link Buttons" },
                    { key: "grid" as const, icon: Grid3X3, label: "Content Grid" },
                    { key: "services" as const, icon: DollarSign, label: "Services/Pricing" },
                    { key: "contact" as const, icon: Mail, label: "Contact Form" },
                  ].map((section) => (
                    <button
                      key={section.key}
                      onClick={() => toggleSection(section.key)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{section.label}</span>
                      </div>
                      <div className={cn(
                        "w-10 h-6 rounded-full p-1 transition-colors",
                        sections[section.key] ? "bg-primary" : "bg-muted"
                      )}>
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-card transition-transform",
                          sections[section.key] && "translate-x-4"
                        )} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="default" 
                  className="w-full gap-2"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {website.id ? "Update Website" : "Save Website"}
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={handleExport}>
                  <Download className="w-4 h-4" />
                  Export HTML
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

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Website Preview</DialogTitle>
            </DialogHeader>
            {website && (
              <iframe
                srcDoc={generateWebsiteHTML({
                  name: website.name,
                  bio: website.bio,
                  headline: website.headline,
                  about: website.about,
                  links: website.links,
                  services: website.services,
                  theme: website.theme,
                })}
                className="w-full h-[600px] border border-border rounded-lg"
                title="Website Preview"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={showExport} onOpenChange={setShowExport}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Export HTML</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyHTML}>
                    Copy Code
                  </Button>
                  <Button size="sm" onClick={downloadHTML}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <pre className="bg-secondary rounded-lg p-4 overflow-auto max-h-[500px] text-xs text-foreground">
              <code>{htmlContent}</code>
            </pre>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}