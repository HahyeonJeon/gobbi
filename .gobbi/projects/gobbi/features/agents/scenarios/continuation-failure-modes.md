---
name: continuation-failure-modes
description: Failure mode scenarios for subagent continuation — flag off, wrong-tree write, metadata clobber, compaction, cost regression
type: scenarios
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, continuation, agent-teams, failure-mode, cwd, metadata]
---

# Continuation Failure Modes

**Category:** failure-mode
**Coverage:** partial

## Situation

Five failure modes were identified during Ideation, each with a defined fallback behavior. These must be handled by the design; if any failure mode is unhandled, the continuation mechanism is not safe to ship.

## Inputs

**F-1:** `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is unset; `SendMessage` is not invocable.
**F-2:** Continued teammate's cwd resets to main tree on a new turn; a Write/Edit uses a relative path.
**F-3:** Continuation reuses the same `agentId`; the upsert-by-`agentId` hook overwrites the prior entry; teammate turns are in a separate session transcript not under the parent's `subagents/`.
**F-4:** `/clear`, `/compact`, or resume breaks the in-process teammate.
**F-5:** A continued run does NOT beat the fresh-spawn baseline on cumulative re-read/token cost.

## Expected behavior

**F-1:** Operator pre-check fails → manager fresh-spawns with a full brief (the standard delegation path). Continuation is a preferred-where-safe option, never a hard dependency. This session dogfoods exactly this path.

**F-2:** Prevented by D3 write-discipline: absolute worktree path on EVERY write surface + `git -C <worktree-abs>` + manager post-turn tree-check. Re-`cd` alone is INSUFFICIENT (recorded project mistakes confirm `cd` does not persist across tool boundaries).

**F-3:** Addressed by T2's schema extension (`turns[]`/`continuationOf`) + teammate-aware metadata path (teammate discovery via team config `members`, teammate transcript is a separate session, teammate token accounting). Note: actual `.sh` runtime code is a deferred backlog.

**F-4:** Manager spawns FRESH and re-primes from durable session memory (`rawdata/`, `staging/`, `state.json`). Manager never messages a dead teammate.

**F-5:** Per F4 cost gate, if continuation does not beat the fresh-spawn baseline (measured against COMPLETE token cost including teammate sessions), the manager falls back to fresh spawns for that chain.

## Verification

- F-1: confirm no doc asserts continuation required; confirm the fallback path is documented; confirm the operator pre-check flag name is stated.
- F-2: grep `agents/leader.md`, `agents/executor.md`, and the executor delegation template for all five D3 discipline clauses; confirm clause 1 names absolute paths, clause 2 names `git -C <worktree-abs>`, clause 5 names the manager post-turn tree-check.
- F-3: confirm the chosen schema preserves per-turn routing; confirm D5 names teammate discovery, transcript location, token accounting, and hook relation.
- F-4: confirm orchestration docs state the compaction/resume → fresh-spawn-and-re-prime path; confirm dead-teammate messaging is forbidden.
- F-5: confirm the F4 measurement includes teammate-session usage; confirm a fail-rule is stated (if not beating baseline, fall back to fresh).

## Related

- `features/agents/design/subagent-continuation-mechanism.md` — D3 (F-2), D4 (F-1), D5 (F-3), D7 (F-4), F4 section (F-5)
