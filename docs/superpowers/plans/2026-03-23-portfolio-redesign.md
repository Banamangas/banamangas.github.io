# Portfolio Redesign — Terminal Aesthetic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio from a generic Tailwind scaffold into a distinctive terminal/developer aesthetic with new components, new pages sections, and a complete visual system overhaul.

**Architecture:** Design-system-first — rewrite `global.css` with CSS custom properties establishing the full dark terminal palette, then update each component and page to consume those tokens. New functionality (timeline, skills JSON, open source strip, animated hero) is additive on top of the updated base.

**Tech Stack:** Astro 5, Tailwind CSS v4, JetBrains Mono + IBM Plex Sans (Google Fonts), CSS-only animations (no JS animation libraries)

> **Note on testing:** This is a static Astro site with no unit test framework. Verification at each step uses `npx astro check` (TypeScript type checking) and `npm run build` (full build). Visual verification uses `npm run dev`. These replace the red/green TDD cycle — the equivalent of "write test → see it fail → implement → see it pass" is "confirm build passes → make change → confirm build still passes + check visually."

---

## File Map

### Modified
| File | What changes |
|---|---|
| `src/styles/global.css` | Full rewrite — CSS custom properties, font imports, base styles |
| `src/layouts/BaseLayout.astro` | Terminal window chrome nav, remove ThemeToggle |
| `src/components/TechBadge.astro` | Category-based color assignment |
| `src/components/ProjectCard.astro` | Terminal surface card, directory-style titles |
| `src/components/StatsGrid.astro` | Replaced with JSON-formatted block |
| `src/pages/index.astro` | Animated terminal hero + skills JSON + open source sections |
| `src/pages/about.astro` | Bio rewrite + timeline + contact |
| `src/pages/projects/[...slug].astro` | Terminal path breadcrumb, JSON stats block |
| `src/pages/projects/index.astro` | Comment-style section label |

### Created
| File | Purpose |
|---|---|
| `src/components/TerminalWindow.astro` | Reusable terminal window shell (traffic-light dots, title bar) |
| `src/components/SkillsJSON.astro` | Syntax-highlighted JSON skills block |
| `src/components/Timeline.astro` | Vertical git-log style timeline |
| `src/components/ContactLinks.astro` | Contact card list |
| `src/components/OpenSourceRepos.astro` | Open source repo strip |
| `src/data/skills.ts` | Skills data by category (placeholder — user fills in) |
| `src/data/timeline.ts` | Career timeline entries (placeholder — user fills in) |
| `src/data/repos.ts` | Open source repo list (placeholder — user fills in) |

### Deleted
| File | Reason |
|---|---|
| `src/components/ThemeToggle.astro` | Dark-only design — no toggle needed |

---

## Task 1: CSS Design System

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro` (font preconnects only)

- [ ] **Step 1: Confirm baseline build passes**

```bash
cd /home/born/Github/portfolio && npm run build
```
Expected: build succeeds with no errors.

- [ ] **Step 2: Rewrite `src/styles/global.css`**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

:root {
  --bg: #0d1117;
  --surface: #161b22;
  --surface-2: #21262d;
  --border: #30363d;
  --text: #e6edf3;
  --muted: #7d8590;
  --body: #c9d1d9;
  --green: #3fb950;
  --cyan: #79c0ff;
  --purple: #d2a8ff;
  --orange: #ffa657;
  --red: #f85149;
}

@layer base {
  html {
    scroll-behavior: smooth;
    background-color: var(--bg);
    color: var(--text);
    font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;
  }

  body {
    background-color: var(--bg);
    color: var(--text);
  }

  a {
    color: var(--cyan);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* Prose overrides for terminal theme */
  .prose {
    --tw-prose-body: var(--body);
    --tw-prose-headings: var(--text);
    --tw-prose-links: var(--cyan);
    --tw-prose-bold: var(--text);
    --tw-prose-code: var(--purple);
    --tw-prose-hr: var(--border);
    --tw-prose-quotes: var(--muted);
    --tw-prose-captions: var(--muted);
    --tw-prose-counters: var(--muted);
    --tw-prose-bullets: var(--muted);
    color: var(--body);
  }

  code {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.875em;
    color: var(--purple);
  }
}

/* Typewriter animation used by homepage hero */
@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

- [ ] **Step 3: Update font preconnects in `src/layouts/BaseLayout.astro`**

Remove the existing Google Fonts `<link>` tags. The font is now loaded via `@import` in `global.css`. Also remove all `dark:` variant classes and the `ThemeToggle` import — that comes in Task 2. For now just remove the font links from `<head>`:

```html
<!-- Remove these three lines -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 4: Run type-check and build**

