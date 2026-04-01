import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Trash2, Map, ArrowRight, Sun, Moon, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "@/components/ChatMessage";
import { WaveLoader } from "@/components/WaveLoader";
import { Logo } from "@/components/Logo";
import { useChat } from "@/hooks/useChat";
import { useTrip } from "@/contexts/TripContext";
import { useTheme } from "@/hooks/useTheme";
import { useGeoSuggestions } from "@/hooks/useGeoSuggestions";
import { useSavedTrips } from "@/hooks/useSavedTrips";

function Particles() {
  return (
    <div className="particles">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${15 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 10}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function Index() {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearChat, latestItinerary } = useChat();
  const { setItinerary } = useTrip();
  const { suggestions, locationLabel, isLoading: geoLoading } = useGeoSuggestions();
  const { theme, toggleTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (latestItinerary) {
      setItinerary(latestItinerary);
    }
  }, [latestItinerary, setItinerary]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-background relative travel-bg">
      <Particles />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 glass-strong border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="transition-transform duration-300 hover:scale-110">
            <Logo size={42} />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground leading-none">TripMap Planner</h1>
            <p className="text-xs text-foreground/50">AI-powered travel planning</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme" className="glass hover:glow-primary transition-all duration-300 text-foreground">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          {hasMessages && (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/itinerary")} className="glass hover:glow-primary transition-all duration-300 text-foreground">
                <Map className="w-4 h-4 mr-1" /> Itinerary
              </Button>
              <Button variant="ghost" size="icon" onClick={clearChat} title="New chat" className="glass hover:glow-primary transition-all duration-300 text-foreground">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden relative z-10">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            {/* Hero */}
            <div
              className="mb-8 animate-slide-up-fade"
              style={{ animationDelay: "0s" }}
            >
              <Logo size={80} />
            </div>
            <h2
              className="text-4xl md:text-6xl font-display font-bold gradient-text mb-4 animate-slide-up-fade drop-shadow-lg"
              style={{ animationDelay: "0.15s" }}
            >
              Where to next?
            </h2>
            <p
              className="text-foreground/70 mb-12 max-w-md text-base animate-slide-up-fade"
              style={{ animationDelay: "0.3s" }}
            >
              Plan trips anywhere in the world — compare ferries, trains &amp; flights, find hotels, and build complete travel itineraries.
            </p>

            {/* Location label */}
            {locationLabel && !geoLoading && (
              <p className="text-sm text-primary/80 mb-4 animate-slide-up-fade" style={{ animationDelay: "0.35s" }}>
                📍 {locationLabel}
              </p>
            )}

            {/* Prompt cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full">
              {geoLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-[72px] rounded-2xl" />
                  ))
                : suggestions.map((prompt, i) => (
                    <button
                      key={prompt.text}
                      onClick={() => sendMessage(prompt.text)}
                      className="group relative text-left px-5 py-5 rounded-2xl glass gradient-border transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/10 animate-slide-up-fade"
                      style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-primary/25 group-hover:shadow-md group-hover:shadow-primary/20">
                          <prompt.icon className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <span className="text-sm text-foreground leading-snug flex-1">{prompt.text}</span>
                      </div>
                      <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-0 translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    </button>
                  ))}
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && <WaveLoader />}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input */}
      <div className="relative z-10 p-3 md:p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <div className="flex-1 relative group">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Plan your next adventure..."
              rows={1}
              className="w-full resize-none rounded-2xl glass-strong px-5 py-3.5 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-300 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className={`rounded-2xl h-[48px] w-[48px] earth-gradient shadow-lg transition-all duration-300 ${
              input.trim() ? "scale-100 shadow-primary/30" : "scale-95 opacity-70"
            }`}
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-2 opacity-40">
          Prices are AI-generated estimates. Always verify with operators before booking.
        </p>
      </div>
    </div>
  );
}
