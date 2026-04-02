

## Fix 5 Root Issues: PDF, Collaborative Alignment, Copy Link, Scroll, Destination Photos

### 1. PDF Export — Not a Proper Document

**Problem**: The `ExportPDF` component uses jsPDF correctly, but the PDF has issues: no proper structure for multi-day trips, the `→` arrow character isn't supported by jsPDF's default font (renders as garbage), and currency symbols like `₹` also fail. jsPDF's default font only supports basic Latin characters.

**Fix in `src/components/ExportPDF.tsx`**:
- Replace `→` with `->` (ASCII-safe)
- Replace `₹` and other non-Latin currency symbols with their text equivalents (e.g., "INR ", "Rs.") when rendering in jsPDF
- Add better spacing, a header with trip duration, and more structured layout
- Add packing list to PDF if present

### 2. Collaborative SharedTrip — Calendar Alignment Issues

**Problem**: In `SharedTrip.tsx`, the itinerary is shown only via `ItineraryCalendar` inside a Card. The calendar view renders day columns side by side, but the container Card doesn't handle overflow properly — columns get squished on smaller screens.

**Fix in `src/pages/SharedTrip.tsx`**:
- Add `overflow-x-auto` to the Card wrapping the calendar
- Ensure the calendar container allows horizontal scrolling when columns overflow

### 3. Copy Link — Not Working

**Problem**: The `copyLink` function uses `btoa(unescape(encodeURIComponent(JSON.stringify(itinerary))))` which creates a base64 URL. Two issues:
- The itinerary JSON is almost always too large for a URL (>2000 chars), so it falls back to copying plain text — which isn't a "link"
- Even when it fits, the `/itinerary` page doesn't read `?data=` query params — it reads from `TripContext`, so the link wouldn't work anyway

**Fix in `src/components/ShareButtons.tsx`**:
- Change "Copy Link" to always use the collaborative share flow (backend storage + short share code) instead of the broken base64 URL approach
- OR simpler: make "Copy Link" copy the itinerary as formatted text (rename to "Copy Text") and keep "Collaborative Link" as the true shareable link
- Best approach: Make "Copy Link" invoke the share-trip edge function (same as collaborative) to generate a real working link. Remove the separate "Collaborative Link" option to avoid confusion.

### 4. Scroll — Whole Page Should Scroll

**Problem**: The `RouteScrollToTop` in `App.tsx` is working for route changes, but the Itinerary page itself uses `h-[calc(100vh-60px)]` with internal `overflow-y-auto` (line 257 + 292). This means the page content scrolls inside a nested container, not the whole page. The map section is fixed at 40vh, consuming screen space. The user sees the second map (world map) from the screenshot — suggesting the viewport is split awkwardly.

**Fix in `src/pages/Itinerary.tsx`**:
- Remove `h-[calc(100vh-60px)]` from the main container (line 257)
- Remove `flex-1 overflow-y-auto` from the content area (line 292) — let the whole page scroll naturally
- Keep the map at a fixed height but don't constrain the overall page height

### 5. Destination Photos — Still No Photos Showing

**Problem**: The current `DestinationPhotos.tsx` shows gradient cards with MapPin icons — no actual photos. The component title says "Destination Photos" but shows colored rectangles. The gradients use CSS variables like `hsl(var(--primary))` which may resolve to similar/invisible colors depending on theme.

**Fix in `src/components/DestinationPhotos.tsx`**:
- Use **Lorem Picsum** (`https://picsum.photos/seed/{destination}/288/192`) for reliable, always-loading images with a seed based on destination name for consistency
- Add an `<img>` tag with the picsum URL, with `onError` fallback to the gradient card
- This gives actual photos (random but consistent per destination) with zero API key needed

### Files Modified

| File | Change |
|------|--------|
| `src/components/ExportPDF.tsx` | Fix non-Latin character rendering, use ASCII-safe alternatives |
| `src/pages/SharedTrip.tsx` | Add overflow-x-auto to calendar container |
| `src/components/ShareButtons.tsx` | Make Copy Link use share-trip backend for real shareable URLs |
| `src/pages/Itinerary.tsx` | Remove fixed viewport height, let page scroll naturally |
| `src/components/DestinationPhotos.tsx` | Add real photos via Lorem Picsum with gradient fallback |

