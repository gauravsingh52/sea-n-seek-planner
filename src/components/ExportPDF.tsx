import { useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ItineraryData } from "@/types/itinerary";
import { toast } from "sonner";

const currencySymbols: Record<string, string> = { INR: "₹", EUR: "€", USD: "$", GBP: "£", JPY: "¥", THB: "฿", AUD: "A$", CAD: "C$", SGD: "S$", MYR: "RM", NZD: "NZ$" };

export function ExportPDF({ itinerary }: { itinerary: ItineraryData }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const symbol = currencySymbols[itinerary.currency] || itinerary.currency || "$";
      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(20);
      doc.setTextColor(33, 33, 33);
      doc.text(itinerary.title || "Trip Itinerary", 15, y);
      y += 10;

      if (itinerary.days) {
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`${itinerary.days} day${itinerary.days > 1 ? "s" : ""}${itinerary.nights ? `, ${itinerary.nights} night${itinerary.nights > 1 ? "s" : ""}` : ""}`, 15, y);
        y += 8;
      }

      doc.setDrawColor(200);
      doc.line(15, y, 195, y);
      y += 8;

      const dayGroups: Record<number, typeof itinerary.legs> = {};
      itinerary.legs.forEach((leg) => {
        const day = leg.day || 1;
        if (!dayGroups[day]) dayGroups[day] = [];
        dayGroups[day].push(leg);
      });

      for (const [day, legs] of Object.entries(dayGroups).sort(([a], [b]) => Number(a) - Number(b))) {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text(`Day ${day}`, 15, y);
        y += 7;

        for (const leg of legs) {
          if (y > 260) { doc.addPage(); y = 20; }
          doc.setFontSize(11);
          doc.setTextColor(33, 33, 33);
          doc.text(`• ${leg.title}`, 20, y);
          const costText = leg.cost > 0 ? `${symbol}${leg.cost}` : "Free";
          doc.text(costText, 175, y, { align: "right" });
          y += 5;

          doc.setFontSize(9);
          doc.setTextColor(120, 120, 120);
          if (leg.description) {
            const descLines = doc.splitTextToSize(leg.description, 140);
            doc.text(descLines, 25, y);
            y += descLines.length * 4;
          }
          if (leg.from && leg.to) {
            doc.text(`${leg.from} → ${leg.to}`, 25, y);
            y += 4;
          }
          if (leg.time) {
            doc.text(leg.time, 25, y);
            y += 4;
          }
          y += 3;
        }
        y += 4;
      }

      if (y > 240) { doc.addPage(); y = 20; }
      doc.setDrawColor(200);
      doc.line(15, y, 195, y);
      y += 8;
      doc.setFontSize(14);
      doc.setTextColor(33, 33, 33);
      doc.text("Total Cost", 15, y);
      doc.text(`${symbol}${itinerary.totalCost}`, 175, y, { align: "right" });

      doc.save(`${(itinerary.title || "itinerary").replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to export PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleExport} disabled={loading} title="Export as PDF" className="glass text-foreground">
      <FileDown className="w-4 h-4" />
    </Button>
  );
}
