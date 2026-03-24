---
title: "FOE Buildings Database REST API"
subtitle: "Full-stack data pipeline & REST API for Forge of Empires"
date: 2026-02-01
tags: [Python, FastAPI, Selenium, SQLite, Pandas, Discord.py, APScheduler]
thumbnail: "/images/projects/foe-buildings.png"
live: "https://foe-buildings.duckdns.org/docs"
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

The system automatically scrapes building statistics from the official FOE game using Selenium, normalises the data with Pandas, and stores it in a SQLite database. A FastAPI REST API exposes 19 endpoints for querying buildings, ages, and stats. A Discord bot lets players query the database directly from their guild servers.

Querying the data requires an active API Key with the `read` or `admin` role.

The API is also used in the project [FoE Building Database - Streamlit App](/projects/foe-building-analyzer).

## Architecture

- **Scraper** — Selenium-driven crawler that handles dynamic wiki pages
- **Parser** — JSON parser to transform heavily nested-JSON data into a Pandas DataFrame
- **Pipeline** — Pandas transformations to normalise stat columns across game ages
- **Database** — SQLite with a schema covering buildings, ages, levels, and stats
- **API** — FastAPI with typed Pydantic models, automatic OpenAPI docs
- **Bot** — Discord.py integration with slash commands for in-game lookups
- **Scheduler** — APScheduler runs weekly scrapes to keep data current

## Discord Bot

This comes as an additional way to have a better access to building stats in Forge of Empires. You can query any building of the game (in English or French language), define a specific era, and the statistics of the building will be displayed in a embed message, alongside the building image.

<figure>                                                                                  
    <img src="../../images/projects/building_discord_command_example.png" alt="Use of the /building command on Discord" />                       
    <figcaption>Use of the /building command on Discord</figcaption>
</figure>

There is also a slash command called `/consumables` which will list all buildings producing one specific consumable of your choice. A useful command, as the use of consumables in-game has become more and more important throughout the recent years.

<figure>                                                                                  
    <img src="../../images/projects/discord-bot-consumable-command.png" alt="Use of the /consumables command on Discord" />                       
    <figcaption>Use of the /consumables command on Discord.</figcaption>
</figure>

## Testing

255 tests cover the scraper, pipeline transformations, API endpoints, and bot command parsing. The test suite runs against a real SQLite database to catch schema drift.
