# Code Review

## Intent

Code Review is an independent, read-only, non-gating review of one exact code subject and its affected
surfaces. It binds the revision, scope, governing sources, reviewer relationship, and caller-owned report
path before inspection. It produces one caller-bound report. It does not approve, gate, correct, commit, or
capture durable Memory automatically.

The canonical [Code Review skill](../../../skills/code-review/SKILL.md) owns the operating procedure. This
design records the current boundary and ownership without copying that procedure.

## Five phases

1. **Bind sources and subject.** Bind the exact code identity, affected surfaces, scope, exclusions,
   governing sources, safe read-only method, reviewer relationship, report path, and invalidation condition.
2. **Inspect and critique without the checklist.** Read the actual code, callers, dependencies, tests,
   configuration, documents, generated views, behavior, effects, failures, and recovery surfaces. Complete
   the five critical-review inquiries before opening any prepared checklist or same-subject report.
3. **Lock the pre-checklist record.** Freeze the exact subject identity, direct observations, Problems,
   Improvements, Strengths, Gaps, and coverage leads. Do not backfill this record from the checklist. If
   prepared material contaminates the critique, discard it and rebind and restart; if the subject changes,
   rebind or record the review as historical.
4. **Overlay applicability, checklist pass, and reconciliation.** Account for every core category and
   evidence-activated overlay from direct subject evidence. Walk every applicable checklist item in source
   order, apply activated overlays, then reconcile unique findings from the critical review and prepared
   coverage without changing the locked record.
5. **State and handoff.** Recheck identity and source coverage. Mark the report `current`, `partial`,
   `unable`, or `historical`, state evidence limits and recovery, and hand the caller its report. The
   result grants no approval, correction, integration, publication, or release authority.

## Checklist-free critical review

The five subjects below are inquiry prompts. They are not checklist items, core categories, scenarios, or
report taxonomy. They keep the first critique independent of the prepared coverage source.

| Inquiry subject | Question |
|---|---|
| Design, intent, and best version | What does the code intend, and what would the best supported version do differently? |
| Failure, misuse, and cosmetic compliance | How can the code fail, be misused, or satisfy the form of a rule while missing its purpose? |
| State, data, effects, and resources | What states, meanings, effects, ownership, lifetimes, and cleanup paths can become wrong or unclear? |
| Change, integration, and compatibility | What callers, integrations, versions, environments, artifacts, and handoffs can break or remain inconsistent? |
| Absences across the lifecycle | What necessary design, implementation, testing, verification, delivery, operation, transition, or closure work is absent? |

## Coverage shape

The reusable baseline records 26 core categories, 30 expected scenarios, 180 unchecked negative signs, 10
scenario-spectrum rows, and 22 lifecycle-stage rows. The 26 core categories are Project Fit, Affected
Surfaces, Project Structure, Architecture, Design Pattern, Abstraction, Data Model, Public API, Parameters,
Modularization, Reusability, Performance, Optimization, Unintended Overengineering, Code Complexity,
Readability, Vocabulary, Naming Convention, Docstring, Correctness, Testing, Verification, Delivery,
Usability, Operations, and Compatibility. Data Model is the sole added core category.

The 15 specialist overlays remain evidence-activated and ordered as follows: Security, Privacy, Concurrency,
Accessibility, Localization, Dependencies, Build, Packaging, Release, Deployment, Configuration,
Observability, Migration, Deprecation, and Retirement. Release is ordered between Packaging and Deployment.
An overlay is activated only by bound governing or direct subject evidence, and every overlay receives an
applicability result.

## Ownership boundaries

| Concern | Owner and boundary |
|---|---|
| Refactoring structure | Project Structure owns the resulting organization, placement, and structural ownership. |
| Test code and behavior risk | Testing owns test-code quality and behavior or risk coverage. |
| Evidence and claims | Verification owns evidence identity, execution, and claim fit. |
| Unintended overengineering | Requires a missing current requirement or observed need. It never infers author intent. |
| Root findings | One root Problem has one primary category. Secondary effects link back to that Problem. |
| Taxonomy gaps | A supported finding without a prepared owner may use `Unclassified — taxonomy Gap`; this is a temporary coverage signal, not a new category. |

## Report and consumers

The [Code Review checklist](../../../skills/code-review/checklist.md) supplies the reusable baseline. The
[report template](../../../skills/code-review/templates/report.md) defines the nine report sections:
Summary, Subject and Scope, Method, Checklist Review, Problems, Improvements, Strengths, Gaps, and Handoff.
It also defines the four checklist item results: `problem found`, `no problem found`, `not applicable`, and
`evidence missing`. This design references those contracts rather than copying them.

[Execution](../../../skills/execution/SKILL.md) consumes the Code Review checklist directly for checklist
self-review. It does not run the full Code Review operation or gain report or formal-decision authority.
[Evaluation](evaluation.md) records its own unaided same-subject critique before reading a same-subject Code
Review report. It independently verifies any prepared evidence and retains finding and verdict authority.

Code Review hands the completed report to its caller. Durable Reports Memory requires a separate authorized
Memory action; Code Review never captures it automatically.
