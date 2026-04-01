

## Fix: Country-Level Suggestions Instead of Continent-Only

### Problem
Currently suggestions are mapped only by continent (`AS`, `EU`, etc.), so a user in Chandigarh, India gets generic Asia suggestions about Tokyo bullet trains and Vietnam ferries — not relevant to their location at all.

### Solution
Add **country-level** prompt mappings that override the continent fallback. The API already returns `country_code` — we just need to use it.

### Changes — `src/hooks/useGeoSuggestions.ts`

1. **Add a `COUNTRY_PROMPTS` mapping** with country-specific suggestions for major countries:
   - **IN (India)**: Chandigarh to Manali road trip, Kerala backwater houseboat, Rajasthan palace tour (Delhi–Jaipur–Udaipur), Darjeeling Himalayan Railway
   - **US**: California coast road trip, NYC to DC Amtrak, Hawaii island hopping, Route 66
   - **UK**: Scottish Highlands road trip, Lake District, London to Edinburgh train, Channel Islands ferry
   - **JP**: Bullet train Tokyo–Kyoto–Osaka, Okinawa islands, Hokkaido road trip, Mt Fuji day trip
   - **AU**: Great Ocean Road, Sydney–Melbourne train, Whitsundays, Outback road trip
   - **TH**: Bangkok to Chiang Mai train, island hopping Krabi, Ayutthaya day trip, Phuket coastal tour
   - Add 6-8 popular travel countries total

2. **Update the selection logic**: Check `country_code` first → if match in `COUNTRY_PROMPTS`, use that. Otherwise fall back to continent → then global fallback.

3. **Use city name in suggestions** when available — e.g. for India, dynamically prefix one suggestion with the user's city: `"Weekend getaway from {city} to Shimla"`.

### Files Modified
| File | Change |
|------|--------|
| `src/hooks/useGeoSuggestions.ts` | Add `COUNTRY_PROMPTS` map, update selection logic to prefer country over continent, add one city-personalized suggestion |

