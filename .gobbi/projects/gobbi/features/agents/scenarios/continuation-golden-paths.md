---
name: continuation-golden-paths
description: Golden-path scenarios for subagent continuation via Agent Teams teammates
type: scenarios
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, continuation, agent-teams, golden-path]
---

# Continuation Golden Paths

**Category:** golden-path
**Coverage:** partial

## Situation

The manager decides to continue the same subagent (via Agent Teams teammate) rather than spawning fresh. Two primary golden paths: (1) the leader chain within a single Ideation loop, and (2) the executor chain across tasks on a shared subsystem.

## Inputs

**G1 (leader chain, in-loop):**
- Manager is at Ideation with Sub-steps A→B→C→D→WORK to run.
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is set; Claude Code v2.1.32+ confirmed.
- Leader teammate already spawned for Sub-step A with full Load Directives.

**G2 (executor chain, shared subsystem):**
- Task NN is complete; task NN+1 is ready.
- F1 predicate: NN+1's `files:`/feature scope OVERLAPS NN's touched files (or same feature directory).
- Saturation count: < 3 consecutive continued tasks.
- Context budget: not strained.

## Expected behavior

**G1:** Manager `SendMessage`-continues the same leader teammate for Sub-steps B→C→D→WORK with a delta-brief (next-step goal + new inputs only). No Load Directives re-paste. Teammate retains the framed problem, scope, insights from Sub-step A. No re-derive, no re-read of `features/`/`mistakes/`.

**G2:** Manager continues the same executor teammate for task NN+1 with a delta-brief using absolute worktree paths on every write surface and `git -C <worktree-abs>` for git ops. Manager runs a post-turn tree-check after NN+1 completes to confirm writes landed in the correct worktree.

## Verification

- G1: delta-brief carries goal + inputs + scope + status enum; does NOT include full Load Directives re-paste. Teammate transcript is a single continuing session, not a set of per-sub-step spawns.
- G2: F1 predicate evaluation (overlap-OR-same-feature-dir AND consecutive-count < 3) is mechanical and yields the same result for any caller. Post-turn tree-check confirms no strays.

## Related

- `features/agents/design/subagent-continuation-mechanism.md` — D1 (G1: leader row; G2: executor row), D2 (delta-brief), D3 (write-discipline)
