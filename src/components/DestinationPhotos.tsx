import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Camera, MapPin } from "lucide-react";
import type { ItineraryData } from "@/types/itinerary";

function DestinationCard({ dest }: { dest: string }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(dest.toLowerCase())}/288/192`;

  return (
    <div className="flex-shrink-0 w-36">
      <div className="relative w-36 h-24 rounded-xl overflow-hidden">
        {!imgError ? (
          <>
            <img
              src={imageUrl}
              alt={dest}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <span className="text-white text-xs font-semibold leading-tight drop-shadow-sm flex items-center gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {dest}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-muted flex flex-col items-center justify-center">
            <MapPin className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-muted-foreground text-xs font-semibold text-center px-2 leading-tight">
              {dest}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

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
              <DestinationCard key={dest} dest={dest} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardHeader>
    </Card>
  );
}
