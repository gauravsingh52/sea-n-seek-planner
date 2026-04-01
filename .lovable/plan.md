

## Smart Suggestions: Learn from User's Chat History

### Problem
The landing page shows generic/fallback suggestions (Barcelona, Tokyo, California, Bali) that aren't relevant to the user. The geo-IP detection often fails or returns a country without mapped prompts.

### Solution
Make suggestions **adaptive** by analyzing the user's past chat history to extract destinations/themes they've searched for, then blend those with geo-based suggestions. This way, returning users see personalized prompts based on their actual travel interests.

### How It Works

1. **Extract travel patterns from history** — scan saved chat session titles/messages for destination names, travel styles (budget, luxury, backpacking), and transport preferences
2. **Generate personalized suggestion cards** — create prompts like "Another trip near [previous destination]", "Explore more of [country they searched]", "Similar to your [past trip title]"
3. **Fallback chain**: Personalized (from history) → Geo-based (from IP) → Global defaults
4. **Improve geo fallback** — add more countries to `COUNTRY_PROMPTS` so fewer users hit the generic fallback

### Changes

**`src/hooks/useSmartSuggestions.ts`** — New hook
- Takes `sessions` from chat history and `geoSuggestions` from geo hook
- Parses session titles/first messages to extract destination keywords
- Returns blended suggestions: 2 history-based + 2 geo-based (or 4 geo if no history)
- Uses a simple keyword extraction approach (city/country names from past queries)

**`src/hooks/useGeoSuggestions.ts`** — Add more countries
- Add IT, ES, CA, BR, MX, KR, NZ, EG, TR, ZA to `COUNTRY_PROMPTS` so more users get localized suggestions instead of fallback

**`src/pages/Index.tsx`** — Use smart suggestions
- Import `useSmartSuggestions`, pass it `sessions` + geo data
- Replace raw `suggestions` with the blended output on the landing page

### Files Modified

| File | Change |
|------|--------|
| `src/hooks/useSmartSuggestions.ts` | Create — blends history-based + geo-based suggestions |
| `src/hooks/useGeoSuggestions.ts` | Add 10 more countries to COUNTRY_PROMPTS |
| `src/pages/Index.tsx` | Use smart suggestions instead of raw geo suggestions |

