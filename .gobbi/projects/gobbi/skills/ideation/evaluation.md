# Ideation Evaluation Entry

Use this entrypoint with [evaluation/SKILL.md](../evaluation/SKILL.md). It adds Ideation-specific lenses to the one complete evaluator report. It creates no extra output and changes no central finding, checklist, or verdict rule.

## Required inputs

- canonical Ideation synthesis and subject digest;
- both independent drafts and reciprocal reviews;
- resolved open decisions and user-approved scope and design choices;
- research sources, prior attempts, active project scopes, rules, and mistakes;
- [scenarios.md](scenarios.md) and [checklists.md](checklists.md); and
- the complete Ideation WORK validation evidence.

Missing creation evidence is evaluated as a process or unevaluable issue; it is not silently ignored.

## Perspective lenses

### Project

Test root cause, trigger, success and falsification signals, strongest counterfactual, user-approved scope, active-scope overlap, and complete obligation coverage. Compare framing and design directly. A symptom solution, silent scope expansion, or dropped accepted constraint is a finding.

### Structure

Test concern ownership, project-pattern reuse, component boundaries, interfaces, dependency direction, state/data invariants, test seams, and the distinction between directional design and Planning decomposition.

### Performance

Test scale assumptions, dominant resources, external-call counts, batching, timeout and retry behavior, recurring cost, capacity limits, and committed measurement. At Ideation, evidence may be an estimate and measurement design; unsupported speed claims fail.

### Aesthetics

Read the artifact cold. Test first-page clarity, stable names, hierarchy, project convention, exact headings, placeholders, filler, and whether a skim yields the same meaning as a full read.

### Usage

Test whether planners, executors, users, callers, operators, maintainers, and approvers can act without private context. Include accessibility, locale, actionable failures, and 3am diagnosis when applicable.

### Consistency

Compare scope, framing, research, decisions, design, scenarios, obligations, checks, terms, and deferred items. Search for dangling sources, renamed concepts, contradictory assumptions, and decisions not reflected in the synthesis.

### Risk

Test blast radius, rollback, one-way actions, security and authorization, privacy and retention, shared state, compatibility, dependency and license risk, cost runaway, and assumptions whose failure invalidates the design.

### Overall

Challenge wrong premises, unnecessary novelty, unrelated bundled outcomes, mechanism-level constraints that belong in Planning or Execution, and process shortcuts. Preserve concrete well-grounded research, sharp scope language, and defensible existing-pattern choices.

## Recommended verification

Use direct reads and safe read-only commands: compare active feature scopes; inspect cited files and history; resolve links; search terms and placeholders; trace obligations both ways; compare interfaces with established project patterns; and perform cold-reader, boundary, counterfactual, and cosmetic-compliance probes.

## Rule crosswalk

| Parent rules | Primary report coverage |
|---|---|
| I-1, I-2, I-3 | Project, Usage, Risk |
| I-4, I-5, I-6 | Project, Consistency, Overall |
| I-7 | Structure, Performance, Usage, Risk |
| I-8 | Consistency and completed checklist |
| I-9 | Structure, Project |
| I-10 | Consistency, Overall |

Every applicable IDEA-CK item appears in the report checklist. The evaluator adds an item for any target-specific case. A material revision repeats the complete seven perspectives plus Overall from a fresh evaluator.
