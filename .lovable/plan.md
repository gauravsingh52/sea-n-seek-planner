

## Two Features: Weather Forecasts + Save/Load Itineraries

### Feature 1: Weather Forecast for Destinations

**Approach**: Use the free Open-Meteo API (no API key required) to fetch weather forecasts for each destination in the itinerary based on its coordinates.

**New edge function `supabase/functions/weather/index.ts`**:
- Accepts an array of `{ lat, lng, name }` locations
- Calls `https://api.open-meteo.com/v1/forecast` for each location (temperature, weather code, precipitation)
- Returns a map of location name → weather data (high/low temp, condition icon, description)

**Update `src/types/itinerary.ts`**:
- Add `WeatherData` type: `{ tempHigh: number, tempLow: number, condition: string, icon: string }`

**New `src/hooks/useWeather.ts`**:
- Takes itinerary legs, extracts unique locations with coordinates
- Calls the weather edge function
- Returns a map of location name → weather info
- Caches results to avoid repeated calls

**Update `src/pages/Itinerary.tsx`**:
- Show a small weather badge on each leg card (e.g., "☀️ 28°/18°C")
- Add a weather summary section showing conditions at each destination

### Feature 2: Save & Load Past Itineraries

**Approach**: Use `localStorage` for persistence — no auth required, works immediately. Each saved itinerary gets a timestamp and title.

**New `src/hooks/useSavedTrips.ts`**:
- `saveTrip(itinerary)` — stores to localStorage with timestamp, returns ID
- `loadTrips()` — returns all saved itineraries sorted by date
- `deleteTrip(id)` — removes a saved trip
- Max 20 saved trips (oldest auto-deleted)

**Update `src/pages/Itinerary.tsx`**:
- Add a "Save Trip" button in the header (shows toast on save)
- If trip is already saved, show "Saved ✓" state

**New `src/pages/SavedTrips.tsx`**:
- Lists all saved itineraries as cards with title, date, total cost
- Click to load → sets TripContext and navigates to `/itinerary`
- Swipe/button to delete

**Update routing**:
- `src/App.tsx` — add `/saved` route
- `src/pages/Index.tsx` — add "Saved Trips" button in header (with count badge)

### Files

| File | Action |
|------|--------|
| `supabase/functions/weather/index.ts` | Create — Open-Meteo proxy |
| `src/types/itinerary.ts` | Add WeatherData type |
| `src/hooks/useWeather.ts` | Create — fetch weather for itinerary locations |
| `src/hooks/useSavedTrips.ts` | Create — localStorage CRUD for trips |
| `src/pages/Itinerary.tsx` | Add weather badges, save button |
| `src/pages/SavedTrips.tsx` | Create — saved trips list page |
| `src/App.tsx` | Add `/saved` route |
| `src/pages/Index.tsx` | Add "Saved Trips" nav button |

