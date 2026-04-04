

## Enhance Weather Widget for Destination Itineraries

### Current State
The weather feature is already fully wired up and working:
- Backend function (`supabase/functions/weather/index.ts`) calls Open-Meteo API — verified working, returns real live data
- `useWeather` hook fetches weather for all destinations with coordinates
- A compact "Weather Forecast" card shows at the top of the itinerary
- Small weather badges appear on individual leg cards

### Enhancement Plan
Make the weather widget more visually rich and useful:

**`src/pages/Itinerary.tsx`** (or extract to new `src/components/WeatherWidget.tsx`):
- Replace the current compact inline display with a proper card grid — one card per destination
- Each card shows: destination name, weather icon (large), high/low temps, condition text
- Add a subtle gradient background matching the weather condition (sunny = warm yellow, rain = cool blue, etc.)
- Show "3-day forecast" by extending the backend to return all 3 days (it already fetches 3 days but only returns day 1)

**`supabase/functions/weather/index.ts`**:
- Return all 3 forecast days instead of just day 1
- Add `humidity` and `precipitation_probability` to the response for richer display

**`src/types/itinerary.ts`**:
- Extend `WeatherData` to include `forecast` array (3 days), `humidity`, `precipChance`

### Files Modified

| File | Change |
|------|--------|
| `supabase/functions/weather/index.ts` | Return 3-day forecast with humidity and precip chance |
| `src/types/itinerary.ts` | Extend WeatherData type with forecast array |
| `src/components/WeatherWidget.tsx` | New component with per-destination weather cards and 3-day mini forecast |
| `src/pages/Itinerary.tsx` | Replace inline weather display with new WeatherWidget component |