```bash
npx astro check && npm run build
```
Expected: no type errors, build succeeds. The site will look broken visually (colors gone) — that's expected until the next tasks apply the new palette.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: establish terminal design system in global.css"
```

---

## Task 2: BaseLayout — Terminal Nav Chrome

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Delete: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Rewrite `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Data Science & Engineering Portfolio' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body style="background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column;font-family:'IBM Plex Sans',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased;">

    <!-- Terminal window nav -->
    <nav style="background:var(--surface-2);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;">
      <div style="max-width:56rem;margin:0 auto;padding:0 1.5rem;height:3rem;display:flex;align-items:center;gap:1rem;">
        <!-- Traffic light dots -->
        <div style="display:flex;gap:6px;flex-shrink:0;">
          <a href="/" style="width:12px;height:12px;border-radius:50%;background:#ff5f57;display:block;" title="Home"></a>
          <div style="width:12px;height:12px;border-radius:50%;background:#febc2e;"></div>
          <div style="width:12px;height:12px;border-radius:50%;background:#28c840;"></div>
        </div>
        <!-- Path breadcrumb -->
        <div style="flex:1;text-align:center;color:var(--muted);font-size:0.6875rem;font-family:'JetBrains Mono',monospace;letter-spacing:0.04em;">
          ~/portfolio
        </div>
        <!-- Nav links -->
        <div style="display:flex;gap:1.5rem;flex-shrink:0;">
          <a href="/projects" style="color:var(--cyan);font-size:0.6875rem;font-family:'JetBrains Mono',monospace;text-decoration:none;transition:color 0.15s;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--cyan)'">projects</a>
          <a href="/about" style="color:var(--cyan);font-size:0.6875rem;font-family:'JetBrains Mono',monospace;text-decoration:none;transition:color 0.15s;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--cyan)'">about</a>
          <a href="/resume" style="color:var(--cyan);font-size:0.6875rem;font-family:'JetBrains Mono',monospace;text-decoration:none;transition:color 0.15s;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--cyan)'">resume</a>
        </div>
      </div>
    </nav>

    <main style="max-width:56rem;margin:0 auto;padding:3rem 1.5rem;flex:1;width:100%;">
      <slot />
    </main>

    <footer style="border-top:1px solid var(--border);text-align:center;font-size:0.75rem;color:var(--muted);padding:1.5rem;font-family:'JetBrains Mono',monospace;">
      <span style="color:var(--green);">banamangas@portfolio</span><span style="color:var(--text);">:~$</span> <span style="color:var(--muted);">built with Astro & Tailwind CSS</span>
    </footer>

  </body>
</html>
```

- [ ] **Step 2: Delete `src/components/ThemeToggle.astro`**

```bash
rm src/components/ThemeToggle.astro
```

- [ ] **Step 3: Run type-check and build**

```bash
npx astro check && npm run build
```
Expected: passes. If there's a "ThemeToggle not found" error, search for any remaining import and remove it.

- [ ] **Step 4: Visual check**

```bash
npm run dev
```
Open http://localhost:4321. The nav should show traffic-light dots, `~/portfolio` center path, and cyan nav links on a dark surface.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro && git rm src/components/ThemeToggle.astro
git commit -m "feat: terminal window nav chrome, remove theme toggle"
```

---

## Task 3: TechBadge — Syntax Token Style

**Files:**
- Modify: `src/components/TechBadge.astro`

- [ ] **Step 1: Rewrite `src/components/TechBadge.astro`**

```astro
---
interface Props {
  tag: string;
}

const { tag } = Astro.props;

// Assign color by category
const LANGUAGES = ['Python', 'SQL', 'Bash', 'R', 'JavaScript', 'TypeScript', 'Go', 'Rust'];
const FRAMEWORKS = ['FastAPI', 'Airflow', 'dbt', 'Flask', 'Selenium', 'Discord.py', 'APScheduler', 'Pandas', 'NumPy', 'Scikit-learn'];
const INFRA = ['Docker', 'GitHub Actions', 'Kubernetes', 'PostGIS', 'GIS', 'Linux'];
const DATA = ['PostgreSQL', 'SQLite', 'MySQL', 'Redis', 'MongoDB', 'Spark', 'Kafka'];

type Color = 'purple' | 'cyan' | 'green' | 'orange' | 'muted';

function getColor(t: string): Color {
  if (LANGUAGES.includes(t)) return 'purple';
  if (FRAMEWORKS.includes(t)) return 'cyan';
  if (INFRA.includes(t)) return 'green';
  if (DATA.includes(t)) return 'orange';
  return 'muted';
}

const colorMap: Record<Color, { bg: string; text: string; border: string }> = {
  purple: { bg: 'rgba(210,168,255,0.1)', text: '#d2a8ff', border: 'rgba(210,168,255,0.3)' },
  cyan:   { bg: 'rgba(121,192,255,0.1)', text: '#79c0ff', border: 'rgba(121,192,255,0.3)' },
  green:  { bg: 'rgba(63,185,80,0.1)',   text: '#3fb950', border: 'rgba(63,185,80,0.3)'   },
  orange: { bg: 'rgba(255,166,87,0.1)',  text: '#ffa657', border: 'rgba(255,166,87,0.3)'  },
  muted:  { bg: 'rgba(125,133,144,0.1)', text: '#7d8590', border: 'rgba(125,133,144,0.3)' },
};

const color = colorMap[getColor(tag)];
---

<span style={`display:inline-flex;align-items:center;padding:2px 10px;border-radius:4px;font-size:0.6875rem;font-weight:500;font-family:'JetBrains Mono',monospace;background:${color.bg};color:${color.text};border:1px solid ${color.border};`}>
  {tag}
</span>
```

