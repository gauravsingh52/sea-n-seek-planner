

## Redesign Logo — Bold & Animated

### Problem
The current logo is too faint and abstract — the thin arcs, tiny plane, and small pin blend together into an indistinct shape, especially in dark mode. It doesn't read as a clear "travel" icon at small sizes (navbar) or large sizes (hero).

### New Design: **Stylized Paper Plane + Globe Ring**
A clean, instantly recognizable travel icon with strong visual weight:

- **Thick gradient ring** — bold 4px stroke, full circle with a dash gap at top-right for dynamism
- **Large paper plane** — centered, geometric, filled with primary-to-accent gradient. Universally recognized as "travel/journey"
- **Motion trail** — 3 small dots trailing behind the plane suggesting movement
- **Warm accent glow** — subtle radial glow behind the plane for depth

### Hover Animation
- **CSS transition on the wrapper**: `transition: transform 0.4s ease`
- On hover: `rotate(8deg) scale(1.1)` — subtle tilt + scale for playful interaction
- The plane inside gets a separate `translateX(2px)` shift to feel like it's taking off

### Changes

**`src/components/Logo.tsx`** — Complete SVG redesign + hover class
- Replace all paths with new paper plane geometry + bold ring
- Add `group` class and `transition-transform duration-400 hover:rotate-6 hover:scale-110` to the outer wrapper
- Keep the same props interface (`size`, `className`)

**`src/index.css`** — Add `@keyframes logo-hover-plane` for the inner plane shift on hover (CSS-only, no JS state needed)

