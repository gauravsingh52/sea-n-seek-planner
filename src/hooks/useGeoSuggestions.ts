import { useState, useEffect } from "react";
import { Ship, Train, Car, Palmtree } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface GeoSuggestion {
  icon: LucideIcon;
  text: string;
}

interface GeoResult {
  suggestions: GeoSuggestion[];
  locationLabel: string;
  isLoading: boolean;
}

const FALLBACK: GeoSuggestion[] = [
  { icon: Ship, text: "Plan a ferry trip from Barcelona to Ibiza with hotels" },
  { icon: Train, text: "Compare bullet trains vs flights from Tokyo to Osaka" },
  { icon: Car, text: "Road trip itinerary along the California coast" },
  { icon: Palmtree, text: "Plan a budget island-hopping trip in Bali" },
];

const COUNTRY_PROMPTS: Record<string, GeoSuggestion[]> = {
  IN: [
    { icon: Car, text: "Weekend getaway from {city} to Manali via scenic hill roads" },
    { icon: Ship, text: "Kerala backwater houseboat cruise from Alleppey to Kumarakom" },
    { icon: Car, text: "Rajasthan palace tour: Delhi → Jaipur → Udaipur → Jodhpur" },
    { icon: Train, text: "Darjeeling Himalayan Railway toy train experience" },
  ],
  US: [
    { icon: Car, text: "Pacific Coast Highway road trip from LA to San Francisco" },
    { icon: Train, text: "Amtrak scenic route from New York to Washington DC" },
    { icon: Palmtree, text: "Hawaii island-hopping: Oahu, Maui & Big Island" },
    { icon: Car, text: "Historic Route 66 road trip from Chicago to Santa Monica" },
  ],
  GB: [
    { icon: Car, text: "Scottish Highlands road trip: Edinburgh to Isle of Skye" },
    { icon: Train, text: "London to Edinburgh on the LNER east coast line" },
    { icon: Palmtree, text: "Lake District weekend retreat with hiking trails" },
    { icon: Ship, text: "Channel Islands ferry trip from Poole to Jersey & Guernsey" },
  ],
  JP: [
    { icon: Train, text: "Shinkansen bullet train tour: Tokyo → Kyoto → Osaka" },
    { icon: Palmtree, text: "Okinawa tropical island hopping with beach resorts" },
    { icon: Car, text: "Hokkaido scenic road trip through Furano & Biei" },
    { icon: Car, text: "Mt Fuji day trip from Tokyo with lake views" },
  ],
  AU: [
    { icon: Car, text: "Great Ocean Road drive from Melbourne to the 12 Apostles" },
    { icon: Train, text: "Sydney to Melbourne XPT coastal rail journey" },
    { icon: Palmtree, text: "Whitsunday Islands sailing and snorkeling trip" },
    { icon: Car, text: "Red Centre outback road trip: Alice Springs to Uluru" },
  ],
  TH: [
    { icon: Train, text: "Overnight sleeper train from Bangkok to Chiang Mai" },
    { icon: Palmtree, text: "Krabi island hopping: Railay, Koh Phi Phi & Koh Lanta" },
    { icon: Car, text: "Ayutthaya ancient temples day trip from Bangkok" },
    { icon: Ship, text: "Phuket to Koh Samui coastal ferry adventure" },
  ],
  DE: [
    { icon: Train, text: "ICE high-speed train from Berlin to Munich via Nuremberg" },
    { icon: Car, text: "Romantic Road drive from Würzburg to Füssen" },
    { icon: Ship, text: "Rhine river cruise from Cologne to Koblenz" },
    { icon: Palmtree, text: "Black Forest hiking and spa retreat" },
  ],
  FR: [
    { icon: Train, text: "TGV from Paris to Nice along the French Riviera" },
    { icon: Car, text: "Loire Valley château road trip from Tours" },
    { icon: Ship, text: "Corsica ferry from Nice with coastal village tour" },
    { icon: Palmtree, text: "Provence lavender fields and wine tasting trip" },
  ],
};

const REGION_PROMPTS: Record<string, GeoSuggestion[]> = {
  EU: [
    { icon: Ship, text: "Plan a Channel ferry trip from Dover to Calais with hotels" },
    { icon: Train, text: "Eurostar journey from London to Paris with day trips" },
    { icon: Palmtree, text: "Mediterranean island hopping: Santorini, Mykonos & Crete" },
    { icon: Car, text: "Alpine road trip through Switzerland and Austria" },
  ],
  NA: [
    { icon: Car, text: "Road trip along the California coast from LA to San Francisco" },
    { icon: Ship, text: "Caribbean cruise itinerary: Bahamas, Jamaica & Cozumel" },
    { icon: Train, text: "Cross-country Amtrak trip from New York to Los Angeles" },
    { icon: Palmtree, text: "Beach-hopping in Cancún and the Riviera Maya" },
  ],
  AS: [
    { icon: Train, text: "Bullet train tour from Tokyo to Kyoto to Osaka" },
    { icon: Palmtree, text: "Island hopping in Thailand: Phuket, Koh Phi Phi & Krabi" },
    { icon: Car, text: "Golden Triangle road trip: Delhi, Agra & Jaipur" },
    { icon: Ship, text: "Ferry trip through Ha Long Bay in Vietnam" },
  ],
  SA: [
    { icon: Car, text: "Patagonia road trip from Buenos Aires to Ushuaia" },
    { icon: Ship, text: "Amazon river cruise from Manaus to Belém" },
    { icon: Palmtree, text: "Galápagos Islands hopping itinerary from Quito" },
    { icon: Train, text: "Peru rail journey to Machu Picchu from Cusco" },
  ],
  OC: [
    { icon: Car, text: "New Zealand South Island road trip: Queenstown to Milford Sound" },
    { icon: Palmtree, text: "Fiji island-hopping trip with beach resorts" },
    { icon: Ship, text: "Sydney to Tasmania ferry and coastal tour" },
    { icon: Train, text: "Great Southern rail journey across Australia" },
  ],
  AF: [
    { icon: Car, text: "Safari route from Nairobi to Masai Mara and Serengeti" },
    { icon: Ship, text: "Morocco coastal trip from Tangier to Essaouira" },
    { icon: Train, text: "Blue Train luxury journey from Pretoria to Cape Town" },
    { icon: Palmtree, text: "Zanzibar and Dar es Salaam beach & culture trip" },
  ],
};

export function useGeoSuggestions(): GeoResult {
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>(FALLBACK);
  const [locationLabel, setLocationLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        const continent = data.continent_code as string;
        const city = data.city as string;
        const country = data.country_name as string;
        const countryCode = data.country_code as string;

        // Priority: country → continent → fallback
        if (countryCode && COUNTRY_PROMPTS[countryCode]) {
          const prompts = COUNTRY_PROMPTS[countryCode].map((p) => ({
            ...p,
            text: city ? p.text.replace("{city}", city) : p.text.replace(/from \{city\} /g, ""),
          }));
          setSuggestions(prompts);
        } else if (continent && REGION_PROMPTS[continent]) {
          setSuggestions(REGION_PROMPTS[continent]);
        }

        if (city) {
          setLocationLabel(`Popular trips near ${city}`);
        } else if (country) {
          setLocationLabel(`Suggested for travelers in ${country}`);
        }
      })
      .catch(() => {
        // fallback silently
      })
      .finally(() => {
        clearTimeout(timeout);
        setIsLoading(false);
      });

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  return { suggestions, locationLabel, isLoading };
}
