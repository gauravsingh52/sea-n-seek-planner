
## Three Fixes

### 1. Daily Reset for Guest 3-Chat Limit

**Problem:** Guest chat count in `localStorage` never resets, so guests get only 3 chats ever.

**Fix:** Store a timestamp alongside the guest count in `localStorage`. On each visit, check if 24 hours have passed since the timestamp was set. If so, reset the count to 0.

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Store `tripmap_guest_chats` as JSON `{ count, timestamp }`. On init, check if 24h elapsed; if so, reset to 0. |

### 2. Rebuild Project Presentation (.pptx)

**Problem:** The previous presentation was low quality.

**Fix:** Create a professional, college-level presentation from scratch using `pptxgenjs` with:
- Bold color palette (deep navy + gold accent), consistent design across all slides
- Proper slide layouts: title slide, problem/solution, features showcase, tech stack, architecture, credit system, demo walkthrough, future roadmap, Q&A
- Visual elements on every slide (icons, stat callouts, colored blocks, two-column layouts)
- Professional typography and spacing
- ~10 slides total

Output: `/mnt/documents/TripMap_Planner_Presentation.pptx`

### 3. Fix Currency Converter

**Problem:** The converter uses static hardcoded exchange rates and may not render/function correctly.

**Fix:**
- Replace static rates with a free exchange rate API (ExchangeRate-API or similar) fetched on component mount
- Add loading state and error fallback to the static rates
- Ensure the component renders correctly with proper state handling

| File | Change |
|------|--------|
| `src/components/CurrencyConverter.tsx` | Add `useEffect` to fetch live rates from a free API (e.g., `https://open.er-api.com/v6/latest/USD`). Fall back to static rates on error. Add loading spinner. |
