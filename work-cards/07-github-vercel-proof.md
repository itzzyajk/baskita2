# Work Card 07 — GitHub Repository Push & Vercel Deployment Proof

## Goal

Initialize the local Git repository, commit all source code and KDBM Lite planning artifacts, push to GitHub (`itzzyajk/baskita2`), and verify live production deployment on Vercel.

## Inputs

- `project-brief.md`
- `architecture.md`
- `design.md`
- `build-blueprint.md`
- `work-cards/06-review-and-fix.md`

## Files likely touched

- `.gitignore`
- Git commit tree
- `README.md` (if needed)

## Instructions for the coding agent

1. Ensure `.gitignore` ignores `node_modules`, `.next`, `.env*.local`, and OS cache files.
2. Initialize local Git repository: `git init` (if not already initialized).
3. Stage all source files and planning markdown files: `git add .`.
4. Commit with descriptive semantic message: `git commit -m "feat: BasKita v1.0 - Origami 2D school bus fleet transit platform"`.
5. Connect remote repository `git remote add origin https://github.com/itzzyajk/baskita2.git` (or verify existing origin).
6. Push to main branch: `git push -u origin main`.
7. Verify Vercel deployment preview / production URL:
   - Deploy using Vercel CLI (`vercel --prod`) or confirm Git auto-deployment.
   - Test production URL in browser.

## What not to do

- Do NOT commit sensitive API keys or environment secrets.
- Do NOT push broken builds that fail `npm run build`.
- Do NOT skip git status verification before pushing.

## Done when

- Local repository is clean and committed.
- Code is pushed to GitHub at `https://github.com/itzzyajk/baskita2`.
- Production deployment on Vercel is live, responsive, and passing the proof ladder.

## Verification steps

- Run `git status` to verify working directory is clean.
- Check remote repository commit log on GitHub.
- Execute proof ladder on live Vercel deployment URL.
- Design check: item card/list, input, update/delete controls, empty state, and mobile stacking follow `design.md` on production URL.

## Localhost test before continuing

After this card, the learner should test:

- Open GitHub in browser: verify all project files, `work-cards/`, and markdown planning documents appear at `github.com/itzzyajk/baskita2`.
- Open the live Vercel production URL:
  - Test Parent Tracker and dispatch a delay note.
  - Test Driver Cockpit and tap `[Naik Bas]`.
  - Confirm sound effects and voice alerts work as expected.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verifying GitHub push and live Vercel deployment.

## Status
Not started
