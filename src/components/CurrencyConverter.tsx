import { useState, useEffect } from "react";
import { ArrowLeftRight, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, INR: 83.5, EUR: 0.92, GBP: 0.79, JPY: 154.5, THB: 35.8, AUD: 1.53, CAD: 1.36, SGD: 1.34, MYR: 4.72, NZD: 1.63,
};

const CACHE_KEY = "tripmap_exchange_rates";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
}

function getCachedRates(): CachedRates | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data: CachedRates = JSON.parse(raw);
    if (data.rates && data.timestamp) return data;
    return null;
  } catch {
    return null;
  }
}

function setCachedRates(rates: Record<string, number>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }));
  } catch {}
}

async function fetchWithRetries(url: string, retries = 3): Promise<Record<string, number>> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.rates) return data.rates;
      throw new Error("No rates in response");
    } catch {
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
      }
    }
  }
  throw new Error("All retries failed");
}

export function CurrencyConverter({ baseCurrency }: { baseCurrency?: string }) {
  const [amount, setAmount] = useState<number>(100);
  const [from, setFrom] = useState(baseCurrency || "USD");
  const [to, setTo] = useState(baseCurrency === "USD" ? "EUR" : "USD");
  const [rates, setRates] = useState<Record<string, number>>(() => {
    const cached = getCachedRates();
    return cached ? cached.rates : FALLBACK_RATES;
  });
  const [loading, setLoading] = useState(true);
  const [rateSource, setRateSource] = useState<"live" | "cached" | "fallback">(() => {
    const cached = getCachedRates();
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) return "cached";
    return "fallback";
  });

  const loadRates = async () => {
    setLoading(true);
    const cached = getCachedRates();

    // Use cache if fresh
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setRates(cached.rates);
      setRateSource("cached");
      setLoading(false);
      return;
    }

    try {
      const freshRates = await fetchWithRetries("https://open.er-api.com/v6/latest/USD");
      setRates(freshRates);
      setCachedRates(freshRates);
      setRateSource("live");
    } catch {
      // Fall back to stale cache or hardcoded
      if (cached) {
        setRates(cached.rates);
        setRateSource("cached");
      } else {
        setRateSource("fallback");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const currencies = Object.keys(rates).sort();
  const converted = ((amount / (rates[from] || 1)) * (rates[to] || 1)).toFixed(2);

  const sourceLabel = rateSource === "live"
    ? "Live rates from Open Exchange Rates"
    : rateSource === "cached"
    ? "Cached rates (updated recently)"
    : "Approximate rates for reference only";

  return (
    <Card className="glass-strong gradient-border">
      <CardHeader className="py-4 px-5">
        <CardTitle className="text-base font-display gradient-text mb-3 flex items-center gap-2">
          💱 Currency Converter
          {loading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
          {!loading && rateSource === "fallback" && (
            <button onClick={loadRates} className="ml-auto p-1 rounded hover:bg-muted transition-colors" title="Retry fetching live rates">
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="text-sm h-8"
            />
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button onClick={() => { setFrom(to); setTo(from); }} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex-1 text-right space-y-1">
            <p className="text-lg font-semibold text-foreground">{converted}</p>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <div className={`w-1.5 h-1.5 rounded-full ${rateSource === "live" ? "bg-green-500" : rateSource === "cached" ? "bg-yellow-500" : "bg-muted-foreground"}`} />
          <p className="text-[10px] text-muted-foreground">{sourceLabel}</p>
        </div>
      </CardHeader>
    </Card>
  );
}
