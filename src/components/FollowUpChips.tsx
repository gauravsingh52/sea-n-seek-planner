import { Sparkles } from "lucide-react";

interface FollowUpChipsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

const DEFAULT_FOLLOW_UPS = [
  "Show cheaper alternatives",
  "Compare 3 different options",
  "What should I pack?",
];

export function FollowUpChips({ suggestions, onSelect, disabled }: FollowUpChipsProps) {
  const chips = suggestions.length > 0 ? suggestions : DEFAULT_FOLLOW_UPS;

  return (
    <div className="flex flex-wrap gap-2 animate-slide-up-fade">
      <Sparkles className="w-3.5 h-3.5 text-primary mt-1.5" />
      {chips.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          disabled={disabled}
          className="text-xs px-3 py-1.5 rounded-full glass gradient-border text-foreground/80 hover:text-foreground hover:scale-105 transition-all duration-200 disabled:opacity-50"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
