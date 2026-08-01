# TypeScript Typing Evaluation Checklist

This reusable unchecked source evaluates one set of type-modeling, narrowing, and declaration choices against
the preferences this skill owns. It is governed by the [`typescript`](../SKILL.md) domain and
[`typescript-typing`](SKILL.md) preferences, with
[`typescript-development`](../typescript-development/SKILL.md) as the operation that applies them,
[`typescript-testing`](../typescript-testing/SKILL.md) owning the evidence that proves a type relationship,
and [`typescript-packaging`](../typescript-packaging/SKILL.md) owning the published declaration contract. The
source commit that contains this file identifies the checklist version. Its stable owner prefix is `TSTYPE`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSTYPE-SC-PROJECT-01 — Normal case: the model follows an understood runtime domain

Types describe a runtime domain, so the domain has to be understood before it can be modeled. The expected
outcome settles what the values are, where they come from, and how they change, then chooses the type model.
A model designed from the shape of the code rather than the domain is the failure.

#### Checklist

- [ ] TSTYPE-CK-PROJECT-01-01 — The runtime domain of the modeled values is understood before the type model is chosen.
- [ ] TSTYPE-CK-PROJECT-01-02 — Every departure from these preferences preserves the same honest runtime and public contracts.

### TSTYPE-SC-PROJECT-02 — Expected failure: the domain has no settled shape yet

A payload, a plugin result, or a migration-era value has no stable shape the code can name. The expected
outcome keeps that uncertainty visible and resolves it at one adapter that returns validated domain values.
Reaching for `any` to make the uncertainty disappear is the failure.

#### Checklist

- [ ] TSTYPE-CK-PROJECT-02-01 — Uncertainty is preserved with `unknown`, a relationship-preserving generic, or a precise boundary adapter.
- [ ] TSTYPE-CK-PROJECT-02-02 — An unsettled shape is resolved at one boundary adapter that returns validated domain values.

## Structure

### TSTYPE-SC-STRUCTURE-01 — Normal case: valid states are modeled directly

A value with distinct modes can be modeled so that invalid combinations are hard to construct and every
variant is visible. The expected outcome uses discriminated unions and makes exhaustive handling checkable.
Correlated optional fields or boolean pairs that admit impossible combinations are the failure.

#### Checklist

- [ ] TSTYPE-CK-STRUCTURE-01-01 — Values with distinct modes are modeled as discriminated unions rather than correlated optional fields or boolean combinations.
- [ ] TSTYPE-CK-STRUCTURE-01-02 — Every discriminated union whose variants must all be handled carries a `never` exhaustiveness check.
- [ ] TSTYPE-CK-STRUCTURE-01-03 — Invalid combinations of the modeled state are difficult to construct in the chosen model.

### TSTYPE-SC-STRUCTURE-02 — Poor quality: abstraction that preserves no relationship

The code compiles and the generics look general, but a type parameter appears once, carries no constraint that
matters, or exists where a concrete type would say more. The expected outcome earns each abstraction from a
relationship it preserves and keeps inputs narrow until a real boundary widens them.

#### Checklist

- [ ] TSTYPE-CK-STRUCTURE-02-01 — Every generic preserves a visible relationship among inputs, outputs, or members.
- [ ] TSTYPE-CK-STRUCTURE-02-02 — Every type parameter carries the smallest useful constraint.
- [ ] TSTYPE-CK-STRUCTURE-02-03 — Every type parameter is actually used.
- [ ] TSTYPE-CK-STRUCTURE-02-04 — Input types stay narrow.
- [ ] TSTYPE-CK-STRUCTURE-02-05 — Widening happens only at an intentional abstraction or public boundary.

## Performance

Not applicable: this skill decides compile-time modeling, narrowing, and declaration form. It assigns no
latency, throughput, capacity, resource, or recurring-cost obligation, and the runtime cost of the modeled
code is decided by the operation that implements it and by the toolchain that builds it.

