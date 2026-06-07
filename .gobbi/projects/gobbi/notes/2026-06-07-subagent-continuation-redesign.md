---
name: subagent-continuation-redesign
description: Redesigned the subagent system to support continuing the same subagent (Agent Teams teammate) across phases/steps instead of always spawning fresh — T1-T4 documentation + orchestration discipline, 6 commits, dual-system PASS
type: notes
scope: project
feature: null
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, delegation, orchestration, continuation, agent-teams, dual-system-eval]
features_touched: [agents]
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped:
  - features/agents/design/subagent-continuation-mechanism.md
  - features/agents/plans/2026-06-07-main.md
  - features/agents/decisions/2026-06-07-continue-vs-fresh-deterministic-rule.md
  - features/agents/decisions/2026-06-07-teammate-aware-metadata-design.md
  - features/agents/checklists/continuation-mechanism.md
  - features/agents/discussions/2026-06-07-agent-teams-mechanism-and-compaction.md
  - features/agents/discussions/2026-06-07-continuation-mode-and-scope.md
  - features/agents/discussions/2026-06-07-f1-predicate-and-f3-cotouches.md
  - features/agents/discussions/2026-06-07-iter2-divergence-reconciliation.md
  - features/agents/scenarios/continuation-golden-paths.md
  - features/agents/scenarios/continuation-failure-modes.md
  - features/agents/scenarios/evaluator-independence-invariant.md
  - features/agents/references/claude-code-agent-teams.md
  - features/agents/references/sendmessage-continuation-gated.md
  - features/agents/references/claude-code-subagents-fresh-by-design.md
  - features/agents/references/context-rot-triangular-rebilling.md
  - features/agents/references/persistent-vs-ephemeral-subagents.md
  - features/agents/references/prompt-cache-ttl-regression.md
  - features/agents/backlogs/agent-teams-precheck-automation.md
  - features/agents/backlogs/agent-teams-sh-runtime-implementation.md
  - mistakes/cotouch-enumeration-must-cover-semantic-equivalents.md
  - mistakes/false-missing-file-grep-scoped-to-wrong-dir.md
  - mistakes/planning-leader-asserted-file-type-without-verifying.md
  - skills/mistake/layer2-cotouch-enumeration-must-cover-semantic-equivalents.md
  - skills/mistake/layer2-planning-leader-asserted-file-type-without-verifying.md
---

# Subagent Continuation Redesign

## What happened

The session redesigned gobbi's subagent delegation system so the manager can CONTINUE a persistent teammate (Claude Code Agent Teams) across phases/steps, instead of always spawning fresh. The motivation: the leader chain and executor chain both re-derive root-cause and re-grep the same area on every spawn; this is wasteful and also has a known realized failure (wrong-tree commit when cwd resets).

**Ideation** ran 3 iterations (iter1 both REVISE, iter2 divergence Claude-PASS/Codex-REVISE→aggregate-REVISE, iter3 both PASS). The 3-iter arc drove two major design additions:

- iter1→iter2: F1 predicate made operational (from "shared subsystem" label to explicit overlap-or-same-feature-dir + cap=3 rule); F3 co-touch sites expanded (added manager.md, CLAUDE.md, ideation.md); F4 cost measurement criterion added; F2 write-discipline (absolute paths + `git -C`) hardened.
- iter2→iter3: Codex caught the Agent Teams metadata gap (O1 High/75) — parent-scoped `subagents/` rollup cannot see teammate turns or tokens. This forced the teammate-aware metadata path (D5): teammate discovery via team config `members` array, teammate transcript in its own session, teammate token accounting. Also added D9 (team roster + mailbox + lifecycle policy: teammates = leader + executor only, evaluator FORBIDDEN as teammate, all coordination via manager, one team at a time).

The pivot to Claude Code Agent Teams as the mechanism happened in iter2 after the manager fetched the official doc (`https://code.claude.com/docs/en/agent-teams`). This confirmed teammates are full independent Claude Code sessions with their own transcripts — which is both the continuation primitive AND the source of the metadata gap.

**Preparation** was skipped (readiness GREEN, 0 gaps; manager light-verified).

**Planning** ran 1 iter. Manager performed a light evaluation (spot-verify, not a spawned evaluator). One defect found: the plan asserted `agents/*.md` are "real files (NOT symlinks)" — this was INCORRECT (they ARE symlinks → `.gobbi/projects/gobbi/agents/`). Manager corrected the plan and propagated the correction to all executor briefs. Mistake staged for promotion (planning-leader-asserted-file-type-without-verifying).

