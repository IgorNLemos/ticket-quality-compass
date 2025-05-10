
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./pages/NotFound";
import IssuePanelView from "./pages/IssuePanelView";
import AdminView from "./pages/AdminView";
import { JiraProvider } from "./contexts/JiraContext";
import { useJira } from "./contexts/JiraContext";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// ModuleRouter handles displaying the correct component based on the Jira module key
const ModuleRouter = () => {
  const { isLoading, moduleKey } = useJira();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Log the module key for debugging
  console.log('Current module key:', moduleKey);
  
  // Render the appropriate component based on the module key
  switch (moduleKey) {
    case 'ticket-evaluation-dashboard':
      return <AdminView />;
    case 'ticket-evaluation-panel':
      return <IssuePanelView />;
    default:
      // For development or when moduleKey is unknown, try to infer from URL
      if (window.location.pathname.includes('issue-panel')) {
        return <IssuePanelView />;
      } else if (window.location.pathname.includes('admin')) {
        return <AdminView />;
      } else {
        // Default to admin view for local development
        console.warn('Unknown module key, defaulting to NotFound view');
        return <NotFound />;
      }
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <JiraProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ModuleRouter />
      </TooltipProvider>
    </JiraProvider>
  </QueryClientProvider>
);

export default App;
