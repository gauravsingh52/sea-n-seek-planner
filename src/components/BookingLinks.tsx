import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ItineraryLeg } from "@/types/itinerary";

function getBookingUrl(leg: ItineraryLeg): { url: string; label: string } | null {
  const from = encodeURIComponent(leg.from || "");
  const to = encodeURIComponent(leg.to || "");

  if (leg.type === "transport") {
    switch (leg.icon) {
      case "plane":
        return { url: `https://www.google.com/travel/flights?q=flights+from+${from}+to+${to}`, label: "Flights" };
      case "train":
        return { url: `https://www.google.com/maps/dir/${from}/${to}/?travelmode=transit`, label: "Trains" };
      case "bus":
        return { url: `https://www.google.com/maps/dir/${from}/${to}/?travelmode=transit`, label: "Bus" };
      case "car":
        return { url: `https://www.google.com/maps/dir/${from}/${to}/?travelmode=driving`, label: "Drive" };
      case "ship":
        return { url: `https://www.google.com/search?q=ferry+${from}+to+${to}`, label: "Ferry" };
      default:
        return { url: `https://www.google.com/maps/dir/${from}/${to}/`, label: "Directions" };
    }
  }

  if (leg.type === "hotel") {
    const dest = encodeURIComponent(leg.from || leg.title || "");
    return { url: `https://www.google.com/travel/hotels/${dest}`, label: "Hotels" };
  }

  if (leg.type === "activity") {
    const place = encodeURIComponent(leg.from || leg.title || "");
    return { url: `https://www.google.com/maps/search/${place}`, label: "Map" };
  }

  return null;
}

export function BookingLinks({ leg }: { leg: ItineraryLeg }) {
  const link = getBookingUrl(leg);
  if (!link) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 px-2 text-[10px] gap-1 text-primary hover:text-primary/80"
      asChild
    >
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="w-3 h-3" />
        {link.label}
      </a>
    </Button>
  );
}
