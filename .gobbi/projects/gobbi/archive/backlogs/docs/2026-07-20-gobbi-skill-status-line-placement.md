---
name: gobbi-skill-status-line-placement
description: "Closed: gobbi/SKILL.md now requires status at the beginning of the response and points to orchestration/delegation.md for the full contract."
type: backlogs
scope: project
feature: null
status: closed
created: 2026-07-11
session: 67cf54c5-f8f6-43a3-a62b-3c948151e926
tags: [docs-sync]
keywords: [gobbi-skill, status-contract, response-placement, cross-doc-drift, delegation-status-contract]
author: claude
priority: low
project-scope: true
shipped_in: d220cba7434745f7ca95b29bbfce22cc9c050faa
archived_at: 2026-07-20
archive_reason: shipped
---

# Resolved — gobbi/SKILL.md status-line placement

## Resolution

The current `skills/gobbi/SKILL.md` says agents report status at the beginning of the response and points to `skills/orchestration/delegation.md § The Status Contract`. That owner separately keeps `## Report Format` last in the prompt. The response-vs-prompt placement distinction is now explicit, so this backlog is closed.

## Problem
`skills/gobbi/SKILL.md` (§ "Status enum", ~line 256) states:

> **Status enum** is the contract every spawned agent reports with **at the end of its response** …

That is the wrong side of the distinction. `skills/delegation/SKILL.md § The Status Contract` (and every role template's `## Report Format`) requires `STATUS:` (+ `VERDICT`/`ARTIFACT`/`SKILLS LOADED`) to be the **FIRST lines of the final response**, because the manager parses from the top and dispatches deterministically. The "at the end" placement is for the **`## Report Format` section in the delegation *prompt*** (recency), not for the agent's *response*.

## Why it surfaced now
The 2026-07-11 delegation Core-Principles redesign removed the "Status enum at the end of the prompt" Core Principle (its substance survives in `delegation/SKILL.md § Status Contract > Prompt placement`). The Codex evaluator (finding F3) noted the removal makes `gobbi/SKILL.md:256`'s already-wrong wording more exposed. **Pre-existing** — not introduced by that change, and out of that change's scope (`gobbi/SKILL.md` was not touched).

## Shipped fix

`gobbi/SKILL.md:256` now matches the Gobbi dispatch contract: agents put the status line **at the START of their response** (the manager parses top-first); the `## Report Format` *section* goes last in the *prompt*. The live owner is `orchestration/delegation.md`.

## Detect
`grep -n "at the end of its response" skills/gobbi/SKILL.md` returns no hit; compare the beginning-of-response wording with `orchestration/delegation.md § The Status Contract` and its prompt-placement subsection.
