import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ship, Hotel, Bus, MapPin, Train, Car, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { useTrip } from "@/contexts/TripContext";
import { TripMap } from "@/components/TripMap";
import type { ItineraryLeg } from "@/types/itinerary";

const iconMap: Record<string, any> = {
  ship: Ship, train: Train, car: Car, plane: Plane, bus: Bus, hotel: Hotel, pin: MapPin,
};

function getIcon(leg: ItineraryLeg) {
  if (leg.icon && iconMap[leg.icon]) return iconMap[leg.icon];
  if (leg.type === "transport") return Ship;
  if (leg.type === "hotel") return Hotel;
  return MapPin;
}

const legColors: Record<string, string> = {
  transport: "border-l-primary",
  hotel: "border-l-accent",
  activity: "border-l-sunset",
};

const legIconBg: Record<string, string> = {
  transport: "bg-primary/15 text-primary",
  hotel: "bg-accent/15 text-accent",
  activity: "bg-sunset/15 text-sunset",
};

function CostBreakdown({ legs, totalCost, currency }: { legs: ItineraryLeg[]; totalCost: number; currency: string }) {
  const categories: Record<string, number> = {};
  legs.forEach((leg) => {
    const cat = leg.type === "transport" ? "Transport" : leg.type === "hotel" ? "Accommodation" : "Activities";
    categories[cat] = (categories[cat] || 0) + leg.cost;
  });
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "€";

  return (
    <Card className="glass-strong gradient-border">
      <CardHeader className="py-4 px-5">
        <CardTitle className="text-base font-display gradient-text mb-3">💰 Cost Breakdown</CardTitle>
        <div className="space-y-2">
          {Object.entries(categories).map(([cat, cost]) => (
            <div key={cat} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{cat}</span>
              <span className="font-semibold text-foreground">{symbol}{cost.toFixed(0)}</span>
            </div>
          ))}
          <div className="border-t border-border/30 pt-2 flex justify-between text-base font-bold">
            <span className="gradient-text">Total</span>
            <span className="gradient-text">{symbol}{totalCost.toFixed(0)}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default function Itinerary() {
  const navigate = useNavigate();
  const { itinerary } = useTrip();

  return (
    <div className="min-h-screen bg-background relative travel-bg">
      <div className="particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDuration: `${15 + Math.random() * 20}s`, animationDelay: `${Math.random() * 10}s` }} />
        ))}
      </div>

      <header className="relative z-10 flex items-center gap-3 px-4 md:px-6 py-3 glass-strong border-b border-border/30">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="glass text-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Logo size={36} />
          <h1 className="text-lg font-display font-bold gradient-text">
            {itinerary?.title || "Your Itinerary"}
          </h1>
        </div>
      </header>

      {!itinerary ? (
        <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-6 animate-slide-up-fade" style={{ animation: "slide-up-fade 0.6s ease-out forwards, glow-pulse 3s ease-in-out infinite 0.6s" }}>
              <MapPin className="w-10 h-10 text-muted-foreground animate-bounce-subtle" />
            </div>
            <h2 className="text-2xl font-display font-bold gradient-text mb-3 opacity-0 animate-slide-up-fade" style={{ animationDelay: "0.15s" }}>
              No itinerary yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto opacity-0 animate-slide-up-fade" style={{ animationDelay: "0.3s" }}>
              Chat with TripMap Planner to create a travel plan. Your itinerary will appear here once generated.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="rounded-2xl earth-gradient shadow-lg hover:scale-105 transition-transform duration-300 opacity-0 animate-slide-up-fade"
              style={{ animationDelay: "0.45s" }}
            >
              Start Planning
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col h-[calc(100vh-60px)]">
          <div className="h-[40vh] min-h-[250px] p-4 pb-2">
            <TripMap itinerary={itinerary} />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="max-w-3xl mx-auto space-y-4 pt-2">
              {itinerary.legs.map((leg, i) => {
                const Icon = getIcon(leg);
                const symbol = itinerary.currency === "GBP" ? "£" : itinerary.currency === "USD" ? "$" : "€";
                const borderColor = legColors[leg.type] || "border-l-primary";
                const iconBg = legIconBg[leg.type] || "bg-primary/15 text-primary";
                return (
                  <div key={leg.id} className="relative">
                    {i < itinerary.legs.length - 1 && (
                      <div className="absolute left-[23px] top-[56px] bottom-[-16px] w-[2px] bg-gradient-to-b from-primary/40 to-primary/10" />
                    )}
                    <Card
                      className={`glass gradient-border border-l-[3px] ${borderColor} opacity-0 animate-slide-up-fade hover:scale-[1.02] transition-transform duration-300`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <CardHeader className="flex flex-row items-center gap-3 py-3 px-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-sans font-semibold text-foreground">{leg.title}</CardTitle>
                          <p className="text-xs text-muted-foreground truncate">{leg.description}</p>
                          {leg.from && leg.to && (
                            <p className="text-xs text-muted-foreground/70 mt-0.5">{leg.from} → {leg.to}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-foreground">
                            {leg.cost > 0 ? `${symbol}${leg.cost}` : "Free"}
                          </p>
                          {leg.time && <p className="text-xs text-muted-foreground">{leg.time}</p>}
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                );
              })}
              <div className="opacity-0 animate-slide-up-fade" style={{ animationDelay: `${itinerary.legs.length * 0.1}s` }}>
                <CostBreakdown legs={itinerary.legs} totalCost={itinerary.totalCost} currency={itinerary.currency} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
