---
title: "Great Buildings Bot"
subtitle: "Discord slash-command bot for Great Building lookups and FP leveling cost calculations"
date: 2024-11-01
tags: [Python, Discord.py, Flask, difflib]
thumbnail: "/images/projects/gbs-bot.png"
github: "https://github.com/Banamangas/gbs_bot"
featured: false
stats:
  - label: "Python Lines"
    value: "~1,480"
  - label: "Slash Commands"
    value: "4"
  - label: "GB Database"
    value: "4.1 MB JSON"
  - label: "Languages"
    value: "EN / FR"
---

A Discord bot that gives Forge of Empires players instant access to Great Building FP costs, medals and blueprints. Players can look up any GB's level costs and rewards — directly from Discord, with interactive buttons for deeper exploration.

## The Problem

Great Buildings are one of the core mechanics in FoE. Knowing how much it will cost to level a Great Building is sometimes tricky without the right tools (like FoE-Helper). FoE-Helper and foe.tools solve this, but are either a browser extension or a website — not always accessible. Having a Discord slash command bot means the information is one command away, wherever you are.

## Commands

| Command | What it does |
|---------|-------------|
| `/gb <name>` | Looks up a GB: age, size, build cost |
| `/gb_list [age]` | Lists all GBs, optionally filtered by age |
| `/gb_level <name> <level>` | Level cost and rewards with Previous/Next buttons |
| `/invest <gb> <from> <to> [ratio]` | FP leveling cost breakdown across a level range |

<figure>                                                                                  
    <img src="/images/projects/discord-bot-invest-command.png" alt="Use of the /invest command on Discord" />                       
    <figcaption>Use of the /invest command on Discord</figcaption>
</figure>

All GB names support autocomplete with fuzzy matching.

## Leveling Cost Calculator

The `/invest` command shows what it costs a GB owner to level across a range, accounting for the FP that investors contribute:

```
FPs Saved = Sum of all position reward FPs × Ratio
User Cost = Total Level Cost − FPs Saved
```

**FPs Saved** is the total FP contributed by investors — each position's reward FP multiplied by the ratio, representing what investors put in to secure that position at the current market rate. **User Cost** is what the owner pays net after those contributions. Results are colour-coded in Discord embeds (green when investor contributions exceed total cost, red otherwise). The FP ratio defaults to 1.9 but can be overridden via a Discord modal (0.0–2.0 range). Bonus rewards per position (blueprints, medals) are also totalled across the full level range.

## Technical Highlights

**Fuzzy matching:** GB names are matched with `difflib.get_close_matches(cutoff=0.6)`, so typos like `/gb coliseum` still resolve to "The Colosseum" correctly.

**Interactive Discord UI:** `GBLevelView` and `InvestmentView` subclass `discord.ui.View` with button callbacks and a 300-second timeout. State (current level, position) is held in the view object, so Previous/Next buttons update in-place without re-querying.

**Clean data layer:** All GB data lives in a single JSON file. The `GBData` class wraps it with query methods, keeping the command handlers thin and testable.
