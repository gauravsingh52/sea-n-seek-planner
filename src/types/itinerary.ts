export type LegType = "transport" | "hotel" | "activity";

export interface ItineraryLeg {
  id: string;
  type: LegType;
  title: string;
  description: string;
  from?: string;
  to?: string;
  fromCoords?: { lat: number; lng: number };
  toCoords?: { lat: number; lng: number };
  time?: string;
  cost: number;
  icon?: string;
}

export interface WeatherData {
  tempHigh: number;
  tempLow: number;
  condition: string;
  icon: string;
}

export interface ItineraryData {
  legs: ItineraryLeg[];
  totalCost: number;
  currency: string;
  title?: string;
}