**Execution** ran 6 tasks (T01–T05 per plan + T06 survivor sweep):
- T01 (de21e1f): `delegation/SKILL.md` — continue-vs-fresh decision table, F1 predicate, delta-brief mechanism, evaluator FORBIDDEN wall.
- T02 (ed286e8): `session.template.json` + `orchestration/SKILL.md` — teammate-aware `agents[]` schema (turns[]/continuationOf) + teammate metadata section.
- T03 (6b6e8c3): `orchestration/workflow/ideation.md` + `execution.md` + `orchestration/SKILL.md` — leader/executor continuation choreography, two use-modes, team roster/mailbox/lifecycle, audit-trail reconciliation.
- T04 (75d273d): `agents/leader.md`, `agents/executor.md`, `delegation/templates/executor.md`, `execution/SKILL.md` — continuation write-discipline (absolute paths, `git -C <worktree-abs>`, re-anchor, re-state scope/status).
- T05 (3e0f76f): `agents/manager.md`, `.claude/CLAUDE.md` — qualified the two "nothing inherited" assertions to point at the continuation exception.
- T06 (b202939): Survivor sweep (auto-mode.md, chat-mode.md, gobbi/SKILL.md, delegation/SKILL.md, orchestration/workflow/planning.md) — qualified the operative fresh-executor dispatch rows that iter1 evaluation caught as High/100 survivors.

Execution dual-system evaluation: iter1 both REVISE (fresh-executor/audit-trail survivors; Codex rated the auto/chat-mode operative rows High). iter2 (after survivor sweep): Codex re-eval all 4 findings RESOLVED → PASS.

## What shipped

- 6 commits on `claude-2026-06-07-a4e3b54d-3182-4193-8a42-69fce489a098` (base: develop e968976), 14 files.
- Feature memory: design doc, plan, 2 decisions, 4 discussions, 3 scenarios, checklist, 6 references, 2 backlogs promoted to `features/agents/`.
- 3 project mistakes (2 staged + 1 synthesized from planning discussion-log).
- 2 Layer-2 copies (skills/mistake/) for cross-project recall.

## What got stuck

Nothing is stuck. The only open item is deliberate: the actual `.sh` runtime code for populating `turns[]`/teammate token usage at runtime is deferred to the new backlog (`features/agents/backlogs/agent-teams-sh-runtime-implementation.md`).

## What shifted

The design added D9 (team roster/mailbox/lifecycle) mid-iter2 in response to Codex O2. This was not in iter1 scope but is now a first-class policy component of the design.

The Execution scope grew by 1 task (T06 survivor sweep) — approved by the manager mid-Execution after iter1 evaluation revealed that the original co-touch enumeration missed the operative auto/chat-mode dispatch rows. This was a recognized pattern (see new mistake: cotouch-enumeration-must-cover-semantic-equivalents).

## Decisions to respect

1. **Continuation = primary-where-safe, never mandatory.** Operator pre-check (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, v2.1.32+) is required before relying on continuation. If unset, fresh-spawn fallback.
2. **Evaluator continuation is FORBIDDEN — hard wall.** Evaluators stay fresh subagents, kept OUT of the Agent Teams mailbox. Non-negotiable.
3. **F1 predicate is deterministic:** continue iff (next task files/feature scope overlaps current task's touched files OR same feature directory) AND (consecutive continued count < 3) AND (context budget not strained); otherwise fresh-spawn.
4. **`.claude/agents/{manager,leader,executor}.md` are symlinks, NOT real files.** Edit via canonical `.gobbi/projects/gobbi/agents/` paths. The Edit tool refuses symlink paths.
5. **Teammate-aware metadata:** teammate turns go in `turns[]` (not last-write-wins upsert); teammate tokens must be counted in the cost rollup via team config `members` array (not parent `subagents/` only).

## Next session

The session branch `claude-2026-06-07-a4e3b54d-3182-4193-8a42-69fce489a098` needs a PR opened against `develop`. The manager owns this.

FLAG-2: `claude` doc-authoring skill is absent. This was deferred from scope but is a noted gap in the existing backlogs.

The deferred `.sh` runtime backlog (`features/agents/backlogs/agent-teams-sh-runtime-implementation.md`) is the natural next pick-up for the `agents` feature.
