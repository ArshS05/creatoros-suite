import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ContentCalendar from "./pages/ContentCalendar";
import IdeaScrapbook from "./pages/IdeaScrapbook";
import AutoReScript from "./pages/AutoReScript";
import WebsiteBuilder from "./pages/WebsiteBuilder";
import CollabInbox from "./pages/CollabInbox";
import CollabTracker from "./pages/CollabTracker";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<ContentCalendar />} />
          <Route path="/ideas" element={<IdeaScrapbook />} />
          <Route path="/rescript" element={<AutoReScript />} />
          <Route path="/website" element={<WebsiteBuilder />} />
          <Route path="/inbox" element={<CollabInbox />} />
          <Route path="/tracker" element={<CollabTracker />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
