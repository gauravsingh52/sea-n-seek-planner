

## Fix Geo-Detection: ipapi.co is Failing

### Root Cause
The network logs show `ipapi.co/json/` returns "Failed to fetch" — the API is blocked/rate-limited in the preview environment. The 2-second timeout also causes silent failures. Since detection never succeeds, the user in Jalandhar (India) sees generic global fallback suggestions instead of India-specific ones.

### Solution
Replace the single unreliable API with a **multi-provider fallback chain**. Try 3 free geo-IP APIs in sequence — if one fails, try the next. Also increase timeout and add better error recovery.

### Changes

**`src/hooks/useGeoSuggestions.ts`** — Replace single API call with fallback chain

1. Try `https://api.ipapi.is/` first (no key needed, reliable, returns `country_code`, `city`, `continent`)
2. If that fails, try `https://ip-api.com/json/?fields=status,country,countryCode,city,continentCode` (free, no CORS issues)
3. If that fails, try `https://ipwho.is/` (another free alternative)
4. Increase timeout from 2s to 4s
5. Normalize response fields across providers (each API uses slightly different field names)
6. If ALL providers fail, attempt to use `navigator.language` to guess the country (e.g., `hi` → IN, `ja` → JP, `de` → DE) as a last resort before showing global fallback

This way even if one API is blocked, the others will work. The language-based fallback ensures users at minimum get their country's suggestions.

### Files Modified

| File | Change |
|------|--------|
| `src/hooks/useGeoSuggestions.ts` | Multi-provider geo API fallback chain + language-based country guess |

