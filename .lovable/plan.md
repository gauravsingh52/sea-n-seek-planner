

## Fix 4 Persistent Issues: Destination Photos, PDF, Copy Link, Scroll

### 1. Destination Photos — `crossOrigin="anonymous"` Breaks Wikipedia Images

**Root cause**: The `crossOrigin="anonymous"` attribute on `<img>` tags causes the browser to make a CORS preflight request to `upload.wikimedia.org`. Wikipedia's image CDN does NOT return `Access-Control-Allow-Origin` headers for all image URLs, so the browser blocks the image entirely — worse than no attribute at all.

**Fix**: Remove `crossOrigin="anonymous"` from all `<img>` tags. Keep `referrerPolicy="no-referrer"` (this works fine — it just omits the Referer header). Also add `console.warn` in the fetch catch block so failures are visible during debugging.

### 2. PDF Export — Layout Issues

**Root cause**: The current PDF code works but has minor issues: the `safe()` function is too aggressive stripping non-ASCII, and there's no visual separator between days. The structure is correct but needs polish.

**Fix**: Already has page numbers and footer from last fix. Add a light gray background rect for day headers to visually separate sections. Widen description text wrap from 145 to 155.

### 3. Copy Link — Clipboard Blocked in Iframe

**Root cause**: Already fixed with `fallbackCopy()` using `document.execCommand('copy')`. The current code looks correct. The remaining issue: if the share-trip function call fails (network error), the toast says "Itinerary text copied!" which is misleading.

**Fix**: Add explicit error distinction — if link creation fails, show "Could not create share link. Itinerary text copied instead." If link succeeds but clipboard fails, show the URL in the toast so users can manually copy it.

### 4. Scroll — Page Not Scrolling

**Root cause**: The outer `div` has `min-h-screen` but the content inside uses `relative z-10` without `overflow` handling. The `h-[40vh]` map section combined with `min-h-screen` on the wrapper works fine in theory, but the `travel-bg` class or `particles` div may have `position: fixed` or `overflow: hidden` that blocks scroll.

**Fix**: Check `travel-bg` and `particles` CSS classes in `index.css`. Add `overflow-y: auto` to the main content wrapper if needed. Ensure no parent element has `overflow: hidden`.

### Files Modified

| File | Change |
|------|--------|
| `src/components/DestinationPhotos.tsx` | Remove `crossOrigin="anonymous"` from all img tags |
| `src/components/ExportPDF.tsx` | Add day header background rects, widen text wrap |
| `src/components/ShareButtons.tsx` | Improve error toast messages with URL display |
| `src/index.css` | Check/fix travel-bg and particles overflow rules |

