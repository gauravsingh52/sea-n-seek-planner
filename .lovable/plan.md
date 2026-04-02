

## Add 3 Major Features: Calendar View, Budget Tracker, Collaborative Trips

Based on your selections, here's the plan to add these three features to TripMap Planner.

---

### 1. Multi-Day Calendar View

**What it does**: A visual timeline/calendar that shows each day of the itinerary as a column or row, with transport, hotels, and activities placed in time slots — instead of just a flat list.

**Implementation**:
- Create `src/components/ItineraryCalendar.tsx` — a day-by-day grid view component
  - Each column = one day, with time slots showing legs (transport, hotel, activity)
  - Color-coded cards by leg type (blue for transport, green for hotel, orange for activity)
  - Clickable cards that expand to show details
- Add a toggle button on the Itinerary page to switch between "List view" (current) and "Calendar view"
- Uses existing `ItineraryData.legs` with the `day` and `time` fields already present

**Files**: `src/components/ItineraryCalendar.tsx` (new), `src/pages/Itinerary.tsx` (add toggle)

---

### 2. Budget Tracker

**What it does**: Track spending vs budget with a visual breakdown by category (transport, hotels, activities) and a progress bar showing how much budget is used.

**Implementation**:
- Create `src/components/BudgetTracker.tsx` — a collapsible panel showing:
  - Total budget (from TripSettings) vs total itinerary cost
  - Progress bar with color (green/yellow/red based on %)
  - Pie or bar chart breakdown by category (transport/hotel/activity) using simple CSS or a lightweight chart
  - Per-person cost when travelers > 1
- Add to the Itinerary page below the cost summary
- Uses existing `legs[].cost`, `legs[].type`, `totalCost`, and `currency` from ItineraryData
- Uses `tripSettings.budget` for the budget limit

**Files**: `src/components/BudgetTracker.tsx` (new), `src/pages/Itinerary.tsx` (integrate)

---

### 3. Collaborative Trips (Share & Co-Edit)

**What it does**: Generate a shareable link for a trip. Anyone with the link can view the itinerary, and authenticated users can add comments or suggest changes.

**Implementation**:

**Database** (requires migrations):
- Create `shared_trips` table: `id`, `share_code` (unique), `title`, `itinerary_data` (jsonb), `created_by` (uuid, nullable), `created_at`
- Create `trip_comments` table: `id`, `shared_trip_id` (FK), `author_name`, `content`, `created_at`
- RLS: Anyone can SELECT shared_trips by share_code; only creator can UPDATE/DELETE; anyone can INSERT comments

**Backend**:
- Edge function `share-trip` — accepts itinerary JSON, generates a unique share code, stores in `shared_trips`, returns the shareable URL

**Frontend**:
- Create `src/pages/SharedTrip.tsx` — a public page at `/trip/:shareCode` that loads the shared itinerary and displays it read-only with a comments section
- Update `src/components/ShareButtons.tsx` — add a "Copy share link" button that calls the edge function and copies the URL
- Add route in `App.tsx`

**Files**: `shared_trips` + `trip_comments` tables (migration), `supabase/functions/share-trip/index.ts` (new), `src/pages/SharedTrip.tsx` (new), `src/components/ShareButtons.tsx` (update), `src/App.tsx` (add route)

---

### Summary

| Feature | New Files | Modified Files |
|---------|-----------|----------------|
| Calendar View | `ItineraryCalendar.tsx` | `Itinerary.tsx` |
| Budget Tracker | `BudgetTracker.tsx` | `Itinerary.tsx` |
| Collaborative Trips | `SharedTrip.tsx`, `share-trip/index.ts` | `ShareButtons.tsx`, `App.tsx` + DB migration |

These are large features — I recommend implementing them one at a time, starting with Calendar View (simplest, no backend needed), then Budget Tracker, then Collaborative Trips.

