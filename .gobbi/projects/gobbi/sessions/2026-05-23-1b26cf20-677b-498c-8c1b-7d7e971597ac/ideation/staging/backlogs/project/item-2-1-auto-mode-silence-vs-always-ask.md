---
title: "Item 2-1 — Auto-mode silence vs Always-Ask categories"
status: deferred
project: gobbi
feature: null
task: null
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created: 2026-05-23
tags: [process, auto-mode, askuserquestion, categories, deferred]
disposition: open
---

# Item 2-1 — Auto-mode silence vs Always-Ask categories

## Context

Auto Mode (currently active per the system-reminder banner in this session) biases the manager toward proceeding without clarifying questions. But certain decision categories MUST still trigger AskUserQuestion regardless of Auto Mode — e.g., approvals, scope-contract locks, contribution points, divergent evaluation findings. The current discipline is implicit; Item 2-1 would name the Always-Ask categories explicitly and codify them in a skill or rule so Auto Mode silence is constrained.

## Why deferred

Explicitly excluded from this session per Sub-step B Scope Contract (Out-of-Scope item). Bundle scope was capped at three items (T1 + T2 + T3); Item 2-1 was not selected for this bundle. The Auto Mode banner currently fires per-session via system-reminder but does not have a codified always-active rule under `.gobbi/projects/gobbi/rules/`.

## When to pick up

- Whenever a new mistake surfaces where Auto Mode silence caused a user-facing slip (i.e., the manager proceeded without asking and the user later corrected the direction).
- Could be bundled with Item 1-2 (skill-loading-discipline) in a future "delegation infrastructure" feature.

## Suggested approach

1. Enumerate the current AskUserQuestion call sites across all five workflow loop skills.
2. Categorize them: blocking-approval / contribution-point / divergence-arbitration / configuration.
3. Decide which categories are Always-Ask vs Auto-Mode-skippable.
4. Codify in a project rule under `.gobbi/projects/gobbi/rules/` or in `discussion/SKILL.md`.

## Effort estimate

Small-medium — one workflow loop. Most of the work is enumeration + categorization; the codification is a single rule/skill edit.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Anchor

- Sub-step B Scope Contract Out-of-Scope row
- Prior-session deferred list
