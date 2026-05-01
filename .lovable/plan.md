
## Two Deliverables

### 1. Daily 10 Credits + Guest Access (ChatGPT-style)

**How it works:**
- Anonymous users (not logged in) get 2-3 free chats stored in localStorage. No login required.
- After the free chats are used, a login prompt appears.
- Logged-in users receive 10 credits daily. Credits reset every 24 hours (tracked by a `last_credit_refresh` timestamp on the `profiles` table).

**Database changes:**
- Add `last_credit_refresh` column (timestamp) to `profiles` table.
- Update the `deduct_credit` function to auto-refresh credits to 10 if 24+ hours have passed since `last_credit_refresh`.

**App changes:**

| File | Change |
|------|--------|
| `src/App.tsx` | Remove `ProtectedRoute` wrapper from `/` route so guests can access the chat page |
| `src/pages/Index.tsx` | Track guest message count in localStorage. After 2-3 messages, show a login modal instead of sending. Logged-in users use credits as before. |
| `src/components/CreditBar.tsx` | Show "Guest: X/3 free chats" for anonymous users, normal credit bar for logged-in users |
| `supabase/functions/chat/index.ts` | Allow unauthenticated requests with a rate limit (max 3 per IP/session). For authenticated users, keep credit deduction as-is. |
| `src/hooks/useAuth.ts` | On login, call `refreshCredits` which now auto-resets if 24h passed (handled server-side) |
| Migration | Add `last_credit_refresh` to profiles, update `deduct_credit` RPC |

**Guest flow:**
1. User lands on `/` without logging in -- sees chat UI
2. Can send up to 3 messages (tracked in localStorage)
3. On 4th message, a modal appears: "Sign up to continue -- get 10 free credits daily!"
4. After signup/login, credits work normally with daily refresh

### 2. Downloadable .pptx Presentation

A professionally designed PowerPoint file about TripMap Planner covering:
- Project overview and purpose
- Key features (AI chat, itinerary planning, real-time collaboration, weather, currency converter, etc.)
- Tech stack (React, Supabase, AI Gateway)
- Architecture diagram
- Credit system explanation
- Demo screenshots description
- Future roadmap

Output: `/mnt/documents/TripMap_Planner_Presentation.pptx`
