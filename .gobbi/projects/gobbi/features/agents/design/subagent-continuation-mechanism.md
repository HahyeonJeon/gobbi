---
name: subagent-continuation-mechanism
description: Design for continuing the same subagent (Agent Teams teammate) across phases/steps instead of always spawning fresh
type: design
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, orchestration, delegation, agent-teams, continuation]
supersedes: null
superseded_by: null
related:
  - features/agents/decisions/2026-06-07-continue-vs-fresh-deterministic-rule.md
  - features/agents/decisions/2026-06-07-teammate-aware-metadata-design.md
  - features/agents/plans/2026-06-07-main.md
---

# Subagent Continuation Mechanism (Agent Teams)

## Problem

gobbi's delegation contract asserts "Nothing is inherited — every fresh subagent re-loads the full Load Directives stack and re-reads the codebase" as an absolute rule. This is correct for independence but wasteful where the SAME problem understanding is carried forward and thrown away on every spawn. The leader chain and the executor chain both re-derive root-cause and re-grep the same area on every spawn.

A realized correctness failure exists: a continued executor once committed to the wrong tree because cwd resets each turn and re-`cd` alone is insufficient across tool boundaries.

Without a teammate-aware metadata path, a continued chain's turns and token cost are invisible to `session.json` — making both the audit trail and the F4 cost gate unreliable.

## Scope

**In scope (T1–T4):**
- T1: `delegation/SKILL.md` — continue-vs-fresh rule, F1 predicate, delta-brief mechanism, evaluator-FORBIDDEN wall
- T2: `session.json.agents[]` schema + `post-tool-use-agents.sh` + teammate-aware rollup path — session-metadata representation for a continued/teammate agent
- T3: `orchestration/workflow/ideation.md` + `orchestration/workflow/execution.md` — spawn choreography, roster/mailbox/lifecycle policy, F3 audit-trail reconciliation
- T4: `agents/leader.md` + `agents/executor.md` + executor delegation template + `agents/manager.md` + `.claude/CLAUDE.md` — continuation write-discipline, F3 "nothing inherited" qualifications

**Out of scope:** evaluator continuation (FORBIDDEN), assistant continuation (fresh), new runtime, automating the operator pre-check.

## Approach

**Mechanism:** Claude Code Agent Teams (teammates). A teammate is a full, independent, persistent Claude Code session re-addressed by name via `SendMessage` with its own context preserved across messages. Gated behind `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (requires v2.1.32+).

**Core rule (D1 — Option A, deterministic):** A continue-vs-fresh decision table keyed on role × transition. Leader-chain continues within a loop (best-effort across loops, degrades at compaction). Executor-chain continues iff the F1 predicate holds (shared subsystem + under cap=3). Assistant stays fresh. Evaluator continuation is FORBIDDEN.

**F1 operational predicate:** "Shared subsystem" = the next task's `files:`/feature scope OVERLAPS the current task's touched files, OR the two tasks are in the same feature directory. "Saturation cap" = continue at most 3 consecutive tasks, then force fresh. Break early if context budget is strained.

**Delta-brief mechanism (D2):** First spawn loads the full Load Directives stack. Each continuation carries only the next-step goal + new inputs + changed-file re-anchor + re-stated scope + status enum.

**Continuation write-discipline (D3):** Every continuation turn must use absolute worktree paths on every write surface, `git -C <worktree-abs>` for all git ops, explicit re-anchor on changed files, re-stated scope + status enum, and a manager post-turn tree-check.

**Fallback (D4):** Primary-where-safe with a fresh-spawn fallback and an operator pre-check. Continuation is never a hard dependency.

**Teammate-aware metadata (D5):** Extend `session.json.agents[]` with `turns[]`/`continuationOf`. The metadata must additionally model: (a) teammate discovery via team config `members` array, (b) teammate transcript ownership/location (separate session, not parent `subagents/`), (c) teammate token accounting in the cost rollup, (d) relation to the Task/Agent hook (which does NOT capture teammate turns).

**Two modes (D6):** (1) sequential single long-lived teammate per role-chain — the token-saving default; (2) bounded parallel teammate fan-out (3–5) for exploration — accepts higher cost, not the default.

**Compaction fallback (D7):** After `/clear`, `/compact`, or resume, the in-process teammate is gone. Manager spawns fresh and re-primes from durable session memory.

**Evaluator hard wall (D8):** Evaluators are NEVER continued, shared, or made teammates. They stay fresh subagents kept OUT of the team mailbox.

**Team roster + mailbox + lifecycle (D9):** TEAMMATES = leader + executor. SUBAGENTS (plain Task/Agent, fresh) = evaluator (forbidden as teammate) + assistant. Manager = team lead. Non-evaluator teammates do NOT message each other — all coordination via the manager. One team at a time; manager cleans up before a new team; no nested teams.

## Scenarios

Key scenarios the design must handle (golden paths G1/G2; edge cases Ed1–Ed5; failure modes F-1 through F-5; adversarial invariants A1/A2). Full enumeration in `features/agents/scenarios/`.

## Validation

Each T1–T4 component has a presence + correctness check defined in the Scope Contract's success criteria (SC1–SC7). F4 adds the empirical cost gate: a continued-agent run must show lower cumulative re-read/token cost than the equivalent fresh-spawn baseline, measured via a rollup that INCLUDES teammate-session token usage.

## Trade-offs

- **What this optimizes for:** reduced redundant re-reads for the leader and executor chains; eliminating the realized wrong-tree commit failure class via write-discipline.
- **What it sacrifices:** added dispatch complexity for the manager (decide continue-vs-fresh, run post-turn tree-check, detect dead teammates); teammate token usage is additional and not in the parent rollup, so measurement requires extending the cost accounting.
- **Key constraint:** the token win exists ONLY in the sequential single-persistent-teammate shape (mode 1). Mode 2 (parallel) costs more. The saturation cap and F4 measurement gate are the design's answers to this constraint.

## Open issues

- D5 exact JSON shape and exact teammate-rollup mechanism: documented in T2 (`session.template.json` + `orchestration/SKILL.md`), but actual `.sh` runtime code to populate `turns[]`/teammate token usage at runtime is deferred (see `features/agents/backlogs/agent-teams-sh-runtime-implementation.md`).
- `claude` doc-authoring skill absent (FLAG-2) — referenced in planning open items; deferred to a future backlog.

## Shipped

This design shipped as 6 commits on `claude-2026-06-07-a4e3b54d-3182-4193-8a42-69fce489a098` (base: develop e968976). Dual-system Execution PASS after a survivor-sweep round. See `features/agents/plans/2026-06-07-main.md` for the task decomposition.
