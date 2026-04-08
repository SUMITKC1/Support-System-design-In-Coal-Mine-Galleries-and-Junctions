# Support System Design Calculator (Next.js)

This project is now a standard Next.js frontend app for roof-bolt support design in underground coal mine galleries and junctions.

## Tech Stack

- Next.js (App Router)
- React
- CSS (global styling and dark mode)

## Run Locally

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Build for Production

```bash
npm run build
npm run start
```

## Core Formulas

- Rock load (simplified): `RL = 0.1 * (100 - RMR) * t`
- Rock load (CMRI style): `Pr = gamma * B * (1.7 - 0.037 * RMR + 0.0002 * RMR^2)`
- Effective capacity (kN): `Ceff = Cb * eta_b * eta_p`
- Spacing: `S = sqrt(Ceff / (Pr * FoS * Jf))`
- Support density: `Ceff(t) / S^2`

## Pages

- `/` Home + calculator
- `/about` Project overview
- `/team` Team members
