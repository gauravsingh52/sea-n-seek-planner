

## Location-Based Trip Suggestions

### Idea
Detect the user's approximate location via a free IP geolocation API and show personalized quick-start prompts based on their region/country. Falls back to the current global prompts if geolocation fails.

### How It Works

**1. Create `src/hooks/useGeoSuggestions.ts`**
- On mount, call a free IP geolocation API (`https://ipapi.co/json/` — no API key needed, 1000 req/day free)
- Extract `country_code`, `city`, `region`, `continent_code`
- Based on the detected region, return a set of 4 region-specific prompt suggestions
- Region mapping:
  - **Europe** → Channel ferry trips, Eurostar, Mediterranean island hopping, Alpine road trips
  - **North America** → US road trips, Caribbean cruises, cross-country trains, Mexico flights
  - **Asia** → Bullet trains Japan, island hopping SE Asia, India rail, China high-speed
  - **South America** → Patagonia road trip, Amazon river, Galapagos ferries
  - **Oceania** → NZ road trip, Australian coast, Fiji island hopping
  - **Africa** → Safari routes, Morocco coastal, Cape Town to Kruger
  - **Fallback** → Current global prompts
- Personalize the greeting: "Popular trips near {city}" or "Suggested for travelers in {country}"
- Returns `{ suggestions, locationLabel, isLoading }`

**2. Update `src/pages/Index.tsx`**
- Import and use `useGeoSuggestions()`
- Show a small label above prompt cards: "Popular trips near London" (or wherever they are)
- Replace the static `QUICK_PROMPTS` with the dynamic region-based ones
- Show a skeleton/shimmer while loading, then animate the cards in
- Keep static prompts as fallback if API fails or takes too long (2s timeout)

### Files
| File | Action |
|------|--------|
| `src/hooks/useGeoSuggestions.ts` | Create — IP geolocation + region-based prompt mapping |
| `src/pages/Index.tsx` | Edit — use dynamic suggestions, show location label |

