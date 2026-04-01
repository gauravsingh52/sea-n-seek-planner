import { useState, useCallback } from "react";
import type { ItineraryData } from "@/types/itinerary";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

function parseItineraryJson(text: string): ItineraryData | null {
  const marker = "```itinerary-json";
  const startIdx = text.indexOf(marker);
  if (startIdx === -1) return null;

  const jsonStart = text.indexOf("\n", startIdx) + 1;
  const endIdx = text.indexOf("```", jsonStart);
  if (endIdx === -1) return null;

  try {
    const raw = JSON.parse(text.slice(jsonStart, endIdx).trim());
    if (raw && Array.isArray(raw.legs)) {
      return {
        legs: raw.legs.map((leg: any, i: number) => ({
          id: leg.id || `leg-${i}`,
          type: leg.type || "activity",
          title: leg.title || "",
          description: leg.description || "",
          from: leg.from,
          to: leg.to,
          fromCoords: leg.fromCoords,
          toCoords: leg.toCoords,
          time: leg.time,
          cost: Number(leg.cost) || 0,
          icon: leg.icon,
        })),
        totalCost: Number(raw.totalCost) || 0,
        currency: raw.currency || "EUR",
        title: raw.title,
      };
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function stripItineraryBlock(text: string): string {
  const marker = "```itinerary-json";
  const startIdx = text.indexOf(marker);
  if (startIdx === -1) return text;
  const endIdx = text.indexOf("```", startIdx + marker.length);
  if (endIdx === -1) return text;
  return (text.slice(0, startIdx) + text.slice(endIdx + 3)).trim();
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [latestItinerary, setLatestItinerary] = useState<ItineraryData | null>(null);

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input };
    const allMessages = [...messages, userMsg];
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Request failed" }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              const displayContent = stripItineraryBlock(assistantContent);
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === assistantId) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: displayContent } : m);
                }
                return [...prev, { id: assistantId, role: "assistant", content: displayContent }];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Parse itinerary data from completed response
      const itineraryData = parseItineraryJson(assistantContent);
      if (itineraryData) {
        setLatestItinerary(itineraryData);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong";
      setMessages(prev => [
        ...prev,
        { id: assistantId, role: "assistant", content: `⚠️ ${errorMsg}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setLatestItinerary(null);
  }, []);

  return { messages, isLoading, sendMessage, clearChat, latestItinerary };
}
