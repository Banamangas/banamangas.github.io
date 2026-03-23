# Player FoE Bot

> Discord bot for real-time player and guild leaderboards across all 24 French FoE servers

---

## Overview

A Discord bot that scrapes player rankings from all 24 French Forge of Empires servers daily, stores them in SQLite, and exposes slash commands for leaderboard queries with 24-hour progression diffs. Players can look up any player's current rank and stats, or see who gained the most battles or points in the last 24 hours — across any server or all servers combined.

---

## The Problem

FoE leaderboard data is scattered across 24 separate server pages on a third-party site (scoredb.io). There was no way to query cross-server rankings, see 24-hour progression, or look up a specific player without manually browsing multiple pages. Guild officers tracking competitive players had no tooling for it.

---

## What I Built

### Automated Daily Scraper

Every day at 6:00 AM (Paris time), the bot fetches all 24 French servers in parallel using a `ThreadPoolExecutor`. For each server, it:
1. Sends an HTTP request to `foe.scoredb.io/fr<N>/`
2. Parses the HTML rankings table with BeautifulSoup
3. Loads the result into a Pandas DataFrame
4. Writes to SQLite (current `players` table + `players_history` archive)

The API already provides 24-hour diffs (`pointsDif`, `battlesDif`) which are stored directly alongside the snapshot.

### Database

Two SQLite tables with targeted indexes for fast query patterns:

```sql
players          -- current snapshot (replaced daily)
players_history  -- 7-day rolling archive (auto-purged)
```

Indexes on `server`, `name`, `(player_id, server)`, and `snapshot_date` keep lookups O(log n) even as the history table grows. Explicit SQLite type mappings prevent pandas INTEGER overflow on large point values.

### Discord Commands

| Command | What it does |
|---------|-------------|
| `/player <name> <server>` | Full profile: rank, era, guild, points, battles, 24h diffs |
| `/top_battles [limit] [server]` | Top players by 24h battle gain |
| `/top_points [limit] [server]` | Top players by 24h point gain |
| `/top_guilds [limit] [server]` | Top guilds by total 24h battles |
| `/scan` | Admin-only manual trigger for a full scrape |

All name and server arguments support autocomplete with fuzzy matching.

---

## Technical Highlights

### Multi-Server Parallel Fetching
All 24 servers are fetched concurrently via `ThreadPoolExecutor`. Each thread handles one server independently, with per-thread error handling so a single failing server doesn't block the others.

### 7-Day Retention Policy
History rows older than 7 days are automatically deleted after each scrape. This keeps the database size bounded without losing recent trend data.

### SQLite Indexing Strategy
Four indexes are created at initialisation time, chosen to match the bot's query patterns:
- `idx_server` — for server-filtered top lists
- `idx_name` — for player lookups by name
- `idx_player_server` — for composite player+server queries
- `idx_history_date` — for history retention purges

### DTYPE Enforcement
Pandas infers SQLite column types from Python types, which can cause INTEGER overflow on large FP point values. All numeric columns are explicitly typed at write time to prevent silent truncation.

### Timezone-Aware Scheduling
APScheduler is configured with `Europe/Paris` timezone so the 6:00 AM trigger adjusts correctly for DST transitions — no off-by-one-hour bugs.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Discord | discord.py 2.3.0+ |
| Web Scraping | BeautifulSoup 4.11+, requests, aiohttp |
| Data Processing | Pandas, NumPy |
| Database | SQLite3 (indexed, 2 tables) |
| Concurrency | concurrent.futures (ThreadPoolExecutor) |
| Scheduling | APScheduler (pytz, Europe/Paris) |
| Visualisations | Plotly 5.15.0+ |
| Config | python-dotenv |
| Data Source | foe.scoredb.io |

---

## Key Numbers

| Metric | Value |
|--------|-------|
| Python lines | ~1,020 |
| Servers monitored | 24 (FR1–FR24) |
| Database size | ~354 MB |
| History retention | 7 days |
| Database tables | 2 |
| Database indexes | 4 |
| Slash commands | 5 + 1 admin |
| Update schedule | Daily at 6:00 AM (Paris) |
