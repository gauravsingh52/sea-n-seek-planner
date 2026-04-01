import { useState, useCallback, useEffect } from "react";
import type { Message } from "@/hooks/useChat";
import type { ItineraryData } from "@/types/itinerary";

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  itinerary?: ItineraryData | null;
}

const STORAGE_KEY = "tripmap-chat-history";
const MAX_SESSIONS = 20;

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
}

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const saveSession = useCallback((messages: Message[], itinerary?: ItineraryData | null) => {
    if (messages.length === 0) return;
    const firstUserMsg = messages.find(m => m.role === "user");
    const title = firstUserMsg?.content.slice(0, 60) || "Untitled chat";
    const sessionId = messages[0].id;

    setSessions(prev => {
      const existing = prev.findIndex(s => s.id === sessionId);
      const session: ChatSession = {
        id: sessionId,
        title,
        messages,
        createdAt: existing >= 0 ? prev[existing].createdAt : new Date().toISOString(),
        itinerary,
      };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = session;
        return updated;
      }
      return [session, ...prev].slice(0, MAX_SESSIONS);
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSessions([]);
  }, []);

  return { sessions, saveSession, deleteSession, clearAll };
}
