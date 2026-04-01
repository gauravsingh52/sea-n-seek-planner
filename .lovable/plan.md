

## Fix Text Colors, Replace Logo, Update Global Scope

### Problems
1. **Text colors are hard to read** — the `gradient-text` utility cycles through teal/amber/orange which clashes with the dark map background. Subtitle uses `text-muted-foreground` which is too dim.
2. **Logo looks bad** — the compass SVG is overly complex with thin lines that don't render well at small sizes. Needs a cleaner, bolder design.
3. **Copy says "Europe"** — should say "worldwide" since the app covers global travel.

### Changes

**1. Better Text Colors** (`src/index.css`, `src/pages/Index.tsx`)
- Change `gradient-text` to use brighter, higher-contrast stops: white → light teal → white (instead of teal → amber → orange)
- Make subtitle text `text-foreground/70` instead of `text-muted-foreground` for better readability
- Ensure prompt card text is pure white (`text-white`) not dim foreground
- Header brand name: use solid white or light teal instead of gradient

**2. New Logo** (`src/components/Logo.tsx`)
- Replace the busy compass with a clean, bold design: a stylized globe with a curved route/pin
- Thicker strokes, fewer details, reads well at 40px and 80px
- Uses primary (teal) and accent (amber) fills for brand consistency

**3. Global Scope Update** (`src/pages/Index.tsx`)
- Change "Plan trips across Europe" → "Plan trips anywhere in the world"
- Update prompt examples to include worldwide destinations (e.g., Tokyo, Bali, New York)

**4. Prompt Card Icons** (`src/pages/Index.tsx`)
- Update the four quick prompts to reflect global travel, not just European routes

### Files Modified
| File | Change |
|------|--------|
| `src/index.css` | Brighter gradient-text stops |
| `src/components/Logo.tsx` | New cleaner globe+route SVG |
| `src/pages/Index.tsx` | Text colors, global copy, worldwide prompts |