- [ ] **Step 2: Run type-check and build**

```bash
npx astro check && npm run build
```
Expected: passes. Tags on project pages will now show with category-based colors.

- [ ] **Step 3: Commit**

```bash
git add src/components/TechBadge.astro
git commit -m "feat: syntax-token style TechBadge with category-based colors"
```

---

## Task 4: TerminalWindow Component

**Files:**
- Create: `src/components/TerminalWindow.astro`

- [ ] **Step 1: Create `src/components/TerminalWindow.astro`**

```astro
---
interface Props {
  title?: string;
  class?: string;
}

const { title = '', class: className = '' } = Astro.props;
---

<div class={className} style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <!-- Title bar -->
  <div style="background:var(--surface-2);padding:10px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);">
    <div style="display:flex;gap:6px;">
      <span style="width:12px;height:12px;border-radius:50%;background:#ff5f57;display:block;"></span>
      <span style="width:12px;height:12px;border-radius:50%;background:#febc2e;display:block;"></span>
      <span style="width:12px;height:12px;border-radius:50%;background:#28c840;display:block;"></span>
    </div>
    {title && (
      <span style="flex:1;text-align:center;color:var(--muted);font-size:0.6875rem;font-family:'JetBrains Mono',monospace;letter-spacing:0.04em;">
        {title}
      </span>
    )}
  </div>
  <!-- Body -->
  <div style="padding:20px 24px;font-family:'JetBrains Mono',monospace;font-size:0.8125rem;line-height:1.8;">
    <slot />
  </div>
</div>
```

- [ ] **Step 2: Run type-check and build**

```bash
npx astro check && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TerminalWindow.astro
git commit -m "feat: add reusable TerminalWindow component"
```

---

## Task 5: ProjectCard — Terminal Aesthetic

**Files:**
- Modify: `src/components/ProjectCard.astro`

- [ ] **Step 1: Rewrite `src/components/ProjectCard.astro`**

```astro
---
import TechBadge from './TechBadge.astro';

interface Props {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  thumbnail: string;
  featured?: boolean;
}

const { slug, title, subtitle, tags, thumbnail, featured } = Astro.props;
---

<a
  href={`/projects/${slug}`}
  style="display:block;background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden;text-decoration:none;transition:border-color 0.15s,transform 0.15s;"
  onmouseover="this.style.borderColor='var(--cyan)';this.style.transform='translateY(-2px)'"
  onmouseout="this.style.borderColor='var(--border)';this.style.transform='translateY(0)'"
>
  <!-- Thumbnail -->
  <div style="aspect-ratio:16/9;background:var(--surface-2);overflow:hidden;">
    <img
      src={thumbnail}
      alt={title}
      style="width:100%;height:100%;object-fit:cover;transition:transform 0.3s;"
      onmouseover="this.style.transform='scale(1.03)'"
      onmouseout="this.style.transform='scale(1)'"
      loading="lazy"
    />
  </div>
  <!-- Body -->
  <div style="padding:14px 16px;">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:4px;">
      <span style="color:var(--cyan);font-size:0.8125rem;font-weight:600;font-family:'JetBrains Mono',monospace;">
        {slug}/
      </span>
      {featured && (
        <span style="color:var(--green);font-size:0.6875rem;font-family:'JetBrains Mono',monospace;flex-shrink:0;">featured</span>
      )}
    </div>
    <p style="font-size:0.75rem;color:var(--muted);margin-bottom:10px;line-height:1.5;">{subtitle}</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;">
      {tags.slice(0, 4).map((tag) => <TechBadge tag={tag} />)}
      {tags.length > 4 && (
        <span style="font-size:0.6875rem;color:var(--muted);font-family:'JetBrains Mono',monospace;align-self:center;">+{tags.length - 4}</span>
      )}
    </div>
  </div>
</a>
```

- [ ] **Step 2: Run type-check and build**

```bash
npx astro check && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectCard.astro
git commit -m "feat: terminal-style ProjectCard with directory title and syntax badges"
```

---

## Task 6: StatsGrid — JSON Block

**Files:**
- Modify: `src/components/StatsGrid.astro`

