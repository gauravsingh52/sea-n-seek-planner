import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ship, Hotel, Bus, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Itinerary() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Particles */}
      <div className="particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 flex items-center gap-3 px-4 md:px-6 py-3 glass-strong">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="glass">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl earth-gradient flex items-center justify-center shadow-lg">
            <Globe className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-display font-bold gradient-text">Your Itinerary</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
        <div className="text-center py-16">
          <div
            className="w-20 h-20 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-6 animate-slide-up-fade animate-pulse-glow"
          >
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
            <Globe className="w-4 h-4 mr-2" /> Start Planning
          </Button>
        </div>

        <div className="space-y-4 hidden">
          {[
            { icon: Ship, title: "Ferry", desc: "Dover → Calais", time: "08:00 – 09:30", cost: "€45" },
            { icon: Bus, title: "Transit", desc: "Calais Port → Hotel", time: "09:45 – 10:15", cost: "€3" },
            { icon: Hotel, title: "Hotel", desc: "Hotel & Resort Calais", time: "Check-in 14:00", cost: "€85" },
            { icon: MapPin, title: "Activity", desc: "Old Town Walking Tour", time: "15:00 – 17:00", cost: "Free" },
          ].map((item, i) => (
            <Card
              key={i}
              className="glass gradient-border opacity-0 animate-slide-up-fade hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center gap-3 py-3 px-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-sans font-semibold">{item.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{item.cost}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
