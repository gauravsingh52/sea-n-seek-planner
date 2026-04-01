

## Add Typing Animation for AI Responses

The streaming already delivers text incrementally from the backend, but it renders instantly as chunks arrive. We'll add a smooth character-by-character reveal effect on the assistant messages using a custom hook.

### Approach

**Create `src/hooks/useTypingEffect.ts`**
- A hook that takes the target string and a speed (default ~15ms per char)
- Uses `requestAnimationFrame` or `setInterval` to incrementally reveal characters
- Returns the currently visible substring
- When the target string changes (new streamed chunk), it continues typing from where it left off rather than restarting
- Includes a blinking cursor character (`▍`) at the end while typing is in progress

**Update `src/components/ChatMessage.tsx`**
- For assistant messages only, pass `message.content` through `useTypingEffect`
- Render the typed content through `ReactMarkdown` as before
- Add a blinking cursor CSS class in `src/index.css`

### Files
| File | Action |
|------|--------|
| `src/hooks/useTypingEffect.ts` | Create — typing reveal hook |
| `src/components/ChatMessage.tsx` | Use the hook for assistant messages |
| `src/index.css` | Add blinking cursor keyframe |

