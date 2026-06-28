---
name: manager-skipped-user-driven-preparation-discussion
description: Manager auto-dispositioned Preparation gaps without surfacing them to the user; Preparation DISCUSSION is user-driven even in Auto mode.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [auto-mode, preparation, discuss-mode, user-driven, gap-disposition]
author: claude
priority: high
domain: process
---

# Manager Skipped User-Driven Preparation DISCUSSION

## What happened

The manager ran Preparation iter1 and iter2 in Auto mode and auto-dispositioned all readiness gaps (FLAG-2 skip, principle-trace defer, REVISE-threshold defer, etc.) without surfacing them to the user. The iter1 and iter2 drafts labeled those dispositions "manager-auto-dispositioned, pending Wrap-up review" and stated that "no user-facing gap-resolution decision is strictly required" in Auto mode.

The dual-system Codex evaluator held a High/100 finding (`codex-prep-project-001`, `codex-prep-risk-001`, `codex-prep-usage-001`, `codex-prep-consistency-001`) OPEN across iter1 and iter2 because `preparation/SKILL.md:115` requires "every identified gap has a user-locked resolution." Claude's evaluator wrongly called this addressed in iter2. The cross-system divergence was the correct signal: Codex was right.

## Why it happens

The manager confused two distinct modes:

1. **Auto mode's general auto-decide authority** — in Auto mode, agents auto-decide many non-Always-Ask choices without interrupting the user.
2. **The per-loop `discuss.mode` setting** — each loop has its own setting controlling whether DISCUSSION is user-driven or agent-driven. `orchestration/auto-mode.md:86` lists the per-loop modes; line 96 and 213 confirm that `workflow.preparation.discuss.mode = "user"`.

**The missed rule:** `auto-mode.md` keeps Preparation and Ideation DISCUSSION as user-driven loops even in Auto mode. Only Planning, Execution, and Wrap-up DISCUSSION are agent-driven. The manager incorrectly assumed that Auto mode's general authority covered Preparation gap-resolution decisions.

## How to detect

Before auto-deciding any gap, deferred risk, or disposition in any Preparation or Ideation DISCUSSION step, check the loop's `discuss.mode` in `orchestration/auto-mode.md`. The check is:

- `discuss.mode = "user"` → the user MUST confirm; emit a user-decision prompt; do not proceed with manager-auto rationale.
- `discuss.mode = "agent"` → the manager may auto-decide non-Always-Ask items.

The signal: if you are writing "manager-auto-dispositioned" into a Preparation or Ideation readiness draft, stop. Those two loops' DISCUSSION is user-driven; that framing is always wrong.

## Correct approach

In Auto mode, Preparation DISCUSSION (and Ideation DISCUSSION) still runs the user-decision primitive for gap dispositions. The procedure:

1. Complete the readiness inventory (Sub-steps A-D of `preparation/SKILL.md`).
2. Surface ALL identified gaps to the user with proposed dispositions, citing `preparation/SKILL.md` and the relevant evidence.
3. Wait for the user to accept or redirect each proposed disposition (via AskUserQuestion or the active runtime's user-decision primitive).
4. Only after user confirmation: label each disposition USER-LOCKED and cite the confirmation record (`discussion-log.md`).
5. Proceed to evaluation with genuine user-locked dispositions. Any disposition labeled "manager-auto-dispositioned" will correctly fail `preparation/SKILL.md:115`.

Source: `orchestration/auto-mode.md:86,96,213`.

## Related

- [[preparation-skill-automode-carve-out]] — the backlog to add an explicit Auto-mode carve-out citation to `preparation/SKILL.md`
