import { useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Camera } from "lucide-react";
import type { ItineraryData } from "@/types/itinerary";

export function DestinationPhotos({ itinerary }: { itinerary: ItineraryData }) {
  const destinations = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const leg of itinerary.legs) {
      for (const place of [leg.to, leg.from]) {
        if (place && !seen.has(place.toLowerCase())) {
          seen.add(place.toLowerCase());
          result.push(place);
        }
      }
    }
    return result.slice(0, 6);
  }, [itinerary.legs]);

  if (destinations.length === 0) return null;

  return (
    <Card className="glass-strong gradient-border">
      <CardHeader className="py-3 px-5">
        <CardTitle className="text-sm font-display gradient-text mb-2 flex items-center gap-1.5">
          <Camera className="w-4 h-4" /> Destination Photos
        </CardTitle>
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-2">
            {destinations.map((dest) => (
              <div key={dest} className="flex-shrink-0 w-36">
                <div className="relative w-36 h-24 rounded-xl overflow-hidden bg-muted">
                  <img
                    src={`https://source.unsplash.com/featured/288x192/?${encodeURIComponent(dest)},travel`}
                    alt={dest}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
                    <span className="text-white text-xs font-medium">{dest}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardHeader>
    </Card>
  );
}
