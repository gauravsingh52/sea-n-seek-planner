

## Itinerary Page + Map Visualization

### Overview
Two major features: (1) parse structured itinerary data from AI chat responses and display them as rich cards with cost breakdown on the Itinerary page, and (2) add an interactive map showing the planned route.

### Architecture

The AI currently returns free-form markdown. To get structured data, we'll update the system prompt to also emit a hidden JSON block (fenced with a special marker like `~~~itinerary-json`) at the end of each itinerary response. The frontend will parse this out and store it in shared state.

```text
Chat (Index.tsx)
  ↓ AI response contains ```itinerary-json block
  ↓ useChat parses it out → stores in itineraryData state
  ↓ passed via URL state or context
Itinerary Page
  ├─ Timeline cards (transport, hotel, activity)
  ├─ Cost breakdown summary
  └─ Interactive map (Leaflet)
```

### Changes

**1. Update system prompt** (`supabase/functions/chat/index.ts`)
- Add instruction: when generating an itinerary, append a fenced JSON block with structured data containing `legs[]` (each with type, title, description, from, to, lat/lng, time, cost) and a `totalCost` field.

**2. Create itinerary types** (`src/types/itinerary.ts`)
- Define `ItineraryLeg` (type: transport/hotel/activity, title, desc, from/to coords, time, cost) and `ItineraryData` (legs[], totalCost, currency).

**3. Update useChat hook** (`src/hooks/useChat.ts`)
- After streaming completes, scan the final assistant message for the JSON marker, parse it, and expose `itineraryData` state alongside messages.

**4. Create shared state** (`src/contexts/TripContext.tsx`)
- React context to share `itineraryData` between Index and Itinerary pages without losing data on navigation.

**5. Rebuild Itinerary page** (`src/pages/Itinerary.tsx`)
- Consume `itineraryData` from context
- Render a vertical timeline with icon-coded cards (Ship/Train/Hotel/MapPin) per leg
- Each card shows title, description, time, and cost with glass styling
- Bottom summary card with total cost breakdown by category
- Keep the current empty state when no data exists

**6. Add interactive map** (`src/components/TripMap.tsx`)
- Install `react-leaflet` + `leaflet` packages
- Render a Leaflet map with markers at each leg's coordinates
- Draw polyline connecting the route stops
- Custom marker popups showing leg details
- Auto-fit bounds to show all markers

**7. Integrate map into Itinerary page** (`src/pages/Itinerary.tsx`)
- Place the map above the timeline, taking ~40% of the viewport height
- Map and timeline scroll independently

**8. Wire up navigation** (`src/pages/Index.tsx`)
- The "Itinerary" button in the header already navigates to `/itinerary`; wrap App with TripContext so data flows through

### Dependencies
- `leaflet` + `react-leaflet` (+ `@types/leaflet`) for the map
- Leaflet CSS import in index.css or the map component

### Files Modified/Created
| File | Action |
|------|--------|
| `supabase/functions/chat/index.ts` | Edit system prompt |
| `src/types/itinerary.ts` | Create |
| `src/hooks/useChat.ts` | Edit — parse JSON block |
| `src/contexts/TripContext.tsx` | Create |
| `src/components/TripMap.tsx` | Create |
| `src/pages/Itinerary.tsx` | Rebuild |
| `src/pages/Index.tsx` | Minor — consume context |
| `src/App.tsx` | Wrap with TripContext |
| `src/index.css` | Leaflet CSS import |

