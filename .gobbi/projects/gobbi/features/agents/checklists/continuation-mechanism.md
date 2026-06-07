---
name: continuation-mechanism
description: Implementation checklist for the subagent continuation mechanism (T1-T4)
type: checklists
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, continuation, implementation-checklist]
scenario: continuation-golden-paths
---

# Continuation Mechanism — Implementation Checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | `delegation/SKILL.md`: scope "nothing inherited" to fresh spawns; carve a continuation exception | I1 | DONE | grep for the exception carve-out — present (commit de21e1f) |
| 2 | `delegation/SKILL.md`: add role × transition decision table with evaluator row FORBIDDEN | I5, E3, E6 | DONE | grep for the table; evaluator row reads FORBIDDEN (commit de21e1f) |
| 3 | `delegation/SKILL.md`: state the operational F1 predicate (overlap-OR-same-feature-dir + cap=3 + early-break) in the executor row | I2, E4, E6 | DONE | grep for "overlap" AND "same feature dir" AND cap threshold (commit de21e1f) |
| 4 | `delegation/SKILL.md`: add the delta-brief mechanism (no Load Directives re-paste on continuation) | I6, E1, E6 | DONE | grep for "delta-brief" in delegation skill (commit de21e1f) |
| 5 | `session.json.agents[]`: extend schema with `turns[]` sub-array and/or `continuationOf` pointer | I4 | DONE | session.template.json updated; per-turn routing fields preserved (commit ed286e8) |
| 6 | `post-tool-use-agents.sh`: fix upsert-by-agentId clobber so per-turn routing survives | I4 | DOCUMENTED-ONLY | design documented; actual .sh runtime code is a follow-up backlog (agent-teams-sh-runtime-implementation) |
| 7 | T2: model teammate discovery via team config `members` array | I4, E6 | DONE | orchestration/SKILL.md teammate-aware section names members array (commit ed286e8) |
| 8 | T2: model teammate transcript ownership/location (separate session, not parent `subagents/`) | I4, E6 | DONE | orchestration/SKILL.md states separate-session transcript (commit ed286e8) |
| 9 | T2: model teammate token accounting in the session cost rollup | I4, E4, E6 | DOCUMENTED-ONLY | design doc names teammate-aware rollup; actual .sh implementation is a follow-up backlog |
| 10 | T2: state the relation to the existing Task/Agent hook (hook will NOT capture teammate turns) | I4, E6 | DONE | orchestration/SKILL.md addresses hook relation (commit ed286e8) |
| 11 | T2: record that in-process teammates do NOT survive `/resume`/`/rewind` | E6 | DONE | orchestration/SKILL.md states no-resume-survival (commit ed286e8) |
| 12 | `orchestration/workflow/ideation.md`: specify when the manager continues the leader vs fresh-spawns | I6, E6 | DONE | doc names per-sub-step continue-vs-fresh choreography (commit 6b6e8c3) |
| 13 | `orchestration/workflow/ideation.md`: state cross-loop continuation is best-effort | I6, E6, F-4 | DONE | doc qualifies cross-loop continuation as live-only (commit 6b6e8c3) |
| 14 | `orchestration/workflow/ideation.md:35`: reconcile the audit-trail promise | I7 | DONE | doc qualifies "full set of leader transcripts" under continuation (commit 6b6e8c3) |
| 15 | `orchestration/workflow/execution.md`: specify executor continue-iff-F1-predicate-under-cap choreography | I2, E4, E6 | DONE | doc names F1 predicate + cap + compaction-kills-teammate re-prime (commit 6b6e8c3) |
| 16 | Orchestration docs: document the two modes | E6, Ed4 | DONE | both modes documented; mode 1 marked as default (commit 6b6e8c3) |
| 17 | Orchestration docs: state team roster + mailbox + lifecycle policy (D9) | I8, E6 | DONE | grep for "teammates = leader + executor", "no teammate cross-talk", "one team at a time" (commit 6b6e8c3) |
| 18 | `agents/leader.md` and `agents/executor.md`: add continuation discipline | I3, E2 | DONE | grep for absolute-path clause + `git -C` clause + manager tree-check clause (commit 75d273d) |
| 19 | Executor delegation template: embed the same continuation discipline | I3 | DONE | five D3 clauses present in template (commit 75d273d) |
| 20 | `agents/manager.md:12`: qualify "none of them inherit your context" | I7 | DONE | grep confirms qualification present (commit 3e0f76f) |
| 21 | `.claude/CLAUDE.md:31`: qualify "fresh subagents do not inherit the parent's loaded skills" | I7 | DONE | grep confirms qualification present (commit 3e0f76f) |
| 22 | Docs describe continuation as preferred-where-safe, never a hard dependency | E2, E5, E6 | DONE | no doc asserts continuation required; fallback + flag name stated (all tasks) |
| 23 | F4 cost-measurement criterion: continuation must beat the fresh-spawn baseline via teammate-aware rollup | I4, E4, E5, E6 | DONE | measurement source explicitly covers teammate sessions; fail-rule stated (commit ed286e8) |

## Survivor sweep (task 06)

After iter1 dual-system REVISE, a 6th sweep task patched remaining unqualified "fresh executor" / "audit-trail" lines in:
- `skills/orchestration/auto-mode.md`
- `skills/orchestration/chat-mode.md`
- `skills/gobbi/SKILL.md`
- `skills/delegation/SKILL.md`
- `skills/orchestration/workflow/planning.md`

Commit b202939. After sweep: Codex re-eval all 4 findings RESOLVED, no new contradiction → PASS.
