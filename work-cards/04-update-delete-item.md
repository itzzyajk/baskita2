# Work Card 04 — Driver Manifest Mutation & Voice Alerts

## Goal

Implement driver manifest mutation actions (`[Naik Bas]` / `[Cuti]`), buffer delay adjustments, alert dismissal, and automated voice announcements (`SpeechSynthesisUtterance`) upon receiving parent status updates.

## Inputs

- `project-brief.md`
- `architecture.md`
- `design.md`
- `build-blueprint.md`
- `work-cards/03-add-item.md`

## Files likely touched

- `src/components/driver/DriverCockpit.tsx`
- `src/components/common/SoundEffects.ts`
- `src/store/busState.ts`

## Instructions for the coding agent

1. In `DriverCockpit.tsx`, render the active student stop manifest with large tactile controls:
   - For waiting students:
     - `[Naik Bas]` (`min-h-[64px]`, Teal/Green accent): marks status as `boarded`.
     - `[Cuti]` (`min-h-[64px]`, Terracotta/Red accent): marks status as `absent`, skips stop delay.
     - `[+1 Minit]` (`min-h-[48px]`, Canary Yellow accent): increments wait buffer.
   - For students with active parent dispatch:
     - Prominent amber banner: `⏱️ Buffer: +120s (Pesan Ibu Bapa: Lewat 2 Minit)`.
     - Clear/dismiss button to resolve the delay note.
2. Integrate Web Speech API in `SoundEffects.ts`:
   - Function `speakAlert(message: string)` using `window.speechSynthesis`.
   - Use standard Malay or English voice utterance: *"Perhatian pemandu: [Nama Murid] lewat [N] minit di hentian [Hentian]."*.
   - Fallback gracefully if speech synthesis is unsupported or uninitialized.
3. Automatically trigger `speakAlert()` whenever a new parent status dispatch arrives.

## What not to do

- Do NOT crash if the browser blocks audio autoplay before user interaction.
- Do NOT make driver action buttons smaller than 64px.
- Do NOT use unreadable low-contrast text on the driver manifest cards.

## Done when

- Tapping `[Naik Bas]` sets student status to `boarded` and updates manifest counters.
- Tapping `[Cuti]` sets student status to `absent` and recalculates downstream ETA.
- Receiving an update plays the audible Web Speech announcement and renders the amber buffer tag.

## Verification steps

- In Driver Cockpit, tap `[Naik Bas]` on Adam Zikri; verify status becomes `boarded`.
- Tap `[Cuti]` on another student; verify status becomes `absent`.
- Trigger dispatch update and verify voice synthesis sounds in browser.
- Design check: item card/list, input, update/delete controls, empty state, and mobile stacking follow `design.md`.

## Localhost test before continuing

After this card, the learner should test:

- Open Driver Cockpit (`http://localhost:3000`).
- Verify all primary action buttons (`Naik Bas`, `Cuti`) are large, distinct, and thumb-friendly ($\ge 64\text{px}$).
- Tap `[Naik Bas]` on a student; observe badge changes to "Sudah Naik" (Boarded) and the student card collapses/dimples.
- Tap `[Cuti]` on a student; observe badge changes to "Cuti" (Absent).
- Trigger a test voice announcement by dispatching a delay note; verify your computer speakers speak the notification.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verifying driver update and delete/dismiss operations with voice alert. Do not implement cross-tab sync yet.

## Status
Not started
