

## Fix Trip Comparison: Response Too Long for JSON Blocks

### Root Cause
The AI generates extremely detailed markdown for all 3 options (transport tables, accommodation tables, day-by-day itineraries, activities, visa info, tips) BEFORE appending the `itinerary-json` blocks. This exceeds the model's output token limit, so the response gets cut off before any JSON data is emitted. Without JSON blocks, `parseAllItineraryBlocks` finds nothing, so comparison cards never appear.

### Solution: Two-Pronged Fix

**1. Set higher `max_tokens` in edge function (`supabase/functions/chat/index.ts`)**
- Add `max_tokens: 16000` to the API request body to allow enough room for full comparison responses.

**2. Shorten comparison prompt to prioritize JSON output (`supabase/functions/chat/index.ts`)**
- Update the COMPARISON MODE instruction: tell the AI to keep markdown summaries brief when comparing (short paragraph per option, no full day-by-day for each), and output the JSON blocks immediately after the summaries.
- Change instruction to: "When comparing, write a SHORT summary paragraph for each option (3-4 sentences max per option, no full day-by-day breakdown). Then immediately output the itinerary-json blocks. The comparison cards in the UI will show the detailed data — the markdown is just an overview."

**3. Add `~~~itinerary-json` as additional marker (`src/hooks/useChat.ts`)**
- The memory note mentions `~~~itinerary-json` fencing. Add this as a third marker in `parseAllItineraryBlocks` and `stripItineraryBlocks` for robustness.

### Files Modified

| File | Change |
|------|--------|
| `supabase/functions/chat/index.ts` | Add `max_tokens: 16000`, shorten comparison mode instructions to prioritize JSON output |
| `src/hooks/useChat.ts` | Add `~~~itinerary-json` as additional parsing marker |