- [ ] **Step 1: Rewrite `src/components/StatsGrid.astro`**

```astro
---
interface Stat {
  label: string;
  value: string;
}

interface Props {
  stats: Stat[];
}

const { stats } = Astro.props;
---

<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:16px 20px;font-family:'JetBrains Mono',monospace;font-size:0.8125rem;line-height:1.9;margin:1.5rem 0;max-width:480px;">
  <span style="color:var(--text);">{'{'}</span>
  {stats.map((stat, i) => (
    <div style="padding-left:20px;">
      <span style="color:var(--cyan);">"{stat.label}"</span>
      <span style="color:var(--text);">: </span>
      <span style="color:var(--orange);">"{stat.value}"</span>
      {i < stats.length - 1 && <span style="color:var(--text);">,</span>}
    </div>
  ))}
  <span style="color:var(--text);">{'}'}</span>
</div>
```

- [ ] **Step 2: Run type-check and build**

```bash
npx astro check && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/StatsGrid.astro
git commit -m "feat: StatsGrid rendered as syntax-highlighted JSON block"
```

---

## Task 7: Data Files (Placeholder Content)

**Files:**
- Create: `src/data/skills.ts`
- Create: `src/data/timeline.ts`
- Create: `src/data/repos.ts`

- [ ] **Step 1: Create `src/data/skills.ts`**

```typescript
// TODO: Replace with your actual skills before going live

export interface SkillsData {
  [category: string]: string[];
}

export const skills: SkillsData = {
  languages: ['Python', 'SQL', 'Bash'],
  frameworks: ['FastAPI', 'Airflow', 'dbt'],
  data: ['PostgreSQL', 'PostGIS', 'Pandas', 'SQLite'],
  infra: ['Docker', 'GitHub Actions'],
};
```

- [ ] **Step 2: Create `src/data/timeline.ts`**

```typescript
// TODO: Replace with your actual experience before going live

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color?: 'green' | 'cyan' | 'purple' | 'orange';
}

export const timeline: TimelineEntry[] = [
  {
    year: '2024',
    title: 'Role Title @ Company',
    description: 'Short description of what you did and what you shipped.',
    color: 'green',
  },
  {
    year: '2023',
    title: 'Role Title @ Company',
    description: 'Short description of what you did and what you shipped.',
    color: 'cyan',
  },
  {
    year: '2021',
    title: 'Degree — University',
    description: 'Specialisation or relevant focus area.',
    color: 'purple',
  },
];
```

- [ ] **Step 3: Create `src/data/repos.ts`**

```typescript
// TODO: Replace with your actual repos before going live

export interface Repo {
  name: string;
  description: string;
  href: string;
  language: string;
  stars?: number;
}

export const repos: Repo[] = [
  {
    name: 'repo-name',
    description: 'Short description of what this repo does.',
    href: 'https://github.com/Banamangas/repo-name',
    language: 'Python',
    stars: 0,
  },
];
```

- [ ] **Step 4: Run type-check**

```bash
npx astro check
```

- [ ] **Step 5: Commit**

```bash
git add src/data/
git commit -m "feat: add placeholder data files for skills, timeline, and repos"
```

---

## Task 8: New Components

**Files:**
- Create: `src/components/SkillsJSON.astro`
- Create: `src/components/Timeline.astro`
- Create: `src/components/ContactLinks.astro`
- Create: `src/components/OpenSourceRepos.astro`

- [ ] **Step 1: Create `src/components/SkillsJSON.astro`**

```astro
---
import type { SkillsData } from '../data/skills';

interface Props {
  skills: SkillsData;
}

const { skills } = Astro.props;
const entries = Object.entries(skills);
---

<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:16px 20px;font-family:'JetBrains Mono',monospace;font-size:0.8125rem;line-height:1.9;max-width:520px;">
  <span style="color:var(--text);">{'{'}</span>
  {entries.map(([category, tools], i) => (
    <div style="padding-left:20px;">
      <span style="color:var(--cyan);">"{category}"</span>
      <span style="color:var(--text);">: [</span>
      {tools.map((tool, j) => (
        <span>
          <span style="color:var(--orange);">"{tool}"</span>
          {j < tools.length - 1 && <span style="color:var(--text);">, </span>}
        </span>
      ))}
      <span style="color:var(--text);">]{i < entries.length - 1 ? ',' : ''}</span>
    </div>
  ))}
  <span style="color:var(--text);">{'}'}</span>
</div>
```

- [ ] **Step 2: Create `src/components/Timeline.astro`**

