# Go Design Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Design](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### GODSN-SC-PROJECT-01 — Normal case: The public API or CLI serves current callers

A package import path or CLI entry point adds or changes caller-visible behavior. Its public API or CLI should
contain only concepts required by current callers and should hide implementation choices; an unnecessary or
incomplete contract fails.

#### Checklist

- [ ] GODSN-CK-PROJECT-01-01 — Every exported declaration serves a current caller need.
- [ ] GODSN-CK-PROJECT-01-02 — Every implementation detail stays unexported unless callers must name it.
- [ ] GODSN-CK-PROJECT-01-03 — Every caller-dependent behavior is part of the deliberate public API or CLI contract.

### GODSN-SC-PROJECT-02 — Rule violation: A public change ignores compatibility

A public API or CLI name, type, method set, error, or ownership promise changes. The result should be
`compatible`, `migration supplied`, `authorized break`, or `unsupported`, with affected consumers named where
the state requires them; an unclassified or accidental break fails.

#### Checklist

- [ ] GODSN-CK-PROJECT-02-01 — Every changed public API or CLI contract has exactly one state: compatible, migration supplied, authorized break, or unsupported.
- [ ] GODSN-CK-PROJECT-02-02 — Every authorized breaking change identifies its affected consumers.

## Structure

### GODSN-SC-STRUCTURE-01 — Poor quality: An interface exists only for one implementation or mock

The code functions through an interface that no consumer-defined behavior or second real implementation
requires. The design should use the concrete type or a smaller consumer-owned seam; speculative indirection
fails.

#### Checklist

- [ ] GODSN-CK-STRUCTURE-01-01 — Every interface expresses behavior its consumer requires rather than existing to make one concrete type mockable.
- [ ] GODSN-CK-STRUCTURE-01-02 — No public API uses a pointer to an interface.

### GODSN-SC-STRUCTURE-02 — Poor quality: Construction is mandatory without an invariant

A constructor or options layer wraps a type whose zero value could be useful and safe. Construction should be
required only for invariants, dependencies, resources, or material clarity; ceremony without a need fails.

#### Checklist

- [ ] GODSN-CK-STRUCTURE-02-01 — Every constructor establishes a required invariant, dependency, resource, or clarity.
- [ ] GODSN-CK-STRUCTURE-02-02 — Every type that can have a useful zero value provides one.
- [ ] GODSN-CK-STRUCTURE-02-03 — No options object hides a required dependency.

### GODSN-SC-STRUCTURE-03 — Edge case: Receiver kind changes the method set

A type mixes values and pointers or is used through an interface. Receiver choices should preserve mutation,
identity, copy safety, and the intended method set; a subtle interface or copy mismatch fails.

#### Checklist

- [ ] GODSN-CK-STRUCTURE-03-01 — Every pointer and value receiver is justified by mutation, identity, copy cost, size, or copy safety.
- [ ] GODSN-CK-STRUCTURE-03-02 — The resulting method set satisfies every intended interface.

### GODSN-SC-STRUCTURE-04 — Poor quality: Generics precede a real type relationship

A type parameter or constraint makes one implementation more abstract without repeated type-safe algorithm or
container behavior across current types. Generics should preserve that evidenced static relationship; a
speculative constraint hierarchy fails.

#### Checklist

- [ ] GODSN-CK-STRUCTURE-04-01 — Every type parameter and constraint stays within repeated type-safe algorithm or container behavior the current implementation requires.
- [ ] GODSN-CK-STRUCTURE-04-02 — A simpler concrete or interface design would not serve the same callers more clearly.

### GODSN-SC-STRUCTURE-05 — Rule violation: Package identity or sibling ownership drifts

Design work names one or more package identities and may touch sibling concerns. The package name, import
path, package directory or placement, and package boundary should match one accepted responsibility; an exact
package pattern may appear only in project command selection or evidence, with its semantics left to
`go-toolchain`. Confirmed project, package, module, or process design remains with `go-architecture`;
construction or review operations remain with `go-development`; naming and error text remain with
`go-conventions`; source form remains with `go-source`; documentation and comments remain with
`go-documentation`; project command and tool facts remain with `go-toolchain`; concurrent lifetime and
cancellation remain with `go-concurrency`. Any substitution or ownership claim fails.

#### Checklist

- [ ] GODSN-CK-STRUCTURE-05-01 — Every package name, import path, package directory or placement, and package boundary matches the accepted package responsibility.
- [ ] GODSN-CK-STRUCTURE-05-02 — Every exact package pattern named with design work appears only in project command selection or evidence.
- [ ] GODSN-CK-STRUCTURE-05-03 — No design claim defines exact package pattern semantics.
- [ ] GODSN-CK-STRUCTURE-05-04 — Every confirmed project, package, module, or process design result, construction or review operation, written-form judgment, project command or named-tool fact, and concurrent lifetime or cancellation judgment remains with its accepted sibling owner.

## Performance

### GODSN-SC-PERFORMANCE-01 — Edge case: Value semantics copy expensive or non-copyable state