## Aesthetics

### TSTYPE-SC-AESTHETICS-01 — Poor quality: a type expression harder to read than the domain

The types are correct and even clever, but a reader must evaluate a chain of utility types to learn what the
value is. The expected outcome keeps the narrowest honest model and prefers a dedicated domain type whenever
the transformed contract stops being easier to understand.

#### Checklist

- [ ] TSTYPE-CK-AESTHETICS-01-01 — Utility types are used only where the transformed contract remains easier to understand than a dedicated domain type.
- [ ] TSTYPE-CK-AESTHETICS-01-02 — The chosen model is the narrowest honest one rather than the most elaborate type expression available.

## Usage

### TSTYPE-SC-USAGE-01 — Normal case: the public declaration reads as a stable contract

Consumers depend on the emitted declaration, not on the source that produced it. The expected outcome inspects
that emitted surface and stabilizes it where inference would otherwise decide the contract. A public API whose
declaration changes with an unrelated implementation edit is the failure.

#### Checklist

- [ ] TSTYPE-CK-USAGE-01-01 — The emitted public declarations are inspected.
- [ ] TSTYPE-CK-USAGE-01-02 — Exported APIs carry explicit return types wherever those types stabilize declarations or compatibility.
- [ ] TSTYPE-CK-USAGE-01-03 — Inference is left to local implementation details.
- [ ] TSTYPE-CK-USAGE-01-04 — Annotations are used for stable public contracts.
- [ ] TSTYPE-CK-USAGE-01-05 — `satisfies` is used where a value is checked without replacing its useful inferred type.
- [ ] TSTYPE-CK-USAGE-01-06 — `as const` is used for intentionally literal immutable data.

### TSTYPE-SC-USAGE-02 — Edge case: `readonly` reaches the limit of what it guarantees

A `readonly` array or property stops direct reassignment while nested objects inside it stay mutable, which is
exactly where a consumer's expectation and the type diverge. The expected outcome uses `readonly` for mutation
ownership and states how deep the guarantee actually goes.

#### Checklist

- [ ] TSTYPE-CK-USAGE-02-01 — `readonly` is used to express mutation ownership rather than to imply a guarantee the type does not make.
- [ ] TSTYPE-CK-USAGE-02-02 — No model relies on `readonly` for nested immutability unless the model states that depth.

## Consistency

### TSTYPE-SC-CONSISTENCY-01 — Rule violation: a preference used to override a soundness Rule

These preferences are overridable except where a Rule establishes soundness, so a house style cannot license
an unchecked boundary or an unsupported assertion. The expected outcome resolves the conflict in the Rule's
favor. A recorded project style presented as sufficient authority breaks the Rule.

#### Checklist

- [ ] TSTYPE-CK-CONSISTENCY-01-01 — No declaration style, explicitness level, or object-type form produces an outcome a soundness Rule forbids.
- [ ] TSTYPE-CK-CONSISTENCY-01-02 — Every project-level departure keeps the honest runtime and public contracts intact.

### TSTYPE-SC-CONSISTENCY-02 — Normal case: the model agrees with the project's established form

A repository usually has a settled answer for object-type form, explicitness, and declaration style. The
expected outcome follows it. Introducing a second modeling style beside a consistent existing one is the
failure.

#### Checklist

- [ ] TSTYPE-CK-CONSISTENCY-02-01 — `interface` is used for open object contracts intended for compatible augmentation, following the established project convention.
- [ ] TSTYPE-CK-CONSISTENCY-02-02 — `type` is used for unions, aliases, and closed compositions, following the established project convention.
- [ ] TSTYPE-CK-CONSISTENCY-02-03 — The project's established declaration style and explicitness level are followed where they exist.

## Risk

### TSTYPE-SC-RISK-01 — Rule violation: unverified data used as a domain value