```astro
---
import type { TimelineEntry } from '../data/timeline';

interface Props {
  entries: TimelineEntry[];
}

const { entries } = Astro.props;

const dotColors: Record<string, string> = {
  green: 'var(--green)',
  cyan: 'var(--cyan)',
  purple: 'var(--purple)',
  orange: 'var(--orange)',
};
---

<div style="position:relative;max-width:560px;">
  <!-- Vertical line -->
  <div style="position:absolute;left:60px;top:6px;bottom:6px;width:1px;background:var(--border);"></div>

  {entries.map((entry) => {
    const dotColor = dotColors[entry.color ?? 'cyan'];
    return (
      <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:28px;position:relative;">
        <div style="min-width:40px;color:var(--muted);font-size:0.6875rem;font-family:'JetBrains Mono',monospace;text-align:right;padding-top:3px;flex-shrink:0;">
          {entry.year}
        </div>
        <div style={`width:10px;height:10px;border-radius:50%;background:${dotColor};border:2px solid var(--bg);flex-shrink:0;margin-top:5px;position:relative;z-index:1;`}></div>
        <div>
          <div style="color:var(--text);font-size:0.8125rem;font-weight:600;font-family:'JetBrains Mono',monospace;margin-bottom:3px;">{entry.title}</div>
          <div style="color:var(--muted);font-size:0.75rem;line-height:1.6;">{entry.description}</div>
        </div>
      </div>
    );
  })}
</div>
```

- [ ] **Step 3: Create `src/components/ContactLinks.astro`**

```astro
---
export interface ContactLink {
  icon: string;
  label: string;
  href: string;
  description: string;
}

interface Props {
  links: ContactLink[];
}

const { links } = Astro.props;
---

<div style="display:flex;flex-direction:column;gap:10px;max-width:420px;">
  {links.map((link) => (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 18px;display:flex;align-items:center;gap:14px;text-decoration:none;transition:border-color 0.15s;"
      onmouseover="this.style.borderColor='var(--cyan)'"
      onmouseout="this.style.borderColor='var(--border)'"
    >
      <span style="font-size:1.1rem;flex-shrink:0;">{link.icon}</span>
      <div>
        <div style="color:var(--cyan);font-size:0.8125rem;font-family:'JetBrains Mono',monospace;">{link.label}</div>
        <div style="color:var(--muted);font-size:0.6875rem;margin-top:1px;">{link.description}</div>
      </div>
    </a>
  ))}
</div>
```

- [ ] **Step 4: Create `src/components/OpenSourceRepos.astro`**

```astro
---
import type { Repo } from '../data/repos';

interface Props {
  repos: Repo[];
}

const { repos } = Astro.props;

const langColors: Record<string, string> = {
  Python: 'purple',
  SQL: 'orange',
  TypeScript: 'cyan',
  JavaScript: 'cyan',
  Bash: 'green',
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  purple: { bg: 'rgba(210,168,255,0.1)', text: '#d2a8ff', border: 'rgba(210,168,255,0.3)' },
  orange: { bg: 'rgba(255,166,87,0.1)',  text: '#ffa657', border: 'rgba(255,166,87,0.3)'  },
  cyan:   { bg: 'rgba(121,192,255,0.1)', text: '#79c0ff', border: 'rgba(121,192,255,0.3)' },
  green:  { bg: 'rgba(63,185,80,0.1)',   text: '#3fb950', border: 'rgba(63,185,80,0.3)'   },
  muted:  { bg: 'rgba(125,133,144,0.1)', text: '#7d8590', border: 'rgba(125,133,144,0.3)' },
};
---

<div style="display:flex;flex-direction:column;gap:10px;max-width:560px;">
  {repos.map((repo) => {
    const c = colorMap[langColors[repo.language] ?? 'muted'];
    return (
      <a
        href={repo.href}
        target="_blank"
        rel="noopener noreferrer"
        style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;text-decoration:none;transition:border-color 0.15s;"
        onmouseover="this.style.borderColor='var(--cyan)'"
        onmouseout="this.style.borderColor='var(--border)'"
      >
        <div>
          <div style="color:var(--cyan);font-size:0.8125rem;font-family:'JetBrains Mono',monospace;margin-bottom:3px;">⬡ {repo.name}</div>
          <div style="color:var(--muted);font-size:0.75rem;">{repo.description}</div>
        </div>
        <div style="display:flex;gap:12px;align-items:center;flex-shrink:0;margin-left:16px;">
          {repo.stars !== undefined && repo.stars > 0 && (
            <span style="color:var(--muted);font-size:0.6875rem;font-family:'JetBrains Mono',monospace;">★ {repo.stars}</span>
          )}
          <span style={`background:${c.bg};color:${c.text};border:1px solid ${c.border};padding:2px 8px;border-radius:4px;font-size:0.6875rem;font-family:'JetBrains Mono',monospace;`}>
            {repo.language}
          </span>
        </div>
      </a>
    );
  })}
</div>
```

- [ ] **Step 5: Run type-check and build**

```bash
npx astro check && npm run build
```
Expected: passes. These components are not yet used on any pages, so no visual change yet.

- [ ] **Step 6: Commit**

