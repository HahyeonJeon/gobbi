# Domain Skill Naming Standard

This standard defines the shared capability vocabulary and applicability form for domain skill families. Use
it when naming a domain child or writing a root or child Intro and routing row.

## Reserved words

Use a reserved word only for its fixed meaning.

| Word | Fixed meaning |
|---|---|
| `ideation` | Develops an evidence-backed design from a problem and requirements, preserves user decision authority, and stops before realization or task decomposition. |
| `planning` | Turns defined work into a traceable task hierarchy, a dependency-valid execution plan, and the assignment contract those require, and stops before implementation recipes. |
| `execution` | Implements and verifies one defined task under an accepted design and caller delivery policy; excludes multi-task Planning, protected Review, Evaluation, and acceptance. |
| `evaluation` | Independently critiques one frozen target and returns an evidence-based report plus working checklist, with a criteria-derived verdict or `Not issued`; excludes target mutation and decision-state change. |
| `development` | Implements an accepted domain change and coordinates implementation handoffs; excludes protected review, Evaluation, and acceptance. |
| `review` | Performs protected read-only examination and returns scoped evidence without an Evaluation verdict or acceptance. |
| `testing` | Exercises a domain subject to produce test evidence; excludes independent review, Evaluation, and acceptance. |
| `conventions` | Defines project-overridable names, written forms, topology, role and branch vocabulary, handoffs, evidence forms, and departure boundaries. |
| `source` | Defines source-file organization, formatter layout, import form, and generated provenance. |
| `documentation` | Defines public documentation and implementation-comment preferences. |
| `design` | Creates or judges domain structure, behavior, boundaries, and interfaces. |
| `platform` | Covers a standard or engine the project did not create. |
| `runtime` | Covers a framework runtime in which the product executes. |
| `toolchain` | Covers tools invoked to create, inspect, test, package, or deliver domain work. |
| `release` | Covers shipping at operation or preference granularity. |

## Concrete platform names

Use `windows`, `macos`, or `linux` only for a `skill-type: tool` child whose subject is that exact external
platform and whose compatibility boundary is explicit. This list is closed; use `platform` for every other
platform capability.

## Free words

Use a free word only when the domain owns a distinct capability, its authoritative literature uses that word,
and the word duplicates no reserved meaning.

Current free words are `semantics`, `typing`, `async`, `packaging`, `modules`, `concurrency`, `security`,
`architecture`, `feature`, `delivery`, `frontend`, `backend`, `topology`, `contract`, `server`, `typescript`,
`interface`, `interaction`, `motion`, `observability`, `configuration`, `deployment`, `localization`,
`app-lifecycle`, `operations`, `project-structure`, `debugging`, `performance`, and `compiler` for the proper
noun React Compiler.

Add or change a word in this register in the same change that introduces its meaning.

## Applicability and routing form

| Form | Requirement |
|---|---|
| Identity | Each root and child `description` states only what the skill is. |
| Applicability | Each Intro contains one canonical sentence beginning with `Use`, naming the skill or using `it`, and stating `when`, `before`, or `after` it applies. |
| Predicate | Define each `Ci` from its child applicability sentence and `R` from the root applicability sentence; require `R` if and only if at least one `Ci` is true. |
| Routing row | Copy the child's canonical applicability sentence byte for byte. |
| Sibling reference | Refer to a sibling child by its backticked slug. |
