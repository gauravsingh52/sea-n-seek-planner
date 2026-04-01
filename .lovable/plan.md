

## Fix Language Switching — Root Cause & Plan

### Problem
The language selector changes to Hindi but content stays English. Two separate issues:

**Issue 1: AI responses ignore language setting**
The language instruction is appended at the **end** of a very long system prompt (~4000 tokens). The AI model prioritizes earlier instructions. By the time it reaches the language override, it has already "decided" to respond in English based on the English system prompt and English user messages.

**Fix**: Move the language instruction to the **very beginning** of the system prompt, before all other instructions. Prefix it as the first line: `"CRITICAL INSTRUCTION: You MUST respond ENTIRELY in हिन्दी (Hindi)..."`. Also add a reminder at the end for reinforcement.

**Issue 2: Static UI text stays English**
The landing page heading ("Where to next?"), subtitle, suggestion cards, and labels ("Popular trips near...") are hardcoded English strings. The language selector only affects AI chat responses, not the app UI.

**Fix**: Add a simple translation map for key UI strings (heading, subtitle, location label prefix) keyed by language code. The geo suggestion prompts will also get translated versions for the top languages (Hindi, Spanish, French).

### Files Modified

| File | Change |
|------|--------|
| `supabase/functions/chat/index.ts` | Move language instruction to START of system prompt instead of end |
| `src/pages/Index.tsx` | Add UI string translations for heading, subtitle, placeholder text |
| `src/hooks/useGeoSuggestions.ts` | Add translated suggestion text for top languages |

