---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
status: deferred
feature: repo-reset
supersedes: null
superseded_by: null
disposition: open
severity: Low
confidence: 75
finding_id: F-CL2-PREP-ST-01
---

# F-CL2-PREP-ST-01: Binding-constraint phrasing for F-CX-PREP-O-01 is loose

## Context

The F-CX-PREP-O-01 Planning constraint in iter2 reads: "Planning MUST decompose the sweep such that all `mistake`-skill consumers (i.e., all executor tasks) run BEFORE Stage C wipes `mistakes/`."

This phrasing is ambiguous for option (a) — single-executor sweep. Under option (a), the one executor task DOES run across Stage C (it spans Stages 0–G). A literal reader could interpret the constraint as forbidding option (a) because the executor "consumer" is still running when Stage C executes.

The recommendation paragraph ("Option (a): single-executor sweep ... executor loads project mistakes ONCE at task start ... After Stage C wipes mistakes/, the executor continues running but has already loaded the relevant patterns") rescues the meaning, but requires two-paragraph cross-reading to resolve the tension.

## Decision

Document as open below-threshold finding. Tighter phrasing would be: "Planning MUST ensure all `mistake`-skill LOADS happen BEFORE Stage C executes." This moves the constraint to the load event (which option (a) satisfies) rather than the task-span event (which option (a) appears to violate at first glance).

## Consequences

If `pre-routed-gaps.md` or a Planning task description inherits the current phrasing, the Planning leader may need to read both the constraint and the recommendation together to resolve the cognitive friction. No Planning failure expected; the friction is minor.

## Related

- `preparation/evaluation/iter2/claude/structure.md` § Stage 2 Findings
- `preparation/evaluation/iter2/claude/usage.md` § One usage hazard
- `preparation/artifacts/pre-routed-gaps.md` § F-CX-PREP-O-01
