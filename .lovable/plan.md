

## Batch Feature Upgrade — 25 High-Impact Features

Adding 200 features at once would break things and take days. Instead, here are **25 carefully chosen features** across all 4 categories that will make the biggest difference. We'll implement them in one batch since most are small additions.

---

### A. Core Travel Planning (9 features)

| # | Feature | Implementation |
|---|---------|---------------|
| 1 | **Budget input** | Add budget field in chat input area — pass to AI so it respects spending limits |
| 2 | **Traveler count** | Quick selector (1-10 travelers) — AI adjusts pricing per person |
| 3 | **Date picker** | Inline date range picker for trip dates — sent as context to AI |
| 4 | **Packing list generator** | AI generates a packing list based on destination weather + trip type, shown in itinerary page |
| 5 | **Visa info card** | AI includes visa requirements in response based on popular origin-destination pairs |
| 6 | **Currency converter widget** | Small converter tool on itinerary page — uses exchangerate API |
| 7 | **Day-by-day grouping** | Group itinerary legs under Day 1, Day 2 headers |
| 8 | **Trip duration badge** | Show "3 days, 2 nights" badge at top of itinerary |
| 9 | **Emergency contacts** | AI includes local emergency numbers (police, ambulance) for destination country |

### B. Social & Sharing (4 features)

| # | Feature | Implementation |
|---|---------|---------------|
| 10 | **Share as text** | Copy full itinerary as formatted text (already partial — enhance formatting) |
| 11 | **Share via WhatsApp/Telegram** | Share buttons that open `wa.me` / `t.me` with itinerary text |
| 12 | **Download as PDF** | Generate a styled PDF of the itinerary using browser print API |
| 13 | **Share link with URL params** | Encode itinerary as compressed base64 in URL for sharing |

### C. Smart AI Enhancements (6 features)

| # | Feature | Implementation |
|---|---------|---------------|
| 14 | **Follow-up suggestions** | After AI responds, show 3 clickable follow-up chips (e.g., "Show cheaper options", "Add hotels") |
| 15 | **Multi-language support** | Detect browser language, add language selector, instruct AI to respond in chosen language |
| 16 | **Voice input** | Microphone button using Web Speech API for speech-to-text |
| 17 | **Trip comparison** | "Compare with alternatives" button that asks AI to show 3 different itinerary options |
| 18 | **Smart destination photos** | Show a destination photo from Unsplash API in itinerary header |
| 19 | **Travel tips section** | AI includes 3-5 practical tips at the end of each itinerary |

### D. User Experience Polish (6 features)

| # | Feature | Implementation |
|---|---------|---------------|
| 20 | **Onboarding tooltip tour** | First-visit guided tour highlighting key features (3-4 steps) |
| 21 | **Keyboard shortcuts** | Enter to send, Ctrl+N for new chat, Ctrl+S to save trip |
| 22 | **Loading skeleton for itinerary** | Animated skeleton cards while itinerary loads |
| 23 | **Scroll-to-top button** | Floating button in chat when scrolled up |
| 24 | **Mobile bottom nav** | Bottom navigation bar on mobile instead of header buttons |
| 25 | **Toast notifications** | Contextual toasts for save, copy, share actions (already partial — improve) |

---

### Implementation Approach

We'll implement these in **3 sub-batches** to keep things stable:

**Batch 1 — AI & Chat Enhancements** (features 1-3, 5, 9, 14-19)
- Update `supabase/functions/chat/index.ts` system prompt to include visa info, emergency contacts, travel tips, packing lists, follow-up suggestions
- Add `TripSettings` component with budget, travelers, dates — passed as context to chat
- Add follow-up suggestion chips to `ChatMessage.tsx`
- Add voice input button to `Index.tsx`
- Add language selector

**Batch 2 — Itinerary Page** (features 4, 6-8, 10-13, 18, 22)
- Day grouping logic in `Itinerary.tsx`
- Trip duration calculator
- Share buttons (WhatsApp, Telegram, PDF, URL)
- Currency converter widget
- Destination photo from Unsplash
- Loading skeletons

**Batch 3 — UX Polish** (features 20-21, 23-25)
- Onboarding tour component
- Keyboard shortcuts hook
- Scroll-to-top button
- Mobile bottom nav
- Enhanced toasts

### Files Modified/Created

| File | Action |
|------|--------|
| `supabase/functions/chat/index.ts` | Expand prompt: visa, tips, packing, follow-ups, emergency info |
| `src/components/TripSettings.tsx` | Create — budget, travelers, date picker panel |
| `src/components/FollowUpChips.tsx` | Create — clickable suggestion chips after AI response |
| `src/components/VoiceInput.tsx` | Create — mic button with Web Speech API |
| `src/components/ShareButtons.tsx` | Create — WhatsApp, Telegram, PDF, link sharing |
| `src/components/CurrencyConverter.tsx` | Create — small converter widget |
| `src/components/DestinationPhoto.tsx` | Create — Unsplash photo header |
| `src/components/OnboardingTour.tsx` | Create — first-visit tooltip tour |
| `src/components/ScrollToTop.tsx` | Create — floating scroll button |
| `src/components/MobileNav.tsx` | Create — bottom navigation for mobile |
| `src/components/LanguageSelector.tsx` | Create — language picker dropdown |
| `src/hooks/useKeyboardShortcuts.ts` | Create — keyboard shortcut handler |
| `src/hooks/useOnboarding.ts` | Create — first-visit detection |
| `src/pages/Index.tsx` | Add trip settings, voice input, follow-ups, mobile nav, onboarding |
| `src/pages/Itinerary.tsx` | Day grouping, duration badge, share buttons, converter, photo, skeletons |
| `src/hooks/useChat.ts` | Pass trip settings (budget, travelers, dates, language) to AI |

