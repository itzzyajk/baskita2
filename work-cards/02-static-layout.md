# Work Card 02 — Tactical Origami Layout & Role Views

## Goal

Implement the tactile origami papercraft shell, tactical role navigation bar (`RoleSwitcher`), and static layouts for Parent Tracker, Driver Cockpit, Student Lounge, and Billing Hub with high-contrast text and $\ge 64\text{px}$ driver touch targets.

## Inputs

- `project-brief.md`
- `design.md`
- `build-blueprint.md`
- `work-cards/01-project-skeleton.md`

## Files likely touched

- `src/app/page.tsx`
- `src/components/common/RoleSwitcher.tsx`
- `src/components/common/OrigamiIcons.tsx`
- `src/components/parent/ParentTracker.tsx`
- `src/components/driver/DriverCockpit.tsx`
- `src/components/student/StudentLounge.tsx`
- `src/components/billing/BillingHub.tsx`
- `src/components/map/OrigamiMap.tsx`

## Instructions for the coding agent

1. Implement `RoleSwitcher` sticky navigation bar at the top allowing seamless role switching:
   - `Parent Tracker`
   - `Student Lounge`
   - `Driver Cockpit`
   - `Billing Hub`
   - `Admin Radar`
2. Implement static shell for `ParentTracker.tsx`:
   - Hero ETA countdown banner.
   - Vector Map container with 20 km coverage radius representation.
   - Sequenced stop timeline drawer.
   - Digital student boarding pass preview.
3. Implement static shell for `DriverCockpit.tsx`:
   - Mobile-portrait dock layout.
   - High-contrast next-stop header with route milestone.
   - Prominent tactile action buttons with minimum 64px height (`min-h-[64px]`).
4. Implement static shell for `StudentLounge.tsx`:
   - Persistent top ETA HUD.
   - Junior (Kip) vs Senior (Rex) character mode selector.
   - Mini-game selection grid.
5. Implement static shell for `BillingHub.tsx`:
   - Monthly subscription fee cards and invoice table.

## What not to do

- Do NOT make buttons smaller than 48px anywhere, or smaller than 64px in the driver view.
- Do NOT use low-contrast text on white or light backgrounds.
- Do NOT introduce generic glossy modal designs or rounded pill buttons with blurred gradient drop shadows.

## Done when

- All 5 main views (Parent, Student, Driver, Billing, Admin) can be toggled via `RoleSwitcher`.
- High contrast typography and tactile paper aesthetic are applied across all views.
- Driver manifest buttons satisfy `min-h-[64px]`.

## Verification steps

- Toggle between each role in `RoleSwitcher` and verify correct component renders.
- Inspect driver action buttons in dev tools and confirm height $\ge 64\text{px}$.
- Verify text contrast passes WCAG AA ($> 7:1$).
- Design check: item card/list, input, update/delete controls, empty state, and mobile stacking follow `design.md`.

## Localhost test before continuing

After this card, the learner should test:

- Open `http://localhost:3000` in browser.
- Click each role tab in the top bar: `Parent`, `Student`, `Driver`, `Billing`, `Admin`. Confirm all screens render without crash.
- Switch to `Driver` view and inspect the `Naik Bas` and `Cuti` buttons: confirm they are large, easy to tap, with solid offset shadows.
- Resize browser window to mobile width ($390\text{px}$): verify layout stacks cleanly without horizontal scroll blowout.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verifying static layout and role switching. Do not wire live dispatch mutations yet.

## Status
Completed
