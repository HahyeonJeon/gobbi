# Ideation Evaluation Entry

Use this entrypoint to evaluate one stable Ideation artifact. It owns the Ideation-specific evidence frame,
perspective review, causal findings, completed checks, and derived verdict. It creates one self-contained
evaluation result and does not edit the artifact or make a decision reserved for the user.

## Required inputs

- exact Ideation artifact, subject digest, and version;
- resolved open decisions and user-approved scope and design choices;
- input and domain register, governing sources, and authority assessments;
- research sources, prior attempts, active project scopes, and project requirements;
- current-evidence ledger, risk-ordered validation plan, and artifact inventory;
- [scenarios.md](scenarios.md) and [checklists.md](checklists.md); and
- the artifact's direct verification evidence.

Missing evidence is evaluated as a gap or unevaluable issue; it is not silently ignored.

## Evaluation method

1. Bind the review to the exact artifact version, intended outcome, scope, exclusions, user decisions, and acceptance criteria.
2. Select every applicable owned scenario and checklist row, add target-specific cases for material conditions the sources miss, and name the evidence method for each.
3. Inspect the artifact and direct evidence across every perspective. Record strengths and separate causal findings with the expected condition, observed condition, impact, evidence, root cause or leading hypothesis, tested alternative, and corrective direction.
4. Resolve each applicable checklist row as `PASS`, `FAIL:<finding-id>`, or `n/a:<property>`. Missing, stale, contradictory, proxy-only, or unevaluable evidence cannot pass.
5. Classify each finding, derive each perspective result, and derive the final verdict with the verdict rules below.
6. Preserve evaluator independence, keep evaluation separate from correction, and repeat the complete review after any material artifact change.

### Verdict rules

- A **revision finding** identifies a correctable defect while the artifact, accepted problem, intended outcome, scope, and design direction remain assessable and viable.
- A **failure finding** shows that the accepted problem, intended outcome, scope, authority, safety, feasibility, or design direction is invalid, or that missing, stale, contradictory, or unevaluable core evidence prevents a reliable judgment of the artifact.
- A perspective is `FAIL` when it contains a failure finding, `REVISE` when it contains no failure finding but contains a revision finding, and `PASS` when it contains no findings.
- Every failed checklist row cites one or more findings and inherits the most severe cited classification. A perspective or checklist row without an applicable property is `n/a:<property>` and does not affect the final verdict.
- The final verdict is the most severe applicable perspective or checklist result: `FAIL` over `REVISE` over `PASS`. It is `PASS` only when every applicable perspective and checklist row passes.
- A missing perspective, unresolved check, malformed or unclassified finding, stale subject, or inconsistent severity makes the report invalid rather than producing a verdict. Correct the evaluation record before issuing the result.

## Perspective lenses

### Project

Test root cause, trigger, success and falsification signals, strongest counterfactual, user-approved scope, active-scope overlap, applicable domain coverage, and complete obligation coverage. Compare framing and design directly. A symptom solution, silent scope expansion, missing domain concern, or dropped accepted constraint is a finding.

### Structure

Test concern ownership, project-pattern reuse, component boundaries, interfaces, dependency direction, state/data invariants, and test seams. Confirm that one complete method derives specialized decisions from project evidence and authoritative domain sources without importing an outside procedure. Preserve the distinction between directional design and ordered implementation tasks.

### Performance

Test scale assumptions, dominant resources, external-call counts, batching, timeout and retry behavior, recurring cost, capacity limits, and committed measurement. At Ideation, evidence may be an estimate and measurement design; unsupported speed claims fail.

### Aesthetics

Read the artifact cold. Test first-page clarity, stable names, hierarchy, project convention, exact headings, placeholders, filler, and whether a skim yields the same meaning as a full read.

### Usage

Test whether intended readers, users, callers, operators, maintainers, and approvers can understand and use the result without private context. Include accessibility, locale, actionable failures, and 3am diagnosis when applicable. When future validation is planned, confirm that its question, method, participants or environment, signals, owner, execution condition, and reopen condition are usable.

### Consistency

Compare scope, framing, domain coverage, governing foundations, research, decisions, design, scenarios, obligations, checks, terms, and deferred items. Search for dangling sources, renamed concepts, contradictory assumptions, decisions not reflected in the synthesis, and future validation represented as current evidence.

### Risk

Test blast radius, rollback, one-way actions, security and authorization, privacy and retention, shared state, compatibility, dependency and license risk, cost runaway, and assumptions whose failure invalidates the design. Challenge a proposed prototype, spike, benchmark, experiment, or user study that lacks an execution contract or is cited as proof before it exists.

### Overall

Challenge wrong premises, unnecessary novelty, unrelated bundled outcomes, premature implementation detail, external-method dependencies, and process shortcuts. Reject a universal `DESIGN.md`, design tool, framework, prototype, or programming-language requirement that the current scope and governing evidence do not justify. Preserve concrete well-grounded research, sharp scope language, and defensible existing-pattern choices.

## Recommended verification

Use direct reads and safe read-only commands: compare active feature scopes; inspect cited files and history; verify every governing source exists and has the claimed authority; resolve owned links; search terms and placeholders; trace obligations both ways; compare interfaces with established project patterns; classify every evidence claim as current or future; inspect the artifact inventory; and perform cold-reader, boundary, counterfactual, and cosmetic-compliance probes.

Exercise at least one self-containment probe: a project-only design, a software design, an interface or experience design, or a mixed-domain design. A mixed-domain probe fails when the method requires another skill, omits an applicable concern, imports an outside procedure, accepts a non-authoritative source, or lets source order silently resolve an authority conflict.

## Rule crosswalk

| Parent rule | Primary report coverage |
|---|---|
| MUST preserve material user authority | Project, Usage, Risk |
| MUST complete Ideation from this operation and its owned companions | Structure, Consistency, Overall |
| NEVER change the accepted contract silently | Project, Consistency, Risk |

## Procedure crosswalk

| Parent procedure clause | Primary report coverage |
|---|---|
| 1. Context, typed inputs, and applicable domain concerns | Project, Structure, Consistency |
| 2–3. Approved problem, outcome, scope, constraints, and decision criteria | Project, Usage, Risk |
| 4. Evidence quality and governing foundation | Project, Consistency, Overall |
| 5. Material alternatives, recommendation, and user decision | Project, Usage, Risk |
| 6–7. Top-down whole design and bottom-up successive decisions | Structure, Usage, Consistency |
| 8. Complete coverage and future validation commitments | Performance, Usage, Risk, Overall |
| 9. Checkpoint artifact and closed obligation trace | Aesthetics, Consistency |
| 10. Completion and return | Project, Consistency, Overall |

Every applicable IDEA-CK item appears in the report checklist. The evaluator adds an item for any target-specific case. A material revision repeats the complete seven perspectives plus Overall from a fresh evaluator.
