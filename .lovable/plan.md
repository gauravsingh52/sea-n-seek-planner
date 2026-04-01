

## Market Research: Features Missing from TripMap Planner

### Current State
The app has: AI chat itinerary generation, map view, weather badges, currency converter, trip comparison, save/load trips (localStorage), voice input, language selector, dark mode, share buttons, chat history, follow-up chips, onboarding tour, trip settings (budget/travelers/dates).

### What Top Competitors Offer (Wanderlog, Layla, Travo, Voyaiger)

After researching the 2026 travel planner market, here are the **high-impact features we're missing**, grouped by priority:

---

### Batch 1: Essential (implement now — 15 features)

| # | Feature | What it does |
|---|---------|-------------|
| 1 | **Export itinerary as PDF** | Download a clean, printable PDF of the trip plan |
| 2 | **Drag-and-drop itinerary reorder** | Let users rearrange legs/activities within a day |
| 3 | **Add custom stops/notes** | Users manually add their own activities or notes to the generated itinerary |
| 4 | **Collaborative trip sharing via link** | Generate a shareable URL so friends can view the same itinerary |
| 5 | **Offline access** | PWA with service worker — cache the itinerary for offline viewing |
| 6 | **Travel checklist / to-do list** | Editable checklist (visa, insurance, packing) attached to each trip |
| 7 | **Budget tracker** | Track actual spending vs planned budget with a progress bar |
| 8 | **Flight/hotel booking links** | Deep links to Kayak/Google Flights/Booking.com for each transport/hotel leg |
| 9 | **Photo gallery per destination** | Show destination photos (Unsplash API) in itinerary cards |
| 10 | **Trip duration calculator** | Show total travel time, idle time, activity time breakdown |
| 11 | **Emergency info card** | Always-visible card with local emergency numbers, embassy info |
| 12 | **User authentication** | Sign up/login so trips persist across devices (using Lovable Cloud) |
| 13 | **Cloud-synced saved trips** | Store trips in database instead of localStorage |
| 14 | **Multi-city / multi-stop planner** | Explicit support for complex routes (A→B→C→D) with optimized ordering |
| 15 | **Copy itinerary as text** | One-click copy the full itinerary as formatted text for WhatsApp/email |

### Batch 2: Differentiators (implement next — 10 features)

| # | Feature | What it does |
|---|---------|-------------|
| 16 | **Real-time price estimates** | Use web search to show current flight/hotel prices (via Perplexity API) |
| 17 | **Travel document checklist** | Auto-generate visa/passport/insurance requirements based on nationality + destination |
| 18 | **Trip countdown timer** | Dashboard showing days until departure |
| 19 | **Expense splitter** | Split costs among travelers with per-person breakdown |
| 20 | **Alternative route suggestions** | "Show me a scenic route" or "fastest route" toggle |
| 21 | **Attraction ratings & reviews** | Show Google/TripAdvisor-style ratings for suggested activities |
| 22 | **Time zone awareness** | Show local time at each destination, jet lag calculator |
| 23 | **Travel insurance comparison** | Suggest travel insurance options based on destination |
| 24 | **Seasonal travel advice** | "Best time to visit" badges based on weather/crowd data |
| 25 | **Trip templates** | Pre-built itinerary templates ("Weekend in Paris", "Backpacking SEA") users can start from |

---

### Implementation Plan (Batch 1 — 15 features)

Since implementing all 15 at once risks breaking things, I recommend doing them in **3 sub-batches**:

**Sub-batch A (Core UX — 5 features):**
- Export PDF, Copy as text, Add custom stops, Drag-and-drop reorder, Travel checklist

**Sub-batch B (Auth + Cloud — 4 features):**
- User authentication, Cloud-synced trips, Collaborative sharing via link, Budget tracker

**Sub-batch C (Content enrichment — 6 features):**
- Booking links, Destination photos, Trip duration calculator, Emergency info card, Multi-city planner, Offline PWA

### Files to Create/Modify

| File | Change |
|------|--------|
| `src/components/ExportPDF.tsx` | Create — PDF generation using html2canvas + jsPDF |
| `src/components/CopyItinerary.tsx` | Create — copy formatted text to clipboard |
| `src/components/CustomStop.tsx` | Create — form to add user-defined stops |
| `src/components/DraggableItinerary.tsx` | Create — drag-and-drop day planner using dnd-kit |
| `src/components/TravelChecklist.tsx` | Create — editable checklist component |
| `src/components/BudgetTracker.tsx` | Create — spending vs budget progress |
| `src/components/BookingLinks.tsx` | Create — deep links to booking sites |
| `src/components/DestinationPhotos.tsx` | Create — Unsplash photos for destinations |
| `src/components/EmergencyInfo.tsx` | Create — emergency contacts card |
| `src/components/TripCountdown.tsx` | Create — days until departure |
| `src/pages/Itinerary.tsx` | Integrate all new components |
| `src/pages/Index.tsx` | Add auth UI, trip templates |
| `src/pages/Auth.tsx` | Create — login/signup page |
| `supabase/functions/destination-photos/index.ts` | Create — Unsplash proxy |
| Database migration | `saved_trips` table, `user_profiles` table |

### Recommendation

Start with **Sub-batch A** (5 features: PDF export, copy text, custom stops, drag-drop, checklist). These are purely frontend, no auth needed, and give the most immediate user value. Should I proceed with Sub-batch A?

