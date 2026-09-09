# Architecture

## Build Shape

Browser-local tool

## Stack Decision

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS with tactile origami paper theme extensions
- **Mapping Engine:** MapLibre GL with flat 2D vector styling (`#FAF8F5` background, Federal Highway red crease)
- **Audio & Haptics:** Native Web Audio API synthesizer (friction fold, chime, bus horn) + Web Speech API (`SpeechSynthesisUtterance`)
- **Graphics & Mini-Games:** HTML5 Canvas API (Paper Bus Runner, Transit Drift)
- **Deployment:** Vercel + GitHub (`itzzyajk`)

## Structure Overview

The application is structured into four primary interactive views coordinated by a shared tactical state store:
1. **Parent Live Tracker:** Live map rendering, bottom timeline drawer, digital boarding pass, and Paper Airplane one-tap status dispatcher.
2. **Student Lounge ("Wait Zone"):** Junior (Kip the Kancil) vs. Senior (Rex the Helang) modes with 4 mini-games and a persistent sticky ETA HUD that auto-pauses at $\le 2$ min.
3. **Driver Cockpit:** Distraction-free sequential manifest with $\ge 64\text{px}$ touch targets (`[Boarded]`, `[Absent]`, `[+1 Min Wait]`) and automated voice announcements.
4. **Billing Hub:** Subscription tier management, FPX online banking simulation with instant payment reconciliation, and downloadable origami-styled receipts.

## Component Map

```text
src/
├── app/
│   ├── layout.tsx         # Global PWA layout, viewport, metadata, fonts
│   ├── globals.css        # Origami paper theme variables, card folds, drop shadows
│   └── page.tsx           # Role switcher shell and persistent telematics loop
├── components/
│   ├── common/
│   │   ├── RoleSwitcher.tsx         # Top navigation tabs (Parent, Student, Driver, Billing, Admin)
│   │   ├── OrigamiIcons.tsx         # Folded bus, schoolhouse, paper airplane & animal avatars
│   │   ├── PaperAirplaneModal.tsx   # Parent one-tap dispatcher modal
│   │   └── SoundEffects.ts          # Web Audio & Web Speech API synthesis
│   ├── companions/
│   │   └── OrigamiCompanions.tsx    # Kip the Kancil & Rex the Helang SVG vectors & speech bubbles
│   ├── map/
│   │   └── OrigamiMap.tsx           # Flat 2D MapLibre vector map with 20 km radius & bus heading
│   ├── parent/
│   │   ├── ParentTracker.tsx        # Parent live tracking dashboard
│   │   ├── BottomSheetDrawer.tsx    # Sequenced stop timeline drawer
│   │   └── DigitalBusPass.tsx       # Multi-child pass with dynamic QR code
│   ├── student/
│   │   ├── StudentLounge.tsx        # Age-adaptive wait-zone hub & ETA interruption banner
│   │   └── games/
│   │       ├── PaperBusRunner.tsx   # 3-lane vertical runner canvas
│   │       ├── RouteFoldPuzzle.tsx  # Wildlife crease memory game
│   │       ├── TransitDrift.tsx     # Roundabout time-trial drift canvas
│   │       └── TransitTrivia.tsx    # 15s timed navigation quiz
│   ├── driver/
│   │   └── DriverCockpit.tsx        # Portrait dock checklist with >= 64px targets
│   ├── billing/
│   │   └── BillingHub.tsx           # FPX payment modal, WhatsApp reminder, origami receipt
│   ├── admin/
│   │   └── AdminDashboard.tsx       # 20 km radar, route planner, payment audit trails
│   └── registration/
│       └── RegistrationWizard.tsx   # 4-step student onboarding wizard
├── data/
│   ├── fleet.ts           # Van vehicle metadata (Bas 01, Bas 04, Bas 07)
│   ├── routes.ts          # GeoJSON route coordinates & stop milestones
│   ├── schools.ts         # School locations in TTDI Jaya & Shah Alam
│   ├── students.ts        # Enrolled student roster
│   ├── circulars.ts       # Circular notices board
│   └── invoices.ts        # Subscription billing invoices
├── store/
│   └── busState.ts        # Central reactive store & BroadcastChannel sync
└── types/
    └── index.ts           # TypeScript interfaces for all entities
```

