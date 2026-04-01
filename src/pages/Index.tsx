import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Globe, Trash2, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { WaveLoader } from "@/components/WaveLoader";
import { useChat } from "@/hooks/useChat";

const QUICK_PROMPTS = [
  "Plan a weekend trip from London to Paris with ferry and hotels",
  "Compare travel options from UK to Amsterdam — ferry vs train",
  "Find the best route for an Italian coast road trip",
  "Plan a budget island-hopping trip in Greece",
];

export default function Index() {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

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
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg earth-gradient flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground leading-none">TripMap Planner</h1>
            <p className="text-xs text-muted-foreground">AI-powered travel planning</p>
          </div>
        </div>
        <div className="flex gap-2">
          {hasMessages && (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/itinerary")}>
                <Map className="w-4 h-4 mr-1" /> Itinerary
              </Button>
              <Button variant="ghost" size="icon" onClick={clearChat} title="New chat">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="w-16 h-16 rounded-2xl earth-gradient flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Where to next?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Plan trips across Europe — compare ferries, trains &amp; flights, find hotels, and build complete travel itineraries.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left px-4 py-3 rounded-xl border border-border bg-card hover:bg-secondary/60 transition-colors text-sm text-foreground"
                >
                  🗺️ {prompt}
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
      <div className="border-t border-border bg-card/80 backdrop-blur-sm p-3 md:p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Plan your next adventure..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="rounded-xl h-[46px] w-[46px]" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Prices are AI-generated estimates. Always verify with operators before booking.
        </p>
      </div>
    </div>
  );
}
