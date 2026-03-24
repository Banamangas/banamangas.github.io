---
title: "Alertes FoE"
subtitle: "Scheduled Discord announcement bot for recurring Forge of Empires guild events"
date: 2024-09-01
tags: [Python, Discord.py, APScheduler, Flask, pytz]
thumbnail: "/images/projects/alertes-foe.png"
github: "https://github.com/Banamangas/alertes-foe"
featured: false
stats:
  - label: "Python Lines"
    value: "~1,050"
  - label: "Message Types"
    value: "4"
  - label: "Catch-up Window"
    value: "2 hours"
  - label: "Deployment"
    value: "VPS"
---

A Discord bot that sends automated, timezone-aware announcements to a guild server on a fixed weekly schedule. It handles three recurring event types, alternates message content on even/odd ISO weeks, and recovers gracefully if it was offline at the scheduled time.

## The Problem

Guild officers had to manually post reminder messages for recurring weekly events - often forgetting, posting at the wrong time, or sending inconsistent content.

## Scheduled Message Engine

Three recurring schedules, all in Paris timezone with automatic DST handling:

| Day | Time | Event |
|-----|------|-------|
| Thursday | 7:55 AM | Even weeks: QI alert — Odd weeks: GBG alert |
| Tuesday | 8:00 AM | Guild Expedition |
| Sunday | 6:00 PM | Reminder to finish Guild Expedition |

### Even/Odd Week Alternation

Thursday messages vary based on ISO week number parity. The bot computes `datetime.isocalendar().week % 2` at send time - no manual tracking needed.

<figure>                                                                                  
    <img src="/images/projects/qi_alert_example.png" alt="Use of the /building command on Discord" />                       
    <figcaption>Example of a QI alert sent on an even week</figcaption>
</figure>

### Catch-Up Mechanism

If the bot was offline at 7:55 AM on Thursday, it retries the message any time before 10:00 AM that day (a guild leader will likely have posted a message before that time). A `sent_dates.json` file persists send history across restarts to prevent duplicates.
