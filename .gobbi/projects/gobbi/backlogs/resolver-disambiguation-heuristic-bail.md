---
name: resolver-disambiguation-heuristic-bail
description: Multi-candidate worktree disambiguation depends on `git.worktreePath` self-consistency; two copies that each self-reference their own location make the resolver bail (non-blocking)
type: backlogs
scope: project
feature: null
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, metadata, resolver, worktree, risk, follow-up]
priority: medium
disposition: open
project-scope: true
shipped_in: null
---

# Resolver disambiguation heuristic bails on dual self-reference

## Context

Execution EVALUATION finding F-RISK-1 (Claude Risk, assumption_risk, Medium/60). The resolver
prefers the candidate whose own `.git.worktreePath` is a prefix of its physical path
(`post-tool-use-agents.sh:113-117` / `session-end.sh:105-112`). If TWO copies for the same
session-id each self-reference their own physical location (a main-tree copy whose
`git.worktreePath` = main tree AND a worktree copy whose worktreePath = worktree), `hits == 2`
and the resolver bails ("cannot disambiguate"). The disambiguation is heuristic, not a hard
guarantee that the live writer is chosen.

## Why deferred

A bail is non-blocking (SessionEnd backfills / next reconcile retries) so there is no
corruption. In live operation the always-worktree model means only the worktree copy carries a
matching worktreePath, and task-09 removed tracked main-tree copies — so likelihood is low.
Confidence 60 (the dual-self-reference case could not be exercised live; confirmed by reading).
A session whose telemetry silently never records would be hard to notice — the only durable
risk. Coupled with F-STR-1 (`resolver-maxdepth-misses-worktree-session-json.md`); remediate the
two resolver edges together.

## When to pick up

With F-STR-1, during any hardening pass on the metadata-recording resolver.

## Suggested approach

Replace the heuristic prefix-match with a hard guarantee that the live writer is selected — e.g.
prefer the session.json whose `git.worktreePath` matches the *current* `git rev-parse
--show-toplevel` / the active worktree, or stamp the canonical live path into a deterministic
locator. Add a fixture with two self-referencing copies and assert the live one is chosen.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/` — Execution eval iter1 (Claude Risk).
