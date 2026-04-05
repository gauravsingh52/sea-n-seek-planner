import { lazy, Suspense, useEffect, useState, Component, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Send, MapPin, Luggage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";
import { ItineraryCalendar } from "@/components/ItineraryCalendar";
import { DestinationPhotos } from "@/components/DestinationPhotos";
import { WeatherWidget } from "@/components/WeatherWidget";
import { TripDuration } from "@/components/TripDuration";
import { useWeather } from "@/hooks/useWeather";
import { supabase } from "@/integrations/supabase/client";
import type { ItineraryData } from "@/types/itinerary";
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

const currencySymbols: Record<string, string> = {
  INR: "₹", EUR: "€", USD: "$", GBP: "£", JPY: "¥", THB: "฿", AUD: "A$",
};

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
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

function CostBreakdown({ legs, totalCost, currency }: { legs: ItineraryData["legs"]; totalCost: number; currency: string }) {
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

function CommentsSection({ tripId, comments: initialComments }: { tripId: string; comments: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function addComment() {
    if (!newComment.trim() || !tripId) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from("trip_comments")
      .insert({ shared_trip_id: tripId, author_name: authorName.trim() || "Anonymous", content: newComment.trim() })
      .select()
      .single();
    if (error) {
      toast.error("Failed to add comment");
    } else {
      setComments((prev) => [...prev, data as Comment]);
      setNewComment("");
      toast.success("Comment added!");
    }
    setSubmitting(false);
  }

  return (
    <Card className="glass-strong gradient-border">
      <CardHeader className="py-3 px-5">
        <CardTitle className="text-base font-display gradient-text flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" /> Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <div className="px-5 pb-4 space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first!</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 rounded-xl bg-muted/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{comment.author_name}</span>
              <span className="text-[10px] text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{comment.content}</p>
          </div>
        ))}
        <div className="space-y-2 pt-2 border-t border-border/30">
          <Input placeholder="Your name (optional)" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="h-8 text-sm glass border-border/30" />
          <div className="flex gap-2">
            <Input placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addComment()} className="h-9 text-sm glass border-border/30" />
            <Button size="icon" onClick={addComment} disabled={!newComment.trim() || submitting} className="h-9 w-9 earth-gradient">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function SharedTrip() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [tripId, setTripId] = useState<string>("");
  const { weather } = useWeather(itinerary);

  useEffect(() => {
    if (!shareCode) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("shared_trips")
        .select("*")
        .eq("share_code", shareCode)
        .maybeSingle();

      if (error || !data) { setLoading(false); return; }

      setItinerary(data.itinerary_data as unknown as ItineraryData);
      setTitle(data.title || "Shared Trip");
      setTripId(data.id);

      const { data: commentsData } = await supabase
        .from("trip_comments")
        .select("*")
        .eq("shared_trip_id", data.id)
        .order("created_at", { ascending: true });

      setComments((commentsData as Comment[]) || []);
      setLoading(false);
    })();
  }, [shareCode]);

  const symbol = itinerary ? (currencySymbols[itinerary.currency] || itinerary.currency || "$") : "$";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground mb-2">Trip not found</h2>
          <p className="text-muted-foreground mb-4">This share link may be invalid or expired.</p>
          <Button onClick={() => navigate("/")} className="rounded-2xl earth-gradient">Plan Your Own Trip</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-4 md:px-6 py-3 glass-strong border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="glass text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Logo size={36} />
          <div>
            <h1 className="text-lg font-display font-bold gradient-text">{title}</h1>
            <p className="text-xs text-muted-foreground">Shared itinerary • {itinerary.legs.length} stops</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Map */}
        <div className="h-[35vh] min-h-[220px] rounded-2xl overflow-hidden">
          <MapErrorBoundary>
            <Suspense fallback={<div className="w-full h-full glass-strong flex items-center justify-center"><p className="text-muted-foreground text-sm animate-pulse">Loading map...</p></div>}>
              <TripMap itinerary={itinerary} />
            </Suspense>
          </MapErrorBoundary>
        </div>

        {/* Weather */}
        {Object.keys(weather).length > 0 && <WeatherWidget weather={weather} />}

        {/* Trip duration stats */}
        <TripDuration itinerary={itinerary} />

        {/* Destination photos */}
        <DestinationPhotos itinerary={itinerary} />

        {/* Calendar view */}
        <Card className="glass-strong gradient-border p-4 overflow-x-auto">
          <div className="min-w-[600px]">
            <ItineraryCalendar itinerary={itinerary} currencySymbol={symbol} />
          </div>
        </Card>

        {/* Cost breakdown */}
        <CostBreakdown legs={itinerary.legs} totalCost={itinerary.totalCost} currency={itinerary.currency} />

        {/* Packing list */}
        {itinerary.packingList && itinerary.packingList.length > 0 && (
          <PackingListCard items={itinerary.packingList} />
        )}

        {/* Total cost */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total estimated cost</p>
          <p className="text-2xl font-bold gradient-text">{symbol}{itinerary.totalCost.toFixed(0)}</p>
        </div>

        {/* Comments */}
        <CommentsSection tripId={tripId} comments={comments} />
      </div>
    </div>
  );
}
