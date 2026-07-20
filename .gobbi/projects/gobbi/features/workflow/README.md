---
name: README
description: The single Gobbi workflow, v5/v3 session router, dual-system quality loop, and session-record ownership.
type: features
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [workflow, session-memory, orchestration, scaffold, vocabulary-rename, wrap-up-pipeline]
author: claude
value_proposition: Deterministic, auditable work through one workflow, one active router, independent dual-system creation, and fresh dual evaluation.
subsystems: [skills/orchestration, skills/record, skills/memory, skills/ideation, skills/planning, skills/execution, skills/wrap-up]
---

# Workflow

## Overview

The `workflow` feature is the Gobbi session engine. It routes one mandatory workflow:

`Configuration -> Ideation -> Planning -> Execution -> Wrap-up`

Every productive step uses `DISCUSSION -> WORK -> EVALUATION -> RECORD`. Planning is non-skippable and begins with a readiness gate over locked Ideation, memory, skills, authority, and staging.

## Current contract (2026-07-20)

- `session.json` schema version 5 is the low-frequency lifecycle manifest. It owns settings, stable Gobbi session identity, ordered runtime IDs, Git identity, and the final durable outcome.
- `state.json` schema version 3 is the only active router. Its canonical cursor is `current.step`, `current.stage`, `current.iteration`, and `current.task`; `activeDispatches` records bounded live assignments. Runtime task lists are projections only.
- WORK always starts with independent Claude and Codex drafts from one neutral contract. Both drafts freeze before reciprocal cross-review. The active-runtime specialist then writes the synthesis and resolves material items in `open-decisions.md` with the user.
- EVALUATION always uses two fresh independent evaluators. Each writes one system report containing Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, Overall, a finding ledger, a completed checklist, and a derived verdict. A finding is not applied before the user approves its disposition.
- A missing system pauses the loop. Continuation requires an explicit waiver naming the system, step, and iteration. Token cost never reduces Ideation, creation, or evaluation rigor.
- The package has no Gobbi hooks, transcript capture, operational telemetry, or memory-compaction subsystem.
- The ten owned commands are the three root package commands, the root Markdown-link validator, Git posture probe, Memory frontmatter validator, Mistake conformance validator, Record session command, dual-WORK validator, and evaluation-report validator. `examples/typescript/run-examples.sh` is an example harness, not a Gobbi workflow command.

The current owners are `skills/orchestration/`, `skills/record/`, `skills/evaluation/`, and `skills/wrap-up/`. Output files are PASS-only; typed staging may validly remain empty.

## Historical status

The dated entries below are factual records of earlier contracts. They are not current execution guidance.

**v0.5.3 (2026-07-19):** the standalone Preparation phase and skill were retired. Readiness is now the first gate inside Planning DISCUSSION; the session tree uses four contiguous loop directories (`1-ideation`, `2-planning`, `3-execution`, `4-wrap-up`). Session schema v4 and state/settings schema v2 reject legacy session metadata before mutation; pre-v0.5.3 sessions must be completed in a worktree pinned to the older Gobbi version. Missing project-specific skills become the first ordered Execution task, while missing workspace/domain skills return `NEEDS_CONTEXT`.

**Session `7e00f98e` (2026-06-12):** vocabulary rename + Wrap-up pipeline redesign shipped. The per-loop capture sub-phase is now named RECORD (`skills/record/`); durable-tier CRUD standards are now in `skills/memory/`; the old `skills/memorization/` directory is gone. Wrap-up is restructured as a 5-stage gated pipeline: (1) session-record validation, (2) promotion/memorization, (3) memory validation (NON-SKIPPABLE — gates stage 5), (4) handoff, (5) git finalization (manager-owned, LAST). CLAUDE.md and AGENTS.md reconciled to the 6-step machine. 13 commits, all loops dual-system PASS. Two guard scripts added: `check-markdown-links.sh` + `check-residual-vocab.sh`.

