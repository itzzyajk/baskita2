# Build Blueprint

## Source Files

- `project-brief.md`
- `architecture.md`
- `design.md`
- `build-status.md`

## Project Identity

- **Name:** BasKita
- **Tagline:** Origami 2D School Bus Fleet Platform
- **Location Scope:** TTDI Jaya, Seksyen U2, Shah Alam, Selangor (20 km operational radius)
- **Primary Users:** Parents (monitoring arrival and dispatching curbside updates) and Van Drivers (distraction-free sequential stop manifest execution).
- **Secondary Users:** Students (wait-zone companion lounge) and Fleet Admins (billing and route oversight).

## Build Shape

- **Confirmed Shape:** Browser-local tool
- **Characteristics:** Client-side reactive state management, cross-tab synchronization via `BroadcastChannel`, browser `localStorage` persistence, simulated 40 km/h telematics, native Web Audio and Web Speech synthesis, zero external backend/database/IoT dongle requirement.

## Version-One Promise

A cohesive, end-to-end parent-driver synchronization loop in the browser:
1. A parent tracks their child's school bus progressing along the TTDI Jaya route with real-time ETA countdowns.
2. The parent dispatches a quick status note (*"Lewat 2 Minit"* or *"Cuti Hari Ini"*).
3. The driver's cockpit updates reactively across browser tabs, displaying an amber delay buffer and speaking a clear voice announcement via Web Speech API.
4. The driver taps a large ($\ge 64\text{px}$) touch target to record boarding or absence, immediately updating the manifest and recalculating downstream stop arrivals.

## Scope Lock

### Now

- Flat origami vector visual identity (`#FAF8F5`, `#F4D06F`, `#E76F51`, `#2A9D8F`, `#264653`).
- TTDI Jaya 20 km coverage vector map with rotating bus heading and stop markers.
- Parent Live Tracker with sequenced stop timeline drawer, digital QR pass, and paper airplane dispatch modal.
- Driver Cockpit with $\ge 64\text{px}$ tactile single-tap buttons, delay buffer handling, and Web Speech voice alerts.
- Student Lounge wait-zone with Kip & Rex companion guides and 4 interactive canvas mini-games with $\le 2$ min auto-pause HUD.
- Billing Hub featuring monthly tiers, simulated FPX payment flow, and printable origami receipts.
- Browser-local state store backed by `localStorage` and `BroadcastChannel('baskita_bus_sync')`.

### Later

- Multi-device WebSocket synchronization via Supabase Realtime.
- Production FPX payment gateway webhooks (Billplz / ToyyibPay).
- Cloud automated SMS / WhatsApp Business API dispatch.
- Multi-van GPS hardware feed integration.

### Never

- Mandatory physical OBD-II telematics hardware dongles for v1.
- Live credit card transactions or merchant banking contracts in prototype.
- Complex multi-tenant cloud authentication infrastructure.
- Generic low-contrast SaaS styling or unreadable dashboard typography.

## Architecture Summary

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript.
- **Styling:** Tailwind CSS with custom tactile origami theme tokens, 45°/90° geometric facets, and solid offset drop shadows.
- **Map & Canvas:** MapLibre GL for 2D vector transit mapping + HTML5 Canvas API for student mini-games.
- **Audio & Speech:** Native Web Audio API synthesizer for tactile sounds and Web Speech API (`SpeechSynthesisUtterance`) for hands-free driver announcements.
- **Hosting & Source:** GitHub (`itzzyajk/baskita2`) + Vercel.

## Data / State / Storage Rules

- **Entity Model:** Defined in `src/types/index.ts` (`Student`, `BusStop`, `Route`, `Vehicle`, `Invoice`).
- **Store Architecture:** Centralized in `src/store/busState.ts`.
- **Local Persistence Key:** `localStorage.getItem('baskita_manifest_state_v1')`.
- **Cross-Tab Synchronization:** `new BroadcastChannel('baskita_bus_sync')` broadcasts status dispatch and boarding mutations across tabs without page reloads.
- **Simulation Loop:** 1-second interval loop driving vehicle coordinates, speed, heading, and ETA countdowns.
- **Reset Capability:** One-tap restore to initial seed data for demonstration predictability.

## Design Direction Summary

- **Inspiration:** Tactile 2D Origami Papercraft & Malaysian Transit Aesthetic (Option A).
- **What We Borrow:**
  - Crisp 45° and 90° paper fold facets with solid offset drop shadows (`2px 2px 0px #264653`).
  - Physical paper metaphors: dog-eared card corners, colored memo notes, and folded paper airplanes.
  - Malaysian transit palette: Canary Yellow (`#F4D06F`), Terracotta Red (`#E76F51`), Crease Teal (`#2A9D8F`), Deep Slate (`#264653`), Warm Craft Paper (`#FAF8F5`).
  - Monospaced telemetry typography and high-contrast text ($> 7:1$ contrast ratio).
- **What We Do Not Copy:**
  - No glossy SaaS glassmorphism or muddy gradient blobs.
  - No low-contrast light gray typography that becomes unreadable on vehicle dashboards.
  - No distracting decorative animations that slow down driver operation.
  - No fake external corporate logos or stock photography.

## Implementation Rules

