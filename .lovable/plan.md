

## Three Features: Rename Sessions, Fix History Data, Trip Templates

### 1. Rename Chat Sessions

**`src/hooks/useChatHistory.ts`** — Add `renameSession(id, newTitle)` callback that updates the title of a session by ID.

**`src/components/ChatHistory.tsx`** — Fix duplicate interface declaration (lines 8-24). Add inline rename: clicking a pencil icon on a session row enters edit mode with an `<Input>` field. On Enter/blur, call `renameSession`. Import `Pencil` from lucide-react and `Input` from ui.

**`src/pages/Index.tsx`** — Pass `renameSession` to both `<ChatHistory>` instances as `onRename` prop.

### 2. Verify Full Chat Saves (Bug Fix)

The `saveSession` in `useChatHistory.ts` already receives the full `messages` array. However, the `saveSession` call in `Index.tsx` runs on every render where the last message is from the assistant — the `useCallback` has no deps issue. The save function preserves custom titles set by rename by checking if a session already exists and keeping its title if it was manually renamed.

**`src/hooks/useChatHistory.ts`** — Add `customTitle?: boolean` flag to `ChatSession` interface. In `saveSession`, preserve the existing title if `customTitle` is true (so auto-save doesn't overwrite renamed sessions).

### 3. Trip Templates

**`src/components/TripTemplates.tsx`** — New component. A grid of 6-8 pre-built template cards (e.g., "Weekend in Paris", "Backpacking Southeast Asia", "Golden Triangle India", "Japan Rail Pass Tour"). Each card shows title, duration, estimated cost, and a thumbnail emoji. Clicking sends the template as a chat message like "Plan a weekend trip to Paris with 3 days, budget €500".

**`src/pages/Index.tsx`** — Show `<TripTemplates>` on the landing page below the geo-suggestion cards when no messages exist. Import and render conditionally.

### Files Modified

| File | Change |
|------|--------|
| `src/hooks/useChatHistory.ts` | Add `renameSession`, `customTitle` flag on ChatSession |
| `src/components/ChatHistory.tsx` | Fix duplicate interface, add inline rename UI with pencil icon + input |
| `src/components/TripTemplates.tsx` | Create — pre-built trip template cards |
| `src/pages/Index.tsx` | Pass `onRename` to ChatHistory, add TripTemplates to landing page |

