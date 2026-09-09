# Project Brief

## Project Identity

- **Name:** BasKita
- **Tagline:** Origami 2D School Bus Fleet Platform
- **Location Scope:** TTDI Jaya, Seksyen U2, Shah Alam, Selangor (20 km operational radius)

## One-Sentence Concept

A tactile origami 2D school bus fleet tracking platform that delivers real-time simulated GPS tracking, one-tap parent status dispatching, and distraction-free driver manifest execution.

## Target User

- **Parents:** Guardians of enrolled students in TTDI Jaya requiring live vehicle tracking and quick curbside communications.
- **Drivers:** Independent school van operators needing a high-contrast, distraction-free sequential stop checklist operable on a mobile dashboard dock.
- **Secondary Users:** Students (using companion guides Kip and Rex in the wait-zone arcade) and fleet managers (auditing payments and routes).

## User Goal

- **Parents:** Verify school bus arrival ETA in real time, view digital student boarding passes, and dispatch instant notifications (*"Absent Today"*, *"Running 2 Mins Late"*).
- **Drivers:** Follow an auto-sequenced stop checklist with minimum 64px touch targets (`[Boarded]`, `[Absent]`, `[+1 Min Wait]`) and receive automated voice announcements when parents submit updates.

## Build Shape

Browser-local tool

## Shape Confirmation

Confirmed by learner. The primary value is live state manipulation, real-time parent-driver status synchronization, and operational checklist management running reliably in the browser without requiring physical vehicle hardware.

## Version-One Success

A working end-to-end parent-driver synchronization loop:
1. Parent views live 40 km/h telematics simulation along the Saujana route.
2. Parent dispatches a status update (*"Running 2 Mins Late"* or *"Absent Today"*).
3. Driver cockpit updates manifest immediately, adds delay buffer, and plays Web Speech voice announcement.
4. Driver marks student `[Boarded]` or `[Absent]`, updating downstream ETAs and the parent's live view.

## Now / Later / Never

### Now

- Flat origami vector theme (`#FAF8F5`, `#F4D06F`, `#E76F51`, `#2A9D8F`, `#264653`).
- TTDI Jaya 20 km coverage map with simulated GPS progression and rotating bus heading.
- Parent live tracker with Bottom Sheet timeline and Paper Airplane status modal.
- Distraction-free driver cockpit with $\ge 64\text{px}$ touch targets and Web Speech API alerts.
- Student Lounge wait-zone with Kip & Rex companion guides and 4 mini-games.
- Monthly subscription billing hub with FPX simulation and printable origami receipts.

### Later

- Live Supabase Realtime WebSocket sync across multiple physical remote devices.
- Production Billplz / ToyyibPay webhook endpoints for live FPX banking.
- Live Twilio / WhatsApp Business API cloud automated webhooks.

### Never

- Physical OBD-II vehicle hardware dependency for v1.
- Live credit card processing or live money transfers during the prototype stage.
- Unconstrained multi-tenant server complexity that breaks local testing stability.

## Assumptions

- Operating locally or on Vercel preview with modern browser APIs (HTML5 Canvas, Web Audio API, Web Speech API, `BroadcastChannel`).
- Standard mobile portrait dashboard orientation for driver cockpit (touch targets minimum 64px).

## Proof Target

A complete browser demonstration where a parent submits a delay/absence update and the driver's cockpit updates reactively with audio/speech feedback and manifest adjustments.

## Trainer / Learner Notes

- Project owner: `itzzyajk` (<17zzyys@gmail.com>)
- Repo target: GitHub + Vercel
- Prioritizes clean architecture, stability, and distraction-free driver safety.
