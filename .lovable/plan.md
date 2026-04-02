

## Add Logo Entrance Animation

Add a CSS keyframe animation that plays once on page load — the logo scales up from small with a slight rotation and fade-in.

### Changes

**`src/index.css`** — Add `@keyframes logo-entrance` (scale 0.3 → 1, rotate -20° → 0°, opacity 0 → 1, 0.8s cubic-bezier spring)

**`src/components/Logo.tsx`** — Add `animate-[logo-entrance_0.8s_cubic-bezier(0.34,1.56,0.64,1)_forwards]` class to the outer wrapper div