**Session `1abeb43f` (2026-06-08):** session-memory tree redesign shipped. Spec-defined and script-materialized tree: `orchestration/templates/session-tree.md` + `orchestration/scripts/scaffold-session-dir.sh`. Full 45-file doc sweep. All 5 loops dual-system PASS.

At the time, post-cleanup session-memory retention and a Claude doc-authoring skill were deferred. The former `[FLAG-1]` was resolved: project skills are an authoring surface and missing project skills become ordered Execution work.

## Subdirectories

- `design/` — 17 files: session-memory-tree design + 6 Wrap-up/vocabulary-split design docs (D-a through D-f) + the Codex-proposer D1–D9 design (session `6cf13813`) + later sessions' design docs + the 3 doc-routing fix designs D3-001/D3-002/D1-002 (session `1fecddb4`) + the two-doc-kind workflow-compaction design (session `122609f7`)
- `decisions/` — 41 files: 8 from session `1abeb43f` + 11 from session `7e00f98e` + 2 resolved carry-forwards from session `6cf13813` + later sessions' decisions + 8 doc-routing-campaign decisions (session `1fecddb4`) + 4 workflow-compaction decisions (session `122609f7`)
- `references/` — 17 files: 3 from session `1abeb43f` + 5 from session `7e00f98e` + 4 dual-system-production evidence papers from session `6cf13813` + 5 Codex/Git branch-audit references from session `019f283d`
- `discussions/` — 19 files: 1 from session `1abeb43f` + 7 from session `7e00f98e` + 1 Codex-proposer user-decisions (session `6cf13813`) + later sessions' discussions + 2 scope/design-lock discussions (session `1fecddb4`) + 2 audit-scope discussion records from session `019f283d`
- `plans/` — 5 files: the locked 10-task session-memory plan + the locked 11-task vocabulary-rename plan + later plans + the 3-task doc-routing-fix plan (session `1fecddb4`) + the previous Codex branch audit plan
- `reviews/` — 2 files: Preparation readiness review and Task 01 Codex evaluation audit from session `019f283d`
- `backlogs/` — 4 files: task-record template + 17 dangling-ref fix; harness todo mirror; proposer/evaluator model-tier guard (session `6cf13813`); the D5-012 `ideation/SKILL.md:496` stale-copy cross-ref (session `1fecddb4`)
- `checklists/` — 18 files: executor verification checklists for sweep, gates, and evaluation steps; + the literal-gate-checks-structure-not-substring item (session `babc6f3b`) + later sessions' items + 5 doc-routing-campaign residuals (session `1fecddb4`) + 1 branch-audit skill-load checklist gap (session `019f283d`)
- `scenarios/` — workflow/memorization.md doc-filename rename edge case; + iter-artifact-snapshot-frozen-not-mutated (session `babc6f3b`)
- `changelogs/` — 4 files: the verification-frame Phase-B (C1–C6 + F1) ship record (session `babc6f3b`) + two audit-only Execution task records from session `019f283d` + the skill-standard redesign + orchestration refactor record from session `33de02b8`

