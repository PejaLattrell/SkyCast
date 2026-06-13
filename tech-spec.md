# SkyCast — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | React DOM renderer |
| react-router | ^7.0.0 | Client-side routing (3 modules as routes) |
| zustand | ^5.0.0 | Lightweight global state (active tab, weather data, unit toggle) |
| framer-motion | ^12.0.0 | Declarative animations (tab transitions, card expand/collapse, hero reveals) |
| tailwindcss | ^4.0.0 | Utility-first CSS |
| @tailwindcss/vite | ^4.0.0 | Tailwind Vite integration |
| typescript | ^5.6.0 | Type safety |
| vite | ^6.0.0 | Build tool |
| @vitejs/plugin-react | ^4.0.0 | React Vite plugin |
| @types/react | ^19.0.0 | React type definitions |
| @types/react-dom | ^19.0.0 | ReactDOM type definitions |

**Fonts**: Inter loaded via Google Fonts `<link>` in `index.html` with `display=swap`. No npm font packages.

**No shadcn/ui** — the design specifies a fully custom organic aesthetic; standard shadcn primitives would require more override work than building custom components.

**No charting library** — the temperature trend SVG chart and precipitation bars are simple enough to build as custom SVG components with native hover/tooltip handling.

**No icon library** — all 14 weather icons are custom inline SVGs per design spec.

---

## Component Inventory

### Layout

| Component | Source | Reuse |
|-----------|--------|-------|
| **NavigationBar** | Custom | All 3 routes — fixed top bar with tab toggle and wordmark |
| **Footer** | Custom | All 3 routes — shared footer with links |
| **GlassPanel** | Custom | Extensively reused across all modules — core glassmorphic container |
| **WeatherConditionPill** | Custom | Inline weather indicators (featured cities, hourly cards) |
| **TemperatureDisplay** | Custom | Live Weather and Forecast modules — large temperature with unit toggle |

### Page: Explore (Homepage)

| Component | Source | Notes |
|-----------|--------|-------|
| **HeroSection** | Custom | Full-viewport with video bg, blur-to-focus text reveal, parallax |
| **FeaturedCitiesStrip** | Custom | Horizontal drag-scroll strip of city weather cards |
| **FeaturesShowcase** | Custom | 3-column feature cards with hover lift |
| **WeatherMapPreview** | Custom | Decorative animated SVG/CSS map (no interactivity) |
| **TestimonialsSection** | Custom | 3-column testimonial cards |
| **CTABanner** | Custom | Gradient bg with floating decorative circles |

### Page: Live Weather

| Component | Source | Notes |
|-----------|--------|-------|
| **CurrentConditionsPanel** | Custom | Dynamic gradient bg (condition-based), 2-col layout, 2x3 data grid |
| **HourlyForecastStrip** | Custom | Horizontal scroll, compact glass cards |
| **DailyHighlights** | Custom | Sunrise/sunset arc + AQI gauge + precipitation bars |
| **SevereWeatherAlert** | Custom | Conditionally rendered amber banner |

### Page: Forecast

| Component | Source | Notes |
|-----------|--------|-------|
| **WeeklyOverview** | Custom | 7 stacked day cards with expandable hourly detail (Framer Motion layoutId) |
| **TemperatureTrendChart** | Custom | SVG cubic-bezier line chart with hover tooltips |
| **PrecipitationForecast** | Custom | 7-day stacked bar chart (rain/snow/mixed) |
| **WindUvPanel** | Custom | 2-column: compass rose + UV semi-circular gauge |
| **MoonPhase** | Custom | CSS-masked moon with phase rendering |

