---
name: dot-gobbi-project-json-bootstrap
description: Bootstrap .gobbi/project.json to activate the preferred session-dir resolver path
type: backlogs
scope: feature
feature: install-runtime
project: gobbi
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [resolver, hook, bootstrap, project-json, dormant-precondition]
disposition: open
---

# `.gobbi/project.json` bootstrap — dormant precondition for session-dir resolver

## Context

The hook's session-dir resolver algorithm specifies two paths: step (i) — the preferred path — reads `$cwd/.gobbi/project.json` and extracts the `name` field; step (ii) — the fallback path — enumerates `$cwd/.gobbi/projects/` and selects the single directory if exactly one exists.

Empirical verification on 2026-05-23 (`ls .gobbi/project.json` from the repo root): the file **does not exist** in this repo. `ls -la .gobbi/` confirms only `projects/`, `settings.json`, and `.gitignore` are present.

Today the resolver falls through to step (ii) and works correctly because exactly one project directory exists (`.gobbi/projects/gobbi/`). However, step (i) is a **dormant precondition** — it is documented as preferred but cannot be exercised until the file is created.

## Why deferred

The hook is functional without step (i); step (ii) is sufficient for the current single-project repo. Bumping the resolver from "step (i) preferred" to "step (i) required" would either require creating `.gobbi/project.json` as a one-line write or tolerating step (ii) indefinitely. The originating session's scope contract covers docs + scripts + settings.json but does not explicitly include creating `.gobbi/project.json`. Surfacing this as a backlog item keeps the resolver design honest without expanding scope mid-session.

## Suggested approach

Two paths, picked at Execution start or later:

1. **In-Execution (recommended if the executor's plan agrees)**: add a single-file write step to the Execution plan — create `.gobbi/project.json` with content `{"name": "gobbi"}`. Cost: 1 file, ~5 lines. This activates step (i) for every future session.
2. **Defer to a follow-up session**: file is left absent; resolver continues to use step (ii); this backlog item carries forward as the witness that the dormant precondition is intentional.

## When to pick up

- At Planning (task decomposition for the next hook-authoring session): the planner may absorb the file creation into the settings.json registration step since both are bootstrap-type writes.
- At Execution start: the executor may add it as a one-line setup step before authoring the hook script.
- At a future session when the project gains a second project under `.gobbi/projects/` (which would break step (ii)'s "exactly one directory" guard and force step (i) to be created).

## Effort estimate

Trivial — a single-file write (~5 lines of JSON). Estimated < 5 minutes of focused work; can be folded into any hook commit.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Source

- T3 Design Decision D-3-3-resolver step (i) — dormant precondition note (iter3 Fix C)
- Verified empirically: `ls -la /playinganalytics/git/gobbi/.gobbi/project.json` returns "No such file or directory" on 2026-05-23
- iter3 fix-decision F-Fix-C in `rawdata/draft-iter3.md` Decisions Log
