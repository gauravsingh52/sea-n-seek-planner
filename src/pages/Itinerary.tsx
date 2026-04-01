import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ship, Hotel, Bus, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Itinerary() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg earth-gradient flex items-center justify-center">
            <Globe className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-display font-bold text-foreground">Your Itinerary</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground mb-2">No itinerary yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Chat with TripMap Planner to create a travel plan. Your itinerary will appear here once generated.
          </p>
          <Button onClick={() => navigate("/")} className="rounded-xl">
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
            <Card key={i} className="border-border">
              <CardHeader className="flex flex-row items-center gap-3 py-3 px-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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
