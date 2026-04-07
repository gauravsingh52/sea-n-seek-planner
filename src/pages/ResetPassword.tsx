import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Lock, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated!");
      navigate("/");
    }
    setSubmitting(false);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background travel-bg">
        <div className="text-center">
          <Logo size={64} />
          <p className="text-muted-foreground mt-4">Invalid or expired reset link.</p>
          <Button onClick={() => navigate("/auth")} className="mt-4">Back to login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background travel-bg px-4">
      <div className="w-full max-w-md glass-strong rounded-2xl p-6 border border-border/30">
        <div className="text-center mb-6">
          <Logo size={48} />
          <h2 className="text-xl font-bold mt-2">Set New Password</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="pl-10" />
          </div>
          <Button type="submit" className="w-full earth-gradient" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
