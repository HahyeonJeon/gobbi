# Ideation Evaluation Entry

Use this entrypoint with [evaluation/SKILL.md](../evaluation/SKILL.md). It adds Ideation-specific lenses to the one complete evaluator report. It creates no extra output and changes no central finding, checklist, or verdict rule.

## Required inputs

- canonical Ideation synthesis and subject digest;
- both independent drafts and reciprocal reviews;
- resolved open decisions and user-approved scope and design choices;
- input and domain-routing register, governing foundations, and authority assessments;
- research sources, prior attempts, active project scopes, rules, and mistakes;
- current-evidence ledger, risk-ordered validation plan, and artifact inventory;
- [scenarios.md](scenarios.md) and [checklists.md](checklists.md); and
- the complete Ideation WORK validation evidence.

Missing creation evidence is evaluated as a process or unevaluable issue; it is not silently ignored.

## Perspective lenses

### Project

Test root cause, trigger, success and falsification signals, strongest counterfactual, user-approved scope, active-scope overlap, applicable-domain routing, and complete obligation coverage. Compare framing and design directly. A symptom solution, silent scope expansion, missing domain owner, or dropped accepted constraint is a finding.

### Structure

Test concern ownership, project-pattern reuse, component boundaries, interfaces, dependency direction, state/data invariants, and test seams. Confirm that one complete base method routes specialized decisions to applicable domain skills without copying their procedures. Preserve the distinction between directional design and Planning decomposition.

### Performance

Test scale assumptions, dominant resources, external-call counts, batching, timeout and retry behavior, recurring cost, capacity limits, and committed measurement. At Ideation, evidence may be an estimate and measurement design; unsupported speed claims fail.

### Aesthetics

Read the artifact cold. Test first-page clarity, stable names, hierarchy, project convention, exact headings, placeholders, filler, and whether a skim yields the same meaning as a full read.

### Usage

Test whether planners, executors, users, callers, operators, maintainers, and approvers can act without private context. Include accessibility, locale, actionable failures, and 3am diagnosis when applicable. When later validation is planned, confirm that its question, method, participants or environment, signals, owner, phase, and reopen condition are usable.

### Consistency

Compare scope, framing, routing, governing foundations, research, decisions, design, scenarios, obligations, checks, terms, and deferred items. Search for dangling sources, renamed concepts, contradictory assumptions, decisions not reflected in the synthesis, and future validation represented as current evidence.

### Risk

Test blast radius, rollback, one-way actions, security and authorization, privacy and retention, shared state, compatibility, dependency and license risk, cost runaway, and assumptions whose failure invalidates the design. Challenge a proposed prototype, spike, benchmark, experiment, or user study that lacks a later test contract or is cited as proof before it exists.

### Overall

Challenge wrong premises, unnecessary novelty, unrelated bundled outcomes, mechanism-level constraints that belong in Planning or Execution, and process shortcuts. Reject a universal `DESIGN.md`, design tool, framework, prototype, or programming-language requirement that the current scope and governing evidence do not justify. Preserve concrete well-grounded research, sharp scope language, and defensible existing-pattern choices.

## Recommended verification

Use direct reads and safe read-only commands: compare active feature scopes; inspect cited files and history; verify every selected skill and governing document exists and has the claimed authority; resolve links; search terms and placeholders; trace obligations both ways; compare interfaces with established project patterns; classify every evidence claim as current or future; inspect the artifact inventory; and perform cold-reader, boundary, counterfactual, and cosmetic-compliance probes.

Exercise at least one applicable routing probe: a project-only design, a Python or TypeScript software design, an interface or experience design, or a mixed-domain design. A mixed-domain probe fails when every available skill is loaded by default, a required owner is absent, specialized policy is copied into the base method, or load order silently resolves an ownership conflict.

## Rule crosswalk

| Parent rule | Primary report coverage |
|---|---|
| MUST define the problem and boundaries before choosing a design | Project, Usage, Risk |
| MUST ground material claims and choices in sufficient evidence | Project, Consistency, Overall |
| MUST develop the design from parent decisions to dependent details | Structure, Project |
| MUST compare genuine alternatives before seeking a material decision | Project, Usage, Risk |
| MUST make every load-bearing assumption and risk falsifiable | Performance, Risk, Overall |
| MUST design the complete observable outcome | Structure, Performance, Usage, Risk |
| MUST keep Ideation directional and traceable | Structure, Project, Consistency |
| MUST update the canonical artifacts at each checkpoint | Consistency and completed checklist |
| MUST prove readiness before a phase transition | Project, Consistency, Overall |
| MUST preserve approved decisions and constraints across revisions | Consistency, Overall |
| NEVER treat a requested solution or visible symptom as the settled problem | Project, Overall |
| NEVER leave scope open-ended or silently absorb adjacent work | Project, Risk |
| NEVER treat an assumption or weak source as authoritative evidence | Project, Consistency, Risk, Overall |
| NEVER lock a dependent detail while its parent decision is unresolved or disproven | Structure, Project |
| NEVER invent cosmetic alternatives or make a user-owned material choice | Project, Usage, Risk |
| NEVER advance with an unresolved material decision, an under-evidenced high-risk assumption, or an in-scope design obligation deferred to a later phase | Project, Risk, Overall |
| NEVER turn Ideation into an ordered task plan or implementation diff | Structure, Project |
| NEVER silently remove an accepted decision, constraint, or obligation during revision | Consistency, Overall |

## Procedure crosswalk

| Parent procedure clause | Primary report coverage |
|---|---|
| 1. Context, typed inputs, and applicable-domain routing | Project, Structure, Consistency |
| 2–3. Approved problem, outcome, scope, constraints, and decision criteria | Project, Usage, Risk |
| 4. Evidence quality and governing foundation | Project, Consistency, Overall |
| 5. Material alternatives, recommendation, and user decision | Project, Usage, Risk |
| 6–7. Top-down whole design and bottom-up successive decisions | Structure, Usage, Consistency |
| 8. Complete coverage and discussion-only validation plan | Performance, Usage, Risk, Overall |
| 9. Checkpoint artifact and closed obligation trace | Aesthetics, Consistency |
| 10. Planning readiness and workflow-independent handoff | Project, Consistency, Overall |

Every applicable IDEA-CK item appears in the report checklist. The evaluator adds an item for any target-specific case. A material revision repeats the complete seven perspectives plus Overall from a fresh evaluator.
