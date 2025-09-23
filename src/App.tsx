import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { HireXForm } from "./components/HireXForm";
import { Profile } from "./components/Profile";

const App = () => {
  const [currentView, setCurrentView] = useState<"dashboard" | "form" | "profile">("dashboard");

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onCreateNew={() => setCurrentView("form")} />;
      case "form":
        return <HireXForm />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard onCreateNew={() => setCurrentView("form")} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation currentView={currentView} onViewChange={setCurrentView} />
          {renderCurrentView()}
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
