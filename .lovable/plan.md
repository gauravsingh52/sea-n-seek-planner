

## Fix: Destination Photos Still Showing Fake/No Images

### Root Cause Analysis
The current code in `DestinationPhotos.tsx` already uses the Wikipedia REST API — this is correct. However, there are two remaining issues:

1. **`extractPlaceName` doesn't strip enough noise** — Indian destinations often come from the AI as "Jalandhar City Railway Station" or "Shimla ISBT Bus Stand" — after stripping, residual words like "City" or "ISBT" can cause Wikipedia mismatches (e.g., "Jalandhar City" matches a disambiguation page with no image instead of "Jalandhar")
2. **No retry with simpler name** — if the first Wikipedia lookup returns no thumbnail, the code immediately falls back to the icon placeholder. It should retry with just the first word (city name) as a second attempt.

### Fix in `src/components/DestinationPhotos.tsx`

1. **Improve `extractPlaceName`** — also strip: "city", "ISBT", "cantonment", "cantt", "depot", "stand", "main", "central", numbers, and extra whitespace
2. **Add fallback fetch** — if the first Wikipedia call returns no `thumbnail`, extract just the first significant word (e.g., "Jalandhar" from "Jalandhar City") and retry once
3. **Better cache key normalization** — lowercase and trim before caching to avoid duplicate fetches

### Technical Detail

```typescript
function extractPlaceName(dest: string): string {
  return dest
    .replace(/\(.*?\)/g, "")
    .replace(/\b(bus stand|railway station|airport|junction|terminal|station|stop|city|isbt|cantonment|cantt|depot|main|central)\b/gi, "")
    .replace(/\d+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// In fetch logic — add fallback:
const name = extractPlaceName(dest);
fetchWikipedia(name).then(result => {
  if (!result) {
    // Retry with just the first word (core city name)
    const simpler = name.split(" ")[0];
    if (simpler !== name) return fetchWikipedia(simpler);
  }
  return result;
});
```

### Files Modified

| File | Change |
|------|--------|
| `src/components/DestinationPhotos.tsx` | Improve place name extraction, add fallback retry with simpler name |

