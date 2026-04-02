

## Fix: Destination Photos Not Loading + Scroll-to-Top on Route Change

### Problem 1: Destination Photos Broken
The `source.unsplash.com` API has been **deprecated and shut down** (since early 2025). All requests return broken image responses. The screenshots confirm this — alt text shows but no photos load.

**Fix**: Switch to the **Unsplash Image API** direct URL format which still works without an API key:
```
https://images.unsplash.com/photo-random?w=288&h=192&q=80&fit=crop
```

However, this also doesn't support keyword search without an API key. The best free alternative is to use **Pixabay** or simply generate a gradient placeholder with the destination name. The cleanest solution that works reliably without any API key is to use **Lorem Picsum** (`https://picsum.photos/288/192`) with a seed based on the destination name, giving consistent photos per destination. While not destination-specific, they always load.

Alternatively, we can remove the external dependency entirely and show styled gradient cards with destination initials/icons — which is more reliable and looks clean.

**Recommended approach**: Use gradient cards with destination names as the visual element (no external API dependency), keeping the component useful and always working.

### Problem 2: No Scroll-to-Top on Route Navigation
The existing `ScrollToTop` component is designed for in-page scroll (a floating button within a ScrollArea). There's no route-level scroll reset — when navigating from `/` to `/itinerary`, the page may retain its scroll position.

**Fix**: Add a simple route-change `ScrollToTop` component in `App.tsx` that calls `window.scrollTo(0, 0)` on pathname change.

### Changes

**`src/components/DestinationPhotos.tsx`**:
- Remove the broken `source.unsplash.com` URL
- Replace with styled gradient cards — each destination gets a unique gradient based on a simple hash of its name, with a map pin icon and the destination name prominently displayed
- Still horizontally scrollable, visually appealing, zero external dependencies

**`src/App.tsx`**:
- Add a `ScrollToTop` component (using `useLocation` + `useEffect`) inside `BrowserRouter` that scrolls to top on every route change

### Files Modified

| File | Change |
|------|--------|
| `src/components/DestinationPhotos.tsx` | Replace broken Unsplash URLs with gradient destination cards |
| `src/App.tsx` | Add route-level scroll-to-top on navigation |

