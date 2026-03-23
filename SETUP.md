# Portfolio Website — Local Setup Guide

---

## Prerequisites

Before starting, make sure you have the following installed on your machine.

### Required Software

| Tool | Minimum Version | Purpose | Install |
|------|----------------|---------|---------|
| **Node.js** | 18.17.1+ (LTS recommended: 20.x or 22.x) | JavaScript runtime for Astro | [nodejs.org](https://nodejs.org/) or via `nvm` |
| **npm** | 9.0+ (ships with Node.js) | Package manager | Comes with Node.js |
| **Git** | 2.30+ | Version control | `sudo apt install git` / `brew install git` |
| **A code editor** | — | Editing source files | VS Code recommended |

### Recommended (Optional)

| Tool | Purpose | Install |
|------|---------|---------|
| **nvm** | Manage multiple Node.js versions | [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) |
| **VS Code Astro extension** | Syntax highlighting, IntelliSense for `.astro` files | `astro-build.astro-vscode` in VS Code marketplace |
| **VS Code Tailwind CSS IntelliSense** | Autocomplete for Tailwind classes | `bradlc.vscode-tailwindcss` in VS Code marketplace |
| **GitHub CLI (`gh`)** | Create repos, manage PRs from terminal | `sudo apt install gh` / `brew install gh` |

---

## Verify Prerequisites

```bash
# Check Node.js (must be >= 18.17.1)
node --version

# Check npm (must be >= 9.0)
npm --version

# Check Git
git --version
```

If Node.js is missing or outdated, install via nvm:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Reload your shell config
source ~/.bashrc   # Bash
source ~/.zshrc    # Zsh

# Install latest LTS Node.js
nvm install --lts
nvm use --lts
```

---

## Step 1 — Create the Astro Project

```bash
# Scaffold a new Astro project
npm create astro@latest portfolio-website

# When prompted:
#   Template:       "Empty"
#   TypeScript:     "Yes" (strict) — recommended for maintainability
#   Install deps:   "Yes"
#   Initialize git: "Yes"

cd portfolio-website
```

---

## Step 2 — Add Integrations

### Tailwind CSS (styling)

```bash
npx astro add tailwind
```

This automatically:
- Installs `@astrojs/tailwind` and `tailwindcss`
- Creates `tailwind.config.mjs`
- Updates `astro.config.mjs`

### Sitemap (SEO — optional but recommended)

```bash
npx astro add sitemap
```

Generates a `sitemap.xml` at build time for search engine indexing.

---

## Step 3 — Install Additional Dependencies

```bash
# Tailwind typography plugin — renders Markdown content beautifully
npm install @tailwindcss/typography

# Sharp — optimized image processing (Astro uses this for <Image /> component)
npm install sharp
```

---

## Step 4 — Configure Tailwind

Edit `tailwind.config.mjs` to enable the typography plugin and dark mode:

```js
// tailwind.config.mjs
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        accent: {
          light: '#2563EB',  // blue-600
          dark: '#60A5FA',   // blue-400
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

---

## Step 5 — Set Up the Content Collection

Create the content configuration file for project Markdown files:

```bash
mkdir -p src/content/projects
```

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    thumbnail: z.string(),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    featured: z.boolean().default(false),
    stats: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ).optional(),
  }),
});

export const collections = { projects };
```

---

## Step 6 — Add Your First Project

Copy the FOE Buildings Database description into the content collection:

```bash
cp /path/to/portfolio/01_foe_buildings_database.md src/content/projects/foe-buildings.md
```

Then add the required frontmatter at the top of `src/content/projects/foe-buildings.md`:

```yaml
---
title: "FOE Buildings Database"
subtitle: "Full-stack data pipeline & API for Forge of Empires"
date: 2025-01-01
tags: [Python, FastAPI, Selenium, SQLite, Pandas, Discord.py, APScheduler]
thumbnail: "/images/projects/foe-buildings.png"
github: "https://github.com/YOUR_USERNAME/foe-buildings-database"
featured: true
stats:
  - label: "Building Records"
    value: "23,800+"
  - label: "API Endpoints"
    value: "19"
  - label: "Tests"
    value: "255"
  - label: "Python Lines"
    value: "9,700+"
