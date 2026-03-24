---
title: "FoE Building Analyzer - Streamlit App"
subtitle: "Interactive Streamlit web app for analyzing and comparing Forge of Empires buildings"
date: 2025-03-01
tags: [Python, Streamlit, Pandas, NumPy, Plotly, AG-Grid, Pillow]
thumbnail: "/images/projects/foe-building-analyzer.png"
live: "https://foe-buildings-database.streamlit.app/"
github: "https://github.com/Banamangas/FoE-Buildings-Database"
featured: true
stats:
  - label: "Python Lines"
    value: "~5,300"
  - label: "Weightable Columns"
    value: "41"
  - label: "Eras Supported"
    value: "22"
  - label: "Languages"
    value: "EN / FR"
---

A data-driven web application that lets Forge of Empires players filter, compare, and score any of the game's buildings across 22 eras. It connects to the VPS REST API, applies a customizable weighted efficiency model, and renders the results in an interactive data grid with visualizations.

## The Problem

Forge of Empires has 1,082 buildings, each with up to 22 era variants and up to 80+ attributes - production rates, boost percentages, consumables, military output...

The problem was therefore multifaceted:
- Players had no tool to answer questions like *"which buildings give the most value per tile in the?"*. Comparing even a handful of buildings manually is impractical.
- No tool or database was publicly available. Wikis (both official and fandom) exist, but you would need several tabs open at once.
- Nowadays, every event adds a considerable number of building to the game, making it difficult to keep track (10 events per year).

## The solutions

### A comprehensive data pipeline

Data is pulled every day through the FoE Database REST API project I developed and host on a VPS. This data is already pre-processed from the in-game heavily nested JSON files, and cached for the day on the Streamlit App server (not in the user's browser) for avoiding to make repeated call to the API.

Therefore, every building can be displayed from a single interface (Main Page) by just searching for its name. Also, a table referencing all the in-game buildings can be found in another tab, with an interactive Data Grid.

### Weighted Efficiency Calculator

The core feature: a three-step pipeline that converts every building's attributes to a single comparable score.

| Step | What it does |
|------|-------------|
| **Boost application** | Applies the player's city production context + each building's self-boost to raw values |
| **Base reversal** | Reverses combined boost percentages back to true base values |
| **Weighted sum** | Multiplies each column's value by the player's custom weight and sums the result |

41 columns are weightable. The result is a direct, real-value score - no normalisation artifacts. Boost buildings are automatically converted from percentages to equivalent production based on the player's actual city context.

### Interactive Data Grid

AG-Grid renders the filtered, scored dataset with (pre-)selected columns. You can also find:
- Group presets
- sorting
- pagination
- range and categorical filters with AND/OR logic
- heatmap colouring (for the Weighted efficiency score only)
- CSV/JSON export

### City Analysis

Players can paste their in-game building inventory to visualize what is in their city in a table format. It can also be ranked by weighted efficiency gain.

## Technical Highlights

**Direct weighted sum (no normalisation):** Most scoring systems normalise values to [0,1], which could distort comparisons or make them less user-friendly. Normalization is still something I consider switching to, as some metrics cannot be weighted if not normalized (steps between some metrics is too important for a direct weighted sum approach).

**Session-persisted state:** All user preferences (language, filters, weights, city context) persist across Streamlit reruns via session state. Browser refreshes are still clearing users' preferences like language choice. 

**Dual-layer image handling:** Building icons are resolved via ForgeHX CDN hash maps, base64-encoded, and LRU-cached for inline rendering in the grid. This avoids fetching on repeat icons and images from the official servers.