## Data / State Model

```typescript
export interface Student {
  id: string;
  name: string;
  initials: string;
  grade: string;
  ageGroup: 'junior' | 'senior';
  schoolId: string;
  schoolName: string;
  busId: string;
  routeId: string;
  session: 'morning' | 'afternoon';
  pickupStopId: string;
  pickupStopName: string;
  pickupTime: string;
  dropoffStopId: string;
  dropoffStopName: string;
  dropoffTime: string;
  status: 'waiting' | 'boarded' | 'arrived' | 'dropped_off' | 'absent';
  statusNotes?: string;
  guardianName: string;
  guardianPhone: string;
  emergencyContact: string;
  address: string;
  avatar: OrigamiAvatar;
  qrCode: string;
  subscriptionTier: 'single_leg' | 'return_trip' | 'sibling_bundle';
  monthlyFee: number;
  registeredAt: string;
  bufferSeconds?: number;
  afternoonFlag?: 'normal' | 'grandma' | 'self_pickup';
}

export interface BusStop {
  id: string;
  name: string;
  landmark: string;
  lat: number;
  lng: number;
  sequence: number;
  scheduledTime: string;
  studentIds: string[];
  type: 'pickup' | 'dropoff' | 'school';
  isCompleted: boolean;
  waitBufferSeconds?: number;
}
```

## Storage Logic

- **Primary Client State:** React custom hook store (`storeState` in `busState.ts`) providing sub-second reactivity.
- **Cross-Tab Synchronization:** HTML5 `BroadcastChannel('baskita_bus_sync')` broadcasts state changes between tabs (e.g. parent dispatching delay in tab 1 updates driver cockpit in tab 2 instantly).
- **Persistence:** Local browser state backed by `localStorage` (`baskita_manifest_state_v1`).

## User Flow

1. **Parent Tracking & Delay Dispatch:**
   - Parent loads tracker, monitors live 40 km/h van progression.
   - If child is delayed, parent taps `"Pesan Pemandu"` -> selects `"Lewat 2 Minit"`.
   - Dispatcher updates student record (`bufferSeconds: 120`) and pushes an entry to recent updates.
2. **Driver Cockpit Reaction:**
   - Manifest entry displays a prominent amber tag `⏱️ Buffer: +120s`.
   - Web Speech API synthesizes an audible alert: *"Perhatian pemandu: [Murid] lewat 2 minit di hentian [Hentian]."*.
   - When arriving, driver taps `[Boarded]` (min-h 64px) -> status changes to boarded.
   - If a student is absent, driver taps `[Cuti]` -> stop skipped and downstream ETAs recalculated.
3. **Student Lounge Safe Wait:**
   - Student plays *Paper Bus Runner* or *Transit Drift*.
   - Live sticky HUD counts down ETA.
   - At $\le 2$ minutes, game auto-pauses, plays bus horn, and displays full-screen curbside reminder.

## File Expectations

- Markdown planning files must remain intact and updated after every phase.
- App source code resides completely inside `src/`.
- Zero broken imports or external native binary requirements.

## Constraints

- Operable without physical IoT hardware dongles.
- No live banking merchant contracts (simulated FPX reconciliation).
- Distraction-free driver interface requires touch targets $\ge 64\text{px}$.

## Technical Non-Goals

- Multi-tenant cloud database authentication with email verification.
- Live credit card processing or live Stripe APIs.
- Physical OBD-II cellular vehicle telematics hardware.

## Verification Notes

- `npm run build` must compile cleanly with Next.js 14 App Router.
- Speech synthesis and Web Audio must degrade gracefully if browser permissions restrict autoplay before user interaction.
