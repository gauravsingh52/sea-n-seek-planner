import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TripProvider } from "@/contexts/TripContext";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Itinerary from "./pages/Itinerary";
import SavedTrips from "./pages/SavedTrips";
import SharedTrip from "./pages/SharedTrip";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RouteScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TripProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteScrollToTop />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/itinerary" element={<ProtectedRoute><Itinerary /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><SavedTrips /></ProtectedRoute>} />
              <Route path="/trip/:shareCode" element={<SharedTrip />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TripProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