**Note (session `1fecddb4`):** the counts above are approximate for `design/` / `decisions/` / `discussions/` / `checklists/` — several sessions between `babc6f3b` (2026-06-26) and `1fecddb4` (2026-07-05) promoted content here without a corresponding Recent-activity row (a pre-existing README-maintenance gap, not introduced this session). See `## Recent activity` below for the rows that do exist; the file counts are read directly from disk as of this session's Wrap-up.

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-07-19 | Codex worktree implementation | Retired the standalone Preparation skill/loop, absorbed readiness into non-skippable Planning, renumbered the four productive-loop directories, added fail-closed schema compatibility gates, and documented the v0.5.3 new-session-only migration contract. Evaluation was intentionally Codex-only because Claude was unavailable; no synthetic Claude evidence was created. |
| 2026-07-08 | 33de02b8-4dff-4768-bafa-c1f53ae81890 | Skill-standard redesign + orchestration refactor: new 6-section skill skeleton (Frontmatter → Intro → Principles → Rules → Procedure → References) with source-free body + per-doc-local References; `skill-writing/SKILL.md` (dogfood) + `orchestration/SKILL.md` migrated; orchestration split into 4 `orchestration/workflow/*.md` child docs (status-display, session-record, state-machine, metadata) with inbound anchors repointed. Full dual-system workflow — Ideation 3 iterations (iter1 incomplete artifact, iter2 missed child-doc anchors + anchor-blind guard, both fixed) + Execution task 01 and task 05 dual eval (allowlist mismatch + non-source-free Rules; user-approved-removal false positive). 6 commits. Lazy migration going forward — `agent-writing/SKILL.md` and the Interview project-skill template deferred to backlogs; 1 skill-owned mistakes.md (skill-writing, 2 sections) + 1 skill-owned mistakes.md (evaluation, 1 section) + 1 project-tier mistake + 2 learnings promoted |
| 2026-07-07 | 122609f7-3c4c-44ea-af90-efe1531a5cbf | Chat-mode "deepen ideation" session, Ideation-only (no Preparation/Planning/Execution): refined the 2026-07-06 review's Point 2 uniform 8-point compaction skeleton into a validated two-doc-kind (`loop-orchestration`/`gate-orchestration`) design for `orchestration/workflow/*.md`, with a hoist-then-point pointer mechanism and a `check-workflow-pointer-drift.sh` drift-guard spec. Dual-system production (Claude + Codex, reconciled 10/14 rows changed toward Codex, 0 escalated) + two full dual-system evaluation rounds (iter1 REVISE ×2 systems → iter2 PASS). 1 design + 4 decisions promoted; 1 project-tier process mistake promoted (`mistakes/verification/verify-ssot-and-metrics-by-location-not-intent.md`). No implementation this session — a future session executes the design against Planning's re-verification gate |
| 2026-07-06 | 019f283d-e961-7442-9c22-319f26798141 | Previous Codex branch audit-and-record session closed: preserved official Codex/Git references, the four-task branch-audit plan, Preparation and Task 01 review evidence, pinned diff-stat discussion, two Execution task changelogs, one checklist gap, and explicit native-Codex degraded-evaluation debt. Final wrap-up also fixed standing-guard blockers found while validating promoted memory: `.agents` symlink guard self-location, broken relative links, residual Family B wording, and skill-mistakes placeholder path wording. No fake Claude lane was invented. |
| 2026-07-05 | 1fecddb4-255e-4829-9912-42deb9c36fc8 | 3-High workflow-doc-routing fix shipped (GEN-D3-001 + GEN-D3-002 + GEN-D1-002 from the 2026-07-01 adversarial review), on top of PR #333 (`6a0d747c`): `gobbi/SKILL.md` Step 6 routed through the mode-doc dispatch; `auto-mode.md`/`chat-mode.md` mode tables split into `Manager refs` + `Specialist phase loads`; `workflow/evaluation.md`'s drifted routing table replaced with a canonical pointer. 3 commits (`cacc54c7`, `5946cfa0`, `a2c23096`), dual-system EVALUATION PASS at both Ideation (iter2) and Execution (iter1), no divergence. 8 decisions, 3 design, 5 checklists, 2 discussions, 1 backlog (D5-012 cross-ref) promoted; 1 project-tier mistake promoted (`mistakes/assumption/evaluator-spawn-without-producer-done-handshake.md`); GEN-D4-003 + FLAG-2 remain deferred |
| 2026-06-26 | babc6f3b-e845-4ed3-9625-c14ea9237fd8 | Dual-system VERIFICATION frame built + Phase B shipped: the locked verification frame (scenarios + six per-dimension checklists) for the D1–D9 proposer model, plus improvement candidates C1–C6 + the live F1 mirror fix (8 commits). Ideation iter1 FAIL → iter3 PASS; dual eval caught the manager's own audit gap + 2 distinct Execution defects via divergence. 6 mistakes (2 layer-2), 7 learnings, 3 decisions, 1 scenario + 1 checklist, 1 design, 1 changelog promoted |
| 2026-06-25 | 6cf13813-a002-4e55-96b9-a5d65f619ef8 | Dual-system PRODUCTION (Codex independent proposer) designed + shipped across all 5 productive WORK sub-phases: D1–D9 locked design; producer selective-integration + Integration Log; per-step `propose.mode` (all-5-default-ON, master switch dropped); degraded-mode label; D9 freeze boundary. 11 commits, 32 files, dual-system PASS (iter1 REVISE → iter2 PASS). 3 process mistakes promoted |
| 2026-06-13 | 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4 | Vocabulary rename + Wrap-up pipeline redesign: RECORD/memory/memorization vocabulary lock; 2-skill split (record + memory); 5-stage Wrap-up pipeline; CLAUDE.md/AGENTS.md reconcile; 2 guard scripts; 13 commits; 4 mistakes promoted (2 layer-2) |
| 2026-06-08 | 1abeb43f-6389-4abf-b098-b2b3e68d79b2 | Session-memory tree redesign: spec doc + scaffold script + 45-file doc sweep shipped; 6 decisions + design + plan + 3 references promoted |

