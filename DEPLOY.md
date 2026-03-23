# Portfolio Website — Deployment Guide

---

## Deployment Options

| Platform | Cost | Custom Domain | HTTPS | Auto-Deploy | Best For |
|----------|------|---------------|-------|-------------|----------|
| **GitHub Pages** | Free | Yes | Yes (auto) | Yes (GitHub Actions) | Default choice — simple, reliable |
| **Cloudflare Pages** | Free | Yes | Yes (auto) | Yes (Git integration) | Faster global CDN, analytics included |
| **Netlify** | Free tier | Yes | Yes (auto) | Yes (Git integration) | If you want form handling or serverless functions later |
| **Your VPS** | Already paid | Yes (Caddy) | Yes (Caddy) | Manual or scripted | If you want everything on one server |

**Recommended: GitHub Pages** — zero cost, zero maintenance, automatic deploys on every push.

---

## Option 1: GitHub Pages (Recommended)

### Prerequisites

- A GitHub account
- A GitHub repository for the portfolio site
- The site builds locally (`npm run build` succeeds)

### Step 1 — Create the GitHub Repository

```bash
# From the portfolio-website/ directory
gh repo create portfolio-website --public --source=. --push

# Or manually:
git remote add origin git@github.com:YOUR_USERNAME/portfolio-website.git
git push -u origin main
```

### Step 2 — Configure Astro for GitHub Pages

Edit `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Replace with your actual domain (or GitHub Pages URL)
  site: 'https://YOUR_USERNAME.github.io',

  // Only needed if the repo name is NOT <username>.github.io
  // If your repo is "portfolio-website", uncomment this:
  // base: '/portfolio-website',

  integrations: [tailwind(), sitemap()],

  build: {
    assets: '_assets',
  },
});
```

> **Tip:** If you name your repo `YOUR_USERNAME.github.io`, GitHub Pages serves it at the root URL — no `base` path needed. This is the cleanest option.

### Step 3 — Add the GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

  # Allow manual trigger from Actions tab
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# Only allow one deployment at a time
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 4 — Enable GitHub Pages in Repo Settings

1. Go to your repository on GitHub
2. **Settings** > **Pages**
3. Under "Source", select **GitHub Actions**
4. Push a commit to `main` — the workflow triggers automatically

### Step 5 — Verify Deployment

```bash
# Check the workflow run
gh run list --limit 1

# View details if it failed
gh run view <run-id> --log
```

Your site is live at `https://YOUR_USERNAME.github.io/portfolio-website/` (or `https://YOUR_USERNAME.github.io/` if the repo is named `YOUR_USERNAME.github.io`).

---

## Option 2: Cloudflare Pages

### Prerequisites

- A Cloudflare account (free tier)
- Repository pushed to GitHub or GitLab

### Steps

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create**
2. Select **Connect to Git** and authorize your GitHub account
3. Select your `portfolio-website` repository
4. Configure the build:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** Set environment variable `NODE_VERSION` = `22`
5. Click **Save and Deploy**

Cloudflare automatically redeploys on every push to `main`. Preview deployments are created for every PR.

---

## Option 3: Netlify

### Prerequisites

- A Netlify account (free tier)
- Repository pushed to GitHub

### Steps

