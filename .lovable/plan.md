

## Sub-batch C: Booking Links, Destination Photos, Trip Duration, Emergency Info, Multi-City

### 1. Booking Links on Leg Cards

Add clickable "Book" links to transport and hotel legs that deep-link to relevant booking platforms.

**`src/components/BookingLinks.tsx`** — New component
- Transport legs: Generate links to Google Flights (plane), Google Maps directions (car/bus), or rail booking sites based on `icon` type
- Hotel legs: Link to Google Hotels search with destination pre-filled
- Renders as small external-link buttons on each leg card

**`src/pages/Itinerary.tsx`** — Add `<BookingLinks>` inside `LegCard`

### 2. Destination Photos via Unsplash

**`supabase/functions/destination-photos/index.ts`** — New edge function
- Accepts `{ query: "Shimla" }`, calls Unsplash API (`/search/photos`) using a free API key
- Returns 3-4 photo URLs (small size)
- Uses `LOVABLE_API_KEY` — actually we'll use the free Unsplash source URL pattern (`source.unsplash.com`) which requires no API key, just construct URLs

**Simpler approach**: Skip edge function entirely. Use `https://source.unsplash.com/featured/?{destination},travel` URLs directly in the frontend — no API key needed.

**`src/components/DestinationPhotos.tsx`** — New component
- Takes destination names from itinerary legs (unique `to`/`from` values)
- Shows a horizontal scrollable gallery of Unsplash photos
- Renders as a card above the cost breakdown

### 3. Trip Duration Calculator

**`src/components/TripDuration.tsx`** — New component
- Calculates from itinerary legs:
  - Total travel time (sum of transport leg durations parsed from `time` field like "06:00 – 16:00")
  - Number of activities, hotels, transport segments
  - Breakdown: "X hours transit, Y activities, Z nights accommodation"
- Renders as a compact stats card

### 4. Emergency Info Card

**`src/components/EmergencyInfo.tsx`** — New component
- Hardcoded emergency numbers for ~20 common countries, keyed by destination name/country detection
- Shows: Police, Ambulance, Tourist helpline, nearest embassy info placeholder
- Also ask the AI to include emergency info in the JSON response

**`src/types/itinerary.ts`** — Add optional `emergencyInfo` field to `ItineraryData`

**`supabase/functions/chat/index.ts`** — Add `emergencyInfo` to JSON schema instruction so AI provides it

### 5. Multi-City Planner Enhancement

The AI already supports multi-stop routes, but we need explicit UI support.

**`supabase/functions/chat/index.ts`** — Add instruction: "When the user mentions 3+ cities, treat it as a multi-city trip. Optimize the route order for minimum travel time and include connecting transport between each city pair."

**`src/pages/Itinerary.tsx`** — Add a route summary header showing the full route chain (e.g., "Delhi → Agra → Jaipur → Udaipur") extracted from leg `from`/`to` fields

### Files Modified

| File | Change |
|------|--------|
| `src/components/BookingLinks.tsx` | Create — deep links to booking platforms per leg type |
| `src/components/DestinationPhotos.tsx` | Create — Unsplash photo gallery for destinations |
| `src/components/TripDuration.tsx` | Create — travel time/activity stats breakdown |
| `src/components/EmergencyInfo.tsx` | Create — emergency numbers by country |
| `src/types/itinerary.ts` | Add `emergencyInfo` optional field |
| `src/pages/Itinerary.tsx` | Integrate all 4 new components + route summary header |
| `supabase/functions/chat/index.ts` | Add emergencyInfo to JSON schema, multi-city optimization instruction |

