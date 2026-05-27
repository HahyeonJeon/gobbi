---
date: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
status: deferred
feature: project-memory
supersedes: null
superseded_by: null
type: assumption_risk
domain: docs-sync
severity: Low
confidence: 75
disposition: open
finding_ids: [F2]
---

# "Unrelated to Retrofit" Independence Claim Overstated — Defer Stands (F2)

## Context

The Preparation draft (lines 22-23, 89-93) characterizes the dangling `[claude skill](skills/claude/SKILL.md)` link as "out-of-scope `.claude/`-surface drift unrelated to the memory-doc retrofit."

The Claude evaluator (Project perspective, F2) found this independence claim overstated: `gobbi/SKILL.md:187` (FLAG-2 row) states the missing `claude` skill's "intended home is the `project-memory` value-feature (the doc-authoring standard Principle 13 leans on)" — the exact feature this session retrofits, under P13 (the No-Document-Work-Without-Spec principle) that governs the doc-work.

The coupling exists (same feature, same P13). The draft framing understated it by calling it "unrelated."

## Decision

The defer decision is USER-RATIFIED and stands (explicit avoid-unnecessary-change steer, no skill generated this loop). No re-ideate. The characterization is recorded here as an open annotation — the independence claim was imprecise but the defer is safe and correct.

## Rationale

The defer is correct regardless of the coupling: the memory-doc retrofit itself does not depend on a `.claude/`-authoring skill (independently confirmed by both Claude and Codex evaluators — the hot path is `memorization/rules.md` + `memory-map.md` + `templates/*` + P13 directly). The "unrelated" phrasing was imprecise but did not affect the readiness conclusion.

For future sessions: the correct characterization is "project-memory-feature-adjacent drift, deferred per user's avoid-unnecessary-change steer" — not "unrelated."

## Alternatives considered

- Re-characterize inline in the draft — not done (post-EVALUATION mutation; the rawdata draft is preserved as-is).

## Consequences

- FLAG-2 (HIGH, open) remains the canonical record; its HIGH classification should stand.
- A future session should update the characterization if re-opening the dangling-link item.

## Related

- `preparation/evaluation/iter1/claude/project.md` — F2 finding
- `.gobbi/projects/gobbi/backlogs/claude-doc-standard-skill-missing.md` (FLAG-2, HIGH/open)
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md:187` — coupling reference