Data from a network response, a file, a message, or a decode step carries no guarantee about its shape. The
expected outcome holds it as `unknown` and narrows it with checks that can fail. An assertion standing in for
that check breaks the Rule while the program still compiles.

#### Checklist

- [ ] TSTYPE-CK-RISK-01-01 — External, decoded, and otherwise unverified data is accepted as `unknown`.
- [ ] TSTYPE-CK-RISK-01-02 — External, decoded, and otherwise unverified data is parsed or narrowed before use.
- [ ] TSTYPE-CK-RISK-01-03 — No type assertion, non-null assertion, or double assertion is used as a substitute for validation or control-flow narrowing.
- [ ] TSTYPE-CK-RISK-01-04 — Built-in control-flow narrowing, user-defined guards, and parsers are used instead of assertions.
- [ ] TSTYPE-CK-RISK-01-05 — Validated domain values come from one boundary adapter.

### TSTYPE-SC-RISK-02 — Rule violation: `any` where uncertainty could have been preserved

`any` disables checking and carries that loss into every value it touches through assignment. The expected
outcome keeps the uncertainty in a form the compiler still checks. Using `any` where `unknown`, a generic, or
an adapter would work breaks the Rule.

#### Checklist

- [ ] TSTYPE-CK-RISK-02-01 — No `any` is used where the program can preserve uncertainty with `unknown`, a relationship-preserving generic, or a precise boundary adapter.
- Also applies: TSTYPE-CK-PROJECT-02-01 (uncertainty preserved in a checked form).

### TSTYPE-SC-RISK-03 — Adversarial: an escape hatch dressed as established evidence

An `as` with a confident comment, or a double assertion routed through an intermediate type, can present a
guess as a fact the compiler simply cannot see, and review accepts it. The expected outcome admits an
assertion only for a fact established outside the compiler and keeps that evidence visible.

#### Checklist

- [ ] TSTYPE-CK-RISK-03-01 — Every `as` states a fact established outside the compiler rather than a shape the code expects to hold.
- [ ] TSTYPE-CK-RISK-03-02 — The evidence for every `as` is recorded or localized where the assertion is made.

### TSTYPE-SC-RISK-04 — Edge case: a declaration is augmented from outside its owner

Module and global augmentation changes types for code that never opted in, which is the limit case of
protecting the public surface. The expected outcome keeps each augmentation inside the integration boundary
that owns it. An augmentation reaching the whole program is the failure.

#### Checklist

- [ ] TSTYPE-CK-RISK-04-01 — Every module or global augmentation is confined to the owning integration boundary.
- Also applies: TSTYPE-CK-USAGE-01-01 (the emitted declarations are inspected).

## Overall

### TSTYPE-SC-OVERALL-01 — Adversarial: compiler acceptance presented as runtime safety

A clean type-check, an annotation, a non-null assertion, or a `readonly` modifier can each be offered as proof
that a value is what the program claims. The expected outcome keeps every claim inside what its evidence
establishes; compiler agreement accepted as runtime fact is the failure.

#### Checklist

- [ ] TSTYPE-CK-OVERALL-01-01 — No compiler acceptance is treated as proof of a property it does not establish: a passing type-check of external data validity, an annotation of runtime shape, a non-null assertion of presence, and `readonly` of deep immutability.
- [ ] TSTYPE-CK-OVERALL-01-02 — Every unverified assumption about a runtime value remains an open question rather than an established fact.

### TSTYPE-SC-OVERALL-02 — Expected failure: a value fails validation at the boundary

The parser or guard rejects the incoming value, which is the path the boundary exists to produce. The expected
outcome stops the value there rather than letting a partially narrowed shape continue into domain code.

#### Checklist

- [ ] TSTYPE-CK-OVERALL-02-01 — A value that fails boundary validation is rejected rather than passed on as a domain value.
- [ ] TSTYPE-CK-OVERALL-02-02 — No partially narrowed value is used as though narrowing had completed.
