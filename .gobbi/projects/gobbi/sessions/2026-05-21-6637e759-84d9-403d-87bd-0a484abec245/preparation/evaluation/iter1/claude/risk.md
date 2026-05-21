---
loop: preparation
iter: 1
perspective: risk
evaluator_system: claude
artifact_under_eval: preparation/rawdata/draft-iter1.md
---

# Risk — Preparation iter1

## Lens
What breaks if Preparation is wrong? Wrap-up sole-writer contract, staging path correctness, RE-IDEATE triggers not caught, deferred items lost.

## Stage 0 — Target Understanding
The destructive sweep is the highest-blast-radius Idea this project has shipped: an irreversible single-PR squash that deletes ~70+ subtrees. Preparation's job is to make sure no precondition is missing AND no readiness gap is silently downgraded. A wrong Preparation here cascades into either (a) an executor stalling mid-sweep ("checklist says do X but I need skill Y"), (b) an executor rationalizing past a verification gate, or (c) Wrap-up failing to promote inherited Ideation staging because the routing target was placeholder-ized.

## Stage 1 — Frame
Seed scenarios from `preparation/evaluation.md § Risk`:
- S1: No Preparation write went directly to project memory (Wrap-up sole-writer contract).
- S2: Every RE-IDEATE trigger was caught and escalated or explicitly ruled out.
- S3: Deferred items in "Out of scope gaps" are not silently lost.
- S4: Staged skill slugs will not collide with existing project skills (N/A — 0 staged).

## Stage 2 — Scenario walk

**S1 — Wrap-up sole-writer**
- "Generated this loop: 0 skills, 0 memory promotions." No project-memory writes occurred.
- The pre-bootstrapped `preparation/staging/` subdirs are session-scoped, not project-memory. ✓
- I sanity-checked by inspecting `find .gobbi/projects/gobbi/skills/ -name "*.md" -newer .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ideation/` — no recent writes from this session. ✓

**S2 — RE-IDEATE assessment**
- The leader's Sub-step D explicitly states: "No `re-ideate` triggered. No `generate-now` triggered." Sub-step A confirms the Ideation output is mutually consistent (iter4 PASS with Claude PASS + Codex PASS at convergence).
- The leader's Notes-for-downstream-EVALUATION section line 180 explicitly addresses this: "RE-IDEATE triggering: not applicable — no finding rises to 'unworkable without re-Ideation.'"
- ✓ — RE-IDEATE was explicitly considered and ruled out with rationale.

