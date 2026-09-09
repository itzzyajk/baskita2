# Design Direction

## Design Inspiration URL

Fallback Reference: *Tactile 2D Origami Papercraft & Malaysian Transit Aesthetic* (Selected by learner: Option A).

## What We Borrow

- **Geometric Facets:** 45° and 90° crisp paper folds with vector precision and soft directional drop shadows (`box-shadow: 2px 3px 0px rgba(38, 70, 83, 0.16)`).
- **Physical Paper Metaphors:** Sticky notes (`origami-memo-yellow`, `origami-memo-teal`, `origami-memo-terracotta`), dog-eared card corners, and folded paper airplanes for status dispatch.
- **Color Mood:** Warm Craft Paper (`#FAF8F5`), Canary Fold Yellow (`#F4D06F`), Terracotta Red (`#E76F51`), Paper Crease Teal (`#2A9D8F`), and Deep Slate (`#264653`).
- **Typography & Ergonomics:** High-contrast sans-serif with monospace telemetry data and $\ge 64\text{px}$ driver touch targets.

## What We Do Not Copy

- No generic SaaS glossy glassmorphism, 3D claymorphism, or blurred gradient blobs.
- No low-contrast light gray text on white backgrounds (strictly high contrast for vehicle dashboard visibility).
- No distracting full-screen animations that impede rapid driver checklist operation.
- No fake external corporate logos or stock photography.

## Visual Mood

Tactile, geometric, high-contrast, responsive, and protective.

## Layout Rules

- **Header / Role Navigation:** Sticky top tactical bar switching between Parent Tracker, Student Lounge (Wait Zone), Driver Cockpit, Billing Hub, Admin Radar, and Registration.
- **Parent Tracker View:** Top ETA banner, 2D vector map (20 km radius circle around TTDI Jaya), bottom timeline drawer, and digital bus pass with QR code.
- **Student Lounge ("Wait Zone"):** Sticky persistent ETA HUD, age-adaptive mode toggle (Junior Kip vs. Senior Rex), and responsive HTML5 Canvas game viewport.
- **Driver Cockpit View:** Portrait dock layout optimized for mobile dashboard holders; prominent next-stop card with large $\ge 64\text{px}$ single-tap buttons (`[Naik Bas]`, `[Cuti]`, `[+1 Minit]`).
- **Billing Hub View:** Subscription tier cards (RM 90, RM 160, RM 280), searchable invoice ledger, FPX bank selection modal, and printable origami papercraft receipt.

## Color / Contrast Rules

- **Canvas & Backgrounds:** Warm Craft Paper (`#FAF8F5`), Sheet Neutral (`#F4F0EA`), Card Paper (`#FFFFFF`).
- **Primary Text:** Deep Slate (`#264653`) and Slate Dark (`#1E293B`) ensuring a minimum WCAG AA contrast ratio of $> 7:1$.
- **High-Visibility Accents:**
  - Canary Fold Yellow (`#F4D06F`): Badges, bus markers, primary CTA buttons.
  - Terracotta Red (`#E76F51`): Urgent alerts, delay tags, Federal Highway crease.
  - Paper Crease Teal (`#2A9D8F`): Safe status indicators, boarding confirmations, secondary highlights.
- **Crease Strokes:** Muted Crease Gray (`#E2DCD5`, `#DDD6CE`) for dashed fold lines.

## Typography Feel

- **Primary Headings & Body:** System Sans-Serif / Geist Sans (`font-black` / `font-bold` headings with tight letter-spacing for sharp readability).
- **Telemetry & Timings:** Monospaced (`font-mono`) for vehicle speed (km/h), headings (°), clock times (`06:38 AM`), and invoice reference codes.
- **Anti-Fatigue Rule:** Zero unreadable muted text; secondary captions maintain dark neutral grays (`#475569`).

## Component Style

- **Buttons:** Tactile paper buttons with crisp 1.5px slate borders and solid offset drop shadows (`2px 2px 0px #264653`). Active click state translates `(2px, 2px)` with shadow collapse.
- **Cards:** White card paper with dog-eared folded top-right corners (`.origami-folded-corner`).
- **Driver Touch Targets:** All primary driver action buttons strictly enforce a minimum height of $64\text{px}$ (`min-h-[64px]`).
- **Modals:** Slide in along geometric fold crease vectors with backdrop blur.

## Mobile Rules

- Stack all sidebars below the primary action on screens $< 1024\text{px}$.
- Map height maintains minimum $380\text{px}$ on mobile.
- Driver manifest buttons arrange into full-width tap targets or multi-column grids operable with single thumb taps.

## Accessibility Basics

- High-contrast text throughout (strictly adhering to learner priority: no unreadable text).
- Visible focus rings and active states on all buttons and inputs.
- Audio alerts accompanied by visual banners (dual visual + audible notification for both deaf and busy users).
- Minimum tap targets $\ge 48\text{px}$ across the entire app; $\ge 64\text{px}$ for in-vehicle driver actions.

## Anti-Slop Rules

- No fake logos or copied brand marks.
- No placeholder "lorem ipsum" text in any view.
- Real local geographical data (TTDI Jaya, Seksyen U2, Bukit Jelutong, Seksyen 13, SK TTDI Jaya, SMK TTDI Jaya).
- Zero non-functional decorative buttons.

## Design Verification Checklist

- [x] The first screen matches the tactile origami papercraft mood.
- [x] The layout directly supports the parent and driver user goals.
- [x] Mobile and dashboard dock widths are fully readable with large tap targets.
- [x] High-contrast text avoids all washed-out pastels or unreadable fonts.
- [x] Avoids generic AI decoration and clones no external brand.