```bash
git add src/components/SkillsJSON.astro src/components/Timeline.astro src/components/ContactLinks.astro src/components/OpenSourceRepos.astro
git commit -m "feat: add SkillsJSON, Timeline, ContactLinks, and OpenSourceRepos components"
```

---

## Task 9: Homepage — Animated Terminal Hero

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import SkillsJSON from '../components/SkillsJSON.astro';
import OpenSourceRepos from '../components/OpenSourceRepos.astro';
import TerminalWindow from '../components/TerminalWindow.astro';
import { getCollection } from 'astro:content';
import { skills } from '../data/skills';
import { repos } from '../data/repos';

const featured = (await getCollection('projects'))
  .filter((p) => p.data.featured)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

// Build the ls output: up to 3 slugs + "+N more"
const lsOutput = featured
  .slice(0, 3)
  .map((p) => `${p.id}/`)
  .join('  ');
const remaining = featured.length > 3 ? `  +${featured.length - 3} more` : '';
---

<BaseLayout title="Portfolio">
  <!-- Hero: Animated Terminal -->
  <section style="padding:3rem 0 2.5rem;">
    <TerminalWindow title="zsh — 80×24">
      <div class="hero-terminal">
        <!-- Line 1: prompt + command -->
        <div class="tl tl-1">
          <span style="color:var(--green);">banamangas@portfolio</span><span style="color:var(--text);">:</span><span style="color:var(--cyan);">~</span><span style="color:var(--text);"> $ </span><span style="color:var(--text);">whoami</span>
        </div>
        <!-- Line 2: response -->
        <div class="tl tl-2" style="color:var(--orange);padding-left:2px;">Banamangas — Data Scientist &amp; Engineer</div>
        <!-- Line 3: prompt + command -->
        <div class="tl tl-3">
          <span style="color:var(--green);">banamangas@portfolio</span><span style="color:var(--text);">:</span><span style="color:var(--cyan);">~</span><span style="color:var(--text);"> $ </span><span style="color:var(--text);">cat about.txt</span>
        </div>
        <!-- Line 4: response -->
        <div class="tl tl-4" style="color:var(--body);font-family:'IBM Plex Sans',sans-serif;font-size:0.8125rem;line-height:1.7;padding-left:2px;max-width:480px;">
          I build data pipelines, APIs, and tools that turn raw data into something useful.
        </div>
        <!-- Line 5: prompt + command -->
        <div class="tl tl-5">
          <span style="color:var(--green);">banamangas@portfolio</span><span style="color:var(--text);">:</span><span style="color:var(--cyan);">~</span><span style="color:var(--text);"> $ </span><span style="color:var(--text);">ls projects/</span>
        </div>
        <!-- Line 6: response -->
        <div class="tl tl-6" style="color:var(--cyan);padding-left:2px;">{lsOutput}{remaining}</div>
        <!-- Line 7: cursor prompt -->
        <div class="tl tl-7">
          <span style="color:var(--green);">banamangas@portfolio</span><span style="color:var(--text);">:</span><span style="color:var(--cyan);">~</span><span style="color:var(--text);"> $ </span><span class="cursor">▋</span>
        </div>
      </div>
    </TerminalWindow>

    <!-- CTAs -->
    <div style="margin-top:1.5rem;display:flex;gap:10px;flex-wrap:wrap;">
      <a href="/projects" style="display:inline-block;background:#238636;color:#fff;padding:8px 18px;border-radius:6px;font-size:0.75rem;font-family:'JetBrains Mono',monospace;text-decoration:none;transition:background 0.15s;" onmouseover="this.style.background='#2ea043'" onmouseout="this.style.background='#238636'">
        cd projects/
      </a>
      <a href="/resume" style="display:inline-block;background:transparent;color:var(--cyan);border:1px solid var(--border);padding:8px 18px;border-radius:6px;font-size:0.75rem;font-family:'JetBrains Mono',monospace;text-decoration:none;transition:border-color 0.15s;" onmouseover="this.style.borderColor='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)'">
        cat resume.pdf
      </a>
    </div>
  </section>

  <!-- Featured Projects -->
  {featured.length > 0 && (
    <section style="padding:2rem 0;">
      <div style="color:var(--muted);font-size:0.6875rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:1.25rem;">// featured projects</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;">
        {featured.map((p) => (
          <ProjectCard
            slug={p.id}
            title={p.data.title}
            subtitle={p.data.subtitle}
            tags={p.data.tags}
            thumbnail={p.data.thumbnail}
            featured={p.data.featured}
          />
        ))}
      </div>
    </section>
  )}

  <!-- Skills JSON -->
  <section style="padding:2rem 0;">
    <div style="color:var(--muted);font-size:0.6875rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:1.25rem;">// skills.json</div>
    <SkillsJSON skills={skills} />
  </section>

  <!-- Open Source -->
  {repos.length > 0 && (
    <section style="padding:2rem 0;">
      <div style="color:var(--muted);font-size:0.6875rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:1.25rem;">// open source</div>
      <OpenSourceRepos repos={repos} />
    </section>
  )}
