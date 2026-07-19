---
name: d7-001-split-fresh-init-resume-rehydration-shipped
description: Configuration's fresh-init vs resume-rehydration split, as shipped after the iter2 resume-signal correction
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [design, process]
keywords: [GEN-D7-001, resume-detection, fresh-init, row-4, row-4R, continue-target]
author: claude
supersedes: d7-001-split-fresh-init-resume-rehydration
superseded_by: null
related: [resume-detection-must-read-only-pre-branch-persisted-facts, resume-continue-target-must-include-ideation]
---

# Configuration fresh-init vs resume-rehydration split (as shipped)

## Problem

`orchestration/SKILL.md`'s Configuration procedure unconditionally stamped
`workflow.ideation.state = "Active"` and unconditionally re-entered Ideation on every session start,
including a resumed session with live productive-step state. `state.json` was named the recovery
source but nothing actually read it to continue a persisted step, so a resume could clobber live
workflow state (GEN-D7-001).

## Scope

In scope: `orchestration/SKILL.md`'s Configuration procedure (rows 1-5), `gobbi/SKILL.md` §6,
`auto-mode.md:64`'s stale rows-1-4 enumeration. Out of scope: `state.template.json` /
`session.template.json` (no schema change needed under the recommended direction).

## Approach

Row 4 (fresh) and row 4R (resume) are split as two distinct rows. Row 4 remains fresh-only: it
stamps `workflow.ideation.state = "Active"` and enters Ideation. Row 4R is resume-only: it reads and
validates the persisted `state.json`, then continues the persisted active step — which now
explicitly includes Ideation alongside Planning/Execution/Wrap-up, per the iter2 fix for
Claude's F1 finding. Row 4R never re-stamps `workflow.ideation.state = "Active"` — a persisted
Ideation-Active state is read and continued, never re-initialized.

**As-shipped resume signal (post-iter2 correction).** The originally locked direction's resume signal
(`settings.json` exists AND `session.json.previousSessionId` non-null AND a valid `state.json` with a
non-`configuration` Active/Revising step) was found circular at Execution iter1 (Codex finding O1,
Critical, confidence 85): `previousSessionId` is stamped at row 5, AFTER the row 4/4R branch already
ran, so a session's first resume still has `previousSessionId: null` and was misclassified as fresh —
reintroducing the exact clobber this fix was meant to close. The shipped signal drops
`previousSessionId` from the predicate entirely and classifies resume from three facts all persisted
BEFORE the branch: (1) `settings.json` exists, (2) `state.json` exists with a non-`configuration` step
in `Active`/`Revising` state, (3) the row-1 worktree guard is not in the orphaned state.
`previousSessionId` is demoted to post-classification telemetry, stamped at row 5 as a record of what
happened, never read as an input to what should happen.

Row 4R validates four invariants before continuing: (1) no step after the persisted active one is
Done (in the fixed Configuration→…→Wrap-up order), (2) the mode in `state.json` is checked against
current `settings.json` — a legitimate mode reconfigure is not a halt condition, (3) the persisted
step's supporting artifacts exist, (4) any genuine inconsistency fails safe to `NEEDS_CONTEXT` rather
than silently guessing.

## Scenarios

- **Golden — first resume.** A session interrupted after Ideation starts (terminal closed,
  `/clear`, compaction) resumes: `previousSessionId` is still `null`, but the three-fact signal
  (settings + state + worktree-guard) correctly classifies it as resume. Row 4R runs, Ideation is
  CONTINUED (read, not re-stamped).
- **Golden — mid-Planning/Execution/Wrap-up resume.** Same three-AND signal covers every
  productive step identically — no step-specific branch needed.
- **Edge — mode reconfigure on resume.** User legitimately changes mode; row 4R's invariant 2
  validates the CURRENT settings.json rather than halting on the mismatch.
- **Non-blocking residual — crash-mid-Configuration.** A crash between the row-1 worktree guard and
  row 4 (config-only `state.json` stub) matches neither the literal fresh-iff nor resume-iff clause;
  it benignly defaults to fresh (no productive state exists to clobber). Deferred as a Low-severity
  backlog item (`fresh-resume-predicate-strict-complement`) rather than blocking this fix.

## Validation

Executable, root-relative, case-insensitive: a resume trace confirming a first-resume session
(`previousSessionId: null`, valid `state.json` with an Active productive step) is classified resume,
not fresh; a fresh-session trace confirming row 4 still stamps Ideation correctly; a grep across
`gobbi/SKILL.md` + `orchestration/SKILL.md` confirming the continue-target enumeration includes
Ideation everywhere it is listed; both Claude and Codex Execution-loop iter2 evaluations independently
re-verified the corrected predicate and returned PASS.

## Trade-offs

Optimizes for: a provably non-circular resume classifier using only pre-branch facts, and closing the
Critical state-clobber path. Accepts: the fresh/resume predicate is not yet a strict literal
complement (the crash-mid-Configuration edge case defaults to fresh by fall-through rather than by an
explicit third clause) — tracked as a deferred Low-severity backlog item, not blocking.

## Open issues

- `fresh-resume-predicate-strict-complement` (Low, deferred) — make the fresh/resume predicate a
  literal, provably exhaustive three-way partition instead of relying on benign fall-through for the
  crash-mid-Configuration case.

## Related

- [[resume-detection-must-read-only-pre-branch-persisted-facts]] — the mistake-candidate documenting
  the circular-predicate root cause and the general detection-design rule it establishes
- [[resume-continue-target-must-include-ideation]] — the sibling iter2 fix (Claude finding F1)
  ensuring Ideation is a valid resume continue-target
