---
name: agent-teams-mechanism-and-compaction
description: Agent Teams as the continuation mechanism; adding bounded parallel mode; compaction fallback behavior
type: discussions
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, agent-teams, continuation, compaction, parallel]
loop: ideation
outcome: Agent Teams teammates adopted; bounded parallel mode (3-5) added; compaction => fresh spawn + re-prime
---

# Agent Teams as the Continuation Mechanism, Parallel Mode, and Compaction Fallback

## Context

After the user directed research on `https://code.claude.com/docs/en/agent-teams`, the design confirmed that Claude Code Agent Teams (teammates) is THE continuation primitive. Two follow-on questions arose: (1) should the design allow a bounded parallel-teammate use-mode for exploration, and (2) what should the manager do when `/clear`, `/compact`, or resume breaks the in-process teammate?

## Question

Q-Mechanism: Should the design support only sequential single-teammate continuation, or also a bounded parallel fan-out for exploration scenarios?

Q-Compaction: When compaction or resume breaks the in-process teammate, should the manager: (a) error and halt, (b) spawn fresh with a full brief + re-prime from session memory, or (c) try to reconstruct the teammate?

## Options considered

**Q-Mechanism:**
- Sequential single-teammate only: partially accepted as the default; but parallel exploration has real adversarial value.
- Also allow a bounded parallel-teammate fan-out (3–5): accepted for exploration where parallel breadth beats cost.

**Q-Compaction:**
- Error and halt: rejected — would make continuation a fragile hard dependency.
- Spawn fresh with a full brief + re-prime from durable session memory: accepted — keeps continuation resilient and makes the fresh-spawn fallback the reliable path.
- Reconstruct the teammate: not possible — Agent Teams confirms teammates are NOT restored by `/resume`/`/rewind`.

## User decision

Q-Mechanism: **Also allow a bounded parallel-teammate case.** Two modes: (1) sequential single long-lived teammate per role-chain (leader-chain, executor-chain) as the token-saving core, AND (2) bounded parallel-teammate fan-out (3–5) for exploration where parallel adversarial value is real, accepting higher cost.

Q-Compaction: **Fresh spawn + re-prime from session memory.** After `/clear`, `/compact`, resume, continuation is broken; manager spawns fresh and re-primes from durable session artifacts (`rawdata/`, `staging/`, `state.json`). Manager never messages a dead teammate.

## Implication

Mode 1 is the token-saving default; mode 2 is breadth-for-cost and never the default. The two-mode design replaces a single one-size-fits-all model. The compaction fallback makes continuation a best-effort feature rather than a hard dependency — gobbi can run in its full fresh-spawn mode with no continuation primitive available.

The design must document that cost scales linearly with teammate count in mode 2, and that the F4 token-savings measurement covers both modes separately (mode 1 must beat the fresh-spawn baseline; mode 2's higher cost is accepted knowingly).

## Related

- `features/agents/design/subagent-continuation-mechanism.md` — D6 (two sanctioned modes), D7 (compaction fallback)
- `features/agents/decisions/2026-06-07-continue-vs-fresh-deterministic-rule.md` — D1 row 2 (cross-loop best-effort)
