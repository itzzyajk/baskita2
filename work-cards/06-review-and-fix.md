# Work Card 06 — Review Mirror, Accessibility & Polish

## Goal

Conduct a comprehensive design, ergonomics, and accessibility audit against `design.md` and `project-brief.md`, verify Student Lounge auto-pause at $\le 2$ minutes, audit contrast ratios, and verify zero build warnings.

## Inputs

- `project-brief.md`
- `design.md`
- `build-blueprint.md`
- `work-cards/05-localstorage-save-refresh.md`

## Files likely touched

- `src/components/student/StudentLounge.tsx`
- `src/components/student/games/*.tsx`
- `src/components/billing/BillingHub.tsx`
- `src/components/common/RoleSwitcher.tsx`
- `src/components/driver/DriverCockpit.tsx`
- `src/app/globals.css`

## Instructions for the coding agent

1. Verify Student Lounge safety auto-pause:
   - In `StudentLounge.tsx`, confirm that whenever simulated bus arrival ETA drops to $\le 2$ minutes (120 seconds), any active canvas mini-game auto-pauses.
   - Display a full-screen or prominent modal banner: *"Bas dah nak sampai! Sila berkumpul di hentian sekarang!"* with chime sound.
2. Verify Billing Hub simulated FPX flow:
   - Test bank selection modal (Maybank2u, CIMB Clicks, Bank Islam, etc.).
   - Verify payment reconciliation marks invoice as Paid and generates a downloadable/printable origami papercraft receipt.
3. Contrast & Accessibility Audit:
   - Verify every text element has a minimum contrast ratio $> 7:1$ (WCAG AA). Eliminate any low-contrast muted grays.
   - Verify all clickable interactive elements satisfy minimum $\ge 48\text{px}$ touch targets, and all driver action buttons satisfy $\ge 64\text{px}$.
4. Run `npm run build` and ensure zero errors or unhandled warnings.

## What not to do

- Do NOT allow a student to continue playing games when the bus is within 2 minutes of the stop.
- Do NOT use unreadable text or low-contrast colors anywhere.
- Do NOT leave non-functional dummy buttons or placeholder lorem ipsum.

## Done when

- Mini-game auto-pause triggers reliably when ETA drops to 2 minutes or less.
- Billing Hub FPX flow completes cleanly and generates papercraft receipt.
- Contrast ratios pass accessibility checks across all 5 views.
- `npm run build` exits with code 0.

## Verification steps

- In Student Lounge, start *Paper Bus Runner* and wait until ETA hits 2m; verify game pauses with curbside notification.
- In Billing Hub, complete an FPX payment simulation; verify invoice status updates to Paid and receipt generates.
- Run `npm run build` and confirm production build succeeds.
- Design check: item card/list, input, update/delete controls, empty state, and mobile stacking follow `design.md`.

## Localhost test before continuing

After this card, the learner should test:

- In Student Lounge, play one of the mini-games; verify it pauses automatically when the bus approaches ($\le 2$ minutes) and warns the student to prepare for pickup.
- In Billing Hub, pay an invoice via the FPX bank simulation; verify it issues an origami receipt with QR verification.
- Audit mobile view on phone or Chrome DevTools (390px): confirm all text is sharply readable with high contrast and buttons are easy to tap.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verifying polish, accessibility, and build pass. Do not push to GitHub yet.

## Status
Completed
