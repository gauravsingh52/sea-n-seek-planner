import { lazy, Suspense, Component, ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ship, Hotel, Bus, MapPin, Train, Car, Plane, Sun, Moon, Bookmark, BookmarkCheck, CloudSun, Clock, Luggage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";
import { ShareButtons } from "@/components/ShareButtons";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { ExportPDF } from "@/components/ExportPDF";
import { CopyItinerary } from "@/components/CopyItinerary";
import { TravelChecklist } from "@/components/TravelChecklist";
import { CustomStop } from "@/components/CustomStop";
import { BookingLinks } from "@/components/BookingLinks";
import { DestinationPhotos } from "@/components/DestinationPhotos";
import { TripDuration } from "@/components/TripDuration";
import { EmergencyInfo } from "@/components/EmergencyInfo";
import { useTrip } from "@/contexts/TripContext";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { useWeather } from "@/hooks/useWeather";
import type { ItineraryLeg, WeatherData } from "@/types/itinerary";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

const TripMap = lazy(() => import("@/components/TripMap").then(m => ({ default: m.TripMap })));

class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="w-full h-full rounded-2xl glass-strong flex items-center justify-center"><p className="text-muted-foreground text-sm">Map could not be loaded</p></div>;
    return this.props.children;
  }
}

const iconMap: Record<string, any> = { ship: Ship, train: Train, car: Car, plane: Plane, bus: Bus, hotel: Hotel, pin: MapPin };

function getIcon(leg: ItineraryLeg) {
  if (leg.icon && iconMap[leg.icon]) return iconMap[leg.icon];
  if (leg.type === "transport") return Ship;
  if (leg.type === "hotel") return Hotel;
  return MapPin;
}

const legColors: Record<string, string> = { transport: "border-l-primary", hotel: "border-l-accent", activity: "border-l-secondary" };
const legIconBg: Record<string, string> = { transport: "bg-primary/15 text-primary", hotel: "bg-accent/15 text-accent", activity: "bg-secondary/15 text-secondary-foreground" };
const currencySymbols: Record<string, string> = { INR: "₹", EUR: "€", USD: "$", GBP: "£", JPY: "¥", THB: "฿", AUD: "A$", CAD: "C$", SGD: "S$", MYR: "RM", NZD: "NZ$" };

function WeatherBadge({ data }: { data: WeatherData }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground" title={data.condition}>
      {data.icon} {data.tempHigh}°/{data.tempLow}°C
    </span>
  );
}

