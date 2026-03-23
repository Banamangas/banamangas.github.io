# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project State

This repository currently contains **planning and architecture documentation only** — the Astro project has not been scaffolded yet. Before any development tasks, check whether `package.json` exists. If it does not, the project needs to be initialized per `SETUP.md`.

## Initializing the Project

```bash
npm create astro@latest . --template minimal
npx astro add tailwind sitemap
npm install @tailwindcss/typography sharp
```

## Commands (once initialized)

```bash
npm run dev       # Dev server at http://localhost:4321
npm run build     # Build to dist/
npm run preview   # Preview built site
npx astro check   # TypeScript type-check all .astro files
```

## Architecture

### Framework & Stack
- **Astro** — static site generator with file-based routing
- **Tailwind CSS** — utility-first styling with `@tailwindcss/typography` for prose content
- **Content Collections** — project case studies live as Markdown files with typed frontmatter (schema defined in `content.config.ts`)

### Routing Model
- `/` → `src/pages/index.astro` — landing page
- `/projects/` → `src/pages/projects/index.astro` — gallery, reads all content collection entries
- `/projects/[slug]` → `src/pages/projects/[...slug].astro` — dynamic route per Markdown file
- `/about` → `src/pages/about.astro`
- `/resume` → `src/pages/resume.astro`

### Content Model
Project pages are driven by Markdown files in `src/content/projects/`. The frontmatter schema (in `content.config.ts`) includes: `title`, `subtitle`, `date`, `tags`, `thumbnail`, `github`, `live`, `featured`, `stats` (key-value pairs).

### Layout Pattern
All pages use `src/layouts/BaseLayout.astro` which provides the HTML shell, global nav, footer, and dark mode support. Individual pages slot their content inside it.

### Key Directories
- `src/components/` — reusable Astro components (`ProjectCard`, `TechBadge`, `StatsGrid`, `ThemeToggle`)
- `src/styles/global.css` — Tailwind directives and custom styles
- `public/images/projects/` — screenshots and thumbnails (binary assets, not processed by Astro)
- `public/resume.pdf` — served as a static file

### Dark Mode
Tailwind dark mode is class-based (configured in `tailwind.config.mjs`). The `ThemeToggle` component manages the `dark` class on `<html>` and persists preference in `localStorage`.

## Planning Documents
- `SETUP.md` — step-by-step scaffold and configuration guide
- `WEBSITE_ARCHITECTURE.md` — design decisions, color palette, page layouts, content model details
- `DEPLOY.md` — deployment options (GitHub Pages, Cloudflare Pages, self-hosted VPS via Caddy)
- `01_foe_buildings_database.md` — case study content for the first portfolio project
