
## Fix: Table Misalignment + History Not Saving Full Chat

### Problem 1: Table Misalignment
The table renders inside a `max-w-[75%]` chat bubble with no horizontal overflow handling. Wide tables (7-8 columns) get squished, causing misaligned columns. Need to add `overflow-x: auto` on the table wrapper and ensure minimum column widths.

### Problem 2: History Only Saves User Prompt, Not Full Chat
Two bugs:

1. **`beforeunload` save is useless** — `saveSession` calls `setSessions` (React state), which triggers a debounced `useEffect` to write to IndexedDB (500ms timeout). But on page unload, neither the effect nor the timeout ever fires. So if a user closes the tab mid-chat or after one exchange, nothing persists.

2. **Save timing race** — The save fires when `isLoading` transitions false→true, but if the user sends multiple messages quickly or navigates away, the intermediate states may never trigger the save.

### Fix

**`src/components/ChatMessage.tsx`**:
- Add `overflow-x-auto` to the prose wrapper div so wide tables scroll horizontally instead of squishing
- Ensure the chat bubble can expand for tables by using `max-w-[85%]` instead of `max-w-[75%]` on assistant messages

**`src/index.css`**:
- Add `table-layout: auto` and `white-space: nowrap` on `th` elements to prevent header text wrapping that causes misalignment
- Add `min-width` on `td`/`th` to prevent column collapse

**`src/hooks/useChatHistory.ts`**:
- Add a `saveSessionDirect` method that writes to IndexedDB **synchronously** (no debounce) for use in `beforeunload`
- Export both `saveSession` (debounced, for normal use) and `saveSessionDirect` (immediate, for unload)

**`src/pages/Index.tsx`**:
- In the `beforeunload` handler, use direct IndexedDB write (`set()` from idb-keyval) instead of going through React state, since React state updates don't survive page unload
- Also save after each completed exchange (current `wasLoading` pattern), keeping it as a backup

### Files Modified

| File | Change |
|------|--------|
| `src/components/ChatMessage.tsx` | Add `overflow-x-auto`, widen assistant max-width |
| `src/index.css` | Fix table cell sizing with `nowrap` headers, min-width |
| `src/hooks/useChatHistory.ts` | Add direct IndexedDB write method for reliable persistence |
| `src/pages/Index.tsx` | Use direct IndexedDB write in `beforeunload` handler |
