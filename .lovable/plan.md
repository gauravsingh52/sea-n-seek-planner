

## Fix 4 Issues: Language Switching, Scrolling, Logo, Chat History

### 1. Language Not Switching

**Root cause**: The language is stored in `tripSettings.language` and passed to the edge function as a context hint (`Respond in language: ${settings.language}`), but only when `language !== "en"`. The AI receives it as a soft instruction — it may or may not comply. The real issue is the language selector is only visible in the desktop header (`hidden md:flex`), so on many viewports it's invisible. Also, the language instruction is too weak in the system prompt.

**Fix**:
- Make the language selector visible on mobile too (add to `MobileNav` or input area)
- Strengthen the language instruction in the edge function: instead of a context hint, make it a hard system instruction like `"IMPORTANT: You MUST respond entirely in Hindi (हिन्दी). All text including headings, tips, and suggestions must be in this language."`
- Always send language even when it's "en" so the AI knows explicitly

### 2. Main Page Not Scrolling

**Root cause**: The landing page (no messages) is inside `<div className="flex-1 overflow-hidden">` with content centered via `justify-center h-full`. When content overflows (e.g., on smaller screens), `overflow-hidden` clips it. The suggestion cards and input area get cut off.

**Fix**:
- Change `overflow-hidden` to `overflow-y-auto` for the empty-state container
- The centering still works with `min-h-full` instead of `h-full` on the inner div

### 3. Logo Redesign

**Root cause**: Current logo is a complex globe SVG with thin lines that don't render cleanly, especially at small sizes.

**Fix**: Replace with a simpler, bolder logo — a stylized compass/pin icon using filled shapes instead of thin strokes. Use the primary navy color with the accent warm tone for the pin/route element. Fewer paths, thicker lines, cleaner at 40px.

### 4. Chat History

**Root cause**: Currently `clearChat` wipes all messages. There's no way to revisit past conversations. The saved trips feature only saves itineraries, not chat conversations.

**Fix**:
- Create `src/hooks/useChatHistory.ts` — stores chat sessions in localStorage
- Each session: `{ id, title (first user message), messages, createdAt, itinerary? }`
- Auto-save current chat on each assistant reply
- Max 20 sessions, oldest auto-deleted
- Add a chat history sidebar/drawer accessible from header and mobile nav
- Create `src/components/ChatHistory.tsx` — slide-out drawer with list of past chats
- Clicking a past chat loads its messages into `useChat`
- Add `loadChat` method to `useChat` hook
- Add History icon to header and mobile nav

### Files Modified

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Fix overflow-hidden → overflow-y-auto, add history button, add language selector to mobile area |
| `src/components/Logo.tsx` | New simpler bold logo SVG |
| `src/hooks/useChatHistory.ts` | Create — localStorage chat session CRUD |
| `src/components/ChatHistory.tsx` | Create — slide-out drawer listing past chats |
| `src/hooks/useChat.ts` | Add `loadChat` method, auto-save to history on replies |
| `src/components/MobileNav.tsx` | Add History item |
| `supabase/functions/chat/index.ts` | Strengthen language instruction |

