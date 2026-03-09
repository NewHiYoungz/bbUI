# AI API Platform Design Document

**Project:** APIMart-style AI API Marketplace
**Date:** 2026-03-09
**Type:** Frontend-only, full-platform showcase

## Executive Summary

Building a complete AI API marketplace platform similar to APIMart.ai, featuring a unified interface for browsing 500+ AI models. This is a frontend-only implementation with mock data, designed to showcase all platform features with a polished, production-quality UI following a specific design system.

## Reference Platform

**APIMart.ai** - Unified AI API platform providing:
- Single API for 500+ AI models (GPT, Claude, Gemini, image/video generation)
- OpenAI-compatible interface
- Transparent pricing with up to 70% savings
- 99.9% uptime SLA
- Pay-as-you-go model with volume discounts

## Project Scope

**Type:** Full platform (all pages and features)
**Backend:** Frontend-only with mock data
**Tech Stack:** React 18 + Tailwind CSS + Vite
**Features:** Full interactive experience (search, filters, playground, dashboard, charts)

## Design System

### Color Palette
- **Primary (Purple):** `#6C5CE7` - Main buttons, active states, emphasis, logo
- **Accent (Coral Orange):** `#FF8C69` - Feature tags, promotions, secondary highlights
- **Text (Dark Gray):** `#2D3436` - Headings, body text
- **Secondary Text/Borders:** `#B2BEC3` or `#DFE6E9` - Helper text, borders, inactive states

### Visual Style
- **No gradients** - Flat color blocks only
- **Rounded corners:** 8-12px on all cards, buttons, inputs
- **Thin lines and borders**
- **Generous whitespace**
- **Clean, modern aesthetic**

## Architecture

### Project Structure
```
bbUI/
├── src/
│   ├── components/
│   │   ├── atoms/              # Basic building blocks
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Card.jsx
│   │   ├── molecules/          # Simple combinations
│   │   │   ├── APICard.jsx
│   │   │   ├── CodeSnippet.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── PricingCard.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── organisms/          # Complex sections
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── APIGrid.jsx
│   │   │   ├── UsageDashboard.jsx
│   │   │   ├── APIPlayground.jsx
│   │   │   └── Hero.jsx
│   │   └── layout/
│   │       └── Layout.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Marketplace.jsx
│   │   ├── APIDetail.jsx
│   │   ├── Pricing.jsx
│   │   ├── Documentation.jsx
│   │   ├── Dashboard.jsx
│   │   └── Auth.jsx
│   ├── context/
│   │   ├── AuthContext.jsx    # Mock authentication
│   │   └── APIContext.jsx     # Mock API data
│   ├── data/
│   │   ├── mockAPIs.js        # 30-50 sample AI models
│   │   └── mockUser.js        # User dashboard data
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── package.json
└── index.html
```

### Tech Stack Details
- **React 18** with **Vite** - Fast dev server, HMR
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling with custom config
- **Recharts** - Dashboard usage charts
- **React Icons** - Icon library
- **Prism.js** or similar - Code syntax highlighting
- **Copy-to-clipboard** library

### Routing Structure
- `/` - Home/landing page
- `/marketplace` - Browse all APIs
- `/api/:id` - Individual API details
- `/pricing` - Pricing plans
- `/docs` - Documentation
- `/dashboard` - User dashboard (requires mock login)
- `/login` - Login/signup

## Component System

### Atomic Components (atoms/)

**Button**
- Variants: Primary (purple), secondary (outline), accent (coral)
- All buttons: 8-12px rounded corners, flat design
- Hover: Subtle color shift
- States: Default, hover, active, disabled

**Input**
- Border: `#B2BEC3`
- Focus: Purple border `#6C5CE7`
- Consistent padding, rounded corners

**Badge**
- Small labels for categories/tags
- Flat design, rounded
- Color-coded by type

**Card**
- Base container component
- 12px corners, subtle border
- No shadows (flat aesthetic)

### Molecular Components (molecules/)

**APICard**
- Shows: API name, provider logo, category badges, pricing snippet, description
- Hover state: Border color changes to purple
- Click: Navigate to API detail page

**CodeSnippet**
- Syntax-highlighted code block
- Language selector tabs (Python, JavaScript, cURL)
- Copy button with feedback ("Copied!")
- Dark theme for code area

**SearchBar**
- Input with search icon
- Filters dropdown (category, provider, price range)
- Real-time filtering

