# FoE Building Analyzer

> Interactive Streamlit web app for analyzing and comparing Forge of Empires buildings

---

## Overview

A data-driven web application that lets Forge of Empires players **filter, compare, and score** any of the game's 1,000+ buildings across 22 eras. It connects to the VPS REST API, applies a customizable weighted efficiency model, and renders the results in an interactive data grid with visualizations. Deployed on Streamlit Cloud.

**Live system:** Streamlit Cloud, backed by VPS API with 23-hour client-side caching.

---

## The Problem

Forge of Empires has 1,082 buildings, each with up to 22 era variants and 80+ attributes — production rates, boost percentages, consumables, military output. Players had no tool to answer questions like *"which buildings give the most value per tile for my current city setup?"* or *"how do event buildings compare across eras?"* Comparing even a handful of buildings manually is impractical.

---

## What I Built

### 1. Data Loading & Caching

The app fetches paginated data from the VPS REST API and caches it for 23 hours in session state. Translations (EN/FR) are resolved via a fallback chain: requested language JSON → English JSON → hardcoded era dict → original key. All building names, event names, and era labels are localised.

### 2. Weighted Efficiency Calculator

The core feature: a three-step pipeline that converts every building's attributes to a single comparable score.

| Step | What it does |
|------|-------------|
| **Boost application** | Applies the player's city production context + each building's self-boost to raw values |
| **Base reversal** | Reverses combined boost percentages back to true base values |
| **Weighted sum** | Multiplies each column's value by the player's custom weight and sums the result |

41 columns are weightable. The result is a direct, real-value score — no normalisation artifacts. Boost buildings are automatically converted from percentages to equivalent production based on the player's actual city context.

### 3. Interactive Data Grid

AG-Grid renders the filtered, scored dataset with:
- Column groups (8 presets), sorting, pagination
- Per-square and per-era statistics
- Range and categorical filters with AND/OR logic
- Heatmap colouring on numeric columns
- CSV/JSON export

### 4. Visual Analytics

Plotly charts: scatter plots, histograms, heatmaps, radar charts, Sankey diagrams. All update live as filters change.

### 5. City Analysis

Players can paste their in-game building inventory (clipboard format) to receive personalised replacement recommendations ranked by weighted efficiency gain.

---

## Technical Highlights

### Direct Weighted Sum (No Normalisation)
Most scoring systems normalise values to [0,1], which distorts comparisons. This calculator uses absolute production values so that a 10% boost on 1,000 FP/day means exactly 100 FP/day in the score — not an arbitrary 0.4.

### Three-Step Boost Pipeline
Boost percentage buildings require reversing the combined boost to find the true base before weighting. The pipeline handles stacking boosts from both the player's city and the building's own self-boost correctly.

### Session-Persisted State
All user preferences (language, filters, column selection, weights, city context) persist across Streamlit reruns via session state, making the app feel stateful without a backend.

### Dual-Layer Image Handling
Building icons are resolved via ForgeHX CDN hash maps, base64-encoded, and LRU-cached for inline rendering in the grid.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web App | Streamlit |
| Data Processing | Pandas, NumPy |
| Data Grid | AG-Grid (streamlit-aggrid) |
| Visualisations | Plotly |
| API Client | requests (with 23h session cache) |
| Image Handling | Pillow |
| Translations | Custom JSON-based system (EN/FR) |
| Deployment | Streamlit Cloud |

---

## Key Numbers

| Metric | Value |
|--------|-------|
| Python lines | ~5,300 |
| Weightable columns | 41 |
| Supported eras | 22 |
| Column group presets | 8 |
| Languages | 2 (English, French) |
| Cache duration | 23 hours |
| Deployment | Streamlit Cloud |
