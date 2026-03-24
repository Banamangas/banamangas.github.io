# FOE Buildings Database

> Full-stack data pipeline & API for the browser game Forge of Empires

---

## Overview

A production-grade system that **scrapes, parses, stores, and serves** building metadata from the strategy game Forge of Empires. The project runs 24/7 on a VPS, powering a REST API, a Discord bot with fuzzy search, and automated daily update announcements — all built from scratch in Python.

**Live system:** HTTPS-secured API, two systemd services, automated Mon-Fri updates.

---

## The Problem

Forge of Empires has **1,082 buildings**, each with up to **22 era-specific variants** and **up to 80+ attributes** (production rates, boosts, military units, consumables). This data lives in obfuscated, deeply nested game files with no public API. Players and community tool builders had no reliable, structured way to access or compare building stats.

---

## What I Built

### 1. Automated Data Pipeline (ETL)

| Stage | Module | What it does |
|-------|--------|-------------|
| **Extract** | `xhr_url_finder.py` | Selenium-based browser automation that logs into FOE, intercepts live XHR requests, and captures rotating game API URLs |
| **Extract** | `data_updater.py` | Downloads two large JSON files (54 MB + 3.9 MB) via async HTTP (aiohttp) |
| **Transform** | `building_parser.py` | 1,250-line parser that normalizes deeply nested game JSON into 80+ structured fields per building-era record |
| **Load** | `building_analyzer.py` | Flattens parsed data into Pandas DataFrames, writes to indexed SQLite (~23,800 rows) |
| **Enrich** | `translation_retriever.py` | Fetches French building names from the FR game server via a separate Selenium session |

**Runs automatically** Mon-Fri at 6 PM (Paris time) via APScheduler with timezone-aware cron triggers and misfire tolerance.

### 2. REST API (FastAPI)

- **19 endpoints** with role-based access control (`admin` / `read`)
- **Paginated queries** with multi-filter support (era, event, name)
- **Changelog endpoint** tracking field-level diffs across updates (with float tolerance)
- **Operational metrics** endpoint (uptime, DB stats, update history)
- **Kubernetes-style health probes** (`/health` for liveness, `/ready` for DB connectivity + data freshness)
- **Background update trigger** via POST (non-blocking)

### 3. Authentication & Security

- SHA-256 hashed API keys (raw keys never stored)
- **Sliding 24-hour rate limiting** per key (in-memory, thread-safe)
- Full **audit logging** to SQLite (IP, endpoint, status, timestamp)
- Key rotation support without re-issuing
- Configurable retention purge for request logs

### 4. Discord Integration

- **Slash-command bot** with fuzzy search (rapidfuzz), autocomplete, and bilingual support (EN/FR)
- **Webhook announcer** that posts formatted changelogs after each update:
  - Stat ranges displayed chronologically across eras
  - Custom emoji fallback chain (server emoji -> Unicode -> text label)
  - Smart message chunking to respect Discord's 2,000-char limit

### 5. Computed Changelog

After every update, the system diffs old vs new data **column by column** with float tolerance (1e-6 threshold), recording only genuine changes as structured JSON diffs. This powers both the API `/changelog` endpoint and Discord announcements.

---

## Technical Highlights

### Complex Data Transformation
The game's raw JSON is deeply nested: `components -> eras -> production_options -> products`. The parser walks this tree, applies per-era aggregation logic, discovers dynamic columns at parse time (consumables and boosts are not hardcoded), and flattens everything into clean relational rows. A single building entity can explode into 22 database rows.

### Production-Grade Architecture
This isn't a prototype. It runs on a real VPS with:
- **systemd services** for process management
- **Caddy reverse proxy** for HTTPS termination
- **DuckDNS** for stable hostname
- Health probes, graceful shutdown handling, and structured logging throughout

### Comprehensive Testing
**255 pytest tests** across 5 modules, all isolated (no .env, no real DB, no Selenium needed):
- 60 parser tests (boost aggregation, production parsing, era-variant handling)
- 88 API tests (all endpoints, auth enforcement, pagination, filters)
- 46 auth tests (hashing, rate limiting, key rotation, audit logging)
- CI on **Python 3.10 / 3.11 / 3.12** with ruff lint enforcement

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Scraping | Selenium 4, Chrome/Chromium |
| Async HTTP | aiohttp |
| Data Processing | Pandas, NumPy |
| Database | SQLite3 (indexed, two separate DBs) |
| API | FastAPI + Uvicorn |
| Scheduling | APScheduler 3, pytz |
| Discord | discord.py 2, rapidfuzz |
| Linting & CI | ruff, pytest, GitHub Actions |
| Deployment | Caddy, systemd, DuckDNS |

---

## Key Numbers

| Metric | Value |
|--------|-------|
| Building-era records | ~23,800 |
| Unique buildings tracked | 1,082 |
| Fields per record | 80+ |
| Raw data processed per update | ~58 MB JSON |
| Database size | ~114 MB |
| API endpoints | 19 |
| Test count | 255 |
| Core Python modules | 8 (~9,700 lines) |
| Supported languages | 2 (English, French) |

---

## What This Demonstrates

- **End-to-end data pipeline ownership** — from web scraping through parsing, storage, and serving
- **Complex domain modeling** — mapping messy, real-world game data to clean relational schemas
- **API design & security** — authentication, rate limiting, audit trails, health probes
- **Automation & reliability** — scheduled jobs, graceful degradation, comprehensive error handling
- **Test-driven development** — 255 tests, CI matrix across 3 Python versions
- **Production deployment** — real VPS, HTTPS, systemd, monitoring
