---
name: g1-deployment-hygiene-handoff
description: "Next-session handoff: G1 fix cluster shipped (PR off develop); G2/G3 remain; dual-system production lessons promoted."
type: notes
scope: project
feature: null
status: active
created: 2026-06-30
session: 0dc5cf75-54c5-4b52-82fa-b18750bdaade
tags: [process, codex]
keywords: [handoff, deployment, fix-campaign, dual-system]
author: claude
features_touched: [deployment-hygiene]
steps_completed: [ideation, planning, execution, wrap-up]
shipped: [deployment-hygiene, dual-system-work-is-mandatory]
---

# Handoff — G1 deployment hygiene shipped

## What this session did
First fix session of the adversarial-review FIX campaign. User restructured the 7 handoff clusters → **3 by theme** (G1 deploy hygiene = C1+C7; G2 doc consistency = C2+C3+C6; G3 structural = C4+C5). Shipped **G1** end-to-end through the full gobbi workflow (Ideation→Planning→Execution→Wrap-up, dual-system production + evaluation).

**Branch** `claude-2026-06-29-0dc5cf75-…`, 7 commits off develop, PR opened `--base develop`. All gates green: `sync --check` 0, publish-readiness gate 0, validator runnable, version 0.5.1 lockstep.

## Decisions locked (carry forward)
- **A3** = per-file real-dir `.claude/skills` mirror, tool-owned, docs+support-dirs, inventory DERIVED per skill (no whole-dir symlinks). **A7** = PATCH-only 0.5.x + version-bearing-file lockstep + derived-baseline pre-publish gate.

## Dual-system value this session (concrete)
- Production caught the A3/A7 design forks → surfaced for user decision.
- Ideation eval caught the "derive-don't-hardcode contradiction" (the draft hardcoded the mirror inventory while preaching derive — Codex's structure perspective PASSED it; Claude caught it).
- **Execution eval: Codex caught 2 High deployment bugs the Claude evaluator rated PASS** — validator not fail-closed on a broken install; gate accepting leading-zero semver. Both fixed (commit 23d669cd). This is the anti-groupthink signal earning its cost on the exact bug-class G1 fixes.

## Lessons promoted to memory
- `mistakes/codex/dual-system-work-is-mandatory.md` — never downgrade dual PRODUCTION to single for efficiency (user correction).
- `mistakes/codex/peer-operation-must-not-mutate-shared-worktree.md` — the Execution dual-proposer must NOT share the executor's worktree with workspace-write; a stray `git checkout` wipes unstaged edits. **System fix needed:** run the Execution Codex proposer read-only (`-o`) or in an isolated worktree; never let it run tree-level git checkout/restore/stash. (production.md / codex skill should encode this.)

## Open / next
- **G2** and **G3** clusters (separate sessions, per the fix-phase handoff plan on the 5ac6cf6e `-fixplan` branch — note that plan is NOT yet merged to develop).
- `archive/backlogs/process/2026-07-20-integration-log-schema-doc-validator-drift.md` — production.md Integration-Log schema omits the `#` column its validator requires.
- `archive/backlogs/evaluation/2026-07-21-g1-eval-low-followups.md` — complete historical three-item
  queue; F2/F3 are closed, and F1 continues as
  `backlogs/tooling/non-dot-skill-artifact-policy.md`.
- The fire-once validator was non-runnable at baseline (printf crash) — fixed here; flags that the review campaign reads guards without running them.

## Process notes
- Teammate-continuation messaging lagged (teammates processed one instruction per wake; follow-ups needed re-triggering). Fresh report-back spawns were more reliable than continuing idle teammates.
- Wrap-up promotion + handoff done manager-direct (not via a Wrap-up assistant) due to session length + teammate lag.
