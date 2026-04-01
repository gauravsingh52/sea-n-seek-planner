import { createContext, useContext, useState, ReactNode } from "react";
import type { ItineraryData } from "@/types/itinerary";

interface TripContextType {
  itinerary: ItineraryData | null;
  setItinerary: (data: ItineraryData | null) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  return (
    <TripContext.Provider value={{ itinerary, setItinerary }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