---

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| Tab module switch (fade + translateY) | Framer Motion | `AnimatePresence` wrapping route outlet, `motion.div` with exit/enter variants | Medium |
| Active tab pill slide indicator | Framer Motion | `layoutId` on a pseudo-element that morphs between tab positions | Low |
| Hero blur-to-focus text reveal | Framer Motion | `motion.h1` with `filter: blur()` and `opacity` animated via variants with staggerChildren | Low |
| Scroll indicator bounce | CSS | `@keyframes` translateY oscillation, 2s ease-in-out infinite | Low |
| Weather icon animations (all 7 types) | CSS | Per-condition `@keyframes` — rotation, float, dashoffset, fall, flash, blur-pulse, combined | Medium |
| Glass panel hover lift | CSS | `transition` on transform + box-shadow, no library needed | Low |
| Featured cities drag-scroll | Framer Motion | `drag="x"` with `dragConstraints` and `dragElastic` on container | Low |
| Feature cards hover lift | CSS | `transition` translateY(-6px) + shadow change | Low |
| Weather map decorative swirls | CSS | `@keyframes` rotate on radial-gradient pseudo-elements, pulsing city dots | Low |
| CTA floating circles | CSS | Multiple `@keyframes` with independent translateX/Y oscillations | Low |
| Live Weather dynamic bg transition | Framer Motion | `animate` prop on container with condition-driven gradient values, 800ms | Medium |
| Sunrise/sunset arc + sun dot | SVG + CSS | SVG path for arc, positioned dot along arc via CSS (no animation, static position) | Low |
| AQI bar gauge marker | CSS | Absolutely positioned dot on gradient track | Low |
| **Forecast day card expand/collapse** | Framer Motion | `AnimatePresence` + `motion.div` with `layout` prop animating height from 64px to auto; chevron rotate via `animate={{ rotate }}` | 🔒 High |
| Temperature trend SVG chart | Native SVG + React state | Cubic-bezier path manually computed, hover detection via SVG `onMouseMove` + `getBoundingClientRect`, tooltip positioned absolutely | Medium |
| Precipitation bar hover | CSS + React state | CSS opacity transition + React state for tooltip content/position | Low |
| Wind compass arrow | CSS | Static rotation via `transform: rotate(deg)`, subtle pulse via `@keyframes` scale | Low |
| UV gauge needle | CSS | `transform: rotate()` to calculated angle based on UV value | Low |
| Moon phase CSS mask | CSS | `mask-image` radial-gradient or `clip-path` to reveal crescent based on illumination percentage | Medium |
| Skeleton shimmer loading | CSS | `background: linear-gradient(...)` with `background-size: 200% 100%` + `@keyframes` position shift | Low |
| Mobile bottom tab bar | Framer Motion | `layoutId` for active indicator slide (same pattern as desktop nav) | Low |

---

## State & Logic Plan

### Zustand Store: `useWeatherStore`

```
activeTab: 'explore' | 'live' | 'forecast'
unit: 'C' | 'F'
weatherData: WeatherData | null
loading: boolean
location: string

setActiveTab(tab)
setUnit(unit)
setWeatherData(data)
setLoading(bool)
setLocation(location)
```

### React Context: `WeatherConditionContext`

Provides the current dominant condition string to all descendants. Used by:
- `CurrentConditionsPanel` → selects gradient bg
- `Forecast` weekly overview → same gradient logic
- `NavigationBar` → no dependency (transparent glass always)
- All weather icon components → select icon variant + animation

**Why Context over store?** The condition is derived data (from `weatherData.current.condition`), not independent state. Using Context avoids duplicating the condition in the store and ensures derived updates propagate through the tree without manual subscription.

### Temperature Conversion Logic

Pure utility functions (not in store):
- `toFahrenheit(celsius: number): number`
- `formatTemp(value: number, unit: 'C' | 'F'): string`

All API data stored in Celsius; display converts on render based on `useWeatherStore.unit`.

### Forecast Day Card Expand Logic

Local state (not global) — `expandedDayIndex: number | null` in `WeeklyOverview` component. Only one day expanded at a time; clicking a day toggles it and collapses any other.

### SVG Chart Math (Temperature Trend)

Manual cubic-bezier path calculation in a utility:
- Map 7 data points to SVG coordinate space (padding for axes, scale from temp range to pixel height)
- Generate SVG path `d` attribute with control points for smooth curves
- Hover detection: invisible overlay rects per data point segment, `onMouseEnter` sets tooltip state with point data

---

## Other Key Decisions

### Routing Strategy

React Router v7 with 3 route definitions (`/`, `/live`, `/forecast`). The `NavigationBar` tab buttons are `<Link>` components that navigate between routes. The active tab is derived from the current route path, kept in sync via `useLocation` (not a separate store value).

### Video Background

Hero background video is a `<video autoPlay loop muted playsInline>` element with a `<source>` pointing to a local MP4 asset. The design's gradient overlay is a separate positioned `<div>` above the video. No library needed.

### API Integration Pattern

Single `fetchWeather(location: string)` async function that queries OpenWeatherMap (or similar) and normalizes the response into the app's `WeatherData` type. Called on:
- Initial mount of Live Weather / Forecast routes
- Location search (input not in design but implied by city data needs)
- Periodic refresh (setInterval, 10 minutes)

All API calls isolated in a `lib/weather-api.ts` module; no tRPC or backend server needed.

### Responsive Breakpoints

Tailwind breakpoints used throughout:
- Desktop: `lg:` (1024px+) — the design targets 1200px+ for 3-column layouts
- Tablet: `md:` (768px–1023px) — 2-column grids
- Mobile: default (<768px) — single column, bottom tab bar

The NavigationBar renders desktop tabs (top) on `md+` and the mobile bottom tab bar on `<md`.
