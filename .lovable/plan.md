

## Travel Plan Maker - Boat-Focused Chatbot

### Overview
An AI-powered travel planning chatbot that helps users create ferry-based itineraries with hotel and transit comparisons. Uses Lovable AI for natural language understanding and itinerary generation, with a polished chat interface.

### Pages & Layout

1. **Main Chat Page (`/`)** - Full-screen chat interface with a travel-themed design
   - Header with app branding ("BoatTrip Planner") and navigation
   - Chat area with message bubbles (user/assistant), markdown rendering
   - Input bar with send button and suggested quick prompts
   - Sidebar/panel showing current itinerary summary when active

2. **Itinerary View (`/itinerary`)** - Structured view of the generated travel plan
   - Timeline view of the trip (ferry → hotel → activities → transit)
   - Cost breakdown table comparing options
   - Booking links for each component
   - Share/export itinerary option

### Core Features

**AI Chat Engine (Lovable Cloud + Edge Function)**
- Edge function calling Lovable AI with a travel-planning system prompt
- Streaming responses for real-time token rendering
- Context-aware conversation maintaining trip details across messages
- Structured output extraction for itinerary data (ferry options, hotels, costs)

**Multi-Source Comparison UI**
- Ferry comparison cards showing routes, times, prices, operators
- Hotel comparison cards with ratings, prices, amenities
- Transit options between ports and accommodations
- Side-by-side cost comparison table
- "Best value" and "Fastest" recommendation badges

**Itinerary Builder**
- AI generates structured itinerary from conversation
- Visual timeline component showing day-by-day plan
- Editable segments (swap ferry, change hotel)
- Total cost calculator
- External booking links for each component

**Chat UX**
- Quick-start prompt suggestions ("Plan a ferry trip from Dover to Calais", "Find cheap ferries to Ireland in June")
- Rich message rendering with markdown, tables, and embedded comparison cards
- Loading states with travel-themed animations
- Conversation history within session

### Design
- Clean, modern UI with a nautical/travel theme
- Blue-teal color palette evoking ocean/travel
- Card-based comparison layouts
- Responsive design for mobile and desktop
- Smooth streaming text animation

### Technical Architecture
- **Frontend**: React + Tailwind + shadcn/ui components
- **Backend**: Lovable Cloud edge function for AI chat
- **AI**: Lovable AI Gateway (gemini-3-flash-preview) with travel-specialist system prompt
- **Data**: AI-generated mock comparisons initially (ferry/hotel data embedded in system prompt knowledge); real API integration can be added later

