---
name: add-principles-9-and-10
description: Session that added Principles 9 and 10 to the gobbi principles skill, extending 8 → 10 and propagating the count across 5 live doc surfaces.
type: notes
scope: project
feature: null
status: active
created: 2026-06-07
session: b02c3111-68be-4558-a19f-fabf9627602f
tags: [principles, guardrails, p9, p10, crud-5w1h, scope-contract, count-propagation]
features_touched: [guardrails]
loops_completed: [ideation, planning, execution, wrap-up]
shipped: [features/guardrails/decisions/2026-06-07-p9-p10-locked-design.md, features/guardrails/discussions/2026-06-07-p9-p10-title-boundary-scope.md, features/guardrails/plans/2026-06-07-principles-9-10-implementation-plan.md, backlogs/guardrails-readme-iron-law-count-drift.md, backlogs/reciprocal-principle-cross-refs.md]
---

# Add Principles 9 and 10

## What happened

The session added two new behavioral principles to the gobbi principles skill, extending the count from 8 to 10.

**Ideation.** The leader investigated two failure modes the existing 8 principles did not address: (1) agents editing files without checking which other files the edit touches (the blast-radius problem); (2) agents silently deferring in-scope work while reporting tasks done. The leader produced full P9 and P10 wording drafts, a CRUD scope map covering 5 real files and 11 count-references, and an overlap analysis against P1/P5/P6. Eight design decisions (D1–D8) were identified; two AskUserQuestion calls resolved six of them.

**User decisions in Ideation.** The user made six decisions across two exchanges: P9 title locked to "Think CRUD-and-5W1H Before Editing" (user's mnemonic choice over the recommended "Think Project-Wide Before Editing"); P10 title locked to "Finish In-Scope Work — Do Not Defer It" (matched the recommended form); P9 sits beside P6 with a one-line forward cross-reference only — P6 is not rewritten this session; PR scope locked tight (5 real files, 11 count-references, no expanded scope); evaluation limited to dual-system at Execution only; Preparation loop skipped (Ideation → Planning directly). D7 (reciprocal back-pointers from P1/P5/P6 to P9/P10) and D8 (guardrails README "13 Iron Laws" drift, pre-existing and wrong by 7 after this change) were deferred to project backlog.

**Planning.** The leader produced a one-task plan: a single executor pass over 5 canonical real files in a fixed internal order (principles bodies first, then the 4 reference files, then verification). The plan included three verification anchors (V1 count grep, V2 symlink integrity, V3 section count + table rows). No Preparation loop ran. The plan's decomposition rationale centers on P9 itself: consistency across all 5 files is the deliverable and must land as one atomic edit.

**Execution.** A single executor task ran commit `ef1bb0e`. Five files changed, +52/-8 lines. The executor appended P9 and P10 sections (full 4-part format: Why / Practice / Anti-pattern) after P8 in `principles/SKILL.md`, propagated 11 count-references (8→10 in prose + 2 table-row appends in CLAUDE.md and AGENTS.md), and verified all three anchors passed. The 4 symlink views propagated correctly. No symlink was edited directly. No file outside the 5-file scope was touched.

**Execution evaluation.** Dual-system evaluation ran (Claude + Codex). Both returned PASS at iter1. Claude ran all 7 perspectives; the only finding was a Low out-of-scope observation noting the pre-existing D8 guardrails README drift — explicitly deferred. Claude also ran the manager-flagged broad missed-"8" grep across the full canonical tree; result was empty, confirming the 5-file scope was complete. Codex ran 7 perspectives independently and returned PASS with no findings; independently verified scope, structure, count propagation, table rows, and symlink integrity.

## What shipped

- Commit `ef1bb0e` on the session branch (worktree `claude-2026-06-07-b02c3111-68be-4558-a19f-fabf9627602f`). 5 files changed, +52/-8.
  - `.gobbi/projects/gobbi/skills/principles/SKILL.md` — P9 + P10 sections appended
  - `.claude/CLAUDE.md` — count 8→10 (3 refs) + 2 table rows
  - `.codex/AGENTS.md` — count 8→10 (3 refs) + 2 table rows
  - `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` — count 8→10 (3 refs)
  - `.gobbi/projects/gobbi/agents/manager.md` — count 8→10 (1 ref)
- Promoted to project memory this session:
  - `features/guardrails/decisions/2026-06-07-p9-p10-locked-design.md` — D1–D8 locked decisions (ADR format)
  - `features/guardrails/discussions/2026-06-07-p9-p10-title-boundary-scope.md` — both AskUserQuestion exchanges
  - `features/guardrails/plans/2026-06-07-principles-9-10-implementation-plan.md` — implementation plan
  - `backlogs/guardrails-readme-iron-law-count-drift.md` — D8 deferred backlog (project-scope)
  - `backlogs/reciprocal-principle-cross-refs.md` — D7 deferred backlog (project-scope)
- `features/guardrails/README.md` activity log updated; `plans/` subdir created.

## What got stuck

Nothing stuck mid-session. Both deferred items (D7, D8) were pre-planned deferrals, not mid-session blocks.

## What shifted

- The P9 title shifted from the leader's recommendation ("Think Project-Wide Before Editing") to the user's mnemonic choice ("Think CRUD-and-5W1H Before Editing"). The hyphenated form was a compromise that preserves the mnemonic while reading as one compound tool.
- Evaluation was descoped early: the original plan had evaluation at all loops; the user locked it to Execution-only during Ideation, keeping the PR lean.

## Decisions to respect

- P9 title is fixed: "Think CRUD-and-5W1H Before Editing." Do not rename it without re-opening with the user.
- P10 title is fixed: "Finish In-Scope Work — Do Not Defer It." The "In-Scope" qualifier is load-bearing; it prevents misread as banning all deferral.
- P9 sits beside P6. P9 has a forward cross-reference to P6; P6 does NOT have a back-pointer to P9 yet (deferred D7). Do not add the back-pointer without picking up `backlogs/reciprocal-principle-cross-refs.md`.
- P10 explicitly pairs with P5 (P5 = ceiling, P10 = floor). Do not modify P10's Why without re-reading this pairing.
- P9 and P10 count as Iron Laws — the count is now 10, not 8. Any document that references the Iron Law count must be updated when touched. See also `backlogs/guardrails-readme-iron-law-count-drift.md` for the deferred README fix.
- The 5 canonical real-file edit discipline is locked: never edit symlink views (`.claude/skills/principles/SKILL.md`, `.claude/skills/gobbi/SKILL.md`, `.claude/agents/manager.md`, root `AGENTS.md`) — edit the canonical real path only.

## Next session

Two deferred backlogs are ready to pick up independently:

1. `backlogs/reciprocal-principle-cross-refs.md` (D7) — add back-pointers from P5, P6, P1 to P9/P10. Standalone prose edit to three existing principle bodies. Low priority.
2. `backlogs/guardrails-readme-iron-law-count-drift.md` (D8) — fix the pre-existing "13 Iron Laws" hard-coding in `features/guardrails/README.md` (5 places). Standalone prose edit to one README. Medium priority. Pick up after the P9/P10 PR is merged.

The session branch must be merged to develop (or squash-merged as a PR) before these follow-ups run.
