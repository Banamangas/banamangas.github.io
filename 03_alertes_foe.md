# Alertes FoE

> Scheduled Discord announcement bot for recurring Forge of Empires guild events

---

## Overview

A Discord bot that sends automated, timezone-aware announcements to a guild server on a fixed weekly schedule. It handles three recurring event types (Quantum Incursions, Guild Battles), alternates message content on even/odd ISO weeks, and recovers gracefully if it was offline at the scheduled time. Deployed on Render.com.

---

## The Problem

Guild officers had to manually post reminder messages for recurring weekly events — often forgetting, posting at the wrong time, or sending inconsistent content. Events like Quantum Incursions alternate behaviour every two weeks (even/odd ISO week), which added another layer of error-prone manual tracking.

---

## What I Built

### Scheduled Message Engine

Three recurring schedules, all in Paris timezone with automatic DST handling:

| Day | Time | Event |
|-----|------|-------|
| Thursday | 7:55 AM | Quantum Incursion (even/odd week variant) |
| Tuesday | 8:00 AM | Guild Battles |
| Sunday | 6:00 PM | Weekly recap |

APScheduler runs as a background task inside the async Discord client event loop.

### Even/Odd Week Alternation

Thursday messages vary based on ISO week number parity. The bot computes `datetime.isocalendar().week % 2` at send time — no manual tracking needed.

### Catch-Up Mechanism

If the bot was offline at 7:55 AM on Thursday, it retries the message any time before 10:00 AM that day. A `sent_dates.json` file persists send history across restarts to prevent duplicates.

### Admin Commands

- `!test_thursday`, `!test_tuesday`, `!test_sunday` — trigger scheduled messages on demand for testing
- `!status` — shows bot health, last sent message timestamps, and current week parity

### Keep-Alive

A minimal Flask server responds to HTTP pings to prevent Render.com's free tier from sleeping the dyno between scheduled runs.

---

## Technical Highlights

### Critical Bug Fix: Language Inconsistency
The original codebase mixed French and English day names in the same comparison chain, causing Thursday messages to silently fail. The root cause was identified and fixed by centralising all day name mappings in a `DayMapping` class — one source of truth for French↔English conversions.

### Class-Based Refactor
The original monolithic script was restructured into focused classes:
- `Config` — all constants (token, channel IDs, message text, schedules)
- `DayMapping` — French/English day name bidirectional mapping
- `MessageThemes` — Discord embed styling (colours, icons, field layout) per day
- `ScheduledMessenger` — scheduling logic, duplicate prevention, catch-up window

### Structured Logging
All `print()` calls were replaced with `logging` at appropriate levels (debug/info/warning/error), with output to both console and rotating file.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Discord | discord.py 2.6.4+ |
| Scheduling | APScheduler 1.2.2 |
| Timezone | pytz (Europe/Paris) |
| Keep-Alive | Flask 3.0.2 |
| Persistence | JSON file (sent dates) |
| Config | python-dotenv |
| Deployment | Render.com (free tier) |

---

## Key Numbers

| Metric | Value |
|--------|-------|
| Python lines | ~1,050 |
| Scheduled message types | 4 |
| Timezone | Europe/Paris (DST-aware) |
| Catch-up window | 7:55 AM – 10:00 AM |
| Persistence | 2 JSON files |
| Deployment | Render.com |
