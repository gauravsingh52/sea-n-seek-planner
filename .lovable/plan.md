

## Fix: Use Real Destination Photos via Wikipedia API

### Problem
Lorem Picsum shows random stock photos (wheat fields, deserts, night skies) that have nothing to do with the actual destinations. "Chandigarh" shows a random photo, "Shimla" shows sand dunes — completely misleading.

### Solution
Use the **Wikipedia REST API** to fetch the real main image for each destination. The endpoint `https://en.wikipedia.org/api/rest_v1/page/summary/{place_name}` returns a `thumbnail.source` URL — the actual Wikipedia photo for that location (e.g., the real Chandigarh skyline, actual Shimla hills).

- Free, no API key, reliable, CORS-friendly
- Returns the most recognizable photo for each place

### Changes in `src/components/DestinationPhotos.tsx`

1. **Extract core place name** — strip parenthesized details like "(Sector 43/17)" and suffixes like "Bus Stand" to get the Wikipedia article name (e.g., "Chandigarh" from "Chandigarh Bus Stand (Sector 43/17)")
2. **Fetch from Wikipedia** — each `DestinationCard` calls `https://en.wikipedia.org/api/rest_v1/page/summary/{placeName}` on mount and extracts `thumbnail.source`
3. **Fallback chain** — if Wikipedia has no image → show the gradient/icon fallback (existing behavior)
4. **Cache results** — store fetched URLs in a `useRef` map to avoid re-fetching on re-renders

### Technical Detail

```typescript
function extractPlaceName(dest: string): string {
  return dest
    .replace(/\(.*?\)/g, "")
    .replace(/\b(bus stand|railway station|airport|junction|terminal)\b/gi, "")
    .trim();
}

// In DestinationCard:
useEffect(() => {
  const name = extractPlaceName(dest);
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`)
    .then(r => r.json())
    .then(data => {
      if (data.thumbnail?.source) setImageUrl(data.thumbnail.source);
      else setImgError(true);
    })
    .catch(() => setImgError(true));
}, [dest]);
```

### Files Modified

| File | Change |
|------|--------|
| `src/components/DestinationPhotos.tsx` | Replace picsum with Wikipedia API for real destination photos |

