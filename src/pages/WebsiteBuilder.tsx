import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Sparkles, 
  ExternalLink,
  Palette,
  Layout,
  Mail,
  DollarSign,
  Link as LinkIcon,
  Eye,
  Download,
  Grid3X3,
  User,
  Loader2,
  Save,
  Code,
  Copy,
  Check,
  Settings,
  Trash2,
  Plus,
  ChevronDown,
  Zap,
  Star,
  MessageSquare,
  Image,
  Type,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  buildWebsiteFromInstagram, 
  saveWebsite, 
  getWebsites, 
  updateWebsite,
  deleteWebsite
} from "@/lib/api";
import { generateAdvancedWebsiteHTML } from "@/lib/websiteGenerator";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebsiteData {
  id?: string;
  username: string;
  name: string;
  bio: string;
  headline?: string;
  subheadline?: string;
  about?: {
    title?: string;
    content?: string;
    highlights?: string[];
  };
  links: { title: string; url: string; icon?: string; isPrimary?: boolean }[];
  services?: { 
    name: string; 
    price: string; 
    description: string;
    features?: string[];
    popular?: boolean;
  }[];
  testimonials?: {
    name: string;
    role: string;
    content: string;
    avatar?: string;
  }[];
  features?: {
    icon: string;
    title: string;
    description: string;
  }[];
  contactIntro?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
  theme: string;
  published: boolean;
  includeSections?: {
    hero?: boolean;
    about?: boolean;
    features?: boolean;
    services?: boolean;
    testimonials?: boolean;
    contact?: boolean;
    links?: boolean;
  };
}

const themePresets = [
  { id: "dark", name: "Dark Pro", icon: Moon, colors: { primary: "#6366f1", secondary: "#8b5cf6", background: "#0f172a" } },
  { id: "light", name: "Light Clean", icon: Sun, colors: { primary: "#4f46e5", secondary: "#7c3aed", background: "#f8fafc" } },
  { id: "gradient", name: "Gradient", icon: Sparkles, colors: { primary: "#ec4899", secondary: "#8b5cf6", background: "#667eea" } },
  { id: "neon", name: "Neon Glow", icon: Zap, colors: { primary: "#00ff88", secondary: "#00d4ff", background: "#0a0a0a" } },
  { id: "minimal", name: "Minimal B&W", icon: Grid3X3, colors: { primary: "#000000", secondary: "#333333", background: "#ffffff" } },
  { id: "warm", name: "Warm Sunset", icon: Star, colors: { primary: "#f97316", secondary: "#ea580c", background: "#fffbeb" } },
];

const fontPresets = [
  { id: "inter", name: "Inter", preview: "Aa" },
  { id: "poppins", name: "Poppins", preview: "Aa" },
  { id: "playfair", name: "Playfair", preview: "Aa" },
  { id: "space", name: "Space Grotesk", preview: "Aa" },
];

const businessTypes = [
  "Content Creator", "Influencer", "Coach/Consultant", "Freelancer", 
  "Artist/Designer", "Musician", "Photographer", "E-commerce", "Agency", "Other"
];

