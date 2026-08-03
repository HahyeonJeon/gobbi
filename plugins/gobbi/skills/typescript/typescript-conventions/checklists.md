# TypeScript Conventions Evaluation Checklist

This reusable unchecked source evaluates one set of source-level TypeScript choices against the scope and
defaults this skill defines. It is governed by the [`typescript`](../SKILL.md) domain and
[`typescript-conventions`](SKILL.md) preferences, with
[`typescript-development`](../typescript-development/SKILL.md) as the operation that applies them,
[`typescript-typing`](../typescript-typing/SKILL.md) defining type semantics, and
[`typescript-toolchain`](../typescript-toolchain/SKILL.md) defining compiler and module configuration. The
source commit that contains this file identifies the checklist version. Its stable checklist prefix is `TSCONV`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its defining scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSCONV-SC-PROJECT-01 — Normal case: each choice is source-level and follows the settled convention

An ordinary change decides names, file placement, imports, documentation, comments, and formatting, and the
project may already have settled some of them. The expected outcome keeps every decision inside those
source-level concerns and follows the project's coherent, tool-enforced convention where one exists. Deciding
a foreign concern here, or applying a baseline over a settled convention, is the failure.

#### Checklist

- [ ] TSCONV-CK-PROJECT-01-01 — Every decided choice is a name, file, export, import, documentation, comment, or formatting choice.
- [ ] TSCONV-CK-PROJECT-01-02 — Every type-semantics, runtime-architecture, and compiler-configuration question is routed to the TypeScript child or product-domain skill that defines it.
- [ ] TSCONV-CK-PROJECT-01-03 — The project's existing convention is followed wherever it is coherent and tool-enforced.
- [ ] TSCONV-CK-PROJECT-01-04 — A baseline preference from this skill is applied only where the project has not settled the choice.

### TSCONV-SC-PROJECT-02 — Rule violation: an established convention changes without a migration

The change touches files whose file, export, import, documentation, or formatting convention is already
established. The expected outcome preserves those conventions unless the change explicitly migrates them and
records the result. A convention silently replaced inside an ordinary change breaks the Rule.

#### Checklist

- [ ] TSCONV-CK-PROJECT-02-01 — No established file, export, import, documentation, or formatting convention is changed except by a change that explicitly migrates it.
- [ ] TSCONV-CK-PROJECT-02-02 — Every convention the change migrates is recorded as the project's new convention.

## Structure

### TSCONV-SC-STRUCTURE-01 — Normal case: each definition sits near the module that uses it

New helpers, types, and tests need a home. The expected outcome keeps them beside the module or component that uses them and
gives each file one primary responsibility. A helper placed in a shared location before independent consumers
exist, or a file that accumulates unrelated responsibilities, is the failure.

#### Checklist

- [ ] TSCONV-CK-STRUCTURE-01-01 — Narrow helpers and their tests are colocated with the module or component that uses them.
- [ ] TSCONV-CK-STRUCTURE-01-02 — A definition is moved to a shared location only after independent consumers demonstrate the same behavior and type requirements.
- [ ] TSCONV-CK-STRUCTURE-01-03 — Each file carries one primary responsibility.

## Performance

### TSCONV-SC-PERFORMANCE-01 — Poor quality: mechanical style maintained by hand

The source is readable and correct, but formatting and import order are maintained by hand or with local
exceptions while the project provides deterministic tools for both. The expected outcome leaves mechanical style
to those tools, so review attention and diff noise are not spent on it repeatedly.

#### Checklist

- [ ] TSCONV-CK-PERFORMANCE-01-01 — The project formatter is applied without local exceptions wherever the project has one.
- [ ] TSCONV-CK-PERFORMANCE-01-02 — Import grouping and order are kept stable by the project's formatter or linter rather than by hand.
- [ ] TSCONV-CK-PERFORMANCE-01-03 — Where the project has no formatter, the change optimizes for small diffs and the surrounding style.

## Aesthetics

### TSCONV-SC-AESTHETICS-01 — Normal case: names expose the requirement

Names are the first thing a reader uses to understand a value's role, unit, and domain meaning. The expected
outcome distinguishes concepts, units, states, and side effects at the point of use without repeating syntax
or implementation trivia. A name that restates the declaration, or that leaves two domain concepts
indistinguishable, is the failure.

#### Checklist

- [ ] TSCONV-CK-AESTHETICS-01-01 — Every introduced name distinguishes its domain concept, unit, state, and side effect at the point of use.
- [ ] TSCONV-CK-AESTHETICS-01-02 — No name encodes a type the declaration and surrounding domain already communicate.
- [ ] TSCONV-CK-AESTHETICS-01-03 — Naming form follows the baseline where the project has not settled it: domain nouns for values and types, verbs for operations, `is`, `has`, or `can` for booleans, and unit-bearing names where a numeric unit is otherwise ambiguous.

### TSCONV-SC-AESTHETICS-02 — Poor quality: comments that restate the code

