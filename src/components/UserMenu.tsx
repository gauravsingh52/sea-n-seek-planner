import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { CreditBar } from "@/components/CreditBar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, LogIn, Crown, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

function getGuestData() {
  try {
    const raw = localStorage.getItem("tripmap_guest_chats");
    if (!raw) return { count: 0, timestamp: 0 };
    return JSON.parse(raw);
  } catch {
    return { count: 0, timestamp: 0 };
  }
}

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Resets now";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `Resets in ${hours}h ${minutes}m`;
  return `Resets in ${minutes}m`;
}

export function UserMenu() {
  const { user, credits, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [resetLabel, setResetLabel] = useState("");

  useEffect(() => {
    if (user) return;
    
    const update = () => {
      const data = getGuestData();
      if (!data.timestamp || data.count === 0) {
        setResetLabel("");
        return;
      }
      const resetAt = data.timestamp + 24 * 60 * 60 * 1000;
      const remaining = resetAt - Date.now();
      if (remaining <= 0) {
        setResetLabel("3 free chats available!");
      } else {
        setResetLabel(formatTimeRemaining(remaining));
      }
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    const data = getGuestData();
    const elapsed = Date.now() - (data.timestamp || 0);
    const count = elapsed >= 24 * 60 * 60 * 1000 ? 0 : (data.count || 0);
    const remaining = Math.max(0, 3 - count);

    return (
      <div className="flex items-center gap-2">
        <CreditBar credits={remaining} maxCredits={3} label="Guest" resetLabel={resetLabel} />
        {resetLabel && (
          <span className="text-[10px] text-muted-foreground hidden sm:flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {resetLabel}
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="glass text-foreground gap-1.5">
          <LogIn className="w-4 h-4" /> Sign in
        </Button>
      </div>
    );
  }

  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "User";
  const initial = displayName[0]?.toUpperCase() || "U";

  return (
    <div className="flex items-center gap-2">
      <CreditBar credits={credits} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 earth-gradient text-primary-foreground font-bold text-sm">
            {initial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2">
            <p className="font-medium text-sm">{displayName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2">
            <User className="w-4 h-4" />
            {credits} credits remaining (resets daily)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/pricing")} className="gap-2">
            <Crown className="w-4 h-4" />
            Upgrade Plan
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()} className="gap-2 text-destructive">
            <LogOut className="w-4 h-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
