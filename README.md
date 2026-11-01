# Ashan Sithara — Engineering World Portfolio

An interactive engineering portfolio built with Next.js 15, React 19, Tailwind CSS 4, TypeScript and React Three Fiber.

## Run locally

Use **Node.js 22 or newer** (Node 14 cannot run this Next.js version).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

Upload this project to GitHub and import the repository into Vercel as a Next.js project. The normal `next.config.ts` uses the standard Next.js deployment configuration; no static-export changes are required.

## Design and interaction

- The desktop hero uses the refined two-row Cloud Command Center artwork with a clean background plate (`public/command-center-textless.png`): seven logos on the upper ring and eight on the lower ring. All fifteen cards are stationary and clickable. Header navigation, headline, tagline, buttons, and professional highlights are now native HTML/CSS to prevent image-scaling blur.
- The portrait and platform are a 2D composite, **not** a fully rotatable 3D portrait. Navigation and technology cards remain clickable through accessible overlays.
- Small screens show a mobile-specific layout and portrait.
- The rest of the page presents genuine DevOps, software development, networking, monitoring, and AI/data background, distinguishing completed work from planned projects.
- Technology logos use Simple Icons and Devicon assets. The original concept artwork includes illustrative dashboard figures; verify or replace them before publicly marketing them as real production metrics.

## Before public launch

- Replace the placeholder email and LinkedIn URLs in `src/app/page.tsx`.
- Add genuine project repository/demo links where possible.
- Review all descriptions, certification/training details, and numbers.
- If desired, replace the illustration-driven hero with an actual 3D model for independent portrait rotation.
