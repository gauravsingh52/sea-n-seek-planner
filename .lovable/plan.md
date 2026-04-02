

## Fix: First Destination Photo Not Loading (Special Characters in Name)

### Problem
The screenshot shows "Chandigarh Bus Stand (Sector 43/17)" falling back to the no-photo state while other cards load fine. The issue is that `encodeURIComponent` encodes parentheses and slashes, but Lorem Picsum's seed parameter may not handle complex encoded strings well — or the resulting URL is too long/malformed for that specific seed.

### Fix in `src/components/DestinationPhotos.tsx`

**Sanitize the seed** — strip parentheses, slashes, numbers, and extra details before creating the picsum URL. Use only the core place name (e.g., "Chandigarh Bus Stand" instead of "Chandigarh Bus Stand (Sector 43/17)"):

```typescript
function cleanSeed(dest: string): string {
  return dest
    .replace(/\(.*?\)/g, "")   // remove parenthesized details
    .replace(/[^a-zA-Z\s]/g, "") // keep only letters and spaces
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");      // spaces to hyphens
}

const imageUrl = `https://picsum.photos/seed/${cleanSeed(dest)}/288/192`;
```

This ensures every destination gets a clean, short seed that picsum can reliably resolve, while the display name stays unchanged.

### Files Modified

| File | Change |
|------|--------|
| `src/components/DestinationPhotos.tsx` | Add `cleanSeed()` to strip special chars from picsum URL seed |

