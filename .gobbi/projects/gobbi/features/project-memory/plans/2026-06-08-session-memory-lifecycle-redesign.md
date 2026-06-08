---
name: session-memory-lifecycle-redesign
description: 17-task plan implementing the 8 locked decisions (D1–D8) for gobbi's session-memory lifecycle redesign — ephemeral sessions/, deterministic token telemetry, finalized notes/ record, flattened staging, generator. In-scope this session = Clusters M+G (10 tasks); S/R/D1 deferred.
type: plans
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
task_count: 17
supersedes: null
superseded_by: null
---

# Session-memory lifecycle redesign — task plan

## Context

Implements `ideation/artifacts/ideation-design.md` (8 decisions D1–D8, dual-system PASS) after a Preparation PASS that resolved the three readiness spikes (SessionEnd hook EXISTS; codex tokens via `codex exec` stdout; PostToolUse worktree-resolution fix concrete). 17 tasks across 5 clusters (iter2 added the orchestration-contract task 08b). Planning EVALUATION iter2 closed 9 quality findings (F1–F9) in the in-scope cluster.

## Clusters (shippable groupings)

| Cluster | Decisions | Tasks | Size | Independent? |
|---|---|---|---|---|
| **M — tokensUsed problem** | D5 + D6 + D4 | 01–08 + 08b (9) | code/hooks/scripts — the user's named priority | self-contained; the highest-value cluster |
| **G — gitignore migration** | D8 | 09 (1) | tiny — `.gitignore` + 1 git op | fully independent |
| **S — staging flatten** | D3 | 10–12 (3) | 9 doc surfaces | independent of M/G |
| **R — notes/ record + generator** | D2 + D7 | 13–14 (2) | docs + 1 new script | depends on S (flattened router) |
| **D1 — retire D-4** | D1 | 15–16 (2) | 15 doc surfaces (supersede a LOCKED design) | independent of M/G/S |

## Dependencies (cross-cluster)

- R depends on S (task 13 requires task 12's flattened wrap-up router).
- M, G, S, D1 are otherwise mutually independent — except a shared `orchestration/SKILL.md` edit (tasks 07, 08b, 14, 15 touch different sections; sequence them; within M, 08b runs after 07).

## Recommended scope split

- **Must-do this session (user's named priorities):** Cluster M (the tokensUsed problem, now 9 tasks incl. 08b) + Cluster G (gitignore). M fixes the live zeroed-telemetry bug reproduced THIS session; G is tiny and foundational. Together: **10 tasks**, the highest-value + lowest-risk core.
- **Deferrable to a clean follow-up:** Clusters S + R + D1 (7 tasks, ~35 doc surfaces). Large doc sweeps with their own dual-system eval; bundling them with M risks a context-pressured Execution + a diluted review.

Rationale: M+G deliver the user's explicit priorities and a measurable telemetry fix in one tight, well-reviewable Execution. S/R/D1 are doc-heavy refactors whose value is structural cleanliness, not a live bug — they slice cleanly into a follow-up session.

## Authority rule (token telemetry)

SessionEnd is the single authoritative writer of `agents[].tokensUsed` cumulative totals and `usage.*`; PostToolUse seeds/updates each subagent from its own complete transcript; SessionEnd reconciles last + computes the manager rollup. Not-fired degraded path documented (SessionEnd EXISTS per Preparation Spike 1).

## Verification model

These are docs/hooks/scripts — every task's `verifies` is a runnable, repo-root-relative grep / file-existence / `bash -n` / `jq -e` / `git ls-files | wc -l` check (not a unit-test suite). In-scope verifies prove behavior, not just key-presence (e.g. task 02 asserts the written total equals the independent `agent-token-usage.sh` sum; task 03 asserts nonzero `usage.codex`). Full per-task YAML in `planning/rawdata/draft-iter1.md § Tasks`.

## Source

Full task list (17 tasks), dependency table, parallel lanes, agent assignments, self-review, and the F1–F9 closure: `sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/planning/rawdata/draft-iter1.md`. Prior-iter restore: `planning/rawdata/restore/iter1-pre-revise.md`.
