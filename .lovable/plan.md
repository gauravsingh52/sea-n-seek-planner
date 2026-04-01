

## UI Redesign: Travel/Map Theme (replacing nautical/sailing)

### What Changes

**1. Color Palette & CSS Variables** (`src/index.css`)
- Replace ocean-blue/teal with warm earth tones: terracotta, warm sand, forest green, golden amber
- Rename `--ocean-*` vars to `--earth-*`, `--trail-*`
- Update `ocean-gradient` to a warm map-inspired gradient (amber → terracotta → forest)

**2. Fonts** (`src/index.css`, `tailwind.config.ts`)
- Replace `Playfair Display` with `Merriweather` or `Lora` (warm, readable serif for headings)
- Keep `DM Sans` for body (it's neutral enough)

**3. Main Chat Page** (`src/pages/Index.tsx`)
- Replace `Anchor` icon with `Globe` or `MapPin` icon
- Change branding: "BoatTrip Planner" → "TripMap Planner" or "Voyager" (general travel)
- Subtitle: "AI-powered travel planning" (drop "ferry")
- Welcome heading: "Where shall we sail?" → "Where to next?"
- Welcome description: general travel, not ferry-focused
- Quick prompts: broaden to include general travel (keep ferries as one option, add trains, flights, road trips)
- Replace ⛴️ emoji with 🗺️ or 📍
- Placeholder text: "Plan your next adventure..."

**4. Chat Message** (`src/components/ChatMessage.tsx`)
- Replace `Ship` icon with `MapPin` for user avatar
- Replace `Bot` icon with `Globe` for assistant avatar

**5. Wave Loader** (`src/components/WaveLoader.tsx`)
- Replace ferry emoji with a compass/globe icon
- Rename animation (cosmetic)

**6. Itinerary Page** (`src/pages/Itinerary.tsx`)
- Replace `Anchor` icon with `Globe`
- Update branding text

**7. Edge Function System Prompt** (`supabase/functions/chat/index.ts`)
- Rename assistant from "BoatTrip Planner" to "TripMap Planner"
- Broaden scope: still strong on ferries but also covers trains, flights, road trips
- Keep ferry route knowledge but frame as one transport mode among many

**8. Tailwind Config** (`tailwind.config.ts`)
- Rename `ocean` color group to `earth` (deep, mid, light)
- Add `sand` → warmer tone, `sunset` → terracotta

### Files Modified
- `src/index.css` — color palette, gradient, font import
- `tailwind.config.ts` — color names, font family
- `src/pages/Index.tsx` — icons, text, prompts
- `src/components/ChatMessage.tsx` — avatar icons
- `src/components/WaveLoader.tsx` — icon swap
- `src/pages/Itinerary.tsx` — branding
- `supabase/functions/chat/index.ts` — system prompt broadened

