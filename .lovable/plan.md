

## Fix: Make Suggestions Truly Personalized to User's Location (Punjab/Jalandhar)

### Root Cause
The geo API (ipapi.is) works correctly and detects India (IN), state "Punjab", city "Basi" (a village near Jalandhar). But the code only uses **country-level** prompts — so the user sees generic India suggestions like "Kerala backwater cruise" and "Rajasthan palace tour" which aren't relevant to someone in Punjab. The city "Basi" is also obscure, making the location label feel wrong.

### Fix

**`src/hooks/useGeoSuggestions.ts`**:
1. Expose `state` and `city` in the return value from the geo API response
2. Add **Indian state-level prompts** — at minimum for Punjab, Rajasthan, Kerala, Goa, HP, J&K, UP, Maharashtra, Karnataka, Tamil Nadu
3. Prioritize state prompts over country prompts: if `STATE_PROMPTS[state]` exists, use those instead of `COUNTRY_PROMPTS[countryCode]`
4. Add a `CITY_ALIASES` map for small/obscure cities → nearest major city (e.g., "Basi" → "Jalandhar", "Mohali" → "Chandigarh") so the `{city}` placeholder and location label show a recognizable name
5. Fix location label: if city is aliased, show "Popular trips near Jalandhar" instead of "Popular trips near Basi"

**Example Punjab prompts**:
- "Golden Temple & Jallianwala Bagh heritage walk in Amritsar"
- "Weekend getaway from {city} to Shimla via Chandigarh"  
- "Wagah Border ceremony & Amritsar food trail day trip"
- "Dharamshala & McLeodganj hill station trip from {city}"

### Files Modified

| File | Change |
|------|--------|
| `src/hooks/useGeoSuggestions.ts` | Add state-level prompts, city alias map, prioritize state over country |