function CostBreakdown({ legs, totalCost, currency }: { legs: ItineraryLeg[]; totalCost: number; currency: string }) {
  const categories: Record<string, number> = {};
  legs.forEach((leg) => {
    const cat = leg.type === "transport" ? "Transport" : leg.type === "hotel" ? "Accommodation" : "Activities";
    categories[cat] = (categories[cat] || 0) + leg.cost;
  });
  const symbol = currencySymbols[currency] || currency || "$";

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

function PackingListCard({ items }: { items: string[] }) {
  return (
    <Card className="glass-strong gradient-border">
      <CardHeader className="py-4 px-5">
        <CardTitle className="text-base font-display gradient-text mb-3 flex items-center gap-1.5">
          <Luggage className="w-4 h-4" /> Packing List
        </CardTitle>
        <div className="grid grid-cols-2 gap-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
}

export default function Itinerary() {
  const navigate = useNavigate();
  const { itinerary, addCustomLeg } = useTrip();
  const { theme, toggleTheme } = useTheme();
  const { saveTrip, isSaved } = useSavedTrips();
  const { weather } = useWeather(itinerary);
  const saved = isSaved(itinerary);

  const handleSave = () => {
    if (itinerary && !saved) {
      saveTrip(itinerary);
      toast.success("Trip saved!");
    }
  };

  // Group legs by day
  const dayGroups: Record<number, ItineraryLeg[]> = {};
  if (itinerary) {
    itinerary.legs.forEach((leg) => {
      const day = leg.day || 1;
      if (!dayGroups[day]) dayGroups[day] = [];
      dayGroups[day].push(leg);
    });
  }
  const hasDays = itinerary && Object.keys(dayGroups).length > 1;
  const symbol = itinerary ? (currencySymbols[itinerary.currency] || itinerary.currency || "$") : "$";
  const maxDay = itinerary?.days || Math.max(...Object.keys(dayGroups).map(Number), 1);

  return (
    <div className="min-h-screen bg-background relative travel-bg">
      <div className="particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDuration: `${15 + Math.random() * 20}s`, animationDelay: `${Math.random() * 10}s` }} />
        ))}
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 glass-strong border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="glass text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Logo size={36} />
          <div>
            <h1 className="text-lg font-display font-bold gradient-text">
              {itinerary?.title || "Your Itinerary"}
            </h1>
            {itinerary?.days && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {itinerary.days} day{itinerary.days > 1 ? "s" : ""}{itinerary.nights ? `, ${itinerary.nights} night${itinerary.nights > 1 ? "s" : ""}` : ""}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {itinerary && (
            <>
              <ExportPDF itinerary={itinerary} />
              <CopyItinerary itinerary={itinerary} />
              <Button
                variant="ghost" size="icon" title={saved ? "Saved" : "Save trip"}
                className="glass text-foreground" onClick={handleSave} disabled={saved}
              >
                {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
              </Button>
              <ShareButtons itinerary={itinerary} />
            </>
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme" className="glass text-foreground">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {!itinerary ? (
        <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-6 animate-slide-up-fade">
              <MapPin className="w-10 h-10 text-muted-foreground animate-bounce-subtle" />
            </div>
            <h2 className="text-2xl font-display font-bold gradient-text mb-3 animate-slide-up-fade" style={{ animationDelay: "0.15s" }}>No itinerary yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto animate-slide-up-fade" style={{ animationDelay: "0.3s" }}>
              Chat with TripMap Planner to create a travel plan. Your itinerary will appear here once generated.
            </p>
            <Button onClick={() => navigate("/")} className="rounded-2xl earth-gradient shadow-lg hover:scale-105 transition-transform duration-300 animate-slide-up-fade" style={{ animationDelay: "0.45s" }}>
              Start Planning
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col h-[calc(100vh-60px)]">
          <div className="h-[40vh] min-h-[250px] p-4 pb-2">
            <MapErrorBoundary>
              <Suspense fallback={
                <div className="w-full h-full rounded-2xl glass-strong flex items-center justify-center">
                  <p className="text-muted-foreground text-sm animate-pulse">Loading map...</p>
                </div>
              }>
                <TripMap itinerary={itinerary} />
              </Suspense>
            </MapErrorBoundary>
          </div>

          {Object.keys(weather).length > 0 && (
            <div className="px-4 pb-2">
              <div className="max-w-3xl mx-auto">
                <Card className="glass-strong gradient-border">
                  <CardHeader className="py-3 px-5">
                    <CardTitle className="text-sm font-display gradient-text mb-2 flex items-center gap-1.5">
                      <CloudSun className="w-4 h-4" /> Weather Forecast
                    </CardTitle>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(weather).map(([name, data]) => (
                        <div key={name} className="flex items-center gap-2 text-sm">
                          <span className="text-foreground font-medium">{name}</span>
                          <WeatherBadge data={data} />
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="max-w-3xl mx-auto space-y-4 pt-2">
              {hasDays ? (
                Object.entries(dayGroups).sort(([a], [b]) => Number(a) - Number(b)).map(([day, legs]) => (
                  <div key={day}>
                    <div className="flex items-center gap-2 mb-3 mt-4 first:mt-0">
                      <div className="w-8 h-8 rounded-full earth-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">{day}</div>
                      <span className="text-sm font-display font-semibold text-foreground">Day {day}</span>
                      <div className="flex-1 h-px bg-border/30" />
                    </div>
                    {legs.map((leg, i) => (
                      <LegCard key={leg.id} leg={leg} symbol={symbol} weather={weather} isLast={i === legs.length - 1} index={i} />
                    ))}
                  </div>
                ))
              ) : (
                itinerary.legs.map((leg, i) => (
                  <LegCard key={leg.id} leg={leg} symbol={symbol} weather={weather} isLast={i === itinerary.legs.length - 1} index={i} />
                ))
              )}

              {/* Add custom stop */}
              <CustomStop onAdd={addCustomLeg} maxDay={maxDay} />

              {/* Packing list */}
              {itinerary.packingList && itinerary.packingList.length > 0 && (
                <PackingListCard items={itinerary.packingList} />
              )}

              {/* Travel checklist */}
              <TravelChecklist tripId={itinerary.title} />

              {/* Cost breakdown */}
              <CostBreakdown legs={itinerary.legs} totalCost={itinerary.totalCost} currency={itinerary.currency} />

              {/* Currency converter */}
              <CurrencyConverter baseCurrency={itinerary.currency} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LegCard({ leg, symbol, weather, isLast, index }: { leg: ItineraryLeg; symbol: string; weather: Record<string, WeatherData>; isLast: boolean; index: number }) {
  const Icon = getIcon(leg);
  const borderColor = legColors[leg.type] || "border-l-primary";
  const iconBg = legIconBg[leg.type] || "bg-primary/15 text-primary";
  const legWeather = leg.to ? weather[leg.to] : undefined;

  return (
    <div className="relative mb-4">
      {!isLast && (
        <div className="absolute left-[23px] top-[56px] bottom-[-16px] w-[2px] bg-gradient-to-b from-primary/40 to-primary/10" />
      )}
      <Card
        className={`glass gradient-border border-l-[3px] ${borderColor} animate-slide-up-fade hover:scale-[1.02] transition-transform duration-300`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <CardHeader className="flex flex-row items-center gap-3 py-3 px-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-sans font-semibold text-foreground">{leg.title}</CardTitle>
            <p className="text-xs text-muted-foreground truncate">{leg.description}</p>
            {leg.from && leg.to && <p className="text-xs text-muted-foreground/70 mt-0.5">{leg.from} → {leg.to}</p>}
            {legWeather && <div className="mt-1"><WeatherBadge data={legWeather} /></div>}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold text-foreground">{leg.cost > 0 ? `${symbol}${leg.cost}` : "Free"}</p>
            {leg.time && <p className="text-xs text-muted-foreground">{leg.time}</p>}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
