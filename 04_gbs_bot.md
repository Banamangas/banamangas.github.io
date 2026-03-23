# Great Buildings Bot (gbs_bot)

> Discord slash-command bot for Great Building lookups and FP investment ROI analysis

---

## Overview

A Discord bot that gives Forge of Empires players instant access to Great Building statistics and investment profitability calculations. Players can look up any GB's level costs and rewards, then run an ROI analysis across a level range at a custom FP value ratio — directly from Discord, with interactive buttons for deeper exploration.

---

## The Problem

Great Buildings are the endgame progression mechanic in FoE. Investing Forge Points (FP) in another player's GB earns reward FPs, but only if your position isn't sniped before the building levels. Whether a given investment is profitable depends on the FP value ratio your guild uses — a metric that changes over time and differs between guilds. Players had to use external spreadsheets or mental arithmetic to evaluate positions. There was no fast, in-Discord tool.

---

## What I Built

### Commands

| Command | What it does |
|---------|-------------|
| `/gb <name>` | Looks up a GB: age, size, build cost, description |
| `/gb_list [age]` | Lists all GBs, optionally filtered by age |
| `/gb_level <name> <level>` | Shows level cost and reward breakdown with Previous/Next buttons |
| `/invest <gb> <from_level> <to_level> [ratio]` | ROI analysis across a level range with position comparison |

All GB names and ages support autocomplete with fuzzy matching (difflib, 0.6 cutoff).

### Investment Calculator

The `/invest` command computes profitability for every reward position at each level in a range:

```
Net Profit = (Total Reward FP × Ratio) - Total Level Cost
ROI % = (Net Profit / Total Level Cost) × 100
```

Results are colour-coded in Discord embeds (green = profit, red = loss) and ranked by ROI. The FP ratio defaults to 1.9 but can be customised via a Discord modal (0.0–2.0 range).

### Interactive UI

- **Level browsing**: Previous/Next buttons on `/gb_level` responses (300s timeout)
- **Position comparison**: Button to expand all 5 reward positions side-by-side
- **Custom ratio**: Modal input for `/invest` ratio overrides without re-running the command

---

## Technical Highlights

### Fuzzy Matching
GB names are matched with `difflib.get_close_matches(cutoff=0.6)`, so `/gb colosseum` finds "The Colosseum" and typos like `/gb coliseum` still resolve correctly.

### Data Architecture
All GB data lives in a single 4.1 MB JSON file (`gbs-3571d88.json`) with hierarchical structure: GB metadata → level array → position rewards. The `GBData` class wraps this with clean query methods, keeping the command handlers thin.

### Discord UI Views
`GBLevelView` and `InvestmentView` subclass `discord.ui.View` with button callbacks and a 300-second interaction timeout. The view holds a reference to the current level/position state, so Previous/Next buttons update in-place without re-querying.

### Bilingual Support
All embeds, labels, and error messages are routed through a translation module (EN/FR) with a fallback chain, consistent with the other FoE tools in the ecosystem.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Discord | discord.py 2.3.0+ |
| Data | JSON (4.1 MB GB database) |
| Fuzzy Matching | difflib (standard library) |
| Keep-Alive | Flask 2.3.0+ |
| Config | python-dotenv |
| Translations | Custom JSON system (EN/FR) |

---

## Key Numbers

| Metric | Value |
|--------|-------|
| Python lines | ~1,480 |
| Slash commands | 4 |
| Interactive components | Buttons, Modals |
| GB database | 4.1 MB JSON, 60+ Great Buildings |
| FP ratio range | 0.0 – 2.0 |
| Interaction timeout | 300 seconds |
| Languages | 2 (English, French) |