**PricingCard**
- Plan name, price, features list
- CTA button
- Popular plan highlighted with coral accent

**StatsCard**
- Dashboard metric display
- Large number, label, trend indicator
- Icon for visual interest

### Organism Components (organisms/)

**Header**
- Logo, main navigation (Home, Marketplace, Pricing, Docs)
- User menu / login button
- Sticky on scroll
- Responsive: Hamburger menu on mobile

**Footer**
- Company links, social media, newsletter signup
- Multi-column layout on desktop, stacked on mobile

**APIGrid**
- Grid of API cards
- Integrates with search/filter
- Pagination
- Active filter chips (removable)

**UsageDashboard**
- Usage charts (line chart for daily usage, bar chart for costs)
- Recent API calls table
- Current plan information
- API key management section

**APIPlayground**
- Interactive code editor
- Parameter input form
- "Try it" button → Shows mock JSON response
- Copy functionality

**Hero**
- Landing page hero section
- Headline, subheadline, CTA buttons
- Animated background using brand colors

## Data Flow & State Management

### Mock Data Structure

**mockAPIs.js** - 30-50 AI model objects:
```javascript
{
  id: "gpt-4",
  name: "GPT-4",
  provider: "OpenAI",
  category: ["Chat", "Text Generation"],
  description: "Most capable GPT model for complex tasks",
  pricing: {
    input: 0.03,
    output: 0.06,
    unit: "per 1k tokens"
  },
  features: ["128k context", "Function calling", "JSON mode"],
  contextWindow: "128k tokens",
  popular: true,
  new: false,
  documentation: "...",
  examples: [...]
}
```

Models to include:
- Chat: GPT-4, Claude Sonnet, Gemini Pro, Llama 3
- Image: DALL-E 3, Stable Diffusion, Midjourney API
- Video: Sora, Runway Gen-2
- Audio: Whisper, ElevenLabs
- Other: Embeddings, moderation models

**mockUser.js** - User dashboard data:
```javascript
{
  apiKey: "sk-mock-abc123...",
  email: "user@example.com",
  plan: "Pro",
  usage: {
    currentMonth: {
      calls: 15420,
      tokens: 2300000,
      cost: 127.50
    },
    history: [...] // 30 days of usage data for charts
  },
  recentCalls: [
    {
      timestamp: "2026-03-09T10:30:00",
      endpoint: "gpt-4",
      status: 200,
      latency: 245,
      tokens: 150
    },
    ...
  ]
}
```

### Context Providers

**AuthContext**
- State: `isLoggedIn`, `user`, `login()`, `logout()`
- Mock login: Just toggles state, no real authentication
- Persists to localStorage for demo persistence
- Protects dashboard route

**APIContext**
- State: `apis` (all mock APIs), `selectedAPI`, `filters`
- Functions: `searchAPIs()`, `filterByCategory()`, `sortAPIs()`
- All operations on local mock data (no async)

### Data Flow
1. App loads → Contexts initialize with mock data
2. User searches → Filter function runs on mock array → Re-render grid
3. Click API card → Navigate to `/api/:id` → APIDetail reads from context
4. Dashboard → Reads mock usage from AuthContext → Renders charts
5. Mock login → Toggle AuthContext → Show/hide protected routes

**No loading states needed** - All data is local and instant (can add fake spinners for realism if desired)

## User Experience & Interactions

### Interactive Features

**Search & Filter**
- Real-time search (filters as you type)
- Multi-select category filters
- Provider filter (checkboxes)
- Price range slider
- Sort options: Popular, Newest, Price (Low/High)
- Instant results update with smooth transitions

**API Playground**
- Syntax-highlighted code editor
- Language tabs: Python, JavaScript, cURL
- Editable parameters
- "Try it" button → Animated mock JSON response
- Copy to clipboard with visual feedback

**Dashboard Interactions**
- Interactive charts with hover tooltips
- Date range selector (7/30/90 days)
- "Generate API Key" button → Creates mock key
- Recent calls table with expandable rows
- Copy API key with one click

### Animations & Transitions
- Page transitions: 200ms fade-in
- Card hovers: Border color change (100ms)
- Button clicks: Quick scale (0.95x)
- Search results: Staggered fade-in
- Keep all animations fast and subtle

### Responsive Design

**Breakpoints:**
- Mobile: < 640px (single column, hamburger menu, stacked layout)
- Tablet: 640-1024px (2-column grid, collapsible filters)
- Desktop: > 1024px (3-column grid, persistent sidebar)