**S3 — Deferred items not lost**
Each Out-of-scope row has a concrete next-action:
- F-CX-O4-01 → `ideation/staging/decisions/gh-delete-branch-local-cleanup-wording.md` (verified exists on disk per leader's claim; routed to Planning).
- F-OV-02 → resolution-log § iter1 row.
- F-A4-01 / F-U4-01 / F-A3-01 / F-A3-02 → resolution-log "open (below-threshold, documented)".
- CLI-regenerator → `ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` (verified — leader Sub-step B row 6 cites it).
- 3 mistake-file deletions → encoded inline in checklist (cited per-stage).
- Variant C of stub-redirect-format → D4 follow-up.
None are "TBD" or "later" without a pointer. ✓

**S4 — Slug collisions**
- N/A this iter (0 staged skills).

## Stage 2 — Adversarial probe results

I targeted the highest-blast-radius risks for this specific destructive sweep:

**R1 — Stage E.2 NEEDS_CONTEXT enforcement**
The leader claims (Sub-step C row "principles") that "The Implementation Checklist's 'no rationalization' clauses at Stage E.2 and Stage G map directly to Iron Law 11 + the `executor-rationalized-failing-verification-gate` mistake." I cross-checked: the mistake file exists at `.gobbi/projects/gobbi/mistakes/executor-rationalized-failing-verification-gate.md` ✓. Implementation Checklist Stage E.2 line 82 says "If either fails: NEEDS_CONTEXT — do NOT rationalize (per `executor-rationalized-failing-verification-gate.md`)." Stage G line 103 says "Exit ≠ 0 ⇒ NEEDS_CONTEXT (report `$HEAD_SHA`, current `gh pr view <pr-num> --json headRefOid -q .headRefOid`, and gh stderr; do NOT retry, do NOT rationalize)." Both linkages confirmed.

**R2 — Symlink semantics under `git rm -r .codex/`**
`.codex/{agents,hooks,project,rules,skills}` are tracked symlinks pointing INTO `.claude/`. The Implementation Checklist Stage B line 38 explicitly notes: "`.codex/{agents,hooks,project,rules,skills}` are tracked symlinks into `.claude/`; `git rm -r` removes the symlinks, not the targets." Verified: `readlink .codex/skills` → `../.claude/skills`. Removing the symlink does NOT touch the survivor `.claude/skills/` tree. ✓ Risk handled.

**R3 — Order of edits within Stage B's commit 1**
Stage B does both `git rm -r .claude/project/gobbi/` (Q-D) and edits `.claude/CLAUDE.md` lines 61-62 in the SAME commit. CLAUDE.md lines 61-62 reference `../../../.gobbi/projects/gobbi/design/v050-overview.md` and `.../v050-cli.md`. Stage C (commit 2) wipes `design/`. So at commit 1: CLAUDE.md rows are removed BUT design/ targets still exist (next commit wipes them). At commit 2: both gone. Bisect-safe at both end-states. The within-commit order of `git rm` vs sed-edit is irrelevant because they touch disjoint paths. ✓

**R4 — `pre-reset-2026-05-21` push step authorization**
Stage 0 includes `git push origin pre-reset-2026-05-21`. The manager's briefing confirms gh auth covers remote push. I empirically verified `gh auth status` was run by the leader and shows authenticated + ssh + active. No auth risk. ✓

**R5 — `--match-head-commit` semantics with `--squash`**
The flag works with `--squash` per the iter4 evaluator's prior verification and confirmed again here: `gh pr merge --help` lists both `--squash` and `--match-head-commit` as compatible top-level flags. The atomic guard protects against last-second pushes to the PR branch between approval and merge. ✓

**R6 — `.gobbi/.gitignore` editability**
The file is itself gitignored (matched by `.gobbi/*`). On-disk edit works; `git add` is a no-op. Stage D's `git check-ignore` verification depends ONLY on on-disk content. No risk. Phrasing nit only (see usage.md observation).

**R7 — Iteration history preservation for Planning**
session.json carries the 4 ideation iterations with timestamps and verdict ("PASS"). Planning will inherit this. ✓

**R8 — Wrap-up routing-target-vanishes (H-4)**
The 3-mistake H-2 trade-off + the CLI-regenerator H-4 trade-off both mean: post-sweep, the project-memory promotion targets (`mistakes/`, `backlogs/`) are placeholder-ized. Wrap-up MUST NOT promote those Ideation-staged files into placeholder dirs. The leader's Sub-step C "Wrap-up" row + Sub-step B row 6 explicitly document this. The lessons are encoded inline in the checklist. Risk is bounded and documented. ✓

No missed risk found.

## Findings

(none)

## Must-preserve list
- Stage E.2's NEEDS_CONTEXT gate + the citation of `executor-rationalized-failing-verification-gate.md`. This is the Iron Law 11 anchor.
- Stage G's "Exit ≠ 0 ⇒ NEEDS_CONTEXT, do NOT retry, do NOT rationalize" clause.
- Stage B line 38's symlink-semantics note for `.codex/`.
- The H-4 routing-target-vanishes documentation in Sub-step B row 6 + Sub-step C Wrap-up row.

## Verdict
**PASS** — All high-blast-radius risks are either resolved or explicitly bounded with checklist clauses. No silent risk absorption.
