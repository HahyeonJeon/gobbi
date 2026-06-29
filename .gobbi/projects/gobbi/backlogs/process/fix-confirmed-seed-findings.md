---
name: fix-confirmed-seed-findings
description: Fix the three confirmed seed findings (mirror scripts/coding gap, doc-script drift, no live todo-list) after the review
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [docs-sync, process]
keywords: [mirror-sync, scripts, coding-skill, doc-script-drift, live-todo, progress-visibility]
author: claude
priority: high
project-scope: false
shipped_in: null
---

# Fix the confirmed seed findings

## Context
Three findings were confirmed during charter grounding: (A) gobbi never surfaces a live todo-list / progress to the session window; (B) `.claude/skills/` dev mirror omits all `scripts/` dirs and the `coding` skill; (C) skill docs reference scripts at mirror-relative paths that do not resolve in that mirror.

## Why deferred
This session is review-only — no edits to gobbi skills/agents/plugin. The fixes are out of scope and require the deep review to size them and to find sibling instances (the charter generalizes each seed to a class).

## When to pick up
After the deep review classifies each seed and finds its sibling instances. Fixing the mirror generator (B/C) likely pairs with the #258 cross-layer drift validator.

## Suggested approach
- A (live todo): wire the active-runtime task tracker into the orchestration workflow steps so the session surfaces progress; prior art = superpowers' "todo lists from skill checklists".
- B/C: fix the `.claude/skills/` mirror generator to also mirror `scripts/` subdirs and regenerate after new skills (`coding`); add a guard so doc-referenced script paths resolve in every mirror.

## Originating session
.gobbi/projects/gobbi/sessions/2026-06-29-40b9a93e-5ec4-43d7-bd16-075b0c7fa303/

## Related

- [[run-deep-adversarial-review]] — produces these findings formally
- [[automated-cross-layer-drift-validator]] — would prevent B/C recurring
