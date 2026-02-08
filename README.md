Project Tambo is a smart-residence experience built with Next.js. It combines an admin lobby, resident dashboards, AI-driven analytics, and immersive WebGL backgrounds across rooms like utilities, security, amenities, and community.

## Highlights

- Admin and resident flows with unit-aware routing and access guards.
- Tambo AI assistant with chart-only analysis responses (bar and pie charts).
- Dynamic GPU backgrounds (Galaxy, Particles, GridScan, LightPillar, ColorBends).
- LocalStorage-based profiles and utilities with a clear vacancy rule.

## Tech Stack

- Next.js 16 (App Router) + React 19
- Tambo AI SDK (@tambo-ai/react)
- Framer Motion
- WebGL: OGL, Three.js, postprocessing, @react-three/fiber
- CharlieLabs AI

## App Routes

- `/` - Admin lobby (unit directory, light-pillar background)
- `/login` - Authentication (GridScan background)
- `/dashboard?unit=###` - Resident hallway (Galaxy + Particles background)
- `/utilities?unit=###` - Utilities control (ColorBends background)
- `/security?unit=###` - Security command (ColorBends background)
- `/amenities?unit=###` - Amenities grid (ColorBends background)
- `/community?unit=###` - Community hub (ColorBends background)

## AI Assistant

- Chart components: [src/components/tambo/analytics-bar-chart.tsx](src/components/tambo/analytics-bar-chart.tsx) and [src/components/tambo/analytics-pie-chart.tsx](src/components/tambo/analytics-pie-chart.tsx)
- Component registry: [src/lib/tambo.ts](src/lib/tambo.ts)
- Assistant configuration and guidance: [src/app/providers.js](src/app/providers.js)

## Data + Vacancy Rules

- Unit credentials and profiles are stored in LocalStorage.
- A unit is considered vacant only when profile fields are empty and all utilities are zero.
- Source of truth for sample unit data: [src/lib/residence-data.js](src/lib/residence-data.js)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a .env.local file in the project root:

```dotenv
NEXT_PUBLIC_TAMBO_API_KEY=your_key_here
```

## Default Credentials

- Admin: `admin` / `Admin@123`
- Residents:
	- `unit101` / `Unit@101`
	- `unit102` / `Unit@102`
	- `unit201` / `Unit@201`
	- `unit202` / `Unit@202`
	- `unit301` / `Unit@301`
	- `unit302` / `Unit@302`
	- `unit401` / `Unit@401`
	- `unit402` / `Unit@402`
	- `unit501` / `Unit@501`
	- `unit502` / `Unit@502`

Credentials are defined in [src/lib/auth.js](src/lib/auth.js).

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## Known Limitations & Future Improvements

- Chatbot UI Flicker
A brief white flicker may appear in the chatbot panel when transitioning from the dashboard to subrooms.
Cause: Component re-mounting during route transitions with dynamic AI rendering.
Planned improvement: Persistent layout mounting and smoother transition states.

- AI Data Synchronization Delay
When a new unit or user is added via the AI assistant, the frontend updates immediately, but AI analysis may reflect updated data only after a page refresh.
Cause: AI tools currently operate on a stored data snapshot rather than a reactive data source.
Planned improvement: Real-time state or backend integration for instant analytical updates.

- Swipe Navigation Edge Cases
In certain subrooms, back or forward swipe gestures may navigate to unintended routes (e.g., login instead of dashboard).
Cause: Browser history gestures conflicting with custom spatial navigation logic.
Planned improvement: Fully controlled in-app gesture routing with disabled browser-level navigation.

## Notes

- Background effects are client-side components in [src/components](src/components).
- Room pages are client components that enforce unit access via URL query checks.
