## Artifact Summary + W/W/H

Artifact bundle: iter2 role docs plus delegation/evaluator-template/mistake updates. What: a synchronized documentation contract for five agent roles and support skills. Why: address iter1 drift in schema, phases, ownership, and perspective vocabulary. How: canonical lists, load directives, assistant ownership, and a new mistake skill. W/W/H gate: clear; consistency is the dominant residual risk.

## Memory reads

- Required: `evaluation/SKILL.md`, `ideation/evaluation.md`, `principles/SKILL.md`, `delegation/SKILL.md`, `delegation/templates/evaluator.md`, `mistake/SKILL.md`.
- Artifact and supporting reads: all role docs, `memorization/SKILL.md`, `wrap-up/SKILL.md`, `planning/SKILL.md`, `research/SKILL.md`.
- Project rules/mistakes: `rules/stub-redirect-format.md`, `mistakes/delegation-discipline.md`, `mistakes/skills-agents-3-layer-mirror.md`.
- Iter1 Codex inheritance read before Stage 1: `iter1/codex/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.
- Iter1 Claude cross-reference read: `iter1/claude/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.

## Locked Frame (Stage 1)

Scenario CO2-1 - Evaluator docs align with `evaluation/SKILL.md`.
- Check CO2-1.1: Finding schema is delegated to the skill. Inherits Codex `C-002`.
- Check CO2-1.2: Perspective vocabulary is canonical. Inherits Codex `C-003`.
- Check CO2-1.3: Fanout count agrees with evaluation skill.

Scenario CO2-2 - Phase vocabulary is single-sourced.
- Check CO2-2.1: Manager and delegation list the same canonical six phases.
- Check CO2-2.2: Leader/delegation do not introduce Research as a separate phase. Inherits Claude `F-C-04`.
- Check CO2-2.3: `.claude` drift is deferred by user lock, not counted.

Scenario CO2-3 - Assistant write surfaces agree across role, memorization, and wrap-up.
- Check CO2-3.1: Assistant summary, lifecycle, and skill docs name the same write surfaces.
- Check CO2-3.2: Frontmatter tools match those write surfaces.

Scenario CO2-4 (adversarial) - New `mistake` skill does not contradict peer memory rules.
- Check CO2-4.1: Immediate correction capture is compatible with the declared write tier.
- Check CO2-4.2: PASS-only staging does not lose corrections from REVISE/FAIL iterations.

Coverage: Privacy/licensing N/A; docs-sync is primary. Observability covered via status/fanout consistency.

## Stage 2 Findings

### Inherited Codex findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence |
|---|---|---|---|---|---|---|
| C-001 | design_flaw | docs-sync | deferred | 100 | Critical | Runtime/spec/plugin/`.claude` drift is user-locked. Rationale: out-of-scope runtime drift, deferred rather than open/addressed. |
| C-002 | design_flaw | docs-sync | addressed | 100 | High | Evaluator schema now delegates to `evaluation/SKILL.md`: `evaluator.md:35-37`, `evaluator.md:76-87`, `delegation/templates/evaluator.md:90-94`. |
| C-003 | design_flaw | docs-sync | addressed | 100 | High | Perspective names now match canonical vocabulary: `evaluator.md:12`, `delegation/templates/evaluator.md:8`, `evaluation/SKILL.md:83-96`. |
| C-004 | design_flaw | cost | deferred | 100 | High | Runtime model drift requires reading/altering `packages/cli/src/specs/*.json`, explicitly user-locked. |

### Claude divergence carried into frame

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence |
|---|---|---|---|---|---|---|
| Claude F-C-04 | design_flaw | docs-sync | open, stuck | 100 | High | Research remains a separate phase/sub-phase in `leader.md:12`, `leader.md:33`, `delegation/SKILL.md:45`, `delegation/SKILL.md:220`, conflicting with canonical lists at `manager.md:40` and `delegation/SKILL.md:213`. |
| Claude F-C-05 | design_flaw | process | addressed | 100 | Critical | `skills/mistake/SKILL.md` now exists and has peer-skill frontmatter/sections (`mistake/SKILL.md:1-7`, `:15-23`, `:31-51`, `:55-96`, `:100-117`). |

### New/current findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| CO2-001 | design_flaw | docs-sync | open | 100 | High | Same evidence as Claude `F-C-04`: Research is briefable as a phase (`leader.md:12`, `leader.md:33`) while canonical lists exclude it (`manager.md:40`, `delegation/SKILL.md:213`). | Task D did not fully align the canonical phase list across role docs and delegation. |
| CO2-REG-001 | design_flaw | regression | open | 100 | High | `assistant.md:12` says Memorization mode write surface is "session staging only"; `assistant.md:17` adds `artifacts/` and `session.json`; `memorization/SKILL.md:37-42` also includes rawdata, artifacts, staging, and session.json. | Task F's tightening created contradictory shorthand versus actual memory procedure. A reader could omit required artifacts/session.json writes. |
| CO2-REG-002 | design_flaw | regression | open | 100 | High | `mistake/SKILL.md:37-40` and `:76-80` require staging a mistake-candidate immediately after correction; `mistake/SKILL.md:82-90` says staging happens during MEMORIZATION on PASS; `mistake/SKILL.md:117` says assistant MEMORIZATION writes one file per candidate PASS-only. | Task B introduced an internally contradictory skill: corrections during REVISE/FAIL or evaluator read-only contexts are both "immediate" and "PASS-only assistant" writes. |
| CO2-002 | design_flaw | docs-sync | open | 100 | High | Evaluation fanout conflicts: `evaluation/SKILL.md:96` requires all seven + Overall; `delegation/SKILL.md:47`, `delegation/SKILL.md:222`, and `evaluator.md:12` say at least two with Project + Overall minimum. | The same review can be under-scoped or over-costed depending on which doc the manager follows. |

Checklist verdict: CO2-1 partly passes but fanout fails, CO2-2 fails, CO2-3 fails, CO2-4 fails.

Per-perspective verdict: REVISE. Multiple High/100 findings remain.

## Low-confidence appendix

- None.