The comments are accurate and the code behaves correctly, but they narrate what the reader can already see and omit why
the code is the way it is. The expected outcome spends comments on intent, invariants, tradeoffs, and
surprising external constraints.

#### Checklist

- [ ] TSCONV-CK-AESTHETICS-02-01 — No comment restates what the code already states.
- [ ] TSCONV-CK-AESTHETICS-02-02 — Every retained comment documents intent, an invariant, a tradeoff, or a surprising external constraint.

## Usage

### TSCONV-SC-USAGE-01 — Normal case: a consumer can use the public API from its documentation

Consumers of an exported symbol read its documentation and its export form before its implementation. The
expected outcome documents the public API at the level its consumers need and exports it in the form the
project's readers and tools expect. Documentation that stops at what the type already says is the failure.

#### Checklist

- [ ] TSCONV-CK-USAGE-01-01 — Every public API is documented at the level its consumers need, including the behavior, failure, and lifecycle obligations its types cannot express.
- [ ] TSCONV-CK-USAGE-01-02 — TSDoc-style documentation is used where the repository publishes generated API docs.
- [ ] TSCONV-CK-USAGE-01-03 — Ordinary prose comments carry local intent.
- [ ] TSCONV-CK-USAGE-01-04 — Named exports are used where they improve searchability and refactoring.
- [ ] TSCONV-CK-USAGE-01-05 — A project's deliberate default-export convention is followed where it is already consistent.

### TSCONV-SC-USAGE-02 — Adversarial: documentation written to satisfy a coverage check

A documentation block can restate parameter names and return types, satisfy a docs-coverage lint, and leave
the consumer knowing nothing the signature did not already say. The expected outcome measures documentation by
what the consumer learns; a block that exists only to clear the check is the failure.

#### Checklist

- [ ] TSCONV-CK-USAGE-02-01 — No public documentation meets its obligation by restating the signature.
- [ ] TSCONV-CK-USAGE-02-02 — Every documented failure and lifecycle obligation describes the actual behavior rather than the declaration.

## Consistency

### TSCONV-SC-CONSISTENCY-01 — Normal case: the change agrees with the source around it

Neighboring source shows how this project names, places, exports, imports, documents, and formats code. The
expected outcome adopts that observed convention. Introducing a second style beside a consistent existing one,
or departing without a scoped and recorded choice, is the failure.

#### Checklist

- [ ] TSCONV-CK-CONSISTENCY-01-01 — New code follows the file, export, import, documentation, and formatting convention observed in neighboring source.
- [ ] TSCONV-CK-CONSISTENCY-01-02 — No second casing, export, layout, import-order, or documentation style is introduced beside a consistent existing one.
- [ ] TSCONV-CK-CONSISTENCY-01-03 — Every deliberate departure is consistent within its scope.
- [ ] TSCONV-CK-CONSISTENCY-01-04 — Every deliberate departure is recorded.

### TSCONV-SC-CONSISTENCY-02 — Rule violation: a type-only binding imported as a runtime binding

The configured module pipeline decides whether a type-only import must carry `import type` or an inline type
modifier. The expected outcome reads that configuration and marks the binding accordingly. An unmarked
type-only import under a pipeline that requires the distinction breaks the Rule even where the editor accepts
it.

#### Checklist

- [ ] TSCONV-CK-CONSISTENCY-02-01 — `import type` or an equivalent inline type modifier is used wherever the configured module pipeline requires a type-only binding.
- [ ] TSCONV-CK-CONSISTENCY-02-02 — The configured module pipeline is inspected rather than assumed before deciding whether a binding needs the type-only form.

## Risk

### TSCONV-SC-RISK-01 — Edge case: a rename or convention change reaches past the changed file

A rename, a moved definition, or an authorized convention migration touches consumers the diff does not
obviously contain, and a formatter run can rewrite files the change never intended. The expected outcome
completes the migration across every file it claims and leaves everything else untouched.

#### Checklist

- [ ] TSCONV-CK-RISK-01-01 — No consumer keeps the old name, export form, or import form after a rename, move, or authorized migration.
- [ ] TSCONV-CK-RISK-01-02 — No file outside the change's scope is reformatted or re-sorted as a side effect of the change.

## Overall

### TSCONV-SC-OVERALL-01 — Expected failure: the project has no settled convention for the choice

Inspection finds no established naming, layout, export, import, or documentation convention that answers the
change's question. The expected outcome applies this skill's baseline consistently within the change and
records it. Turning the local decision into a project-wide scheme is the observable failure.

#### Checklist

- [ ] TSCONV-CK-OVERALL-01-01 — Where the project has no settled convention, one baseline choice is applied consistently across the change.
- [ ] TSCONV-CK-OVERALL-01-02 — Where the project has no settled convention, the baseline choice that was applied is recorded.
- [ ] TSCONV-CK-OVERALL-01-03 — No project-wide naming, layout, export, import, or documentation scheme is introduced to satisfy a local change.
