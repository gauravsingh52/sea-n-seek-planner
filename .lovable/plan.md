

## Extraordinary UI/UX Redesign

The current UI is flat and generic — basic cards, plain background, no visual depth or delight. Here's the plan to make it extraordinary:

### 1. Immersive Landing Experience (`src/pages/Index.tsx`, `src/index.css`)
- **Animated background**: Subtle floating particles/dots simulating a world map or constellation pattern using CSS keyframes
- **Hero section with glassmorphism**: Large frosted-glass card in the center with backdrop-blur, subtle border glow
- **Animated gradient text** on the "Where to next?" heading — shifting earth tones
- **Staggered fade-in animations** on all elements (heading, subtitle, prompt cards) using CSS animation delays
- **Prompt cards with hover effects**: Scale-up on hover, subtle gradient border animation, icon that animates on hover

### 2. Enhanced Prompt Cards (`src/pages/Index.tsx`)
- Each card gets a unique icon (train, ship, car, island) instead of generic map emoji
- Glassmorphism card style: semi-transparent background, backdrop-blur, glowing border on hover
- Subtle arrow indicator that slides in on hover

### 3. Polished Input Area (`src/pages/Index.tsx`)
- Floating input bar with shadow and glassmorphism effect
- Animated send button with pulse effect when text is entered
- Typing indicator glow around the input border

### 4. Chat Messages (`src/components/ChatMessage.tsx`)
- Messages animate in with slide + fade
- User messages get a subtle gradient background instead of flat color
- Assistant messages get a frosted-glass card look
- Avatar icons with a subtle glow/ring animation

### 5. Enhanced Loading (`src/components/WaveLoader.tsx`)
- Replace simple dots with a spinning globe or animated compass needle
- Add shimmer/skeleton effect for the message area while loading

### 6. Background & Atmosphere (`src/index.css`)
- Subtle radial gradient background (warm center fading to edges)
- Floating decorative elements: faint compass rose or map grid lines as CSS pseudo-elements
- Smooth color transitions throughout

### 7. Header Polish (`src/pages/Index.tsx`)
- Glass-effect header with stronger backdrop blur
- Logo icon with subtle rotation animation on hover
- Gradient text for the brand name

### 8. Itinerary Page (`src/pages/Itinerary.tsx`)
- Cards with staggered entrance animations
- Timeline connector line with animated gradient
- Glass-effect cards with depth

### Files Modified
- `src/index.css` — New keyframes, glassmorphism utilities, animated gradient, floating particles, radial background
- `tailwind.config.ts` — New animation keyframes and utility classes
- `src/pages/Index.tsx` — Glassmorphism cards, animated hero, enhanced prompt cards with unique icons, floating input
- `src/components/ChatMessage.tsx` — Animated message entrance, gradient bubbles, glass effect
- `src/components/WaveLoader.tsx` — Enhanced loading animation
- `src/pages/Itinerary.tsx` — Animated timeline, glass cards

