

## Redesign Logo — Extraordinary / Bold

### Current State
The logo is a simple compass circle with north/south arrows and a dashed route arc. It's generic and forgettable.

### New Design Concept: **Abstract Globe + Pin + Swoosh**
A bold, modern travel logo that stands out — combining a stylized globe wireframe, a prominent location pin, and a dynamic flight arc trail. Uses gradient fills and layered geometric shapes for depth.

**Visual elements:**
- **Outer ring**: Thick gradient-stroked circle with a gap (open ring) — feels modern, not closed
- **Globe wireframe**: Two curved latitude/longitude lines crossing inside — suggests global travel
- **Location pin**: Bold teardrop pin shape offset to upper-right, with glowing dot center — the focal point
- **Flight arc**: Smooth curved trail from bottom-left sweeping up to the pin, with a tiny plane silhouette at the tip
- **Gradient**: Primary → accent gradient for depth; sunset color for the pin glow

### Changes

**`src/components/Logo.tsx`** — Complete SVG replacement with the new bold design:
- Open gradient ring (270° arc, not full circle)
- Two curved globe lines (latitude + longitude arcs)
- Teardrop pin shape at ~(42, 18) with inner glow circle
- Bezier flight trail from (12, 52) sweeping to the pin
- Tiny plane triangle at trail tip
- Drop shadow filter for the pin

