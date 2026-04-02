

## Fix: Geo Suggestions Still Not Showing Punjab/Jalandhar Personalization

### Root Cause

The API detection works — `api.ipapi.is` returns `country_code: "IN"`, `state: "Punjab"`, `city: "Basi"` correctly. The code has `STATE_PROMPTS["Punjab"]` and `CITY_ALIASES["Basi"] = "Jalandhar"`. But the suggestions still show generic/fallback content. Three problems:

1. **No geo result caching** — On every page load or HMR refresh, the hook re-fetches. The first two providers fail (403), and ipapi.is takes ~300ms. During that time, the FALLBACK suggestions render. If HMR triggers multiple re-mounts, the user sees FALLBACK flicker.

2. **`countryCode` case sensitivity** — The ipapi.is response returns `country_code: "IN"` (uppercase), but there's no safety normalization. If any future provider returns lowercase `"in"`, the `COUNTRY_PROMPTS["IN"]` lookup silently fails.

3. **`useSmartSuggestions` can override geo** — If the user has even one chat session with a destination keyword (e.g., "Shimla"), the smart suggestions hook replaces 2 of the 4 geo cards with generic history-based cards like "Plan another trip to Shimla with a different vibe", making the suggestions feel impersonal.

### Fix

**`src/hooks/useGeoSuggestions.ts`**:
1. **Cache geo result in `sessionStorage`** — After successful detection, store `{ city, countryCode, state, continent }`. On next load, read cache first and show results instantly, then optionally refresh in background.
2. **Normalize `countryCode` to uppercase** — Add `.toUpperCase()` after reading from all providers.
3. **State key matching: trim and case-normalize** — Use `geo.state.trim()` for STATE_PROMPTS lookup to handle whitespace edge cases.

**`src/hooks/useSmartSuggestions.ts`**:
4. **Limit history override to 1 card max** — Instead of replacing 2 geo cards with history cards, keep at most 1 history card and 3 geo cards, so location-based suggestions remain dominant.
5. **Make history cards complement location** — Change wording from "Plan another trip to X" to "Explore X again from Jalandhar" by passing `resolvedCity` through.

### Files Modified

| File | Change |
|------|--------|
| `src/hooks/useGeoSuggestions.ts` | Add sessionStorage cache, uppercase normalize countryCode, trim state key |
| `src/hooks/useSmartSuggestions.ts` | Limit history cards to 1, keep 3 geo cards dominant |

