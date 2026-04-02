

## Add Lightbox/Fullscreen View for Destination Photos

### Approach
Add a Dialog-based lightbox that opens when clicking a destination photo. The Google Maps link moves to a button inside the lightbox instead of wrapping the card.

### Changes in `src/components/DestinationPhotos.tsx`

1. **Import `Dialog` components** from `@/components/ui/dialog` and add `ExternalLink` icon from lucide
2. **Add lightbox state** to `DestinationPhotos` parent — track which destination is open (`selectedDest: string | null`) and pass an `onOpen` callback to each card
3. **Change `DestinationCard`** — replace the `<a>` wrapper with a `<button>` that calls `onOpen(dest)`. Keep the same visual card layout
4. **Add a `Dialog`** in `DestinationPhotos` that shows:
   - Large image (fetched from Wikipedia `originalimage.source` for higher resolution, falling back to `thumbnail.source`)
   - Destination name as title
   - "Open in Google Maps" link button at the bottom
   - Close button (built into Dialog)
5. **Use `imageCache`** to get the URL for the selected destination without re-fetching
6. **Also cache `originalimage`** URL separately for the fullscreen view (higher resolution than thumbnail)

### UX Details
- Click photo → fullscreen dialog with large image + place name + Maps link
- Escape or X to close
- Smooth fade-in animation (Dialog default)
- Fallback cards (no photo) still open the lightbox showing just the name + Maps link

### Files Modified

| File | Change |
|------|--------|
| `src/components/DestinationPhotos.tsx` | Add Dialog lightbox, split click from Maps link, cache hi-res URLs |

