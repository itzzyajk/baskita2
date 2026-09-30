# Work Card 05 — LocalStorage Save, Refresh & Cross-Tab BroadcastChannel Sync

## Goal

Wire the central store (`src/store/busState.ts`) to browser `localStorage` (`baskita_manifest_state_v1`) and HTML5 `BroadcastChannel('baskita_bus_sync')`, ensuring state modifications survive page reloads and synchronize across multiple browser tabs in real time without a backend server.

## Inputs

- `project-brief.md`
- `architecture.md`
- `build-blueprint.md`
- `work-cards/04-update-delete-item.md`

## Files likely touched

- `src/store/busState.ts`
- `src/components/parent/ParentTracker.tsx`
- `src/components/driver/DriverCockpit.tsx`

## Instructions for the coding agent

1. In `src/store/busState.ts`, initialize `BroadcastChannel('baskita_bus_sync')`:
   - Listen for cross-tab messages: `DISPATCH_PARENT_NOTE`, `UPDATE_STUDENT_STATUS`, `INCREMENT_BUFFER`, `RESET_STATE`.
   - On message reception, update local React state and fire associated audio or speech alerts.
2. Ensure every state mutation broadcasts the payload to all other active tabs:
   - When parent submits in Tab 1 -> broadcast to Tab 2 (Driver Cockpit).
   - When driver marks boarded in Tab 2 -> broadcast to Tab 1 (Parent Tracker).
3. Connect `localStorage` persistence:
   - On state change, serialize manifest state to `localStorage.setItem('baskita_manifest_state_v1', ...)`.
   - On initial load / mount, read and rehydrate from `localStorage` if present, falling back to seed data if empty.
4. Add a "Reset Demo Data" action in the role bar or settings to purge `localStorage` back to pristine initial seed state.

## What not to do

- Do NOT create infinite broadcast ping-pong loops (ignore echo messages from self if applicable, or only handle foreign tab events).
- Do NOT fail if `localStorage` or `BroadcastChannel` is blocked in incognito or restricted browser environments.

## Done when

- Dispatching a note in Tab 1 immediately updates Tab 2 without page reload.
- Marking a student boarded in Tab 2 updates Tab 1 immediately.
- Refreshing either tab preserves all manifest changes and status notes.

## Verification steps

- Open two separate browser tabs (`http://localhost:3000`).
- Set Tab 1 to Parent Tracker, Tab 2 to Driver Cockpit.
- In Tab 1, send a delay note for Adam Zikri. Confirm Tab 2 updates instantly and plays speech alert.
- In Tab 2, click `[Naik Bas]`. Confirm Tab 1 updates Adam's status to Boarded.
- Refresh both tabs and confirm statuses persist.
- Design check: item card/list, input, update/delete controls, empty state, and mobile stacking follow `design.md`.

## Localhost test before continuing

After this card, the learner should test:

- Open two tabs side-by-side: Tab A (Parent) and Tab B (Driver).
- In Tab A, submit "Lewat 2 Minit" for Adam Zikri.
- Look at Tab B: confirm the amber delay badge appears immediately without refreshing Tab B.
- In Tab B, tap `[Naik Bas]`: confirm Tab A updates Adam's boarding status.
- Press `F5` / Refresh in both tabs: confirm Adam remains marked as Boarded.
- Tap "Reset Demo" button: confirm data returns to original morning schedule.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verifying cross-tab synchronization and reload persistence. Do not move to review and fix yet.

## Status
Completed
