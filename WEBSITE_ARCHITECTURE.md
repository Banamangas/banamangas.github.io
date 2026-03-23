# Portfolio Website — Architecture & Design Plan

---

## Goal

A personal portfolio website showcasing Data Science / Data Engineering projects to potential employers. Clean, professional, fast-loading, and easy to maintain as new projects are added.

---

## Recommended Tech Stack

### Option A: Static Site (Recommended)

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | **Astro** | Static-first, component islands for interactivity, Markdown-native (each project = 1 .md file), blazing fast output |
| **Styling** | **Tailwind CSS** | Utility-first, easy to build a clean professional look without writing custom CSS from scratch |
| **Hosting** | **GitHub Pages** or **Cloudflare Pages** | Free, automatic deploys on push, custom domain support, HTTPS included |
| **Domain** | Custom `.dev` or `.io` domain | Professional appearance (~$10-15/year) |

**Why static?** A portfolio site has no dynamic data. Static = fast, free hosting, zero maintenance, perfect Lighthouse scores. Astro's Markdown content collections mean adding a new project is just dropping a `.md` file.

### Option B: If You Want Python Throughout

| Layer | Technology |
|-------|-----------|
| **Framework** | **FastAPI** (you already know it) or **Flask** with Jinja2 templates |
| **Styling** | Tailwind CSS via CDN |
| **Hosting** | Your existing VPS (you already have Caddy + systemd) |

Pros: stays in your comfort zone. Cons: overkill for static content, adds server maintenance.

### Option C: Lightweight Alternative

| Layer | Technology |
|-------|-----------|
| **Framework** | **Hugo** or **Jekyll** |
| **Hosting** | GitHub Pages |

Even simpler than Astro, but less flexible for custom interactive components.

---

## Recommended: Option A (Astro + Tailwind + GitHub Pages)

---

## Site Structure

```
/                          # Landing page — name, title, short intro, links
/projects/                 # Project gallery — card grid with thumbnails
/projects/foe-buildings/   # Individual project page (from .md file)
/projects/[next-project]/  # Future projects slot in the same way
/about/                    # Background, skills, education, contact
/resume/                   # Downloadable PDF + inline highlights
```

---

## Page Designs

### Landing Page (`/`)

```
+-------------------------------------------------------+
|  [Name]                              [Nav: Projects | About | Resume]  |
+-------------------------------------------------------+
|                                                       |
|  Hi, I'm [Name].                                      |
|  Data Scientist / Data Engineer                        |
|                                                       |
|  I build end-to-end data systems —                    |
|  from scraping and pipelines to APIs and dashboards.  |
|                                                       |
|  [View Projects ->]     [LinkedIn] [GitHub] [Email]   |
|                                                       |
+-------------------------------------------------------+
|  Featured Projects (2-3 cards)                        |
|  +-------------+  +-------------+  +-------------+   |
|  | FOE DB      |  | Project 2   |  | Project 3   |   |
|  | [thumbnail] |  | [thumbnail] |  | [thumbnail] |   |
|  | short desc  |  | short desc  |  | short desc  |   |
|  +-------------+  +-------------+  +-------------+   |
+-------------------------------------------------------+
|  Tech I Work With: Python | SQL | Pandas | FastAPI..  |
+-------------------------------------------------------+
```

### Project Page (`/projects/foe-buildings/`)

```
+-------------------------------------------------------+
|  <- Back to Projects                                  |
+-------------------------------------------------------+
|  # FOE Buildings Database                             |
|  Full-stack data pipeline & API for Forge of Empires  |
|                                                       |
|  [Tags: Python, FastAPI, Selenium, SQLite, Pandas]    |
|                                                       |
|  [Architecture diagram / screenshot]                  |
|                                                       |
|  ## Overview                                          |
|  ...                                                  |
|                                                       |
|  ## The Problem                                       |
|  ...                                                  |
|                                                       |
|  ## What I Built                                      |
|  (pipeline table, API details, Discord bot, etc.)     |
|                                                       |
|  ## Key Numbers                                       |
|  (stats grid: 23K records, 255 tests, etc.)           |
|                                                       |
|  ## Tech Stack                                        |
|  (icon grid with labels)                              |
|                                                       |
|  [View on GitHub ->]                                  |
+-------------------------------------------------------+
```

