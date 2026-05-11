# Vendor Renewal Pressure Map

Vendor Renewal Pressure Map is a public, synthetic-data portfolio product that
turns scattered renewal evidence into a negotiation timing brief. It is designed
for an operator, finance lead, or founder who needs to know which SaaS renewals
need attention before cancellation windows close.

## Portfolio Signal

This slice demonstrates commercial judgment rather than generic spend tracking:
it combines renewal dates, cancellation windows, owner gaps, price-change
evidence, and leverage signals into a pressure score and an action brief.

## Synthetic Data Boundary

All vendors, dates, contracts, owners, amounts, and evidence snippets are
fictional. The app intentionally ships without authentication, uploads, API
keys, or real vendor records so the repository can stay public.

## Stack Rationale

- Vite + React + TypeScript keeps the first slice fast, static, and easy to
  deploy on Vercel.
- Fixture-first data keeps product behavior deterministic and reviewable.
- Vitest covers the scoring and action-brief logic before UI polish expands.
- Plain CSS is used because the demo needs dense operational clarity more than a
  component framework.

## Local Setup

```powershell
npm ci
npm run test -- --run
npm run build
npm run dev
```

## Verification

The intended verification path for this slice is:

1. `npm ci`
2. `npm run test -- --run`
3. `npm run build`
4. Local preview smoke for `Vendor Renewal Pressure Map` and the top action
   brief content.

## File Structure

- `src/data/renewals.ts`: synthetic renewal fixtures and provenance notes.
- `src/lib/renewalPressure.ts`: deterministic scoring, ranking, and brief logic.
- `src/lib/renewalPressure.test.ts`: scoring and brief regression tests.
- `src/App.tsx`: single-screen renewal desk UI.
- `src/styles.css`: responsive operational layout.

## Decision Log

- Kept the first version static and fixture-only because the portfolio value is
  workflow judgment, not live procurement integrations.
- Used explicit score factors instead of a black-box model so reviewers can see
  exactly why a renewal is urgent.
- Ranked vendors by action pressure first, not spend, because cancellation
  windows and owner ambiguity create avoidable leverage loss.
- Rendered the negotiation brief directly in the app instead of hiding it behind
  export controls; a future increment can add copy/download actions after the
  core reasoning is proven.

## Vercel

Production deployment is expected after the worker verifies package, GitHub, and
Vercel surfaces. The app has no server-side secrets.
