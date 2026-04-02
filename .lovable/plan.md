

## Fix: Markdown Tables Not Rendering (Raw `| :--- |` Showing)

### Problem
The AI returns markdown tables in its responses, but `react-markdown` doesn't support table syntax by default. It requires the `remark-gfm` plugin (GitHub Flavored Markdown) to parse tables, strikethrough, and other extended markdown. Without it, raw pipe characters and alignment markers like `| :--- |` are displayed as plain text.

### Fix

**Install**: `remark-gfm`

**`src/components/ChatMessage.tsx`**:
- Import `remarkGfm` from `remark-gfm`
- Pass it to `ReactMarkdown` as `remarkPlugins={[remarkGfm]}`
- Add table styling classes to the prose wrapper so tables look good (borders, padding, alternating rows)

**`src/index.css`** (optional):
- Add minimal table styling for the chat context — bordered cells, proper padding, responsive overflow

### Technical Detail

```tsx
import remarkGfm from "remark-gfm";

<ReactMarkdown remarkPlugins={[remarkGfm]}>{displayed}</ReactMarkdown>
```

This single change enables tables, strikethrough (`~~text~~`), autolinks, and task lists in all AI responses.

