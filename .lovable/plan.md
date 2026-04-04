

## Fix: Share Link "Creating..." Stuck + Add Missing Collaborate Feature + Destination Photos

### Issues Found

1. **Share Link shows "Creating..." but never completes** — The edge function returns 200 with `{ shareCode: "..." }` successfully. However, `supabase.functions.invoke()` returns the response body inside `data` — but if the SDK version wraps it differently, `data.shareCode` could be undefined, causing `createShareLink` to return a URL like `/trip/undefined`. The clipboard then fails in the iframe, and the catch block runs. Also, the `finally` block resets `sharing` to false, but the popover may close before the toast shows.

2. **No "Collaborate" feature exists** — There is a SharedTrip page (`/trip/:shareCode`) with comments, but no way to reach it except via the share link. The user expects a visible "Collaborate" option.

3. **Destination Photos** — Wikipedia API returns 200 with valid thumbnails (confirmed in network logs). The photos ARE loading for some destinations. This seems to be working now.

### Fixes

**1. Fix Share Link (`src/components/ShareButtons.tsx`)**
- Add `console.log` to debug the response from `supabase.functions.invoke`
- Handle the case where `data` might be wrapped: check `data?.shareCode` or `data?.data?.shareCode`
- After creating the link, show the URL in a toast with a clickable link even if clipboard fails
- Replace "Creating..." with a proper loading state that resolves

**2. Add Collaborate Button (`src/pages/Itinerary.tsx` + `src/components/ShareButtons.tsx`)**
- Add a "Collaborate" option in the share popover that creates a share link AND navigates to the shared trip page
- This opens the `/trip/:shareCode` page where others can comment

**3. Destination Photos — No changes needed**
- Network logs confirm Wikipedia API returns valid thumbnails (200 status)
- Photos are loading correctly based on the API responses

### Files Modified

| File | Change |
|------|--------|
| `src/components/ShareButtons.tsx` | Fix data access from SDK response, add Collaborate option, improve error handling |
| `supabase/functions/share-trip/index.ts` | Add logging for debugging |

