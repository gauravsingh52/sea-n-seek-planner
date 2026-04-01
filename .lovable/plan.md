

## Major Visual Upgrade: Colors, Background, and Logo

### Problems Identified
The current UI looks washed out — pale beige tones with low contrast, no visual background imagery, no real logo, and the prompt cards are missing from the landing page (they appear to not be rendering). The overall feel is bland and empty.

### Changes

**1. New Color Palette** (`src/index.css`)
- Shift from pale beige to a richer, more vibrant scheme: deep navy/slate as base, with vivid teal, coral/orange accents, and warm gold highlights
- Higher contrast between background and foreground
- Dark mode as the default aesthetic (dark backgrounds make travel imagery pop)

**2. Travel-Themed Background** (`src/index.css`, `src/pages/Index.tsx`)
- Add a full-screen background using a high-quality travel/map image (world map illustration or aerial landscape) with a dark overlay for readability
- Use CSS `background-image` with a free Unsplash travel photo or an SVG world map pattern
- Layered gradient overlay on top for depth and brand colors bleeding through
- Replace the plain particle animation with a more subtle, atmospheric effect

**3. Custom SVG Logo** (`src/components/Logo.tsx`)
- Create a custom inline SVG logo combining a compass rose with a map pin or route line
- Stylized "TM" monogram integrated into the compass design
- Uses brand gradient colors
- Replace the plain Globe icon in the header and hero section

**4. Landing Page Overhaul** (`src/pages/Index.tsx`)
- Hero section with the new logo prominently displayed over the map background
- Prompt cards with semi-transparent dark glass effect and colored icon accents
- More impactful typography with larger heading and a subtle text shadow
- Animate the logo with a slow pulse/glow effect

**5. Chat Message Polish** (`src/components/ChatMessage.tsx`)
- User messages: vibrant gradient (teal to coral)
- Assistant messages: dark glass card with colored left border accent
- Better avatar styling with gradient rings

**6. Itinerary Page Background** (`src/pages/Itinerary.tsx`)
- Same map background treatment as Index for visual consistency
- Timeline cards with colored left borders matching leg type (blue for transport, green for hotel, amber for activity)

**7. Header & Input Upgrades** (`src/pages/Index.tsx`)
- Header with stronger glass blur over the map background
- Input bar with a glowing border animation on focus
- Send button with a more vivid gradient

### Files Modified/Created
| File | Action |
|------|--------|
| `src/index.css` | New color palette, background image, stronger glass effects |
| `src/components/Logo.tsx` | Create — custom SVG compass/route logo |
| `src/pages/Index.tsx` | Map background, new logo, enhanced prompt cards |
| `src/components/ChatMessage.tsx` | Richer message styling |
| `src/pages/Itinerary.tsx` | Consistent background, colored leg cards |
| `tailwind.config.ts` | Updated color tokens |

