---
title: "FOE Buildings Database"
subtitle: "Full-stack data pipeline & REST API for Forge of Empires"
date: 2025-01-01
tags: [Python, FastAPI, Selenium, SQLite, Pandas, Discord.py, APScheduler]
thumbnail: "/images/projects/foe-buildings.png"
github: "https://github.com/Banamangas/foe_buildings_database"
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

A full-stack data engineering project that scrapes, processes, and serves building data from the browser game *Forge of Empires*.

## What it does

The system automatically scrapes building statistics from the official FOE wiki using Selenium, normalises the data with Pandas, and stores it in a SQLite database. A FastAPI REST API exposes 19 endpoints for querying buildings, ages, and stats. A Discord bot lets players query the database directly from their guild servers.

## Architecture

- **Scraper** — Selenium-driven crawler that handles dynamic wiki pages
- **Pipeline** — Pandas transformations to normalise stat columns across game ages
- **Database** — SQLite with a schema covering buildings, ages, levels, and stats
- **API** — FastAPI with typed Pydantic models, automatic OpenAPI docs
- **Bot** — Discord.py integration with slash commands for in-game lookups
- **Scheduler** — APScheduler runs weekly scrapes to keep data current

## Testing

255 tests cover the scraper, pipeline transformations, API endpoints, and bot command parsing. The test suite runs against a real SQLite database to catch schema drift.
