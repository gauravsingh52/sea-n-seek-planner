

## Classic Color Palette Redesign

### Problem
The current teal + bright orange/amber combination looks garish — high-saturation warm accents clashing with cool teal creates a visually noisy, unrefined feel.

### New Classic Palette
Shift to a sophisticated, muted palette inspired by premium travel brands — deep navy, soft slate, warm ivory, and a single refined accent (muted gold).

**Light mode:**
- Background: `0 0% 98%` (clean off-white)
- Foreground: `220 20% 18%` (near-black navy)
- Primary: `220 45% 42%` (deep slate blue — trustworthy, classic)
- Accent: `38 45% 52%` (muted gold — elegant, not flashy)
- Muted: `220 10% 92%` (soft gray)
- Cards: `0 0% 96%` (subtle warm white)
- Sunset/earth tones: removed or greatly desaturated

**Dark mode:**
- Background: `220 20% 11%` (deep navy)
- Foreground: `210 15% 90%` (warm white)
- Primary: `220 40% 55%` (brighter slate blue)
- Accent: `38 40% 58%` (soft gold)
- Cards: `220 18% 15%`

### Changes

**`src/index.css`**
- Replace all CSS variables with the new classic palette
- Tone down `earth-gradient` to use navy → slate → gold (subtle)
- Reduce glass glow effects — use soft shadows instead of colored glows
- Update `gradient-text` to use foreground → primary (no orange/sunset)

**`tailwind.config.ts`**
- Keep color token names, just update underlying variables
- Reduce `pulse-glow` animation intensity

**`src/pages/Index.tsx`**
- Remove `glow-pulse` inline style from logo/send button (too flashy)
- Use simple `shadow-lg` instead of glowing colored shadows on hover

### Files Modified
| File | Change |
|------|--------|
| `src/index.css` | New classic color palette (both themes), toned-down gradients/glows |
| `tailwind.config.ts` | Adjusted glow keyframe intensity |
| `src/pages/Index.tsx` | Remove garish glow animations, use subtle shadows |

