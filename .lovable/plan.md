

## Add Region-Based Follow-Up Suggestions

### Problem
The `FollowUpChips` component shows static defaults ("Show cheaper alternatives", "Compare 3 different options", "What should I pack?") when the AI doesn't return custom suggestions. These should be personalized based on the user's detected region.

### Solution
Use the existing `useGeoSuggestions` hook's geo data to provide region-aware default follow-up chips. Pass the detected country code to `FollowUpChips` so it can pick relevant defaults.

### Changes

**`src/components/FollowUpChips.tsx`**
- Add region-specific default suggestions keyed by country code (e.g., IN: "Best train routes nearby", "Local street food guide", "Monsoon travel tips"; US: "National parks road trip", "Best airline deals"; JP: "JR Pass worth it?", etc.)
- Add a `regionCode?: string` prop; use it to pick the right defaults when `suggestions` array is empty
- Keep current generic defaults as fallback when no region detected

**`src/pages/Index.tsx`**
- Extract `regionCode` from `useGeoSuggestions` (need to expose it from the hook)
- Pass `regionCode` to `<FollowUpChips>`

**`src/hooks/useGeoSuggestions.ts`**
- Expose `countryCode` in the return value so Index.tsx can pass it to FollowUpChips

### Files Modified

| File | Change |
|------|--------|
| `src/hooks/useGeoSuggestions.ts` | Add `countryCode` to return object |
| `src/components/FollowUpChips.tsx` | Add region-keyed default suggestions, accept `regionCode` prop |
| `src/pages/Index.tsx` | Destructure `countryCode`, pass to FollowUpChips |