1. Log in to [Netlify](https://app.netlify.com/) > **Add new site** > **Import an existing project**
2. Connect to GitHub and select the repository
3. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site**

Alternatively, deploy from the CLI:

```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

---

## Option 4: Self-Hosted (Your VPS with Caddy)

### Prerequisites

- Your existing VPS with Caddy installed
- Node.js 18+ on the VPS (for building)
- A (sub)domain pointing to the VPS

### Step 1 — Clone and Build on the VPS

```bash
cd /home/ubuntu
git clone git@github.com:YOUR_USERNAME/portfolio-website.git
cd portfolio-website
npm ci
npm run build
```

The built site is in `dist/` — plain static HTML, CSS, and JS files.

### Step 2 — Configure Caddy

Add a block to `/etc/caddy/Caddyfile`:

```caddyfile
portfolio.yourdomain.com {
    root * /home/ubuntu/portfolio-website/dist
    file_server

    # Enable gzip/brotli compression
    encode gzip zstd

    # Cache static assets aggressively
    @assets path /_assets/* /images/*
    header @assets Cache-Control "public, max-age=31536000, immutable"

    # SPA-style fallback for clean URLs
    try_files {path} {path}.html {path}/index.html
}
```

Reload Caddy:

```bash
sudo systemctl reload caddy
```

Caddy handles HTTPS automatically via Let's Encrypt.

### Step 3 — Automate Deploys (Optional)

Create a simple deploy script at `/home/ubuntu/portfolio-website/deploy.sh`:

```bash
#!/bin/bash
set -euo pipefail

cd /home/ubuntu/portfolio-website
git pull origin main
npm ci
npm run build

echo "Deploy complete: $(date)"
```

Then either:
- Run manually after each push: `bash deploy.sh`
- Set up a GitHub Actions workflow that SSHs into the VPS and runs it
- Use a webhook listener to trigger on push

---

## Custom Domain Setup

### For GitHub Pages

1. Buy a domain (Namecheap, Google Domains, Cloudflare Registrar — ~$10-15/year)
2. In your DNS provider, add:
   - **A records** pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME record** for `www` pointing to `YOUR_USERNAME.github.io`
3. In your repo: create a file `public/CNAME` containing your domain:
   ```
   yourdomain.dev
   ```
4. In GitHub repo **Settings** > **Pages**, enter your custom domain
5. Check "Enforce HTTPS" (GitHub provisions a Let's Encrypt certificate automatically)
6. Update `site` in `astro.config.mjs`:
   ```js
   site: 'https://yourdomain.dev',
   ```

### For Cloudflare Pages

1. In the Cloudflare Pages project settings, go to **Custom domains**
2. Add your domain — if the domain is already on Cloudflare, DNS is configured automatically
3. If the domain is elsewhere, add the CNAME record Cloudflare provides

### For Netlify

1. In the Netlify site settings, go to **Domain management** > **Add custom domain**
2. Follow the DNS configuration instructions provided
3. Netlify provisions HTTPS automatically

---

## Post-Deployment Checklist

After your first successful deploy, verify everything works:

- [ ] Site loads at the correct URL (custom domain or platform URL)
- [ ] HTTPS works (padlock icon in browser)
- [ ] Landing page renders correctly
- [ ] Project gallery shows all projects
- [ ] Individual project pages render Markdown properly
- [ ] Images and thumbnails load (check browser console for 404s)
- [ ] Dark/light mode toggle works
- [ ] Mobile layout is responsive (test at 375px width)
- [ ] Links to GitHub repos and live demos work
- [ ] Resume PDF downloads correctly
- [ ] Sitemap exists at `/sitemap-index.xml`
- [ ] Meta tags are correct (check with browser dev tools or [metatags.io](https://metatags.io/))

---

## Updating the Site

### Adding a new project

1. Create a new `.md` file in `src/content/projects/`
2. Add a thumbnail to `public/images/projects/`
3. Commit and push to `main`
4. Deployment happens automatically (GitHub Actions / Cloudflare / Netlify)

### Updating existing content

1. Edit the relevant `.md` file or `.astro` component
2. Commit and push
3. Auto-deployed within ~1-2 minutes

### Checking deployment status

```bash
# GitHub Pages
gh run list --limit 1

# Cloudflare Pages — check the dashboard or:
# https://dash.cloudflare.com/ > Workers & Pages > your project > Deployments
```

---

## Monitoring & Analytics (Optional)

For privacy-friendly, lightweight analytics (no cookies, GDPR-compliant):

### Plausible Analytics (recommended)

```html
<!-- Add to BaseLayout.astro <head> -->
<script defer data-domain="yourdomain.dev" src="https://plausible.io/js/script.js"></script>
```

- **Hosted:** $9/month at plausible.io
- **Self-hosted:** Free, runs in Docker on your VPS

### Cloudflare Web Analytics (free)

If using Cloudflare Pages, analytics are built in — just enable in the dashboard. For other hosts:

```html
<!-- Add to BaseLayout.astro before </body> -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

---

## Requirements Summary

### Build Requirements (CI / local)

| Requirement | Details |
|-------------|---------|
| Node.js | >= 18.17.1 (22.x LTS recommended) |
| npm | >= 9.0 |
| Disk space | ~200 MB (node_modules) + ~10 MB (build output) |
| Memory | ~512 MB for build |
| Build time | ~10-30 seconds |

### Hosting Requirements

| Platform | Cost | Requirements |
|----------|------|-------------|
| GitHub Pages | Free | GitHub account, public repo (or Pro for private) |
| Cloudflare Pages | Free | Cloudflare account |
| Netlify | Free tier | Netlify account |
| Self-hosted (VPS) | ~$5-10/month | Node.js on server, Caddy/Nginx, domain |

### Custom Domain

| Item | Cost | Required? |
|------|------|-----------|
| Domain registration | ~$10-15/year | Optional but strongly recommended |
| DNS hosting | Free (Cloudflare, Namecheap, etc.) | Included with domain |
| SSL/HTTPS | Free (auto-provisioned by all platforms) | Automatic |

### Total Cost

| Setup | Monthly | Yearly |
|-------|---------|--------|
| GitHub Pages + custom domain | $0 | ~$12 |
| Cloudflare Pages + custom domain | $0 | ~$12 |
| Self-hosted VPS + domain | ~$5-10 | ~$72-132 |
| Without custom domain | $0 | $0 |
