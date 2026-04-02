
## Fix Comparison Feature: Not Triggering Reliably

### Problem
The comparison code exists but rarely activates because:
1. **AI doesn't reliably output multiple `itinerary-json` blocks** — the system prompt's comparison instructions are buried and the AI often outputs one combined itinerary instead of 2-3 separate JSON blocks
2. **State resets on every new message** — `setComparisonItineraries([])` at line 119 of `useChat.ts` clears comparison data when the user sends any follow-up
3. **No explicit "Compare" trigger** — users have to know to say "compare" in their message; there's no UI affordance

### Fix

**1. Strengthen the system prompt** (`supabase/functions/chat/index.ts`)
- Move the COMPARISON MODE section higher and make it more emphatic
- Add explicit trigger phrases: when the user mentions "compare", "alternatives", "options", "which is better", "budget vs comfort", output **exactly 2-3 separate** `itinerary-json` blocks
- Add a final reminder: "If outputting comparisons, you MUST output 2-3 SEPARATE itinerary-json blocks. Do NOT combine them into one block."

**2. Add a "Compare options" follow-up chip** (`src/components/FollowUpChips.tsx`)
- After any itinerary is generated, always include a "Compare 3 different options" chip in the defaults so users can easily trigger comparison mode

**3. Preserve comparison state** (`src/hooks/useChat.ts`)
- Don't clear `comparisonItineraries` at the start of `sendMessage` — only clear when starting a genuinely new topic (i.e., when `clearChat` is called)
- This way, if a user asks a follow-up question after a comparison, the cards remain visible

**4. Auto-detect comparison intent** (`src/hooks/useChat.ts`)
- Before sending, check if the user's input contains comparison keywords ("compare", "alternatives", "options", "vs", "versus", "which is better")
- If detected, append a hidden context hint to the system: `[USER WANTS COMPARISON — output 2-3 separate itinerary-json blocks]`

### Files Modified

| File | Change |
|------|--------|
| `supabase/functions/chat/index.ts` | Strengthen comparison prompt, add final reminder about multiple JSON blocks |
| `src/hooks/useChat.ts` | Don't reset comparison on follow-up; detect comparison keywords and add hint |
| `src/components/FollowUpChips.tsx` | Ensure "Compare options" is always in default chips after an itinerary |
