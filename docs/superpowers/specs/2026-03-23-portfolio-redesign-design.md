# Portfolio Redesign — Design Spec

**Date:** 2026-03-23
**Scope:** Full rethink — visual system, content, new sections
**Aesthetic:** Terminal / Developer

---

## 1. Goals & Audience

The portfolio must serve three audiences at different reading speeds:
- **Recruiters / hiring managers** — quick credibility signal, clear past work
- **Other developers** — technical depth, stack visibility, open source presence
- **Potential freelance clients** — outcome-focused project storytelling

The current site is structurally sound but has no design identity (Inter font, generic blue accent, default Tailwind layout). The redesign gives it a clear point of view: a developer's terminal.

---

## 2. Design System

### Colors
All CSS custom properties defined in `global.css`:

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0d1117` | Page background |
| `--color-surface` | `#161b22` | Cards, nav, terminal windows |
| `--color-surface-2` | `#21262d` | Terminal window headers, hover states |
| `--color-border` | `#30363d` | All borders |
| `--color-text` | `#e6edf3` | Primary text |
| `--color-muted` | `#7d8590` | Comments, metadata, secondary text |
| `--color-body` | `#c9d1d9` | Prose body text |
| `--color-green` | `#3fb950` | Prompt symbol, success, infra badges |
| `--color-cyan` | `#79c0ff` | Commands, links, framework badges |
| `--color-purple` | `#d2a8ff` | Keywords, labels, language badges |
| `--color-orange` | `#ffa657` | Strings, values, data tool badges |

Dark-only theme. No light mode toggle (the terminal aesthetic is inherently dark).

### Typography
- **Display / UI / terminal text:** `JetBrains Mono` (Google Fonts) — headings, nav, code blocks, section labels, badges
- **Body / prose:** `IBM Plex Sans` (Google Fonts) — descriptions, case study prose, subtitles

### Badge Color Logic
`TechBadge` assigns color by tag category:
- `purple` — programming languages (Python, SQL, Bash, R)
- `cyan` — frameworks & APIs (FastAPI, Airflow, dbt, Flask)
- `green` — infrastructure & ops (Docker, GitHub Actions, PostGIS, Kubernetes)
- `orange` — data tools & databases (PostgreSQL, Pandas, Spark, Redis)
- `muted` — fallback for uncategorised tags

---

## 3. Architecture Changes

### Modified Files
| File | Change |
|---|---|
| `src/styles/global.css` | Full rewrite: CSS custom properties, terminal color system, JetBrains Mono + IBM Plex Sans imports, remove Inter, dark-only base styles |
| `src/layouts/BaseLayout.astro` | Terminal window chrome nav (traffic light dots, `~/portfolio` path breadcrumb), remove light/dark toggle, dark body classes |
| `src/components/TechBadge.astro` | Syntax-token style with category-based color assignment |
| `src/components/ProjectCard.astro` | Directory-style title (`project-name/`), terminal surface card |
| `src/components/StatsGrid.astro` | Replace grid with `stats.json` syntax-highlighted block |
| `src/components/ThemeToggle.astro` | Remove (dark-only) |
| `src/pages/index.astro` | Animated terminal hero + skills JSON section + open source section |
| `src/pages/about.astro` | Bio rewrite + timeline section + contact section |
| `src/pages/projects/[...slug].astro` | Terminal breadcrumb header, stats as JSON block |

### New Components
| Component | Purpose |
|---|---|
| `src/components/TerminalWindow.astro` | Reusable terminal window wrapper (traffic light dots, title bar, dark surface body). Used by hero and stats. |
| `src/components/SkillsJSON.astro` | Renders skills as a syntax-highlighted JSON block. Takes a `skills` prop of shape `{ [category: string]: string[] }`. |
| `src/components/Timeline.astro` | Vertical timeline / git-log style. Takes array of `{ year, title, description }` entries. |
| `src/components/ContactLinks.astro` | Contact card list. Takes array of `{ icon, label, href, description }`. |
| `src/components/OpenSourceRepos.astro` | Repo strip. Takes array of `{ name, description, href, language, stars }`. |

### New Content (Frontmatter / Data)
- `src/data/skills.ts` — skills JSON data (categories + tools). **Requires real content from user before implementation.**
- `src/data/timeline.ts` — career/education timeline entries (`{ year, title, description }`). **Requires real content from user before implementation.**
- `src/data/repos.ts` — open source repo list (`{ name, description, href, language, stars }`). **Requires real content from user before implementation.**

> These files will be created with clearly labelled placeholder data during implementation. The user should replace the placeholder data with real content before the site goes live.

---

## 4. Page Designs

### Homepage (`/`)
Sections in order:
1. **Animated terminal hero** — `TerminalWindow` component typing out `whoami` → name/role, `cat about.txt` → one-line bio, `ls projects/` → up to 3 featured project slugs followed by `+N more` if there are additional ones (e.g. `foe-buildings/  airflow-pipeline/  fastapi-ml/  +2 more`). Pure CSS typewriter animation (no JS library). CTAs: `cd projects/` (→ /projects) and `cat resume.pdf` (→ /resume).
2. **Featured projects** — 2-column `ProjectCard` grid, filtered by `featured: true`
3. **Skills JSON** — `SkillsJSON` component with full stack
4. **Open source** — `OpenSourceRepos` strip

### Projects Index (`/projects`)
- Page header styled as `// ls projects/`
- 2-column `ProjectCard` grid (all projects)

### Project Detail (`/projects/[slug]`)
- Nav breadcrumb shows full path: `~/portfolio/projects/slug`
- Header: comment label `// projects/slug/README.md`, title, subtitle, tags, GitHub/Live links
- Stats block: `TerminalWindow` wrapping `StatsGrid` (now JSON-formatted)
- Prose: `// case-study` label above `prose` content

### About (`/about`)
Sections in order:
1. **Header** — `// cat about.md` label, name, bio paragraph (rewritten with personality)
2. **Timeline** — `// git log --oneline --career` label, `Timeline` component
3. **Contact** — `// contact` label, `ContactLinks` component

---

## 5. Animation

**Terminal hero typewriter:** CSS-only, using `@keyframes` with `steps()` and `animation-delay` to sequence lines. Each line types out then the next begins. Cursor blink on the last active line. Approximate timing: ~1.5s per command line, ~0.8s for the response/output line, ~0.4s gap before next command. Total sequence ~7s, then loops or holds at the final cursor.

**Page load:** Staggered fade-in on homepage sections using `animation-delay` — hero first, then projects, then skills/open source.

**Hover states:**
- `ProjectCard` — border color shifts from `--color-border` to `--color-cyan`, subtle `translateY(-2px)`
- Nav links — color shift from `--color-muted` to `--color-cyan`
- Contact/repo cards — border brightens, background tints slightly

No scroll-triggered animations (keeps the implementation simple and accessible).

---

## 6. Removed

- **Light mode / ThemeToggle** — the terminal aesthetic is dark-only. Removing the toggle simplifies the CSS and removes `dark:` variants throughout.
- **Inter font** — replaced by JetBrains Mono + IBM Plex Sans.
- **Blue-600 accent** — replaced by the full syntax-highlight palette.

---

## 7. Out of Scope

- Writing / Notes blog section (deferred)
- Contact form with backend (links only, no form submission)
- Fetching live GitHub stats via API (repos section uses static data)