A receiver, parameter, or return value contains large data, resource identity, or synchronization state.
Value semantics should remain safe and proportionate; accidental large or invalid copying fails.

#### Checklist

- [ ] GODSN-CK-PERFORMANCE-01-01 — No value copy duplicates non-copyable state.
- [ ] GODSN-CK-PERFORMANCE-01-02 — Every large repeated value copy is justified by the affected public API behavior.

### GODSN-SC-PERFORMANCE-02 — Poor quality: Ownership causes hidden allocation or retention

A package copies, retains, or returns reference-bearing data. The ownership choice should meet caller
independence without avoidable allocation or long-lived retention; an unexplained cost fails.

#### Checklist

- [ ] GODSN-CK-PERFORMANCE-02-01 — Every defensive copy protects a stated independence boundary.
- [ ] GODSN-CK-PERFORMANCE-02-02 — No retained reference extends data lifetime without a caller-visible reason.

## Aesthetics

### GODSN-SC-AESTHETICS-01 — Normal case: Package-qualified APIs form a clear vocabulary

Callers use a package import path through exported functions, types, and methods. The complete public API
should read as a small coherent vocabulary; redundant or scattered concepts fail.

#### Checklist

- [ ] GODSN-CK-AESTHETICS-01-01 — Exported declarations form one coherent vocabulary that stays clear after package qualification.

### GODSN-SC-AESTHETICS-02 — Poor quality: The public API or CLI exposes more shape than behavior

The public API or CLI works but requires callers to understand implementation structure, configuration, or
wide provider interfaces. A public API or CLI that hides little complexity fails.

#### Checklist

- [ ] GODSN-CK-AESTHETICS-02-01 — Callers can use the public API or CLI without understanding internal representation.
- [ ] GODSN-CK-AESTHETICS-02-02 — Every public configuration choice changes behavior callers genuinely need.

## Usage

### GODSN-SC-USAGE-01 — Normal case: Zero value and construction are predictable

A caller creates a value directly or through a constructor. The valid creation path and initial behavior
should be obvious, safe, and part of the accepted public API; surprising mandatory setup fails.

#### Checklist

- [ ] GODSN-CK-USAGE-01-01 — The zero value is usable whenever no invariant forbids it.
- [ ] GODSN-CK-USAGE-01-02 — Every mandatory constructor communicates why direct zero-value use is invalid.

### GODSN-SC-USAGE-02 — Expected failure: Callers inspect error identity

A caller branches on a sentinel, exported error type, or wrapped cause. The returned error should preserve
only the identity promised by the public API and remain compatible with `errors.Is` or `errors.As`; string-only
or accidental identity fails.

#### Checklist

- [ ] GODSN-CK-USAGE-02-01 — Every programmatically inspectable error keeps a stable public API contract.
- [ ] GODSN-CK-USAGE-02-02 — Every programmatically inspectable error stays discoverable through its promised wrapped identity.
- [ ] GODSN-CK-USAGE-02-03 — No public API error contract depends on matching human error text.

### GODSN-SC-USAGE-03 — Edge case: Nil and empty values differ at a boundary

A slice, map, pointer, or interface crosses serialization, equality, or public API boundaries. Nil and empty
forms should be chosen deliberately and included in the accepted public API where callers can observe them;
accidental distinction fails.

#### Checklist

- [ ] GODSN-CK-USAGE-03-01 — Every observable nil-versus-empty distinction is deliberate.
- [ ] GODSN-CK-USAGE-03-02 — Every nil input and nil return state allowed by the contract is safe.

## Consistency

### GODSN-SC-CONSISTENCY-01 — Rule violation: Mutable ownership changes across similar methods

Related methods alternately retain, copy, or transfer slices, maps, buffers, or pointers without one accepted
public API ownership rule. One ownership model should govern each boundary; inconsistent aliasing fails.

#### Checklist

- [ ] GODSN-CK-CONSISTENCY-01-01 — Every reference-bearing input and output has one explicit ownership rule.
- [ ] GODSN-CK-CONSISTENCY-01-02 — Related methods apply the same ownership rule unless their contracts distinguish it.

### GODSN-SC-CONSISTENCY-02 — Rule violation: Receiver choices conflict within one type

Methods on one type use receiver forms that imply incompatible mutation or identity semantics. The receiver
set should represent one coherent type model; unexplained mixing fails.

#### Checklist

- [ ] GODSN-CK-CONSISTENCY-02-01 — Receiver choices are consistent across the method set except where a distinct semantic reason is stated.

### GODSN-SC-CONSISTENCY-03 — Rule violation: The accepted contract and behavior disagree

The accepted public API or CLI defines one contract while runtime behavior, error identity, aliasing, or
ordinary resource lifetime implements another. Every implementation state should match that accepted
contract; any contradiction fails.

#### Checklist

- [ ] GODSN-CK-CONSISTENCY-03-01 — Current behavior, returned error identities, actual aliasing, and actual ordinary resource lifetime match the accepted public API or CLI contract.

### GODSN-SC-CONSISTENCY-04 — Adversarial: The accepted contract is widened to legalize behavior