1. **High Contrast Rule:** All body and header text must strictly satisfy WCAG AA ($> 7:1$ contrast). Never use low-contrast pastels for text.
2. **Driver Ergonomics Rule:** Every driver-facing manifest action button must enforce `min-h-[64px]` for thumb operation on vehicle docks.
3. **Safety Interruption Rule:** In the Student Lounge, games must automatically pause and sound an alert when the bus ETA reaches $\le 2$ minutes.
4. **Resilience Rule:** Audio and speech synthesis must degrade silently without crashing if browser autoplay policies block initial execution before user gesture.
5. **Zero External API Blocker:** All simulation data (routes, stops, students) must operate offline and browser-local.

## File and Folder Expectations

```text
src/
├── app/
│   ├── layout.tsx         # Root layout with PWA meta & theme fonts
│   ├── globals.css        # Origami paper theme variables, folds, shadows
│   └── page.tsx           # Tactical role switcher container
├── components/
│   ├── common/            # RoleSwitcher, OrigamiIcons, PaperAirplaneModal, SoundEffects
│   ├── companions/        # Kip the Kancil & Rex the Helang SVG vectors
│   ├── map/               # OrigamiMap (MapLibre GL 2D vector styling)
│   ├── parent/            # ParentTracker, BottomSheetDrawer, DigitalBusPass
│   ├── student/           # StudentLounge, PaperBusRunner, RouteFoldPuzzle, TransitDrift, TransitTrivia
│   ├── driver/            # DriverCockpit (portrait dock manifest)
│   ├── billing/           # BillingHub, FPX Modal, ReceiptGenerator
│   ├── admin/             # AdminDashboard (20 km fleet radar)
│   └── registration/      # RegistrationWizard
├── data/                  # Seed datasets (fleet, routes, schools, students, invoices)
├── store/                 # busState.ts (central store & BroadcastChannel sync)
└── types/                 # index.ts (TypeScript data models)
```

## Work Card Plan

- **Work Card 01: Setup & Core Manifest State Sync Engine**
  - Implement and verify `busState.ts`, data types, `localStorage` persistence, and `BroadcastChannel` cross-tab synchronization.
- **Work Card 02: Tactile Origami Design System & Navigation Shell**
  - Implement global papercraft styling, tactile buttons, role switcher bar, and modal wrappers.
- **Work Card 03: Parent Live Tracker & Curbside Dispatcher**
  - Implement live vehicle telematics tracking, sequenced timeline drawer, digital QR pass, and paper airplane delay/absence dispatcher.
- **Work Card 04: Driver Cockpit & Voice Announcement System**
  - Implement $\ge 64\text{px}$ touch target manifest checklist, delay buffer banner, and Web Speech API automated voice announcements.
- **Work Card 05: Student Lounge & Curbside Alert System**
  - Implement age-adaptive wait zone with Kip & Rex, 4 canvas mini-games, and the $\le 2\text{ min}$ auto-pause curbside reminder HUD.
- **Work Card 06: Billing Hub & Simulated FPX Checkout**
  - Implement subscription tiers, FPX banking simulation modal, and printable origami papercraft receipt.
- **Work Card 07: Admin 20 km Fleet Radar & Verification Loop**
  - Implement admin radar view, emergency broadcast banner, and comprehensive end-to-end verification.

## Review Mirror

Before marking the build ready for final deployment, audit against:
- [ ] Does the parent delay dispatch immediately appear on the driver's manifest across separate browser tabs?
- [ ] Does the driver cockpit pronounce voice announcements when updates arrive?
- [ ] Are all driver action buttons at least $64\text{px}$ high?
- [ ] Does text contrast pass high-contrast readability standards?
- [ ] Do mini-games auto-pause when ETA drops to 2 minutes or less?
- [ ] Does `npm run build` execute with zero errors?

## Proof Ladder

1. **Step 1:** Open Parent Tracker in Tab A and Driver Cockpit in Tab B.
2. **Step 2:** Observe 40 km/h simulated bus progressing along the TTDI Jaya route.
3. **Step 3:** In Tab A, submit *"Lewat 2 Minit"* for student Adam Zikri via Paper Airplane modal.
4. **Step 4:** Verify Tab B immediately displays `⏱️ Buffer: +120s` and triggers voice announcement: *"Perhatian pemandu: Adam Zikri lewat 2 minit di hentian Surau Al-Ittihad."*.
5. **Step 5:** In Tab B, tap `[Naik Bas]` on the $64\text{px}$ button; verify Tab A updates Adam's status to `Boarded`.

## 60-Second Explanation Template

"BasKita is a tactile 2D origami-styled school bus fleet platform for TTDI Jaya. It solves curbside school transit chaos by giving parents live vehicle tracking and a 1-tap paper airplane dispatcher to inform drivers of delays or absences without frantic phone calls. For drivers, it provides a high-contrast, distraction-free dashboard dock checklist with 64px tap targets and automated voice alerts. Everything runs client-side with instant cross-tab synchronization and zero hardware dependencies."

## Guardrails for the Coding Agent

- Read `build-status.md`, `build-blueprint.md`, and the current work card before editing.
- Implement only the current work card; do not jump ahead.
- Stop after verification and update `build-status.md` after each work card.
- Do not add backend/auth/database/API unless the blueprint explicitly allows it.
- Do not add secrets or keys to code.
- Do not invent claims, testimonials, logos, or real numbers.
- Apply the guardrails for the confirmed build shape (Browser-local tool).
- If a legacy file uses `Build Mode`, treat it as `Build Shape` without stopping.