**Mobile Optimizations:**
- Hamburger menu for navigation
- Collapsible filter sidebar
- Simplified dashboard charts
- Touch-friendly button sizes (min 44px height)

### Accessibility
- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus indicators
- Color contrast meets WCAG AA standards

## Pages & Content

### Home Page
**Sections:**
1. **Hero**: "One API for 500+ AI Models" headline, CTA buttons, animated background
2. **Features Grid**: 4 benefits (Single API, Cost Savings, 99.9% Uptime, Easy Integration)
3. **Popular APIs Carousel**: Top 8 models with cards
4. **Pricing Preview**: Quick 3-plan comparison
5. **Code Example**: Live snippet showing integration simplicity
6. **Footer**: Links, social, newsletter

### Marketplace Page
**Layout:**
- Top: Search bar with sort dropdown
- Left sidebar (desktop): Category filters, provider checkboxes, price slider
- Main area: Grid of API cards (12 per page)
- Bottom: Pagination controls
- Active filter chips (removable with X)

### API Detail Page
**Layout:**
- Header: Name, provider logo, badges, "Add to Dashboard" CTA
- Tabs: Overview | Pricing | Documentation | Examples
- **Overview Tab**: Description, features list, capabilities
- **Pricing Tab**: Detailed pricing table, volume discounts
- **Documentation Tab**: API reference, parameters
- **Examples Tab**: Multi-language code samples
- API Playground section
- Related APIs at bottom

### Pricing Page
**Content:**
- 3-plan comparison table (Free, Pro, Enterprise)
- Feature checklists
- Volume discount calculator widget
- FAQ accordion
- CTA buttons for each plan

### Documentation Page
**Layout:**
- Left sidebar: Table of contents (Getting Started, Auth, API Reference, SDKs, Examples)
- Main content: Markdown-style docs with code blocks
- Right sidebar: "On this page" quick navigation
- Top: Search bar

### Dashboard Page
**Sections:**
1. **Stats Row**: API calls, tokens used, cost, remaining quota
2. **Usage Chart**: Line graph showing daily usage over selected period
3. **API Keys**: Generate/revoke, copy to clipboard
4. **Recent Calls Table**: Timestamp, endpoint, status, latency, expandable for details
5. **Current Plan Card**: Plan info, upgrade CTA

### Login/Signup Page
**Layout:**
- Split screen: Form (left) | Benefits/testimonials (right)
- Email/password inputs
- "Remember me" checkbox
- Social login buttons (mock)
- Toggle between login/signup modes
- Password visibility toggle

## Development Approach

**Phase 1: Setup & Foundation**
1. Initialize Vite + React project
2. Configure Tailwind with custom colors
3. Set up React Router
4. Create base Layout component

**Phase 2: Atomic Components**
- Build Button, Input, Badge, Card
- Test with Storybook (optional) or in isolation
- Ensure design system compliance

**Phase 3: Molecular Components**
- APICard, CodeSnippet, SearchBar, PricingCard, StatsCard
- Compose from atomic components

**Phase 4: Mock Data & Context**
- Create mockAPIs.js and mockUser.js
- Implement AuthContext and APIContext
- Wire up state management

**Phase 5: Organism Components & Pages**
- Build Header, Footer, APIGrid, UsageDashboard
- Assemble pages from components
- Implement routing

**Phase 6: Interactive Features**
- Search/filter logic
- API Playground
- Dashboard charts
- Copy-to-clipboard

**Phase 7: Polish & Responsive**
- Add animations
- Mobile responsiveness
- Accessibility audit
- Cross-browser testing

## Success Criteria

1. ✅ All 7 pages implemented and functional
2. ✅ Design system consistently applied (colors, corners, flat style)
3. ✅ Full interactivity: search, filters, playground, dashboard
4. ✅ Responsive on mobile, tablet, desktop
5. ✅ Smooth animations and transitions
6. ✅ Mock authentication flow works
7. ✅ Code is component-driven and maintainable
8. ✅ Matches APIMart.ai's feature set and aesthetic

## Out of Scope

- Real backend/API integration
- Actual payment processing
- User registration/authentication
- Database persistence
- Real API proxying
- Admin panel
- Analytics tracking
- Email notifications

## Notes

- This is a showcase/portfolio project demonstrating UI/UX skills
- All data is static/mocked - no external API calls
- Focus on visual polish and user experience
- Component reusability and clean code structure