A surprising behavior is found, and the public API or CLI contract is broadened so the two agree instead of
the behavior being corrected or accepted as a design change. The contract should lead the implementation; a
contract weakened to make unintended behavior conformant fails.

#### Checklist

- [ ] GODSN-CK-CONSISTENCY-04-01 — No accepted public API or CLI contract was weakened to accommodate behavior the design intended to reject.
- [ ] GODSN-CK-CONSISTENCY-04-02 — Every public API or CLI contract change after a behavioral surprise has an accepted design decision.

## Risk

### GODSN-SC-RISK-01 — Rule violation: A reusable public API panics on an ordinary failure

Expected input, dependency, I/O, or domain failure reaches reusable code. The public API should return an
actionable error unless its accepted contract requires panic; an ordinary failure that terminates the caller
fails.

#### Checklist

- [ ] GODSN-CK-RISK-01-01 — Panic is reserved for programmer-invariant violations.
- [ ] GODSN-CK-RISK-01-02 — Panic is distinguishable from an expected operational failure.

### GODSN-SC-RISK-02 — Rule violation: A resource leaks on an alternate path

A function acquires a file, body, connection, or similar ordinary resource and exits through success, error,
or early return. Every owning path should release it at the correct time; any leaked or prematurely closed
path fails. Concurrent timer lifetime remains with `go-concurrency`.

#### Checklist

- [ ] GODSN-CK-RISK-02-01 — Every acquired resource has exactly one owner.
- [ ] GODSN-CK-RISK-02-02 — Every owner releases its resource on every terminal path.
- [ ] GODSN-CK-RISK-02-03 — No owner releases its resource before the required lifetime ends.

### GODSN-SC-RISK-03 — Adversarial: A caller mutates an aliased value after return

A caller intentionally changes a supplied or returned slice, map, buffer, or pointer. The public API should
either isolate its state or make the shared view part of its accepted ownership contract; corruption through
an unstated alias fails.

#### Checklist

- [ ] GODSN-CK-RISK-03-01 — Caller mutation cannot corrupt state promised to be independent.
- [ ] GODSN-CK-RISK-03-02 — Every intentionally shared view exposes its aliasing contract.

### GODSN-SC-RISK-04 — Adversarial: Typed nil or dependency errors mimic safe failure

An implementation returns a typed nil in an error interface or exposes a dependency's identity through `%w`.
The apparent error contract should not trick callers or freeze an implementation detail; hidden non-nil or
accidental identity fails.

#### Checklist

- [ ] GODSN-CK-RISK-04-01 — Successful paths return a literal nil error interface.
- [ ] GODSN-CK-RISK-04-02 — No wrapped dependency error becomes part of the public API without deliberate caller support.

### GODSN-SC-RISK-05 — Rule violation: A returned error disappears

A function call returns an error, but the caller loses it or handles the same failure redundantly. Every
returned error should affect control flow or have an accepted discard reason, and one handling layer should
not both log and return it without a caller need; accidental loss or duplicate handling fails.

#### Checklist

- [ ] GODSN-CK-RISK-05-01 — Every returned error has an accepted handled or explicit-discard flow.
- [ ] GODSN-CK-RISK-05-02 — No error is both logged and returned by one handling layer without an accepted caller need.
- Also applies: GODSN-CK-USAGE-02-02 (added context preserves every promised error identity).

### GODSN-SC-RISK-06 — Normal case: A failed operation leaves the caller able to recover

An ordinary public API or CLI call fails partway through validation, allocation, or I/O. Its observable state
should remain consistent so the caller can retry or stop, and it should not keep a half-applied change; a
failure that leaves the value unusable outside the accepted contract fails.

#### Checklist

- [ ] GODSN-CK-RISK-06-01 — Every failed operation leaves the public API or CLI observable state consistent for a retry or a stop.
- [ ] GODSN-CK-RISK-06-02 — No partially applied change survives a failed operation outside the accepted public API or CLI contract.

## Overall

### GODSN-SC-OVERALL-01 — Normal case: The design is coherent from caller to resource

The complete package design should present exact package identities, a small public API or CLI, predictable
values, deliberate abstraction, explicit ownership, ordinary error flow, and closed ordinary resource
lifetimes. A gap between those elements fails the whole.

#### Checklist

- [ ] GODSN-CK-OVERALL-01-01 — The complete design is understandable from its package identities and public API or CLI.
- [ ] GODSN-CK-OVERALL-01-02 — Internal choices preserve every public API or CLI ownership and failure promise.

### GODSN-SC-OVERALL-02 — Adversarial: Compilation and tests mask an unsafe contract

The code compiles and its current tests pass, but a typed nil, alias, method-set mismatch, resource path, or
speculative abstraction still harms callers. Mechanical success must not substitute for design correctness.

#### Checklist

- [ ] GODSN-CK-OVERALL-02-01 — Acceptance is not based solely on compilation or on current test success.
- [ ] GODSN-CK-OVERALL-02-02 — Every package-identity, public API or CLI, ownership, error, and ordinary-resource condition in this checklist remains satisfied together.
