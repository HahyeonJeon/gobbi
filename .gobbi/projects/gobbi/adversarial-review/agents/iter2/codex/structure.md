## Artifact Summary + W/W/H

Artifact bundle: same iter2 docs-only role taxonomy and support-skill bundle. What: role decomposition and dependency structure for manager, leader, executor, evaluator, assistant, delegation, evaluator template, and mistake skill. Why: revise iter1 structural failures around schema drift, missing mistake skill, phase ownership, and write/user-contact boundaries. How: align evaluator schema to the evaluation skill, create `mistake`, and make assistant own Memorization/Wrap-up. W/W/H gate: clear; structural risks are write-surface/testability contradictions.

## Memory reads

- Required: `evaluation/SKILL.md`, `ideation/evaluation.md`, `principles/SKILL.md`, `delegation/SKILL.md`, `delegation/templates/evaluator.md`, `mistake/SKILL.md`.
- Artifact: `agents/{manager,leader,executor,evaluator,assistant}.md`, `skills/delegation/SKILL.md`, `skills/delegation/templates/evaluator.md`, `skills/mistake/SKILL.md`.
- Peer-skill comparison: `skills/memorization/SKILL.md`, `skills/wrap-up/SKILL.md`, `skills/planning/SKILL.md`, `skills/research/SKILL.md`.
- Project memory/rules: `rules/stub-redirect-format.md`, `mistakes/delegation-discipline.md`, `mistakes/skills-agents-3-layer-mirror.md`.
- Iter1 Codex inheritance read before Stage 1: `iter1/codex/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.
- Iter1 Claude cross-reference read: `iter1/claude/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.

## Locked Frame (Stage 1)

Scenario ST2-1 - Each role's tool surface can actually perform its declared structural concern.
- Check ST2-1.1: Assistant can write if it owns Memorization/Wrap-up. Inherits Codex `S-001`, `U-004`, `R-002`; Claude `F-C-06`.
- Check ST2-1.2: Evaluator remains read-only and findings-only.
- Check ST2-1.3: Leader/executor write scope matches their role.

Scenario ST2-2 - Evaluator schema and perspective structure are single-sourced.
- Check ST2-2.1: Evaluator role and template load schema from `evaluation/SKILL.md`. Inherits Codex `S-002`.
- Check ST2-2.2: Perspective names match canonical Project/Structure/Performance/Aesthetics/Usage/Consistency/Risk/Overall. Inherits Codex `S-005`.
- Check ST2-2.3: Target-specific evaluation docs either exist or the role has a fallback. Inherits Codex `S-004`.

Scenario ST2-3 - The new `mistake` skill has peer-skill shape.
- Check ST2-3.1: Frontmatter has name/description/allowed-tools.
- Check ST2-3.2: It has Memory Access Matrix, Core Principles, Procedures, Constraints, Output paths.
- Check ST2-3.3: Its procedure does not contradict the memory tiers it declares.

Scenario ST2-4 (adversarial) - A role is made owner of a phase without getting the capabilities needed for that phase.
- Check ST2-4.1: Memorization/Wrap-up ownership is paired with `Write` or a role-specific template that grants writes.
- Check ST2-4.2: Lookup-mode read-only behavior is not confused with Memorization-mode writing.

Coverage: Dependency/supply-chain N/A (no package dependency). Observability is status-contract parseability; write-surface enforcement is structural.

## Stage 2 Findings

### Inherited Codex findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence |
|---|---|---|---|---|---|---|
| S-001 | design_flaw | process | open, stuck | 100 | High | The specific old line changed, but the root remains: assistant frontmatter is read-only (`assistant.md:4`) while assistant now owns writes in Memorization/Wrap-up (`assistant.md:10-18`, `assistant.md:90-93`). Superseded in severity by `ST2-REG-001`. |
| S-002 | design_flaw | docs-sync | addressed | 100 | High | `evaluator.md:35-37` and `delegation/templates/evaluator.md:90-94` now load schema from `evaluation/SKILL.md` instead of defining a parallel one. |
| S-003 | design_flaw | process | open, stuck | 75 | Medium | Status overlap remains: e.g. leader `DONE_WITH_CONCERNS` covers ambiguity/scope larger than brief (`leader.md:109`), while `NEEDS_CONTEXT` covers needed input (`leader.md:110`) and `BLOCKED` covers contradictory requirements (`leader.md:111`), with no severity-precedence rule. |
| S-004 | checklist_gap | docs-sync | open, stuck | 100 | High | `evaluator.md:41-44` still points to `skills/evaluation/{perspective}.md`, `agents/evaluation/{perspective}.md`, etc.; `find ... -path '*evaluation*' -type f` found only phase child docs, not target-type perspective docs. |
| S-005 | design_flaw | process | addressed | 100 | High | Perspective list is canonical in `evaluator.md:12` and `delegation/templates/evaluator.md:8`. |

### New/current findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| ST2-REG-001 | design_flaw | regression | open | 100 | Critical | `assistant.md:4` declares tools `Read, Grep, Glob, Bash, WebSearch, WebFetch` only. The same file says assistant's primary workflow role is MEMORIZATION (`assistant.md:10-12`) and requires writes to staging/artifacts/session.json (`assistant.md:17`, `assistant.md:93`). Wrap-up WORK also requires assistant project-memory writes (`wrap-up/SKILL.md:116-140`). | Task C/F made assistant the phase owner but did not give it write tools. Memorization and Wrap-up become structurally impossible if the frontmatter tool surface is enforced. |
| ST2-001 | checklist_gap | docs-sync | open | 100 | High | `evaluator.md:41-44` and template placeholder `delegation/templates/evaluator.md:56` require target-type perspective docs; repository only has phase child docs (`skills/{ideation,planning,execution,wrap-up}/evaluation.md` plus `skills/evaluation/SKILL.md`). | Evaluators of agents/rules/project docs are still sent to missing docs; Task A fixed schema but not the load path. |

Checklist verdict: ST2-1 fails, ST2-2 partly passes, ST2-3 shape passes but procedure issues are covered in Consistency, ST2-4 fails.

Per-perspective verdict: FAIL. `ST2-REG-001` is Critical/100.

## Low-confidence appendix

- None.
