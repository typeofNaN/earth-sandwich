# Earth Sandwich

Earth Sandwich is a cinematic 3D antipode explorer built with React, TypeScript, Vite, Tailwind CSS, Three.js, and React Three Fiber. Pick any point on Earth and the app shows where you would emerge after traveling straight through the planet.

## Local Development

```bash
pnpm install
pnpm dev
```

## Production Build

```bash
pnpm build
```

## Preview

```bash
pnpm preview
```

## Lint

```bash
pnpm lint
```

## Type Check

```bash
pnpm typecheck
```

## Deployment

Deployment is configured for GitHub Pages with GitHub Actions:

```text
Push to main
        ↓
GitHub Actions
        ↓
Lint + Type Check + Build
        ↓
GitHub Pages
```

First-time GitHub setup:

```text
Repository → Settings → Pages → Build and deployment → Source → GitHub Actions
```

After that, push to `main` and the workflow in `.github/workflows/deploy.yml` builds and deploys `dist/` automatically. The Vite `base` path is derived from `GITHUB_REPOSITORY` during GitHub Actions, so repository-subpath Pages URLs such as `https://USERNAME.github.io/earth-sandwich/` load assets correctly. For custom domains, set `VITE_BASE_PATH=/` in the workflow or repository environment if needed.

## Sharing

The selected coordinates are encoded as query parameters:

```text
/?lat=23.1291&lng=113.2644
```

This keeps sharing compatible with GitHub Pages without server-side routing.
