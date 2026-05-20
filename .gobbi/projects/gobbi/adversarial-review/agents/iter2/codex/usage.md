## Artifact Summary + W/W/H

Artifact bundle: iter2 role docs plus delegation/evaluator-template/mistake updates, evaluated from the consumer's point of view: manager, spawned subagents, evaluator, and future maintainer. What: operational instructions for using the five-role taxonomy. Why: make routing and escalation deterministic after iter1. How: status enums, `NEEDS_CONTEXT`, canonical schema references, assistant modes, and target-specific evaluation load paths. W/W/H gate: clear; usage failures are in contradictory or missing operational routes.

## Memory reads

- Required skills/artifacts: `evaluation/SKILL.md`, `ideation/evaluation.md`, `principles/SKILL.md`, `delegation/SKILL.md`, `delegation/templates/evaluator.md`, `mistake/SKILL.md`, all five role docs.
- Supporting reads: `memorization/SKILL.md`, `wrap-up/SKILL.md`, target evaluation file existence check.
- Project rule/mistake context: `rules/stub-redirect-format.md`, `mistakes/delegation-discipline.md`, `mistakes/skills-agents-3-layer-mirror.md`.
- Iter1 Codex inheritance read before Stage 1: `iter1/codex/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.
- Iter1 Claude cross-reference read: `iter1/claude/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.

## Locked Frame (Stage 1)

Scenario US2-1 - Manager can route subagents without interpretation.
- Check US2-1.1: Each role says when to use it.
- Check US2-1.2: Status labels are mutually actionable. Inherits Codex `U-002`.

Scenario US2-2 - User-contact boundary is usable.
- Check US2-2.1: Subagents return `NEEDS_CONTEXT` + `user-question:` and do not call AskUserQuestion. Inherits Codex `U-001`.
- Check US2-2.2: Any exception is explicit, manager-owned, and compatible with declared tools.

Scenario US2-3 - Evaluators can load the docs they are told to load.
- Check US2-3.1: Required target-type perspective docs exist or fallback is explicit. Inherits Codex `U-003`, `S-004`.
- Check US2-3.2: Finding schema is usable. Inherits Codex schema findings.

Scenario US2-4 (adversarial) - A tired operator follows assistant docs literally.
- Check US2-4.1: Lookup mode is read-only.
- Check US2-4.2: Memorization mode has write capabilities and exact destinations.
- Check US2-4.3: Mistake staging instructions do not ask an unwritable role to write. Inherits Codex `U-004`.

Coverage: Accessibility applies to scannable status/error paths. I18n N/A. Observability applies as diagnosability from status and evidence.

## Stage 2 Findings

### Inherited Codex findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence |
|---|---|---|---|---|---|---|
| U-001 | design_flaw | process | superseded | 100 | High | The direct prose contradiction is mostly fixed: manager-owned user contact appears in `manager.md:12`, `leader.md:17`, `executor.md:19`, `evaluator.md:94`, `assistant.md:27`. Remaining exception/tool mismatch is captured as `US2-REG-001`. |
| U-002 | design_flaw | process | open, stuck | 75 | Medium | The status enum still lacks a precedence rule when a result is both completed-with-concerns and missing next-step context (`leader.md:108-111`, `executor.md:97-100`, `delegation/SKILL.md:118-123`). |
| U-003 | design_flaw | docs-sync | open, stuck | 100 | High | Schema part is fixed, but evaluator doc-load paths still point to missing target docs: `evaluator.md:41-44`; `find ... -path '*evaluation*' -type f` found only phase child docs. |
| U-004 | design_flaw | process | open, stuck | 100 | High | Assistant no longer says plain "write it", but the root conflict remains: assistant tools are read-only (`assistant.md:4`) while lookup mode can stage mistake-candidates (`assistant.md:90`) and Memorization mode writes session artifacts (`assistant.md:93`). |

### New/current findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| US2-REG-001 | design_flaw | regression | open | 100 | High | `assistant.md:27` says AskUserQuestion is manager-owned, then creates a Wrap-up WORK exception where "the delegation prompt will explicitly grant AskUserQuestion access." Assistant frontmatter does not include AskUserQuestion (`assistant.md:4`), and Wrap-up's routing step says confirmation happens "via manager" (`wrap-up/SKILL.md:137`). | Task E tried to remove subagent AskUserQuestion use, but assistant now documents an exception that is both manager-boundary-breaking and tool-incompatible. |
| US2-001 | checklist_gap | docs-sync | open | 100 | High | `delegation/templates/evaluator.md:56` still has `<<full path to {target-type}/evaluation/{perspective}.md>>`; `evaluator.md:41-44` lists target-type patterns; no `agents/evaluation/`, `rules/evaluation/`, or `project/evaluation/` docs exist. | A manager filling the template literally must either invent a path or send the evaluator to a missing file. |

Checklist verdict: US2-1 partly fails on status precedence, US2-2 fails on assistant exception, US2-3 fails on target-doc paths, US2-4 fails on assistant capabilities.

Per-perspective verdict: REVISE. Multiple High-confidence High findings remain.

## Low-confidence appendix

- None.
