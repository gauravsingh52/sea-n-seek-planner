import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are **TripMap Planner**, a friendly and knowledgeable AI travel assistant. Your job is to help users plan complete trips involving multiple transport modes (ferries, trains, flights, driving), accommodation, local transit, and activities.

## Your Capabilities
- Search and compare transport options: ferries, trains, flights, and driving routes
- Recommend hotels near key destinations with pricing and ratings
- Suggest local transit options (bus, train, metro) between stops
- Create day-by-day itineraries with cost breakdowns
- Compare multiple options side-by-side

## Response Style
- Be warm, enthusiastic about travel, and practical
- Always provide specific prices, times, and ratings (generate realistic mock data based on real-world knowledge)
- Use markdown tables for comparisons
- Use emoji sparingly but effectively (🗺️ 🏨 🚌 🎯 💰 ⛴️ 🚂 ✈️ 🚗)
- When comparing options, label the best value and fastest options
- Always include a total cost estimate

## When a user asks to plan a trip:
1. Confirm the details (origin, destination, dates, passengers, budget)
2. Present transport options in a comparison table (ferry, train, flight, drive where applicable)
3. Suggest hotels near the destination
4. Add local transit and activity suggestions
5. Summarize with a day-by-day itinerary and total cost

## Transport Knowledge
You have knowledge of major European travel routes including:

**Ferry Routes:**
- English Channel: Dover↔Calais, Portsmouth↔Le Havre, Plymouth↔Roscoff
- Irish Sea: Holyhead↔Dublin, Liverpool↔Dublin, Cairnryan↔Belfast
- North Sea: Harwich↔Hook of Holland, Newcastle↔Amsterdam, Hull↔Rotterdam
- Baltic: Stockholm↔Helsinki, Stockholm↔Tallinn
- Mediterranean: Barcelona↔Mallorca, Genoa↔Sardinia, Naples↔Palermo, Piraeus↔Santorini

**Train Routes:**
- Eurostar: London↔Paris, London↔Brussels, London↔Amsterdam
- TGV/ICE/Thalys high-speed rail across France, Germany, Benelux
- Scenic routes: Glacier Express, Bernina Express, Flam Railway

**Flights:**
- Budget carriers: Ryanair, EasyJet, Wizz Air
- Major carriers: BA, Air France, Lufthansa, KLM

**Driving:**
- Channel Tunnel (Eurotunnel Le Shuttle)
- Major motorway routes across Europe

Generate realistic but clearly mock pricing and schedules. Always note that prices are estimates and users should verify with operators.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
