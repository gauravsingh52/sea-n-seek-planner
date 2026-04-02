

## Add Drag-and-Drop Reordering of Itinerary Stops

### Approach
Use `@dnd-kit/core` + `@dnd-kit/sortable` (lightweight, React 18 compatible, actively maintained) to make `LegCard` items draggable within the list view. When a leg is dropped in a new position, the itinerary updates in context.

### Changes

**Install**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

**`src/contexts/TripContext.tsx`**
- Add `reorderLegs(fromIndex: number, toIndex: number)` to context
- Splices the legs array and updates itinerary state

**`src/pages/Itinerary.tsx`**
- Wrap the leg list (both flat and day-grouped views) with `DndContext` + `SortableContext`
- Add `handleDragEnd` that calls `reorderLegs`
- Add a `DragOverlay` for a visual preview while dragging

**`src/pages/Itinerary.tsx` — `LegCard` component**
- Wrap with `useSortable` hook from dnd-kit
- Add a drag handle icon (`GripVertical` from lucide) on the left side
- Apply transform/transition styles from the sortable hook
- Add visual feedback (opacity, scale) when actively dragging

### UX Details
- Drag handle appears on hover (desktop) or always visible (mobile)
- Smooth animation on reorder
- Only active in **list view** (not calendar view)
- Toast notification: "Itinerary reordered" after drop

