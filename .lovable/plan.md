

## Upgrade Chat History Storage: localStorage → IndexedDB

### Problem
The current chat history uses `localStorage` which has a ~5MB limit. Long AI conversations with itinerary data quickly fill this up, causing sessions to silently fail to save or lose data. The user reports only prompts are saved, not full conversations — this is the localStorage quota being exceeded.

### Solution
Switch to **IndexedDB** via the lightweight `idb-keyval` library. IndexedDB supports hundreds of MB, enough to store full conversation histories with all message content and itinerary data.

### Changes

**1. `src/hooks/useChatHistory.ts`** — Rewrite storage layer
- Replace `localStorage.getItem/setItem` with IndexedDB using `idb-keyval` (get/set)
- Load sessions asynchronously on mount
- Save sessions to IndexedDB on every update
- Keep the same `ChatSession` interface and hook API
- Add a one-time migration: on first load, check localStorage for old data, move it to IndexedDB, then clear localStorage

**2. `src/pages/Index.tsx`** — Minor adjustment
- The auto-save effect already calls `saveSession(messages, latestItinerary)` — no change needed, just ensure the full `messages` array (not truncated) is passed

**3. `package.json`** — Add `idb-keyval` dependency (~1KB gzipped)

### Technical Detail
- `idb-keyval` provides simple `get(key)` / `set(key, value)` that wraps IndexedDB
- Sessions are stored as a single array under key `"tripmap-chat-history"`
- Async loading means sessions start as `[]` and populate after mount (no visible delay since the history panel is closed by default)

