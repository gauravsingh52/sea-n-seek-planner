

## Fix Itinerary Feature — Root Cause Analysis & Plan

### Problems Found

**1. Itinerary page crashes with blank screen**
The console shows `TypeError: render2 is not a function` at `updateContextConsumer`. This is caused by `react-leaflet` v5's internal context usage conflicting during render. Even though `TripMap` only renders when `itinerary` is not null, the import of `react-leaflet` at the top of `TripMap.tsx` can cause initialization issues. The fix is to **lazy-load** the `TripMap` component.

**2. AI response doesn't include the `itinerary-json` block**
The streaming response I tested showed a full trip plan but did NOT include the structured JSON block at the end. Without this block, `parseItineraryJson()` returns `null`, so `latestItinerary` is never set, and the Itinerary page always shows "No itinerary yet." The system prompt instructs the AI to include it, but the model doesn't always comply — especially with shorter/simpler requests.

**3. Landing page hero content invisible**
The "Where to next?" text and suggestion cards use `opacity-0 animate-slide-up-fade` but appear invisible in some cases. The `opacity-0` utility class can override the animation's final `opacity: 1` state. Need to remove the `opacity-0` class and let the animation handle it entirely via initial keyframe state.

### Fixes

**Fix 1: Lazy-load TripMap** (`src/pages/Itinerary.tsx`)
- Use `React.lazy()` and `Suspense` to dynamically import `TripMap` only when needed
- Add a loading fallback while the map component loads
- This avoids the `react-leaflet` context crash on initial page render

**Fix 2: Improve itinerary JSON reliability** (`src/hooks/useChat.ts`, `supabase/functions/chat/index.ts`)
- In the system prompt, make the JSON instruction more forceful — move it to the end and emphasize it's mandatory
- In `useChat.ts`, add a fallback: if streaming completes without an `itinerary-json` block, and the response contains itinerary-like content (day-by-day plan, costs), show a toast/notification telling the user to click "View Itinerary" or auto-retry
- Also fix the `parseItineraryJson` function to handle edge cases (extra whitespace, partial blocks)

**Fix 3: Fix animation visibility** (`src/pages/Index.tsx`)
- Remove `opacity-0` class from all animated elements
- Instead, set `opacity: 0` in the animation's `0%` keyframe (already done in tailwind config), so the element starts invisible and animates to visible without class conflict

**Fix 4: Add error boundary for map** (`src/pages/Itinerary.tsx`)
- Wrap the map in an error boundary so if leaflet crashes, the rest of the itinerary cards still render

### Files Modified

| File | Change |
|------|--------|
| `src/pages/Itinerary.tsx` | Lazy-load TripMap with Suspense + error boundary |
| `src/pages/Index.tsx` | Remove `opacity-0` from animated elements |
| `src/hooks/useChat.ts` | More robust JSON parsing, handle edge cases |
| `supabase/functions/chat/index.ts` | Strengthen system prompt JSON instruction |

