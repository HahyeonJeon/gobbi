---
name: workflow-phase-doc-set-enumeration
description: Session journal of how the per-iter-cadence workflow-doc enumeration evolved — the 7-vs-5 file-count correction across two evaluation rounds.
type: notes
scope: project
feature: null
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, per-iter-cadence, workflow-docs, enumeration-history]
features_touched: [git-workflow]
---

# Workflow phase doc-set enumeration — how the 5-file set was settled

This is the chronological narrative reclassified out of `features/git-workflow/design/workflow-phase-doc-set-for-per-iter-cadence.md`, per the dev-doc type-purity rule (a design doc states its conclusion; the session blow-by-blow belongs here). The design doc carries the self-contained conclusion; this note preserves how that conclusion was reached.

## What happened

Design Decision D-4 (per-iteration session-memory commit cadence) called for adding the `chore(session): record <loop> iter{n} memory` commit rule to "all 5 workflow phase docs," but never enumerated which 5 files. A Preparation gap scan flagged this as a Planning-ambiguity gap (low-medium severity), and the user confirmed generating an explicit enumeration design file rather than deferring it.

The first draft of the enumeration design asserted a 5-file target set. Both evaluators in the first evaluation round flagged that `.claude/skills/orchestration/workflow/` actually contains **7 files**, not 5. The second round did an empirical re-verification:

```
$ ls .claude/skills/orchestration/workflow/
evaluation.md  execution.md  ideation.md  memorization.md  planning.md  preparation.md  wrap-up.md
```

That confirmed 5 loop docs (`ideation`, `preparation`, `planning`, `execution`, `wrap-up`) plus 2 cross-cutting sub-phase docs (`evaluation.md`, `memorization.md`). The corrected design names the 5 loop docs as the target set and documents why the 2 sub-phase docs are excluded: the cadence rule is applied at the loop level (each loop's MEMORIZATION phase emits the commit), and the sub-phase docs have no MEMORIZATION phase or iter cadence of their own — editing them would duplicate the rule 5× and break their single-source-of-truth shape.

## What shipped

- `features/git-workflow/design/workflow-phase-doc-set-for-per-iter-cadence.md` — the corrected enumeration design (5 loop docs + the exclusion rationale for the 2 sub-phase docs), reshaped to ADR section contract.

## What got stuck

Nothing stuck. The 7-vs-5 discrepancy was caught at evaluation and corrected by empirical directory re-verification before the design locked.

## What shifted

The target file count shifted from an asserted 5 to a re-verified 5-of-7: the first draft happened to name the right 5 files but did not account for the 2 sub-phase docs in the same directory, leaving an over-edit risk. The correction added the explicit exclusion of `evaluation.md` and `memorization.md` and a verification grep that expects 0 matches in those two files, to catch accidental over-edit.

## Decisions to respect

- The per-iter cadence rule applies to exactly the 5 loop docs; `evaluation.md` and `memorization.md` are excluded by design (see `features/git-workflow/design/workflow-phase-doc-set-for-per-iter-cadence.md`).
- A future cross-reference of the cadence pattern in `memorization.md` is allowed but out of scope for the enumeration; do not re-litigate the 5-file set without a workflow-doc-set change.

## Next session

No follow-up required for this enumeration. If the workflow gains or loses a phase doc, update `features/git-workflow/design/workflow-phase-doc-set-for-per-iter-cadence.md`'s file table accordingly.
