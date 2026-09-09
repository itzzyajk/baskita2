# Work Card 01 — Project Skeleton & Transit Data Models

## Goal

Verify and configure the Next.js 14 App Router project skeleton, Tailwind CSS origami color tokens, TypeScript transit interfaces (`Student`, `BusStop`, `Route`, `Vehicle`, `Invoice`), and seed data for TTDI Jaya school bus transit.

## Inputs

- `project-brief.md`
- `architecture.md`
- `design.md`
- `build-blueprint.md`

## Files likely touched

- `package.json`
- `tailwind.config.ts`
- `src/types/index.ts`
- `src/data/fleet.ts`
- `src/data/routes.ts`
- `src/data/schools.ts`
- `src/data/students.ts`
- `src/data/invoices.ts`
- `src/app/layout.tsx`
- `src/app/globals.css`

## Instructions for the coding agent

1. Ensure TypeScript interfaces in `src/types/index.ts` capture:
   - `Student`: name, school, busId, pickupStop, dropoffStop, status (`waiting`, `boarded`, `arrived`, `dropped_off`, `absent`), bufferSeconds, qrCode.
   - `BusStop`: name, landmark, lat, lng, sequence, scheduledTime, studentIds.
   - `Vehicle`: id, plate, driverName, phone, capacity, currentStop, speed, heading.
2. Verify `tailwind.config.ts` contains the origami palette:
   - Canary Fold Yellow: `#F4D06F`
   - Terracotta Red: `#E76F51`
   - Paper Crease Teal: `#2A9D8F`
   - Deep Slate: `#264653`
   - Warm Craft Paper: `#FAF8F5`
   - Sheet Neutral: `#F4F0EA`
3. Verify `src/app/globals.css` defines papercraft shadow styles (`2px 2px 0px #264653`) and crisp fold borders.
4. Ensure `npm run build` compiles cleanly with zero TypeScript errors.

## What not to do

- Do NOT add external database or cloud authentication dependencies.
- Do NOT add OBD-II hardware libraries or external live telematics APIs.
- Do NOT use unreadable low-contrast pastel colors for text.

## Done when

- Next.js 14 App Router builds cleanly with zero TypeScript or style errors.
- All seed data (TTDI Jaya stops, schools, student roster) is typed and exported.

## Verification steps

- Run `npm run build` and ensure exit code 0.
- Verify exported models in `src/types/index.ts`.
- Design check: typography tokens and color theme strictly adhere to `design.md` contrast requirements.

## Localhost test before continuing

After this card, the learner should test:

- Run `npm run dev` in the terminal and open `http://localhost:3000`.
- Verify the browser loads without runtime console errors.
- Inspect the document body background to confirm the Warm Craft Paper tone (`#FAF8F5`).

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verifying build and seed models. Do not implement UI or state logic yet.

## Status
Completed
