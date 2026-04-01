import { corsHeaders } from "@supabase/supabase-js/cors";

const WMO_CODES: Record<number, { condition: string; icon: string }> = {
  0: { condition: "Clear sky", icon: "☀️" },
  1: { condition: "Mainly clear", icon: "🌤️" },
  2: { condition: "Partly cloudy", icon: "⛅" },
  3: { condition: "Overcast", icon: "☁️" },
  45: { condition: "Foggy", icon: "🌫️" },
  48: { condition: "Rime fog", icon: "🌫️" },
  51: { condition: "Light drizzle", icon: "🌦️" },
  53: { condition: "Drizzle", icon: "🌦️" },
  55: { condition: "Heavy drizzle", icon: "🌧️" },
  61: { condition: "Light rain", icon: "🌦️" },
  63: { condition: "Rain", icon: "🌧️" },
  65: { condition: "Heavy rain", icon: "🌧️" },
  71: { condition: "Light snow", icon: "🌨️" },
  73: { condition: "Snow", icon: "❄️" },
  75: { condition: "Heavy snow", icon: "❄️" },
  80: { condition: "Rain showers", icon: "🌦️" },
  81: { condition: "Heavy showers", icon: "🌧️" },
  82: { condition: "Violent showers", icon: "⛈️" },
  95: { condition: "Thunderstorm", icon: "⛈️" },
  96: { condition: "Thunderstorm with hail", icon: "⛈️" },
  99: { condition: "Severe thunderstorm", icon: "⛈️" },
};

function getWeatherInfo(code: number) {
  return WMO_CODES[code] || { condition: "Unknown", icon: "🌡️" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { locations } = await req.json();
    if (!Array.isArray(locations) || locations.length === 0) {
      return new Response(JSON.stringify({ error: "locations array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Record<string, any> = {};

    // Fetch weather for each unique location (max 10)
    const uniqueLocs = locations.slice(0, 10);
    const fetches = uniqueLocs.map(async (loc: { lat: number; lng: number; name: string }) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3`;
        const resp = await fetch(url);
        if (!resp.ok) return;
        const data = await resp.json();
        const daily = data.daily;
        if (daily && daily.temperature_2m_max?.length > 0) {
          const code = daily.weather_code[0];
          const info = getWeatherInfo(code);
          results[loc.name] = {
            tempHigh: Math.round(daily.temperature_2m_max[0]),
            tempLow: Math.round(daily.temperature_2m_min[0]),
            condition: info.condition,
            icon: info.icon,
          };
        }
      } catch {
        // skip failed location
      }
    });

    await Promise.all(fetches);

    return new Response(JSON.stringify({ weather: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
