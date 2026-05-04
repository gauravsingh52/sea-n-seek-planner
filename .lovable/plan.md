
## 1. Global Chat Busy State

The textarea and send button in `src/pages/Index.tsx` already check `isLoading` to disable themselves (lines 355, 365). However, the `isLoading` state in `useChat.ts` may be resetting to `false` before streaming fully completes (before the typing cursor disappears). The fix:

- Review `useChat.ts` to ensure `isLoading` stays `true` for the entire duration of the streaming response, including until the last chunk is received and processed.
- Verify the textarea `disabled={isLoading}` and button `disabled={!input.trim() || isLoading}` are working correctly with the updated state.

## 2. Travel Checklist Not Working

**Root cause**: Each checklist item is wrapped in a `<label>` element (line 74 of `TravelChecklist.tsx`) that contains a `<button>` acting as a checkbox (line 78). When the user clicks the button, the `onClick` handler fires and toggles the item. Then the `<label>` receives the click event and implicitly "clicks" its associated control (the button) again, toggling it back. Net result: nothing changes.

**Fix**: Change the wrapping `<label>` to a `<div>`. This preserves the layout and hover styles while eliminating the double-toggle behavior.

## 3. Currency Converter Not Clickable

**Root cause**: The `CurrencyConverter` uses Radix `Select` components inside a `Card` with `CardHeader`. The `CardHeader` or parent glassmorphism styling may be creating stacking context issues. More likely, the `<label>` from checklist isn't the issue here -- the Radix Select triggers may need explicit `position: relative` and `z-index` to work inside the glass card, or there may be an invisible overlay element intercepting clicks.

**Fix**:
- Add `relative z-10` to the currency converter's inner container to ensure it sits above any pseudo-element overlays.
- Ensure all interactive elements (Input, Select, button) have proper `position: relative` to escape any stacking context issues from the glassmorphism backdrop-filter.

## 4. Project Assessment Report (PDF)

Generate a professional college-level project report PDF for the TripMap AI Travel Planner, modeled after the uploaded reference document structure. The report will include:

- **Section A**: Project overview (Generative LLM-based, Web Application, deployment link)
- **Section B**: Model and API details (Lovable AI Gateway, Gemini model, streaming)
- **Section C**: Context and data handling (session-based memory, data flow diagram)
- **Section D**: Model configuration (temperature, token limits)
- **Section E**: Technology stack (React, Vite, Tailwind, Supabase, Edge Functions)
- **Section F**: Implementation evidence (describe key features, architecture)
- Evaluation criteria alignment, declaration

Output as a downloadable PDF to `/mnt/documents/`.

## Technical Details

| File | Change |
|------|--------|
| `src/hooks/useChat.ts` | Verify isLoading stays true during entire stream |
| `src/pages/Index.tsx` | No changes needed (already checks isLoading) |
| `src/components/TravelChecklist.tsx` | Change `<label>` to `<div>` on line 74 |
| `src/components/CurrencyConverter.tsx` | Add relative positioning/z-index to fix click interception |
| Script (one-off) | Generate project report PDF |
