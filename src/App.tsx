import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TripProvider } from "@/contexts/TripContext";
import Index from "./pages/Index";
import Itinerary from "./pages/Itinerary";
import SavedTrips from "./pages/SavedTrips";
import SharedTrip from "./pages/SharedTrip";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TripProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/saved" element={<SavedTrips />} />
            <Route path="/trip/:shareCode" element={<SharedTrip />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TripProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
