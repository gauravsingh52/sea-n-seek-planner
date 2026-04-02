import { useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Camera, MapPin } from "lucide-react";
import type { ItineraryData } from "@/types/itinerary";

const GRADIENT_PAIRS = [
  ["hsl(var(--primary))", "hsl(var(--accent))"],
  ["hsl(var(--earth-mid))", "hsl(var(--sand))"],
  ["hsl(var(--earth-light))", "hsl(var(--sunset))"],
  ["hsl(var(--primary))", "hsl(var(--earth-light))"],
  ["hsl(var(--accent))", "hsl(var(--earth-mid))"],
  ["hsl(var(--sunset))", "hsl(var(--primary))"],
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
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
            {destinations.map((dest) => {
              const idx = hashCode(dest) % GRADIENT_PAIRS.length;
              const [from, to] = GRADIENT_PAIRS[idx];
              const angle = (hashCode(dest + "angle") % 4) * 45 + 120;
              return (
                <div key={dest} className="flex-shrink-0 w-36">
                  <div
                    className="relative w-36 h-24 rounded-xl overflow-hidden flex flex-col items-center justify-center"
                    style={{
                      background: `linear-gradient(${angle}deg, ${from}, ${to})`,
                    }}
                  >
                    <MapPin className="w-5 h-5 text-primary-foreground/80 mb-1" />
                    <span className="text-primary-foreground text-xs font-semibold text-center px-2 leading-tight drop-shadow-sm">
                      {dest}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardHeader>
    </Card>
  );
}
