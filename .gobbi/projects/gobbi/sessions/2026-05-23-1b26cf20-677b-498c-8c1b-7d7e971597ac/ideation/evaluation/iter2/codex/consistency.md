## Artifact Summary + Memory reads
Shared Stage 0 summary: see `project.md`. This Consistency pass evaluates cross-section coherence, doc/source sync, branch convention sync, and whether iter2 changes align with cited research and prior findings.

Memory reads:
- full `draft-iter2.md`
- all iter1 Consistency files
- `.claude/skills/git/conventions.md` branch naming and trailer sections
- `.codex-plugin/plugin.json`
- AGENTS instructions supplied by user
- project mistakes, especially whole-file grep and verification-claim mistakes

## Locked Frame (Stage 1)
Scenario C1: Scope Contract, Design, and Success Criteria describe executable T1 branch behavior.
- Check C1.1: Branch name in Scenarios, Checklist, Design, Validation, and Decisions Log is consistent.
- Check C1.2: The consistent branch name is also consistent with git conventions.

Scenario C2: AI provenance trailer is synchronized with `git/conventions.md`.
- Check C2.1: Both draft occurrences use `task/{task-id}`.
- Check C2.2: No residual `loop/preparation/promote-now` exists.

Scenario C3: T3 input/result vocabulary is internally consistent.
- Check C3.1: T3-I-3 and D-3-4 no longer appear contradictory.
- Check C3.2: T3-I-T3.e says the same thing as D-3-4.

Scenario C4: Path-surface vocabulary is reconciled across `.claude`, `.agents`, and `.gobbi`.
- Check C4.1: The draft states why `.claude/skills` targets are intentional.
- Check C4.2: The follow-up sync obligation is visible.

Scenario C5: Deferred items have pointers.
- Check C5.1: `status` schema extension has a backlog pointer.
- Check C5.2: Privacy/retention and DQ-anchor deferrals are either resolved or honestly marked.

Coverage:
- Privacy/data retention: checked in C5 and Risk.
- Licensing/IP: no new copied external code; `not-applicable`.
- Memorization staging shape/naming: no new staging file format is proposed in this draft.

## Per-scenario per-check results
C1.1: PASS. `session/{date}-{ssid-short}` is consistently used in G-1, E-2, T1-I-T1.a, D-1, validation, and F-4.

C1.2: FAIL. Consistency with itself is not enough; the form contradicts the branch naming convention prefix registry.

C2.1: PASS. Grep found `AI-Provenance-Record` in the draft only with `task/{task-id}` or `task/preparation-promote-now-iter`.

C2.2: PASS. No residual `loop/preparation/promote-now` form was found.

C3.1: PASS. D-3-4 explicitly states T3-I-3 describes result side while D-3-4 extracts from input side.

C3.2: PASS. T3-I-T3.e mirrors the same input/result split.

C4.1: PASS. CL-1 says `.claude/skills` is the intended Claude-runtime target for this checklist.

C4.2: PARTIAL. CL-1 says a follow-up note belongs in Wrap-up and `gobbi/SKILL.md`, but that is not yet converted into an explicit task list.

C5.1: PASS. The status schema extension backlog pointer is listed.

C5.2: PARTIAL. DQ-anchor visibility and privacy/retention are declared deferred in F9 without a staged backlog file. That is acceptable as a non-blocking residual, but it is not a clean `deferred` disposition under the strict "backlog pointer" meaning.

## Typed findings
### COD-CONS-001 — Path-surface contradiction addressed
- type: design_flaw
- domain: docs-sync
- disposition: addressed
- confidence: 75
- severity: High
- inherited-from: iter1/codex/consistency-COD-CONS-001 and iter1/codex/overall-COD-OVERALL-001
- evidence: CL-1 at `draft-iter2.md:285` explains the three path surfaces and why `.claude/skills` is intentionally targeted.

### COD-CONS-002 — DQ-anchor traceability remains open at low impact
- type: checklist_gap
- domain: process
- disposition: open
- confidence: 50
- severity: Medium
- inherited-from: iter1/codex/consistency-COD-CONS-002
- evidence: F9 at `draft-iter2.md:502` defers DQ-anchor visibility to raw Sub-step D source records rather than adding a local index or backlog pointer.
- impact: Traceability remains imperfect, but F1-F9 now provide enough local fix-decision trace for Planning.

### COD-CONS-003 — `status` schema extension cleanly deferred
- type: assumption_risk
- domain: observability
- disposition: deferred
- confidence: 75
- severity: Medium
- inherited-from: iter1/codex/consistency-COD-CONS-003
- evidence: `draft-iter2.md:32`, `draft-iter2.md:58`, and `draft-iter2.md:279` consistently defer the template `status` field extension to `staging/backlogs/feature/schema-extension-agents-status-field.md`.

### COD-CONS-004 — Branch naming internally consistent but externally inconsistent
- type: design_flaw
- domain: regression
- disposition: open
- confidence: 100
- severity: High
- surfaced-by: codex
- evidence: The draft consistently uses `session/{date}-{ssid-short}`, but `/playinganalytics/git/gobbi/.claude/skills/git/conventions.md` branch regex and type-prefix table do not allow `session/`.
- impact: This is a consistency failure between the design and a project convention, not a wording nit.

### COD-CONS-005 — Provenance trailer sync resolved
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 100
- severity: High
- inherited-from: iter1/claude/consistency-C1
- evidence: `draft-iter2.md:266`, `draft-iter2.md:310`, and `draft-iter2.md:488` match `git/conventions.md:118`.

## Low-confidence appendix
Low-confidence note: Privacy/retention deferral is not cleanly pointed at a backlog item. Risk records this as a residual Medium rather than a Consistency blocker.

Verdict: REVISE
