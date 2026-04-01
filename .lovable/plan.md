

## Three Features: Sound Effects, Test Typing, Dark/Light Mode

### 1. Message Arrival Sound Effect
- Create a subtle notification sound using the Web Audio API (no external files needed) — a short sine wave "pop" tone
- Create `src/hooks/useMessageSound.ts` that plays a brief tone when called
- In `src/hooks/useChat.ts`, trigger the sound when a new assistant message starts arriving
- No haptic feedback (web standard `navigator.vibrate` is unreliable and unsupported on iOS)

### 2. Test Typing Animation
- I'll use the browser tools to send a test message and verify the typing effect renders correctly

### 3. Dark/Light Mode Toggle
- Add a light theme `:root` variables block in `src/index.css` and move current dark colors under `.dark`
- Create `src/hooks/useTheme.ts` — reads/writes `localStorage`, toggles `.dark` class on `<html>`
- Add a Sun/Moon toggle button in the header of `src/pages/Index.tsx`
- Light theme: warm off-white background, dark text, adjusted glass effects
- Travel background image works for both modes with different overlay opacity

### Files
| File | Action |
|------|--------|
| `src/hooks/useMessageSound.ts` | Create — Web Audio pop sound |
| `src/hooks/useChat.ts` | Edit — play sound on assistant reply |
| `src/index.css` | Edit — light/dark theme variables |
| `src/hooks/useTheme.ts` | Create — theme toggle logic |
| `src/pages/Index.tsx` | Edit — add theme toggle button in header |
| `src/pages/Itinerary.tsx` | Edit — add same toggle for consistency |

