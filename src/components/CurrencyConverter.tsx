import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const RATES: Record<string, number> = {
  USD: 1, INR: 83.5, EUR: 0.92, GBP: 0.79, JPY: 154.5, THB: 35.8, AUD: 1.53, CAD: 1.36, SGD: 1.34, MYR: 4.72,
};

const CURRENCIES = Object.keys(RATES);

export function CurrencyConverter({ baseCurrency }: { baseCurrency?: string }) {
  const [amount, setAmount] = useState<number>(100);
  const [from, setFrom] = useState(baseCurrency || "USD");
  const [to, setTo] = useState(baseCurrency === "USD" ? "EUR" : "USD");

  const converted = ((amount / (RATES[from] || 1)) * (RATES[to] || 1)).toFixed(2);

  return (
    <Card className="glass-strong gradient-border">
      <CardHeader className="py-4 px-5">
        <CardTitle className="text-base font-display gradient-text mb-3">💱 Currency Converter</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="text-sm h-8"
            />
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full mt-1 text-xs bg-transparent border border-border rounded px-2 py-1 text-foreground">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={() => { setFrom(to); setTo(from); }} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex-1 text-right">
            <p className="text-lg font-semibold text-foreground">{converted}</p>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full mt-1 text-xs bg-transparent border border-border rounded px-2 py-1 text-foreground">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Approximate rates for reference only</p>
      </CardHeader>
    </Card>
  );
}