## Current open work

- Complete the repository-wide ownership review and the full Claude Code and native Codex fixtures from the locked 2026-07-20 implementation plan.
- Run the complete dual-system Execution evaluation and resolve its finding batch through the user gate.
- Keep the protected role documents' known obsolete wording isolated as the accepted exception; do not use it as workflow guidance.

## Historical backlog references

These entries record what earlier sessions considered open. They are not the current work queue.

- `backlogs/process/task-record-template-and-dangling-ref.md`: author task-record template + fix 17 dangling refs in chat-mode.md.
- `backlogs/workflow/persist-session-memory-past-cleanup.md` (project-level): retain session working memory after worktree cleanup for post-session debugging.
- `backlogs/workflow/agent-writing-six-section-migration.md` (project-level, session `33de02b8`): migrate `agent-writing/SKILL.md` to the new 6-section skill standard — lazy follow-up.
- `backlogs/workflow/project-skill-template-realign.md` (project-level, session `33de02b8`): RESOLVED — the project-skill template was relocated to `skill-writing/templates/project-skill.md` and realigned to the 6-section standard; backlog closed.
- `backlogs/process/d5-012-ideation-skill-md-stale-routing-copy.md` (session `1fecddb4`): `ideation/SKILL.md:496` carries the same stale routing-table wording GEN-D1-002 fixed at `workflow/evaluation.md`; deferred, out of this session's locked scope.
- `[FLAG-1]`: RESOLVED in v0.5.3 — project `skills/` is a non-memory authoring surface; Planning schedules missing project skills as the first ordered Execution task.
- `[FLAG-2]`: author the `claude` doc-authoring skill (out of scope for this session).
- GEN-D4-003 (2026-07-01 adversarial review, `backlogs/evaluation/fix-d4-review-findings.md:223`): the only remaining High from the original 4; not part of this session's locked scope.

## Historical design decisions (session `7e00f98e`)

- **D5/D6/D7** — Vocabulary lock: per-loop sub-phase = RECORD; durable store = memory; wrap-up promotion stage = memorization.
- **D-b/D10** — Two-skill split: `skills/record/` = per-loop procedure; `skills/memory/` = durable CRUD standard.
- **D-c/D8/D13** — Wrap-up 5-stage pipeline; git finalization is stage 5 (LAST, manager-owned); stage 3 memory validation is NON-SKIPPABLE and gates stage 5.
- **D-f** — CLAUDE.md/AGENTS.md reconciled to 6-step machine (Configuration named explicitly).

## Current owners

- `skills/record/record-map.md` — v5/v3 schemas, eager tree shape, command contract, and atomic patch-file semantics.
- `skills/orchestration/workflow/dual-system-work.md` — independent drafts, cross-review, synthesis, open decisions, and waiver behavior.
- `skills/evaluation/SKILL.md` — the complete report method and verdict derivation.
- `skills/record/scripts/session-record.sh` — the single session-record command.
- `scripts/check-markdown-links.sh` — the root scoped link validator.
