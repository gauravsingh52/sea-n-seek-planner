
## 1. Fix Itinerary PDF Export

The `ExportPDF` component already exists and works. The issue title says "sea trip plan" but this likely means any trip. I'll review and ensure the export works correctly from the Itinerary page — it's already wired up. No changes needed unless there's an actual bug.

**If there is a rendering bug**: Will inspect and fix jsPDF output (encoding, page breaks, currency symbols).

## 2. Currency API Rate Caching with Retries

**Current issue**: Single fetch attempt, no caching — if the API fails, users see fallback rates with no retry.

**Changes to `src/components/CurrencyConverter.tsx`**:
- Cache fetched rates in `localStorage` with a timestamp (key: `tripmap_exchange_rates`)
- On mount, load cached rates immediately if less than 1 hour old (show as live)
- Fetch fresh rates with up to 3 retry attempts (exponential backoff: 1s, 2s, 4s)
- If all retries fail, fall back to cached rates (if any) before using hardcoded fallback
- Show "Cached rates" / "Live rates" / "Approximate rates" label accordingly

## 3. Guest Usage Meter with Reset Timer

**Current issue**: Guest `CreditBar` in `UserMenu` shows remaining chats but no reset countdown.

**Changes to `src/components/UserMenu.tsx`**:
- Read the `tripmap_guest_chats` JSON from localStorage to get the timestamp
- Calculate time remaining until 24h reset
- Display a countdown like "Resets in 5h 23m" below the credit bar
- Auto-update the countdown every minute using `setInterval`

**Changes to `src/components/CreditBar.tsx`**:
- Add optional `resetLabel` prop to display reset time info in the tooltip and inline

## 4. Upgrade/Pricing Plan Page

Create a pricing/upgrade page so users can see plan tiers for future monetization.

**New file `src/pages/Pricing.tsx`**:
- Three-tier pricing cards: Free, Pro, Premium
- Free: 10 credits/day, 3 guest chats, basic itinerary
- Pro: 50 credits/day, priority AI, PDF export, collaboration
- Premium: Unlimited credits, API access, custom branding, priority support
- "Current Plan" badge on Free tier for logged-in users
- "Coming Soon" badge on Pro/Premium with email interest collection
- Styled consistently with the app's glassmorphism theme

**Changes to `src/App.tsx`**:
- Add `/pricing` route

**Changes to `src/components/UserMenu.tsx`**:
- Add "Upgrade Plan" menu item linking to `/pricing`

## Technical Details

| File | Action |
|------|--------|
| `src/components/CurrencyConverter.tsx` | Add localStorage caching + 3 retries with backoff |
| `src/components/UserMenu.tsx` | Add reset countdown for guests + upgrade link |
| `src/components/CreditBar.tsx` | Add optional `resetLabel` prop |
| `src/pages/Pricing.tsx` | New pricing page with 3 tiers |
| `src/App.tsx` | Add `/pricing` route |
