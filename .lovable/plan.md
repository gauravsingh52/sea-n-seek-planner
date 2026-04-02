

## Add Clickable Links: Destination Photos + Better Booking Links

### 1. Destination Photos — Add Google Maps Link

Each destination photo card will become clickable, opening Google Maps for that location in a new tab.

**Changes in `src/components/DestinationPhotos.tsx`**:
- Wrap the card content in an `<a>` tag linking to `https://www.google.com/maps/search/{placeName}`
- Add hover effect (scale, cursor pointer) for visual feedback
- Use `extractPlaceName(dest)` for the search query (cleaner results)

### 2. Bus/Transport Booking Links — Use Real Booking Sites

Currently the "Bus" link goes to Google Maps transit directions, which isn't useful for booking. Replace with actual Indian bus booking sites.

**Changes in `src/components/BookingLinks.tsx`**:
- Bus: Link to `https://www.redbus.in/bus-tickets/{from}-to-{to}` (India's main bus booking platform)
- Train: Link to `https://www.irctc.co.in` or Google search for train tickets
- Flights: Keep Google Flights (works well)
- Hotels: Keep Google Hotels (works well)

### Files Modified

| File | Change |
|------|--------|
| `src/components/DestinationPhotos.tsx` | Wrap each photo card in a Google Maps link |
| `src/components/BookingLinks.tsx` | Change bus link to RedBus, improve train link |

