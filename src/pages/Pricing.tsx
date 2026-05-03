import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, Zap, Rocket, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    description: "Perfect for exploring TripMap Planner",
    features: [
      "3 guest chats per day",
      "10 credits/day (signed in)",
      "Basic itinerary generation",
      "PDF export",
      "Currency converter",
      "Travel checklist",
    ],
    cta: "Current Plan",
    isCurrent: true,
    highlight: false,
  },
  {
    name: "Pro",
    icon: Crown,
    price: "$9.99",
    period: "/month",
    description: "For frequent travelers who want more",
    features: [
      "50 credits per day",
      "Priority AI responses",
      "Advanced itinerary customization",
      "Real-time collaboration",
      "Weather forecasts",
      "Booking links integration",
      "Destination photos",
      "Budget tracking",
    ],
    cta: "Coming Soon",
    isCurrent: false,
    highlight: true,
  },
  {
    name: "Premium",
    icon: Rocket,
    price: "$24.99",
    period: "/month",
    description: "Unlimited access for power users & teams",
    features: [
      "Unlimited credits",
      "API access",
      "Custom branding",
      "Priority support",
      "Team workspaces",
      "Advanced analytics",
      "Multi-language support",
      "Early access to new features",
    ],
    cta: "Coming Soon",
    isCurrent: false,
    highlight: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background relative travel-bg">
      <div className="particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDuration: `${15 + Math.random() * 20}s`, animationDelay: `${Math.random() * 10}s` }} />
        ))}
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 glass-strong border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="glass text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Logo size={36} />
          <h1 className="text-lg font-display font-bold gradient-text">Plans & Pricing</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="glass text-foreground">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-4">
            Choose Your Travel Plan
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start free, upgrade when you're ready. All plans include our AI-powered itinerary planner.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`glass-strong relative flex flex-col ${
                plan.highlight
                  ? "gradient-border ring-2 ring-primary/20 scale-[1.02]"
                  : "border-border/30"
              }`}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 earth-gradient text-primary-foreground px-4">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mx-auto mb-3">
                  <plan.icon className={`w-6 h-6 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <CardTitle className="text-xl font-display">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full rounded-xl ${
                    plan.isCurrent && user
                      ? "bg-muted text-muted-foreground cursor-default"
                      : plan.highlight
                      ? "earth-gradient text-primary-foreground hover:scale-105 transition-transform"
                      : "glass text-foreground hover:bg-muted"
                  }`}
                  disabled={plan.isCurrent && !!user}
                  onClick={() => {
                    if (!plan.isCurrent) {
                      // Coming soon - just show a message for now
                    } else if (!user) {
                      navigate("/auth");
                    }
                  }}
                >
                  {plan.isCurrent && user ? "Current Plan" : plan.isCurrent && !user ? "Sign Up Free" : plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 glass-strong rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-display font-bold gradient-text mb-2">
            🎓 Student Discount Available
          </h3>
          <p className="text-sm text-muted-foreground">
            Students get special pricing on Pro and Premium plans. Contact us with your .edu email to get started.
          </p>
        </div>
      </main>
    </div>
  );
}