</BaseLayout>

<style>
  /* Typewriter animation — CSS only, no JS */
  /* Timing: ~1.5s per command, ~0.8s response, ~0.4s gap */

  .tl {
    overflow: hidden;
    white-space: nowrap;
    opacity: 0;
  }

  /* Line 1: prompt types out — starts at 0s */
  .tl-1 {
    animation: typing 1.5s steps(50, end) 0.3s forwards, appear 0s 0.3s forwards;
    width: 0;
  }

  /* Line 2: response appears — at 1.8s */
  .tl-2 {
    white-space: normal;
    animation: appear 0s 1.8s forwards;
  }

  /* Line 3: prompt types — at 2.6s */
  .tl-3 {
    animation: typing 1.5s steps(50, end) 2.6s forwards, appear 0s 2.6s forwards;
    width: 0;
  }

  /* Line 4: response appears — at 4.1s */
  .tl-4 {
    white-space: normal;
    animation: appear 0s 4.1s forwards;
  }

  /* Line 5: prompt types — at 4.9s */
  .tl-5 {
    animation: typing 1.5s steps(50, end) 4.9s forwards, appear 0s 4.9s forwards;
    width: 0;
  }

  /* Line 6: response appears — at 6.4s */
  .tl-6 {
    animation: appear 0s 6.4s forwards;
  }

  /* Line 7: final cursor prompt — at 6.9s */
  .tl-7 {
    animation: appear 0s 6.9s forwards;
  }

  @keyframes typing {
    from { width: 0; }
    to { width: 100%; }
  }

  @keyframes appear {
    to { opacity: 1; }
  }

  .cursor {
    color: var(--text);
    animation: blink 1s step-end 6.9s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
</style>
```

- [ ] **Step 2: Run type-check and build**

```bash
npx astro check && npm run build
```

- [ ] **Step 3: Visual check — verify animation**

```bash
npm run dev
```
Open http://localhost:4321. The terminal hero should type out each command in sequence over ~7 seconds. Verify: commands type left-to-right, responses appear instantly, cursor blinks at end.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: animated terminal hero, skills JSON, and open source sections on homepage"
```

---

## Task 10: About Page

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Rewrite `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Timeline from '../components/Timeline.astro';
import ContactLinks from '../components/ContactLinks.astro';
import type { ContactLink } from '../components/ContactLinks.astro';
import { timeline } from '../data/timeline';

const contactLinks: ContactLink[] = [
  {
    icon: '⬡',
    label: 'github.com/Banamangas',
    href: 'https://github.com/Banamangas',
    description: 'Code, projects, contributions',
  },
  // TODO: Add email or other contact methods
];
---

<BaseLayout title="About — Portfolio">

  <!-- Header -->
  <section style="padding:2.5rem 0 2rem;border-bottom:1px solid var(--border);">
    <div style="color:var(--muted);font-size:0.6875rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:10px;">// cat about.md</div>
    <h1 style="color:var(--text);font-size:1.75rem;font-weight:700;font-family:'JetBrains Mono',monospace;letter-spacing:-0.02em;margin-bottom:12px;">Banamangas</h1>
    <p style="color:var(--body);font-size:0.9375rem;line-height:1.8;max-width:540px;">
      Data scientist and engineer. I work at the intersection of infrastructure and insight — building the pipelines, APIs, and tools that make data useful. I care about clean systems, reproducible results, and shipping things that actually run in production.
    </p>
  </section>

  <!-- Timeline -->
  <section style="padding:2rem 0;border-bottom:1px solid var(--border);">
    <div style="color:var(--muted);font-size:0.6875rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:1.25rem;">// git log --oneline --career</div>
    <Timeline entries={timeline} />
  </section>

  <!-- Contact -->
  <section style="padding:2rem 0;">
    <div style="color:var(--muted);font-size:0.6875rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:1.25rem;">// contact</div>
    <ContactLinks links={contactLinks} />
  </section>

</BaseLayout>
```

- [ ] **Step 2: Run type-check and build**

```bash
npx astro check && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: redesign about page with bio, timeline, and contact sections"
```

---

## Task 11: Project Detail Page

**Files:**
- Modify: `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Rewrite `src/pages/projects/[...slug].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import TechBadge from '../../components/TechBadge.astro';
import StatsGrid from '../../components/StatsGrid.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((p) => ({ params: { slug: p.id }, props: { project: p } }));
}

const { project } = Astro.props;
const { Content } = await render(project);
const { title, subtitle, tags, github, live, stats } = project.data;
const slug = project.id;
---

