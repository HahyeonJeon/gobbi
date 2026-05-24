---
title: ".gobbi/project.json bootstrap for D-3-3-resolver step (i) precondition"
status: deferred
project: gobbi
feature: session-foundations-bundle-b
task: null
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created: 2026-05-23
tags: [resolver, hook, bootstrap, project-json, dormant-precondition]
disposition: open
---

# .gobbi/project.json bootstrap for D-3-3-resolver step (i) precondition

## Context

T3 Design Decision D-3-3-resolver (Sub-step D iter2) specifies the hook's session-dir resolver algorithm. Step (i) — the **preferred** project-name lookup path — reads `$cwd/.gobbi/project.json` and extracts the `name` field. Step (ii) — the **fallback** path — enumerates `$cwd/.gobbi/projects/` and selects the single directory if exactly one exists.

Empirical verification on 2026-05-23 (iter3, `ls .gobbi/project.json` from the repo root): the file **does not exist** in this repo. `ls -la .gobbi/` confirms only `projects/`, `settings.json`, and `.gitignore` are present.

Today the resolver falls through to step (ii) and works correctly because exactly one project directory exists (`.gobbi/projects/gobbi/`). However, step (i) is a **dormant precondition** — it is documented as preferred but cannot be exercised until the file is created.

## Why deferred

The hook is functional without step (i); step (ii) is sufficient for the current single-project repo. Bumping the resolver from "step (i) preferred" to "step (i) required" would either:
- require creating `.gobbi/project.json` as a one-line write at Execution start (in scope for the executor), OR
- defer the file creation to a follow-up session and tolerate step (ii) being the only working path indefinitely.

The user-locked Scope Contract (Sub-step B) includes T1 + T3 docs + scripts + settings.json, but does not explicitly include creating `.gobbi/project.json`. Surfacing this as a backlog item keeps the resolver design honest (it documents the precondition) without expanding scope mid-Ideation.

## Suggested approach

Two paths, picked at Execution start or later:

1. **In-Execution (recommended if the executor's plan agrees)**: add a single-file write step to T3's Execution plan — create `.gobbi/project.json` with content `{"name": "gobbi"}` (or richer metadata if the executor's design widens). Cost: 1 file, ~5 lines. This activates step (i) for every future session.
2. **Defer to a follow-up session**: file is left absent; resolver continues to use step (ii); this backlog item carries forward as the witness that the dormant precondition is intentional.

## When to pick up

- At Planning (T3 task decomposition): the planner may absorb the file creation into T3-I-T3.c (the `.claude/settings.json` registration step) since both are bootstrap-type writes.
- At Execution start: the executor may add it as a one-line setup step before authoring the hook script.
- At a future session when the project gains a second project under `.gobbi/projects/` (which would break step (ii)'s "exactly one directory" guard and force step (i) to be created).

## Effort estimate

Trivial — a single-file write (~5 lines of JSON). Estimated < 5 minutes of focused work; can be folded into any T3 commit.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Anchor

- T3 Design Decision D-3-3-resolver step (i) — dormant precondition note (iter3 Fix C)
- Verified empirically: `ls -la /playinganalytics/git/gobbi/.gobbi/project.json` returns "No such file or directory" on 2026-05-23
- iter3 fix-decision F-Fix-C in `rawdata/draft-iter3.md` Decisions Log