export default function WebsiteBuilder() {
  const [activeTab, setActiveTab] = useState("build");
  const [isBuilding, setIsBuilding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [savedWebsites, setSavedWebsites] = useState<WebsiteData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    businessName: "",
    businessType: "Content Creator",
    selectedTheme: "dark",
    selectedFont: "inter",
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
  });

  const [sections, setSections] = useState({
    hero: true,
    about: true,
    features: true,
    services: true,
    testimonials: true,
    contact: true,
    links: true,
  });

  const [features, setFeatures] = useState({
    animations: true,
    responsiveDesign: true,
    contactForm: true,
    socialLinks: true,
    seoOptimized: true,
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
          about: typeof w.sections === 'object' && w.sections !== null ? (w.sections as { about?: WebsiteData['about'] }).about : undefined,
          links: (w.links as WebsiteData['links']) || [],
          services: (w.services as WebsiteData['services']) || [],
          theme: w.theme || "dark",
          published: w.published || false,
        }));
        setSavedWebsites(mapped);
      }
    } catch (error) {
      console.error("Error loading websites:", error);
    }
  };

  const handleBuild = async () => {
    if (!formData.username.trim() && !formData.businessName.trim()) {
      toast({ title: "Please enter a username or business name", variant: "destructive" });
      return;
    }

    setIsBuilding(true);
    try {
      const activeSections = Object.entries(sections)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

      const activeFeatures = Object.entries(features)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim());

      const result = await buildWebsiteFromInstagram({
        username: formData.username,
        businessName: formData.businessName,
        businessType: formData.businessType,
        style: formData.selectedTheme,
        colorTheme: `${formData.primaryColor} and ${formData.secondaryColor}`,
        fontStyle: formData.selectedFont,
        sections: activeSections,
        features: activeFeatures,
      });

      if (result?.website) {
        const newWebsite: WebsiteData = {
          username: formData.username || formData.businessName,
          name: result.website.name || formData.businessName || formData.username,
          bio: result.website.bio || "",
          headline: result.website.headline,
          subheadline: result.website.subheadline,
          about: result.website.about,
          links: result.website.links || [],
          services: result.website.services || [],
          testimonials: result.website.testimonials || [],
          features: result.website.features || [],
          contactIntro: result.website.contactIntro,
          socialLinks: result.website.socialLinks,
          colorScheme: result.website.colorScheme,
          theme: formData.selectedTheme,
          published: false,
          includeSections: sections,
        };
        setWebsite(newWebsite);
        setActiveTab("customize");
        toast({ 
          title: "Website generated!", 
          description: "Your professional website is ready. Customize it in the next tab." 
        });
      }
    } catch (error) {
      console.error("Build error:", error);
      toast({ 
        title: "Generation failed", 
        description: "Please try again or check your inputs.",
        variant: "destructive" 
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const handleSave = async () => {
    if (!website) return;

    setIsSaving(true);
    try {
      const html = generateAdvancedWebsiteHTML(website);

      if (website.id) {
        await updateWebsite(website.id, {
          name: website.name,
          bio: website.bio,
          headline: website.headline,
          about: website.about?.content,
          theme: website.theme,
          links: website.links,
          services: website.services,
          sections: {
            about: website.about,
            testimonials: website.testimonials,
            features: website.features,
            socialLinks: website.socialLinks,
            includeSections: website.includeSections,
          },
          html_content: html,
        });
        toast({ title: "Website updated successfully!" });
      } else {
        const saved = await saveWebsite({
          username: website.username,
          name: website.name,
          bio: website.bio,
          headline: website.headline,
          about: website.about?.content,
          theme: website.theme,
          links: website.links,
          services: website.services,
          sections: {
            about: website.about,
            testimonials: website.testimonials,
            features: website.features,
            socialLinks: website.socialLinks,
            includeSections: website.includeSections,
          },
          html_content: html,
        });
        setWebsite({ ...website, id: saved.id });
        toast({ title: "Website saved successfully!" });
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
    const html = generateAdvancedWebsiteHTML(website);
    setHtmlContent(html);
    setShowExport(true);
  };

  const handlePreview = () => {
    if (!website) return;
    setShowPreview(true);
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

  const copyHTML = async () => {
    await navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    toast({ title: "HTML copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteWebsite = async (id: string) => {
    try {
      await deleteWebsite(id);
      await loadSavedWebsites();
      if (website?.id === id) {
        setWebsite(null);
      }
      toast({ title: "Website deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      toast({ title: "Error deleting website", variant: "destructive" });
    }
  };

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
    if (website) {
      setWebsite(prev => prev ? {
        ...prev,
        includeSections: { ...prev.includeSections, [key]: !sections[key] }
      } : null);
    }
  };

  const updateTheme = (themeId: string) => {
    setFormData(prev => ({ ...prev, selectedTheme: themeId }));
    if (website) {
      setWebsite(prev => prev ? { ...prev, theme: themeId } : null);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            AI Website Builder
          </div>
          <h1 className="text-4xl font-bold text-foreground">Create Your Website</h1>
          <p className="text-lg text-muted-foreground mt-3">
            Generate a stunning, professional website in seconds with AI.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="build" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Build</span>
            </TabsTrigger>
            <TabsTrigger value="customize" disabled={!website} className="gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Customize</span>
            </TabsTrigger>
            <TabsTrigger value="export" disabled={!website} className="gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          {/* Build Tab */}
          <TabsContent value="build" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Input Fields */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Basic Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Instagram Username (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="@yourusername"
                        className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Business/Brand Name *
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Your Brand Name"
                        className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Business Type
                      </label>
                      <div className="relative">
                        <select
                          value={formData.businessType}
                          onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                          className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                        >
                          {businessTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Theme Selection */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    Theme & Colors
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {themePresets.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => updateTheme(theme.id)}
                        className={cn(
                          "p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105",
                          formData.selectedTheme === theme.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div 
                          className="w-full h-10 rounded-lg mb-2 flex items-center justify-center"
                          style={{ background: theme.colors.background }}
                        >
                          <div 
                            className="w-6 h-6 rounded-full"
                            style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">{theme.name}</p>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.primaryColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={formData.primaryColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="flex-1 h-10 px-3 rounded-lg bg-secondary text-sm text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.secondaryColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={formData.secondaryColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="flex-1 h-10 px-3 rounded-lg bg-secondary text-sm text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Sections & Features */}
              <div className="space-y-6">
                {/* Sections */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Layout className="w-5 h-5 text-primary" />
                    Website Sections
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "hero" as const, icon: Star, label: "Hero Header" },
                      { key: "about" as const, icon: User, label: "About" },
                      { key: "features" as const, icon: Zap, label: "Features" },
                      { key: "services" as const, icon: DollarSign, label: "Services" },
                      { key: "testimonials" as const, icon: MessageSquare, label: "Testimonials" },
                      { key: "links" as const, icon: LinkIcon, label: "Links" },
                      { key: "contact" as const, icon: Mail, label: "Contact" },
                    ].map((section) => (
                      <button
                        key={section.key}
                        onClick={() => toggleSection(section.key)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                          sections[section.key] 
                            ? "bg-primary/10 border border-primary/30 text-primary" 
                            : "bg-secondary/50 border border-transparent hover:bg-secondary text-muted-foreground"
                        )}
                      >
                        <section.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.label}</span>
                        {sections[section.key] && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Extra Features
                  </h3>
                  <div className="space-y-2">
                    {[
                      { key: "animations" as const, label: "Smooth Animations", desc: "Scroll and hover effects" },
                      { key: "responsiveDesign" as const, label: "Responsive Design", desc: "Mobile-friendly layout" },
                      { key: "contactForm" as const, label: "Contact Form", desc: "Collect visitor messages" },
                      { key: "socialLinks" as const, label: "Social Links", desc: "Connect your profiles" },
                      { key: "seoOptimized" as const, label: "SEO Optimized", desc: "Search engine friendly" },
                    ].map((feature) => (
                      <button
                        key={feature.key}
                        onClick={() => setFeatures(prev => ({ ...prev, [feature.key]: !prev[feature.key] }))}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="text-left">
                          <span className="text-sm font-medium text-foreground block">{feature.label}</span>
                          <span className="text-xs text-muted-foreground">{feature.desc}</span>
                        </div>
                        <div className={cn(
                          "w-10 h-6 rounded-full p-1 transition-colors",
                          features[feature.key] ? "bg-primary" : "bg-muted"
                        )}>
                          <div className={cn(
                            "w-4 h-4 rounded-full bg-card transition-transform",
                            features[feature.key] && "translate-x-4"
                          )} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-4">
              <Button 
                size="lg"
                className="h-14 px-12 gap-3 text-lg rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
                onClick={handleBuild}
                disabled={isBuilding || (!formData.username && !formData.businessName)}
              >
                {isBuilding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Website...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Website
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="space-y-6">
            {website && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Preview Window */}
                <div className="lg:col-span-2">
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-destructive/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">
                          {website.username.toLowerCase().replace(/[^a-z0-9]/g, "")}.site
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="gap-2" onClick={handlePreview}>
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">Full Preview</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="relative h-[600px] overflow-hidden">
                      <iframe
                        srcDoc={generateAdvancedWebsiteHTML(website)}
                        className="w-full h-full border-0 scale-[0.6] origin-top-left"
                        style={{ width: '166.67%', height: '166.67%' }}
                        title="Website Preview"
                      />
                    </div>
                  </div>
                </div>

                {/* Customization Panel */}
                <div className="space-y-4">
                  {/* Quick Theme */}
                  <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Palette className="w-5 h-5 text-primary" />
                      Quick Theme
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {themePresets.slice(0, 6).map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => updateTheme(theme.id)}
                          className={cn(
                            "p-2 rounded-xl border-2 transition-all",
                            website.theme === theme.id ? "border-primary" : "border-transparent hover:border-border"
                          )}
                        >
                          <div 
                            className="w-full h-8 rounded-lg"
                            style={{ background: theme.colors.background }}
                          />
                          <p className="text-xs text-muted-foreground mt-1">{theme.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section Toggles */}
                  <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Layout className="w-5 h-5 text-primary" />
                      Toggle Sections
                    </h3>
                    <div className="space-y-2">
                      {[
                        { key: "hero" as const, label: "Hero" },
                        { key: "about" as const, label: "About" },
                        { key: "features" as const, label: "Features" },
                        { key: "services" as const, label: "Services" },
                        { key: "testimonials" as const, label: "Testimonials" },
                        { key: "links" as const, label: "Links" },
                        { key: "contact" as const, label: "Contact" },
                      ].map((section) => (
                        <button
                          key={section.key}
                          onClick={() => toggleSection(section.key)}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <span className="text-sm text-foreground">{section.label}</span>
                          <div className={cn(
                            "w-8 h-5 rounded-full p-0.5 transition-colors",
                            sections[section.key] ? "bg-primary" : "bg-muted"
                          )}>
                            <div className={cn(
                              "w-4 h-4 rounded-full bg-card transition-transform",
                              sections[section.key] && "translate-x-3"
                            )} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button 
                      className="w-full gap-2"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {website.id ? "Update" : "Save"} Website
                    </Button>
                    <Button variant="outline" className="w-full gap-2" onClick={() => setActiveTab("export")}>
                      <Code className="w-4 h-4" />
                      Export Code
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            {website && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Download className="w-5 h-5 text-primary" />
                      Export Options
                    </h3>
                    <div className="space-y-3">
                      <Button 
                        className="w-full gap-2 h-12 justify-start"
                        onClick={() => {
                          const html = generateAdvancedWebsiteHTML(website);
                          setHtmlContent(html);
                          downloadHTML();
                        }}
                      >
                        <Download className="w-5 h-5" />
                        Download as HTML File
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full gap-2 h-12 justify-start"
                        onClick={() => {
                          const html = generateAdvancedWebsiteHTML(website);
                          setHtmlContent(html);
                          copyHTML();
                        }}
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {copied ? "Copied!" : "Copy HTML to Clipboard"}
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full gap-2 h-12 justify-start"
                        onClick={handleExport}
                      >
                        <Eye className="w-5 h-5" />
                        View Full Code
                      </Button>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">What's Included</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Complete HTML with embedded CSS
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Responsive mobile-first design
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Smooth scroll animations (AOS)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        SEO-optimized meta tags
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Modern Google Fonts
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Contact form ready
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-4 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Code Preview</span>
                    <Button size="sm" variant="ghost" onClick={() => {
                      const html = generateAdvancedWebsiteHTML(website);
                      setHtmlContent(html);
                      copyHTML();
                    }}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <pre className="bg-secondary rounded-lg p-4 overflow-auto h-[400px] text-xs text-foreground/80">
                    <code>{generateAdvancedWebsiteHTML(website).slice(0, 2000)}...</code>
                  </pre>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Saved Websites */}
        {savedWebsites.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-primary" />
              Your Websites
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedWebsites.map((site) => (
                <div
                  key={site.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md",
                    website?.id === site.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => {
                    setWebsite(site);
                    setFormData(prev => ({ ...prev, selectedTheme: site.theme }));
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{site.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">@{site.username}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        site.id && handleDeleteWebsite(site.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ 
                        background: themePresets.find(t => t.id === site.theme)?.colors.primary || "#6366f1"
                      }}
                    />
                    <span className="text-xs text-muted-foreground capitalize">{site.theme} theme</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!website && !isBuilding && savedWebsites.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
              <Globe className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Start Building</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter your details above and let AI create a stunning personal website for you.
            </p>
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="p-4 border-b border-border">
              <DialogTitle className="flex items-center justify-between">
                <span>Website Preview</span>
                <Button size="sm" variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
              </DialogTitle>
            </DialogHeader>
            {website && (
              <iframe
                srcDoc={generateAdvancedWebsiteHTML(website)}
                className="w-full h-[80vh] border-0"
                title="Website Preview"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={showExport} onOpenChange={setShowExport}>
          <DialogContent className="max-w-5xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Export HTML</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyHTML}>
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
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
