

## Fix Map, Currency & Missing Features

### Problems

1. **Map crash**: `react-leaflet` v5 requires React 19 but this project uses React 18. The `render2 is not a function` error is a known incompatibility — v5 uses React 19's new context consumer API. The error boundary catches it, showing "Map could not be loaded."

2. **Currency always EUR/€**: The system prompt hardcodes `"currency": "EUR"` in its example. For Indian users (and others), prices show in euros instead of local currency. The prompt needs to instruct the AI to use the user's local currency.

3. **System prompt is Europe-only**: The transport knowledge section only lists European routes. For worldwide users (especially India), the AI lacks knowledge of local routes.

### Fixes

**1. Downgrade react-leaflet to v4** (`package.json`)
- Change `react-leaflet` from `^5.0.0` to `^4.2.1` 
- Change `@react-leaflet/core` (if present) accordingly
- v4 is fully compatible with React 18

**2. Update system prompt for worldwide coverage** (`supabase/functions/chat/index.ts`)
- Add Indian transport routes: trains (Rajdhani, Shatabdi, Vande Bharat), buses (Volvo AC), flights (IndiGo, SpiceJet, Air India), driving routes (NH highways)
- Add routes for US, SE Asia, Japan, Australia
- Change the currency instruction: "Use the local currency of the trip destination. For India use INR (₹), for US use USD ($), for UK use GBP (£), for Europe use EUR (€)" etc.
- Update the example JSON to show `"currency": "INR"` as an alternative

**3. Fix currency symbol display** (`src/pages/Itinerary.tsx`, `src/components/TripMap.tsx`)
- Add INR (₹) to the currency symbol mapping (currently only handles EUR, GBP, USD)
- Add a broader currency map: `{ INR: "₹", EUR: "€", USD: "$", GBP: "£", JPY: "¥", THB: "฿", AUD: "A$" }`

**4. Add missing practical features** (`src/pages/Itinerary.tsx`)
- **Share/download button**: Export itinerary as a shareable link or copy text summary
- **Day grouping**: Group legs by day if the AI provides day information
- **Travel tips section**: Show destination-specific tips from the AI response

### Files Modified

| File | Change |
|------|--------|
| `package.json` | Downgrade react-leaflet to v4.2.1 |
| `supabase/functions/chat/index.ts` | Worldwide routes, local currency instruction |
| `src/pages/Itinerary.tsx` | Broader currency symbol map, share button |
| `src/components/TripMap.tsx` | Use currency from itinerary data in popups |

