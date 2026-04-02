

## Fix Chat History: Full Conversations Not Saving Correctly

### Root Cause

The auto-save in `Index.tsx` fires on **every `messages` state change** — which happens on every streaming chunk during AI responses. This causes dozens of rapid IndexedDB writes with **partial assistant content**. If the final write races with an earlier one, the saved session ends up with incomplete or empty assistant messages. That's why loading a session shows "only prompts."

### Fix

**1. `src/pages/Index.tsx`** — Change auto-save trigger
- Stop saving on every `messages` change during streaming
- Instead, save only when `isLoading` transitions from `true` → `false` (streaming finished), using a `useRef` to track previous loading state
- Also save on `beforeunload` event to catch mid-chat browser close
- This guarantees the saved data always has the **complete** assistant response

```
// Before (fires every streaming chunk — broken):
useEffect(() => {
  if (messages.length > 0 && messages[messages.length - 1]?.role === "assistant") {
    saveSession(messages, latestItinerary);
  }
}, [messages, latestItinerary, saveSession]);

// After (fires once when streaming ends — correct):
const wasLoading = useRef(false);
useEffect(() => {
  if (wasLoading.current && !isLoading && messages.length > 0) {
    saveSession(messages, latestItinerary);
  }
  wasLoading.current = isLoading;
}, [isLoading, messages, latestItinerary, saveSession]);
```

**2. `src/hooks/useChatHistory.ts`** — Debounce IndexedDB writes
- Add a 500ms debounce to the persist effect so rapid session updates don't cause write races
- Use a `setTimeout` + cleanup pattern in the useEffect

### Files Modified

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Save only after streaming completes + save on beforeunload |
| `src/hooks/useChatHistory.ts` | Debounce IndexedDB persist writes by 500ms |

