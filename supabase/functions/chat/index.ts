import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
- Provide visa requirements for common origin-destination pairs
- Include emergency contact numbers for destination countries
- Generate packing lists based on destination weather and trip type
- Offer 3-5 practical travel tips per destination

## Response Style
- Be warm, enthusiastic about travel, and practical
- Always provide specific prices, times, and ratings (generate realistic mock data based on real-world knowledge)
- Use markdown tables for comparisons
- Use emoji sparingly but effectively (🗺️ 🏨 🚌 🎯 💰 ⛴️ 🚂 ✈️ 🚗)
- When comparing options, label the best value and fastest options
- Always include a total cost estimate

## Trip Context
The user may provide trip settings:
- **Budget**: Respect the budget limit. If no budget given, suggest mid-range options.
- **Travelers**: Multiply per-person costs by traveler count. Show per-person AND total costs.
- **Dates**: Use specific dates in the itinerary when provided. Consider seasonal pricing.
- **Language**: Respond in the specified language if provided.

## When a user asks to plan a trip:
1. Confirm the details (origin, destination, dates, passengers, budget)
2. Present transport options in a comparison table (ferry, train, flight, drive where applicable)
3. Suggest hotels near the destination
4. Add local transit and activity suggestions
5. Summarize with a day-by-day itinerary and total cost
6. Include a **🛂 Visa Info** section with requirements
7. Include a **🆘 Emergency Contacts** section with local numbers
8. Include **💡 Travel Tips** section with 3-5 practical tips
9. End with **📋 Follow-up suggestions** — exactly 3 short questions the user might want to ask next

## Transport Knowledge
You have knowledge of worldwide travel routes including India, Europe, USA & Americas, Southeast Asia, Japan, Australia & NZ.

## Currency Rules
ALWAYS use the local currency of the trip destination.

Generate realistic but clearly mock pricing and schedules. Always note that prices are estimates and users should verify with operators.

## IMPORTANT: Structured Itinerary Data

Whenever you generate a complete itinerary, you MUST append a hidden JSON data block at the very end of your response:

\`\`\`itinerary-json
{
  "title": "Trip title",
  "currency": "INR",
  "totalCost": 5500,
  "days": 3,
  "nights": 2,
  "legs": [
    {
      "day": 1,
      "type": "transport",
      "icon": "train",
      "title": "Train: Delhi to Shimla",
      "description": "Kalka-Shimla Railway",
      "from": "Delhi",
      "to": "Shimla",
      "fromCoords": { "lat": 28.6139, "lng": 77.2090 },
      "toCoords": { "lat": 31.1048, "lng": 77.1734 },
      "time": "06:00 – 16:00",
      "cost": 450
    }
  ],
  "packingList": ["Warm jacket", "Comfortable walking shoes"],
  "followUpSuggestions": ["Show me cheaper options", "Add more activities", "What's the weather?"],
  "emergencyInfo": { "police": "100", "ambulance": "102", "fire": "101", "tourist": "1363" }
}
\`\`\`

Rules for the JSON block:
- "type" must be one of: "transport", "hotel", "activity"
- "icon" must be one of: "ship", "train", "car", "plane", "bus", "hotel", "pin"
- Always include real approximate lat/lng coordinates
- This block will be hidden from the user

## COMPARISON MODE
When the user asks to compare options, output 2-3 SEPARATE \`\`\`itinerary-json blocks.

## CRITICAL REMINDER
You MUST ALWAYS include the \`\`\`itinerary-json block at the end of EVERY response that contains any trip plan.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, settings } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Auth check - extract user from JWT
    const authHeader = req.headers.get("authorization") || "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Please sign in to use the chat" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Deduct credit using admin client
    const { data: creditResult, error: creditError } = await supabaseAdmin.rpc("deduct_credit", {
      p_user_id: user.id,
    });

    if (creditError) {
      console.error("Credit deduction error:", creditError);
      return new Response(
        JSON.stringify({ error: "Credit system error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (creditResult === -1) {
      return new Response(
        JSON.stringify({ error: "You've used all your credits! No credits remaining.", code: "NO_CREDITS" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from settings
    let langPrefix = "";
    let contextMsg = "";
    if (settings) {
      const parts: string[] = [];
      if (settings.budget) parts.push(`Budget: ${settings.budget} (local currency)`);
      if (settings.travelers && settings.travelers > 1) parts.push(`Travelers: ${settings.travelers}`);
      if (settings.dateFrom && settings.dateTo) parts.push(`Dates: ${settings.dateFrom} to ${settings.dateTo}`);
      if (settings.language && settings.language !== "en") {
        const langMap: Record<string, string> = {
          hi: "हिन्दी (Hindi)", es: "Español (Spanish)", fr: "Français (French)",
          de: "Deutsch (German)", ja: "日本語 (Japanese)", zh: "中文 (Chinese)", ar: "العربية (Arabic)",
          pt: "Português (Portuguese)", ko: "한국어 (Korean)",
        };
        const langName = langMap[settings.language] || settings.language;
        langPrefix = `CRITICAL INSTRUCTION — LANGUAGE OVERRIDE: You MUST respond ENTIRELY in ${langName}. Every single word must be in ${langName}. Do NOT use English except for JSON keys.\n\n`;
      }
      if (parts.length > 0) {
        contextMsg = `\n\n[Trip Context: ${parts.join(", ")}]`;
      }
    }

    const systemContent = langPrefix + SYSTEM_PROMPT + contextMsg;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
        stream: true,
        max_tokens: 16000,
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
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
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

    // Include remaining credits in header
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Credits-Remaining": String(creditResult),
      },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
