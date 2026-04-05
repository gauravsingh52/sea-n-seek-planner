

## Fix 4 Issues: Animated Weather Icons, Collaborate Page, Travel Checklist, Currency Converter

### 1. Animated Weather Icons (Replace Emojis)

**Problem**: Weather widget uses emoji strings from the backend. Need CSS-animated SVG icons instead.

**Solution**: Create animated weather icon components using Lucide icons with CSS animations (pulsing sun, falling rain drops, drifting clouds, etc.). Map weather conditions to these animated components in WeatherWidget.

**Changes**:
- `src/components/WeatherWidget.tsx` — Replace `{data.icon}` emoji with an `<AnimatedWeatherIcon condition={data.condition} />` component that renders animated Lucide icons (Sun with pulse, Cloud with drift, CloudRain with drop animation, Snowflake with float, CloudLightning with flash)
- `src/index.css` — Add keyframe animations: `@keyframes spin-slow`, `@keyframes rain-drop`, `@keyframes cloud-drift`, `@keyframes snow-float`, `@keyframes lightning-flash`

### 2. Collaborate Page — Missing Features

**Problem**: The SharedTrip page (`/trip/:shareCode`) only shows a calendar grid and comments. It's missing: destination photos, weather, packing list, cost breakdown, map, checklist — all the features the main itinerary page has.

**Solution**: Port key sections from the Itinerary page into SharedTrip:
- Add the TripMap component (lazy loaded)
- Add DestinationPhotos
- Add WeatherWidget (with useWeather hook)
- Add Packing List display
- Add Cost Breakdown
- Add TripDuration stats
- Fix the calendar overflow (already has `overflow-x-auto`)

**Changes**:
- `src/pages/SharedTrip.tsx` — Import and render TripMap, DestinationPhotos, WeatherWidget, TripDuration, PackingListCard, CostBreakdown. Reuse existing components. Add proper layout matching the main Itinerary page structure.

### 3. Travel Checklist Not Working

**Problem**: The checklist component code looks correct — it uses localStorage and Radix Checkbox. The likely issue is that `onCheckedChange` receives a `CheckedState` (boolean | "indeterminate") but the toggle function expects a simple call. Looking at the code, `toggle(item.id)` is called correctly via `onCheckedChange={() => toggle(item.id)}`. 

The real problem: the `select` dropdowns in CurrencyConverter use `className="bg-transparent"` which in dark mode makes `<option>` elements invisible (dark text on dark background). Same pattern may affect checkbox visibility.

**Investigation**: The checkbox code looks functionally correct. The issue may be that clicking checkboxes doesn't visually update due to CSS conflicts with the `glass-strong` card styling, or the `max-h-48 overflow-y-auto` container is eating scroll events. Will ensure the checkbox container allows proper interaction and add visual feedback.

**Changes**:
- `src/components/TravelChecklist.tsx` — Increase `max-h-48` to `max-h-64` to show more items, ensure checkbox click area is large enough, add a subtle animation on check

### 4. Currency Converter Not Working

**Problem**: The `<select>` elements use `className="bg-transparent"` which in dark mode renders `<option>` text as invisible (browser renders option text in the system default color). The converter logic itself is correct (hardcoded rates, simple math).

**Solution**: Style the `<select>` and `<option>` elements properly for dark mode. Use `bg-background text-foreground` on the select, and add explicit colors on `<option>` elements.

**Changes**:
- `src/components/CurrencyConverter.tsx` — Fix select styling: use `bg-background text-foreground` and add `className="bg-background text-foreground"` to each `<option>`. Also add NZD to rates.

---

### Files Modified

| File | Change |
|------|--------|
| `src/components/WeatherWidget.tsx` | Replace emoji icons with animated Lucide SVG icons |
| `src/index.css` | Add weather animation keyframes |
| `src/pages/SharedTrip.tsx` | Add map, photos, weather, packing list, cost breakdown, duration |
| `src/components/TravelChecklist.tsx` | Fix scroll container height, improve checkbox interaction |
| `src/components/CurrencyConverter.tsx` | Fix dark mode select/option styling |

