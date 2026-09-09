# Work Card 03 — Parent Status Dispatch & Update Creation

## Goal

Implement the parent curbside update mechanism: a Paper Airplane modal allowing parents to create and dispatch live status updates (*"Lewat 2 Minit"*, *"Cuti Hari Ini"*, or custom curbside notes) for their student, appending to the active dispatch buffer.

## Inputs

- `project-brief.md`
- `architecture.md`
- `design.md`
- `build-blueprint.md`
- `work-cards/02-static-layout.md`

## Files likely touched

- `src/components/common/PaperAirplaneModal.tsx`
- `src/components/parent/ParentTracker.tsx`
- `src/store/busState.ts`
- `src/types/index.ts`

## Instructions for the coding agent

1. Build `PaperAirplaneModal.tsx` styled as a folded tactile paper note:
   - Header with student name and current stop location.
   - Quick-select preset buttons:
     - `⏱️ Lewat 2 Minit (+120s buffer)`
     - `⏱️ Lewat 5 Minit (+300s buffer)`
     - `❌ Cuti Hari Ini (Langkau Hentian)`
     - `🏡 Balik Rumah Nenek (Hentian Alternatif)`
   - Custom note text input with clear character counter.
   - Submit CTA: `[Hantar Nota Lipatan ✈️]` with active paper press translation animation.
2. Wire dispatch action in `busState.ts`:
   - Append dispatch entry to student record: `bufferSeconds: number`, `statusNotes: string`, `timestamp: string`.
   - Add entry to the recent dispatch log.
3. Show immediate feedback toast/banner in `ParentTracker.tsx` confirming transmission.

## What not to do

- Do NOT require cloud API endpoints or WhatsApp webhooks for dispatching.
- Do NOT clear or wipe the student manifest when adding a dispatch note.
- Do NOT use unreadable text on the quick-select buttons.

## Done when

- Clicking `"Pesan Pemandu"` opens the origami paper modal.
- Selecting a delay preset or typing a note dispatches an update into the store.
- Parent tracker view displays active dispatch confirmation.

## Verification steps

- Open Parent Tracker, trigger `"Pesan Pemandu"` modal.
- Submit a `"Lewat 2 Minit"` dispatch for Adam Zikri.
- Confirm student state reflects `bufferSeconds: 120`.
- Design check: item card/list, input, update/delete controls, empty state, and mobile stacking follow `design.md`.

## Localhost test before continuing

After this card, the learner should test:

- Open Parent Tracker (`http://localhost:3000`).
- Click the `"Pesan Pemandu"` (or Paper Airplane icon) button.
- Confirm the folded paper modal appears with high-contrast text.
- Click `"Lewat 2 Minit"` and click `"Hantar Nota Lipatan"`.
- Confirm the modal closes and the tracker displays a notification badge or message indicating update sent.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verifying parent status dispatch creation. Do not implement driver response logic yet.

## Status
Not started
