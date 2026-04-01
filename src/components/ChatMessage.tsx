import ReactMarkdown from "react-markdown";
import { MapPin, Globe } from "lucide-react";
import type { Message } from "@/hooks/useChat";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      style={{
        animation: isUser
          ? "slide-in-right 0.4s ease-out forwards"
          : "slide-in-left 0.4s ease-out forwards",
      }}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "earth-gradient text-primary-foreground animate-pulse-glow"
        }`}
      >
        {isUser ? <MapPin className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "earth-gradient text-primary-foreground rounded-br-md shadow-lg"
            : "glass-strong rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-card-foreground prose-strong:text-card-foreground prose-td:text-card-foreground prose-th:text-card-foreground">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
