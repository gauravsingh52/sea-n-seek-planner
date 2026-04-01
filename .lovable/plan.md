

## Fix Bugs & Add Trip Comparison Feature

### Issues Found

**1. Settings button not visible on landing page**
`TripSettings` is only rendered when `hasMessages` is true (line 240-243 of Index.tsx). Before the user sends any message, there's no way to set budget/travelers/dates.

**2. Language not changing AI response language**
The language is sent in `settings.language` and the edge function builds a strong instruction. However, the language instruction is appended as a `[Trip Context: ...]` suffix to the system prompt — the AI may treat it as a soft hint. Also, the language selector is always sent (good), but it's buried inside a bracketed context string rather than being a separate, top-level system instruction.

**3. Mobile ChatHistory drawer doesn't open**
The mobile `ChatHistory` at line 279-287 uses `trigger={<span className="hidden" />}` — this hidden span can never be clicked. The `onHistoryClick` in MobileNav is supposed to open it, but `historyOpen` state is set but never connected to the Sheet's `open` prop. The Sheet only opens via its SheetTrigger click.

**4. Console ref warnings**
`MobileNav` and `ChatHistory` are function components passed to `asChild` or `ref`-forwarding contexts without `forwardRef`.

**5. Map still failing**
`react-leaflet@4.2.1` with `@react-leaflet/core@2.1.0` — the explicit `@react-leaflet/core` pin may conflict. The core package v2.1.0 was designed for react-leaflet v4 but may have React 18 compatibility issues depending on resolution. The `render2 is not a function` error comes from core's context consumer implementation.

### Plan

**A. Fix TripSettings visibility (Index.tsx)**
- Show `TripSettings` always (not just when `hasMessages`), move it above the input form unconditionally.

**B. Fix language switching (edge function)**
- Move language instruction out of the bracketed context string. Instead, append it as a standalone paragraph to the system prompt: `"\n\nIMPORTANT OVERRIDE: You MUST respond entirely in [Language]. Every heading, sentence, tip, and followUpSuggestions value must be in [Language]. Do NOT use English unless the selected language is English."` — placed outside the `[Trip Context]` block so the AI treats it as a hard rule.

**C. Fix mobile ChatHistory drawer (Index.tsx)**
- Pass `open={historyOpen}` and `onOpenChange={setHistoryOpen}` to the mobile `ChatHistory` Sheet. Update `ChatHistory` component to accept optional `open`/`onOpenChange` props and pass them to `<Sheet>`.

**D. Fix map — remove @react-leaflet/core pin (package.json)**
- Remove the explicit `@react-leaflet/core: 2.1.0` dependency. Let `react-leaflet@4.2.1` resolve its own compatible core version. This should fix the `render2` error.

**E. Add Trip Comparison Feature**
- Add a "Compare options" follow-up chip/button that sends a message like "Show me 3 alternative itinerary options for comparison" to the AI.
- Update the system prompt to include a comparison instruction: when asked to compare, output 3 separate `itinerary-json` blocks (labeled Option A, B, C).
- Update `useChat.ts` `parseItineraryJson` to extract multiple itinerary blocks and store them as an array.
- Create `src/components/TripComparison.tsx` — a side-by-side view showing 2-3 itineraries in columns with key metrics (total cost, duration, number of stops). User can pick one to view in full.
- Add a "Compare" button on the Itinerary page that triggers comparison mode.

### Files Modified

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Show TripSettings always; fix mobile ChatHistory open state; add "Compare" follow-up chip |
| `src/components/ChatHistory.tsx` | Accept `open`/`onOpenChange` props for controlled Sheet |
| `supabase/functions/chat/index.ts` | Move language instruction to standalone system paragraph; add comparison mode instruction |
| `package.json` | Remove `@react-leaflet/core` explicit dependency |
| `src/hooks/useChat.ts` | Support extracting multiple itinerary blocks; expose `comparisonItineraries` state |
| `src/components/TripComparison.tsx` | Create — side-by-side itinerary comparison cards |
| `src/pages/Itinerary.tsx` | Add comparison view toggle, show TripComparison when multiple itineraries available |