<BaseLayout title={`${title} — Portfolio`} description={subtitle}>
  <article>

    <!-- Header -->
    <header style="padding:2rem 0 1.5rem;border-bottom:1px solid var(--border);margin-bottom:0;">
      <div style="color:var(--muted);font-size:0.6875rem;letter-spacing:0.1em;font-family:'JetBrains Mono',monospace;margin-bottom:10px;">// projects/{slug}/README.md</div>
      <h1 style="color:var(--text);font-size:1.75rem;font-weight:700;font-family:'JetBrains Mono',monospace;letter-spacing:-0.02em;margin-bottom:8px;">{title}</h1>
      <p style="color:var(--muted);font-size:0.9375rem;margin-bottom:16px;">{subtitle}</p>

      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px;">
        {tags.map((tag) => <TechBadge tag={tag} />)}
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer"
             style="background:var(--surface);border:1px solid var(--border);color:var(--cyan);padding:7px 16px;border-radius:6px;font-size:0.75rem;font-family:'JetBrains Mono',monospace;text-decoration:none;transition:border-color 0.15s;"
             onmouseover="this.style.borderColor='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)'">
            ⬡ GitHub
          </a>
        )}
        {live && (
          <a href={live} target="_blank" rel="noopener noreferrer"
             style="background:#238636;color:#fff;padding:7px 16px;border-radius:6px;font-size:0.75rem;font-family:'JetBrains Mono',monospace;text-decoration:none;transition:background 0.15s;"
             onmouseover="this.style.background='#2ea043'" onmouseout="this.style.background='#238636'">
            ↗ Live Demo
          </a>
        )}
      </div>
    </header>

    <!-- Stats JSON -->
    {stats && stats.length > 0 && (
      <div style="padding:1.5rem 0;border-bottom:1px solid var(--border);">
        <div style="color:var(--muted);font-size:0.6875rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:14px;">// stats.json</div>
        <StatsGrid stats={stats} />
      </div>
    )}

    <!-- Prose -->
    <div style="padding:1.5rem 0;">
      <div style="color:var(--muted);font-size:0.6875rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:1rem;">// case-study</div>
      <div class="prose prose-invert max-w-none">
        <Content />
      </div>
    </div>

    <!-- Back link -->
    <div style="padding:1rem 0;border-top:1px solid var(--border);">
      <a href="/projects" style="color:var(--muted);font-size:0.75rem;font-family:'JetBrains Mono',monospace;text-decoration:none;" onmouseover="this.style.color='var(--cyan)'" onmouseout="this.style.color='var(--muted)'">← cd ../</a>
    </div>

  </article>
</BaseLayout>
```

- [ ] **Step 2: Run type-check and build**

```bash
npx astro check && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/[...slug].astro
git commit -m "feat: terminal-style project detail page with JSON stats"
```

---

## Task 12: Projects Index + Final Verification

**Files:**
- Modify: `src/pages/projects/index.astro`

- [ ] **Step 1: Update `src/pages/projects/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import { getCollection } from 'astro:content';

const projects = (await getCollection('projects')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);
---

<BaseLayout title="Projects — Portfolio">
  <div style="padding:2rem 0 1.5rem;">
    <div style="color:var(--muted);font-size:0.6875rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:8px;">// ls projects/</div>
    <h1 style="color:var(--text);font-size:1.75rem;font-weight:700;font-family:'JetBrains Mono',monospace;letter-spacing:-0.02em;margin-bottom:4px;">Projects</h1>
    <p style="color:var(--muted);font-size:0.8125rem;font-family:'JetBrains Mono',monospace;">{projects.length} director{projects.length !== 1 ? 'ies' : 'y'}</p>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;">
    {projects.map((p) => (
      <ProjectCard
        slug={p.id}
        title={p.data.title}
        subtitle={p.data.subtitle}
        tags={p.data.tags}
        thumbnail={p.data.thumbnail}
        featured={p.data.featured}
      />
    ))}
  </div>
</BaseLayout>
```

- [ ] **Step 2: Full type-check and build**

```bash
npx astro check && npm run build
```
Expected: clean pass with zero type errors, zero build errors.

- [ ] **Step 3: Full visual walkthrough**

```bash
npm run dev
```
Verify each page:
- `/` — terminal hero animates correctly, featured cards show, skills JSON renders, open source strip renders
- `/projects` — grid of redesigned cards
- `/projects/foe-buildings` — terminal header, JSON stats, prose, back link
- `/about` — bio, timeline, contact links

- [ ] **Step 4: Final commit**

```bash
git add src/pages/projects/index.astro
git commit -m "feat: terminal-style projects index page"
```

---

## After Implementation

1. **Fill in data files** — replace placeholder content in `src/data/skills.ts`, `src/data/timeline.ts`, `src/data/repos.ts` with real information
2. **Add contact email** — update `contactLinks` array in `src/pages/about.astro` if you want an email link
3. **Verify on mobile** — check the terminal hero and card grid at small viewport widths
