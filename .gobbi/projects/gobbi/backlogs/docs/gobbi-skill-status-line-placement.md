---
name: gobbi-skill-status-line-placement
description: "gobbi/SKILL.md § Status enum says agents report status at the END of their response, contradicting delegation/SKILL.md + the 4 role templates which require STATUS: in the FIRST lines (manager parses top-first)."
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-11
session: 67cf54c5-f8f6-43a3-a62b-3c948151e926
tags: [docs-sync]
keywords: [gobbi-skill, status-contract, response-placement, cross-doc-drift, delegation-status-contract]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# gobbi/SKILL.md status-line placement contradicts the delegation status contract

## Problem
`skills/gobbi/SKILL.md` (§ "Status enum", ~line 256) states:

> **Status enum** is the contract every spawned agent reports with **at the end of its response** …

That is the wrong side of the distinction. `skills/delegation/SKILL.md § The Status Contract` (and every role template's `## Report Format`) requires `STATUS:` (+ `VERDICT`/`ARTIFACT`/`SKILLS LOADED`) to be the **FIRST lines of the final response**, because the manager parses from the top and dispatches deterministically. The "at the end" placement is for the **`## Report Format` section in the delegation *prompt*** (recency), not for the agent's *response*.

## Why it surfaced now
The 2026-07-11 delegation Core-Principles redesign removed the "Status enum at the end of the prompt" Core Principle (its substance survives in `delegation/SKILL.md § Status Contract > Prompt placement`). The Codex evaluator (finding F3) noted the removal makes `gobbi/SKILL.md:256`'s already-wrong wording more exposed. **Pre-existing** — not introduced by that change, and out of that change's scope (`gobbi/SKILL.md` was not touched).

## Fix (deferred)
Reword `gobbi/SKILL.md:256` so it matches the delegation contract: agents put the status line **at the START of their response** (the manager parses top-first); the `## Report Format` *section* goes last in the *prompt*. Cross-check any other doc that summarizes the status contract.

## Detect
`grep -n "at the end of its response" skills/gobbi/SKILL.md` returns the offending line; compare with `delegation/SKILL.md § The Status Contract` response wire format.
