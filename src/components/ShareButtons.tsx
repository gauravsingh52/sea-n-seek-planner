import { useState } from "react";
import { Share2, MessageCircle, Send, FileDown, Link2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import type { ItineraryData } from "@/types/itinerary";
import { toast } from "sonner";

const currencySymbols: Record<string, string> = {
  INR: "₹", EUR: "€", USD: "$", GBP: "£", JPY: "¥", THB: "฿", AUD: "A$",
};

function formatItineraryText(it: ItineraryData): string {
  const sym = currencySymbols[it.currency] || it.currency || "$";
  let text = `🗺️ ${it.title || "Trip Itinerary"}\n\n`;
  it.legs.forEach((leg, i) => {
    text += `${i + 1}. ${leg.title}\n`;
    text += `   ${leg.description}\n`;
    if (leg.from && leg.to) text += `   📍 ${leg.from} → ${leg.to}\n`;
    if (leg.time) text += `   🕐 ${leg.time}\n`;
    if (leg.cost > 0) text += `   💰 ${sym}${leg.cost}\n`;
    text += "\n";
  });
  text += `━━━━━━━━━━━━━━━\n💰 Total: ${sym}${it.totalCost}\n\nPlanned with TripMap Planner ✈️`;
  return text;
}

interface ShareButtonsProps {
  itinerary: ItineraryData;
}

export function ShareButtons({ itinerary }: ShareButtonsProps) {
  const [sharing, setSharing] = useState(false);
  const text = formatItineraryText(itinerary);
  const encoded = encodeURIComponent(text);

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encoded}`, "_blank");
  const shareTelegram = () => window.open(`https://t.me/share/url?text=${encoded}`, "_blank");

  const downloadPDF = () => {
    window.print();
    toast.success("Print dialog opened!");
  };

  const copyLink = () => {
    try {
      const compressed = btoa(unescape(encodeURIComponent(JSON.stringify(itinerary))));
      const url = `${window.location.origin}/itinerary?data=${compressed}`;
      if (url.length > 2000) {
        navigator.clipboard.writeText(text);
        toast.success("Itinerary text copied (too large for URL)");
      } else {
        navigator.clipboard.writeText(url);
        toast.success("Share link copied!");
      }
    } catch {
      navigator.clipboard.writeText(text);
      toast.success("Itinerary text copied!");
    }
  };

  const shareCollaborative = async () => {
    setSharing(true);
    try {
      const { data, error } = await supabase.functions.invoke("share-trip", {
        body: { itinerary, title: itinerary.title },
      });
      if (error) throw error;
      const url = `${window.location.origin}/trip/${data.shareCode}`;
      await navigator.clipboard.writeText(url);
      toast.success("Collaborative share link copied! Anyone can view & comment.");
    } catch (e: any) {
      toast.error("Failed to create share link");
    } finally {
      setSharing(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" title="Share" className="glass text-foreground">
          <Share2 className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          <button onClick={shareWhatsApp} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
            <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
          </button>
          <button onClick={shareTelegram} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
            <Send className="w-4 h-4 text-blue-500" /> Telegram
          </button>
          <button onClick={downloadPDF} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
            <FileDown className="w-4 h-4 text-red-500" /> Print / PDF
          </button>
          <button onClick={copyLink} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
            <Link2 className="w-4 h-4 text-primary" /> Copy Link
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
