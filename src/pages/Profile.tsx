import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Camera, 
  Save,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Mail,
  MapPin,
  Link as LinkIcon,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ElementType;
}

export default function Profile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [niche, setNiche] = useState("");
  const [experience, setExperience] = useState("Intermediate");
  
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    youtube: "",
    twitter: "",
    tiktok: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Save profile logic here
    toast({
      title: "Profile saved!",
      description: "Your profile has been updated successfully.",
    });
  };

  const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your creator profile</p>
          </div>
          <Button 
            className="gap-2 bg-gradient-to-r from-primary to-primary/80"
            onClick={handleSave}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center overflow-hidden border-4 border-border shadow-xl">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-primary-foreground" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground mt-3">Click to upload photo</p>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="yourname"
                      className="w-full h-12 pl-8 pr-4 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full h-12 px-4 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and what you create..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full h-12 px-4 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full h-12 px-4 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Info */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Creator Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Content Niche</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., Fitness, Tech, Lifestyle..."
                className="w-full h-12 px-4 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Globe className="w-4 h-4 text-primary" />
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full h-12 px-4 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <label className="text-sm font-semibold text-foreground">Experience Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {experienceLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setExperience(level)}
                  className={cn(
                    "py-3 px-4 rounded-xl text-sm font-medium transition-all border-2",
                    experience === level
                      ? "bg-primary text-primary-foreground border-primary shadow-lg"
                      : "bg-secondary hover:bg-secondary/80 text-foreground border-transparent hover:border-primary/30"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" />
            Social Links
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Instagram className="w-4 h-4 text-pink-500" />
                Instagram
              </label>
              <input
                type="url"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                placeholder="https://instagram.com/username"
                className="w-full h-12 px-4 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Youtube className="w-4 h-4 text-red-500" />
                YouTube
              </label>
              <input
                type="url"
                value={socialLinks.youtube}
                onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})}
                placeholder="https://youtube.com/@channel"
                className="w-full h-12 px-4 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Twitter className="w-4 h-4 text-blue-400" />
                X (Twitter)
              </label>
              <input
                type="url"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                placeholder="https://x.com/username"
                className="w-full h-12 px-4 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                TikTok
              </label>
              <input
                type="url"
                value={socialLinks.tiktok}
                onChange={(e) => setSocialLinks({...socialLinks, tiktok: e.target.value})}
                placeholder="https://tiktok.com/@username"
                className="w-full h-12 px-4 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Save Button (Mobile) */}
        <div className="md:hidden">
          <Button 
            className="w-full h-14 gap-2 bg-gradient-to-r from-primary to-primary/80 rounded-2xl text-base"
            onClick={handleSave}
          >
            <Save className="w-5 h-5" />
            Save Changes
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