### Project Gallery (`/projects/`)

Grid of cards, each showing:
- Project name
- One-line description
- 3-4 tech tags
- Thumbnail or icon
- Link to detail page

---

## Design Principles

1. **Content-first** — The projects are the star. Minimal chrome, maximum readability.
2. **Dark/light mode** — Toggle, defaulting to system preference.
3. **Responsive** — Mobile-first grid that collapses gracefully.
4. **Fast** — Static HTML, lazy-loaded images, no JavaScript frameworks bloating the bundle.
5. **Professional but not boring** — Subtle accent color, clean typography (Inter or similar), tasteful spacing.
6. **Easy to update** — Adding a project = writing a Markdown file with frontmatter.

---

## Color Palette (suggestion)

| Role | Light Mode | Dark Mode |
|------|-----------|-----------|
| Background | `#FAFAFA` | `#0F172A` (slate-900) |
| Card surface | `#FFFFFF` | `#1E293B` (slate-800) |
| Primary text | `#1E293B` | `#F1F5F9` (slate-100) |
| Accent | `#2563EB` (blue-600) | `#60A5FA` (blue-400) |
| Tags | `#E0E7FF` bg / `#4338CA` text | `#312E81` bg / `#A5B4FC` text |

---

## Astro Project Structure

```
portfolio-website/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       # HTML shell, nav, footer, dark mode
│   ├── pages/
│   │   ├── index.astro            # Landing page
│   │   ├── about.astro            # About / contact
│   │   ├── resume.astro           # Resume page
│   │   └── projects/
│   │       ├── index.astro        # Project gallery (reads all .md files)
│   │       └── [...slug].astro    # Dynamic project page from .md
│   ├── content/
│   │   └── projects/
│   │       ├── foe-buildings.md   # <-- content from 01_foe_buildings_database.md
│   │       └── next-project.md    # Future projects go here
│   ├── components/
│   │   ├── ProjectCard.astro
│   │   ├── TechBadge.astro
│   │   ├── StatsGrid.astro        # Key numbers display
│   │   └── ThemeToggle.astro
│   └── styles/
│       └── global.css             # Tailwind imports + custom overrides
├── public/
│   ├── images/projects/           # Screenshots, diagrams
│   └── resume.pdf
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## Content Model (Markdown Frontmatter)

Each project `.md` file uses frontmatter that Astro reads automatically:

```yaml
---
title: "FOE Buildings Database"
subtitle: "Full-stack data pipeline & API for Forge of Empires"
date: 2025-01-01               # Project start date (for sorting)
tags: [Python, FastAPI, Selenium, SQLite, Pandas, Discord.py]
thumbnail: "/images/projects/foe-buildings.png"
github: "https://github.com/username/foe-buildings-database"
live: "https://api.example.com"  # Optional: link to live demo
featured: true                    # Show on landing page
stats:
  - label: "Building Records"
    value: "23,800+"
  - label: "API Endpoints"
    value: "19"
  - label: "Tests"
    value: "255"
  - label: "Core Modules"
    value: "9,700 lines"
---

## Overview
...rest of the project description in Markdown...
```

---

## Deployment Pipeline

```
GitHub repo (push to main)
        |
        v
GitHub Actions: build Astro site
        |
        v
Deploy to GitHub Pages (or Cloudflare Pages)
        |
        v
Custom domain with HTTPS (automatic)
```

Total cost: **$0/month** (+ ~$12/year for a custom domain).

---

## Future Enhancements (once more projects exist)

- **Filter/sort** on the projects page (by tech, by date, by category)
- **Blog section** for technical write-ups (Astro supports this natively)
- **Analytics** via Plausible or Umami (privacy-friendly, self-hostable)
- **Interactive demos** embedded via Astro component islands (e.g., a live API query widget for FOE Buildings)

---

## Getting Started

```bash
# Create the project
npm create astro@latest portfolio-website
cd portfolio-website

# Add Tailwind
npx astro add tailwind

# Add your project .md files to src/content/projects/
# Start developing
npm run dev
```
