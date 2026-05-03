import { Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CreditBarProps {
  credits: number;
  maxCredits?: number;
  label?: string;
  resetLabel?: string;
}

export function CreditBar({ credits, maxCredits = 10, label, resetLabel }: CreditBarProps) {
  const pct = Math.max(0, Math.min(100, (credits / maxCredits) * 100));
  const isLow = credits <= 2;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-border/30 cursor-default">
          <Zap className={`w-4 h-4 ${isLow ? "text-destructive" : "text-primary"}`} />
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isLow ? "bg-destructive" : "bg-primary"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={`text-xs font-semibold tabular-nums ${isLow ? "text-destructive" : "text-foreground"}`}>
              {credits}
            </span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label ? `${label}: ` : ""}{credits} {label === "Guest" ? "free chats" : "credits"} remaining out of {maxCredits}</p>
        {resetLabel && <p className="text-xs text-primary font-medium">{resetLabel}</p>}
        <p className="text-xs text-muted-foreground">
          {label === "Guest" ? "Sign in for 10 daily credits!" : "1 credit per chat · resets daily"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