---
```

---

## Step 7 — Add Static Assets

```bash
mkdir -p public/images/projects
```

Place project thumbnails and screenshots in `public/images/projects/`. Recommended:
- Thumbnail: 800x450px (16:9), WebP or PNG
- Architecture diagrams: any size, will be lazy-loaded
- Resume PDF: `public/resume.pdf`

---

## Step 8 — Create the Base Layout

Create `src/layouts/BaseLayout.astro` — the HTML shell shared by all pages:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Data Science & Engineering Portfolio' } = Astro.props;
---

<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>{title}</title>
  </head>
  <body class="bg-gray-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 font-sans antialiased">
    <nav><!-- your nav here --></nav>
    <main class="max-w-4xl mx-auto px-4 py-12">
      <slot />
    </main>
    <footer class="text-center text-sm text-slate-500 py-8">
      <!-- your footer here -->
    </footer>
  </body>
</html>
```

---

## Step 9 — Run the Dev Server

```bash
npm run dev
```

The site is now live at **http://localhost:4321**. Hot-reload is enabled — changes appear instantly.

---

## Step 10 — Build & Preview Locally

```bash
# Generate static HTML
npm run build

# Preview the built site locally (serves from dist/)
npm run preview
```

The build output goes to `dist/`. This is exactly what gets deployed.

---

## Project File Structure (after setup)

```
portfolio-website/
├── astro.config.mjs              # Astro config (integrations, site URL)
├── tailwind.config.mjs           # Tailwind config (theme, plugins)
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies and scripts
├── src/
│   ├── content.config.ts         # Content collection schemas
│   ├── layouts/
│   │   └── BaseLayout.astro      # Shared HTML shell
│   ├── pages/
│   │   ├── index.astro           # Landing page
│   │   ├── about.astro           # About / contact
│   │   ├── resume.astro          # Resume page
│   │   └── projects/
│   │       ├── index.astro       # Project gallery
│   │       └── [...slug].astro   # Dynamic project detail page
│   ├── content/
│   │   └── projects/
│   │       └── foe-buildings.md  # First project writeup
│   ├── components/
│   │   ├── ProjectCard.astro     # Card for gallery grid
│   │   ├── TechBadge.astro       # Tag pill component
│   │   ├── StatsGrid.astro       # Key numbers display
│   │   └── ThemeToggle.astro     # Dark/light mode switch
│   └── styles/
│       └── global.css            # Tailwind directives + custom styles
├── public/
│   ├── images/projects/          # Screenshots, thumbnails
│   ├── favicon.svg
│   └── resume.pdf
└── dist/                         # Build output (git-ignored)
```

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:4321 with hot reload |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview built site locally |
| `npx astro check` | Type-check all `.astro` files |
| `npx astro add <integration>` | Add an Astro integration (e.g., `tailwind`, `sitemap`) |

---

## Adding a New Project

1. Create a new `.md` file in `src/content/projects/` (e.g., `ml-pipeline.md`)
2. Add the required frontmatter (see Step 6 for the schema)
3. Write the project description in Markdown below the frontmatter
4. Add a thumbnail to `public/images/projects/`
5. The project automatically appears in the gallery and gets its own page

No code changes needed — just content.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `npm create astro` fails | Update npm: `npm install -g npm@latest` |
| Node.js version too old | Install LTS via nvm: `nvm install --lts` |
| Tailwind classes not applying | Verify `content` paths in `tailwind.config.mjs` include `**/*.astro` |
| Images not loading | Files must be in `public/` and referenced with absolute paths (e.g., `/images/projects/foo.png`) |
| Content collection errors | Run `npx astro check` — usually a frontmatter schema mismatch |
| Port 4321 in use | Use `npm run dev -- --port 3000` |

---

## Requirements Summary

### Minimum

- Node.js >= 18.17.1
- npm >= 9.0
- Git >= 2.30
- ~200 MB disk space (node_modules)

### npm Packages (installed automatically)

| Package | Purpose |
|---------|---------|
| `astro` | Framework |
| `@astrojs/tailwind` | Tailwind integration |
| `tailwindcss` | CSS utility framework |
| `@tailwindcss/typography` | Prose styling for Markdown |
| `sharp` | Image optimization |
| `@astrojs/sitemap` | SEO sitemap generation |
