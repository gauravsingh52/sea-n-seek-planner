

## Add "Compare" Button to Trigger Comparisons from Any Itinerary Result

### Approach
When the AI returns an itinerary and the assistant message is displayed, add a "Compare options" button below the message. Clicking it sends a pre-built comparison prompt referencing the current trip, triggering the existing comparison flow.

### Changes

**`src/components/ChatMessage.tsx`**
- Accept optional props: `onCompare?: () => void` and `hasItinerary?: boolean`
- For assistant messages where `hasItinerary` is true, render a small "Compare 3 options" button below the message bubble
- Uses `ArrowRightLeft` icon from lucide-react, styled as a ghost button

**`src/hooks/useChat.ts`**
- Export a helper `triggerComparison` callback that takes no args — it reads the latest itinerary title/destination and sends a message like `"Compare 3 different options for this trip"` with the comparison hint auto-appended
- Add `triggerComparison` to the return object

**`src/pages/Index.tsx`**
- Pass `onCompare` and `hasItinerary` to each `ChatMessage` for assistant messages that were followed by an itinerary parse
- Track which message IDs produced itineraries (check if a message's raw content contained itinerary-json blocks) by adding a small Set in the chat render logic
- Wire `onCompare` to call `triggerComparison` from useChat

### Files Modified

| File | Change |
|------|--------|
| `src/hooks/useChat.ts` | Add `triggerComparison` callback |
| `src/components/ChatMessage.tsx` | Add optional "Compare" button for itinerary messages |
| `src/pages/Index.tsx` | Pass compare props to ChatMessage |

