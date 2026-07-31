# Go Design Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Design](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

## Project

### GODSN-SC-PROJECT-01 — Normal case: The public surface serves real callers

A package adds or changes caller-visible behavior. The exported surface should contain only concepts required
by current clients and should hide implementation choices; an unnecessary or incomplete contract fails.

#### Checklist

- [ ] GODSN-CK-PROJECT-01-01 — Every exported declaration serves a current caller need.
- [ ] GODSN-CK-PROJECT-01-02 — Every caller-dependent behavior is part of the deliberate public contract.
- [ ] GODSN-CK-PROJECT-01-03 — Implementation details remain unexported unless callers must name them.

### GODSN-SC-PROJECT-02 — Rule violation: A public change ignores compatibility

An exported name, type, method set, error, or ownership promise changes. Existing consumers should retain their
contract or receive an explicitly authorized compatibility break; accidental breakage fails.

#### Checklist

- [ ] GODSN-CK-PROJECT-02-01 — Every changed public contract has a deliberate compatibility position.
- [ ] GODSN-CK-PROJECT-02-02 — Every authorized breaking change identifies its affected consumers.

## Structure

### GODSN-SC-STRUCTURE-01 — Poor quality: An interface exists only for one implementation or mock

The code functions through an interface that no consumer-defined behavior or second real implementation
requires. The design should use the concrete type or a smaller consumer-owned seam; speculative indirection
fails.

#### Checklist

- [ ] GODSN-CK-STRUCTURE-01-01 — Every interface expresses behavior required by its consumer.
- [ ] GODSN-CK-STRUCTURE-01-02 — No interface exists solely to make one concrete type mockable.
- [ ] GODSN-CK-STRUCTURE-01-03 — No API uses a pointer to an interface.

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

- [ ] GODSN-CK-STRUCTURE-03-01 — Every pointer receiver is justified by mutation, identity, size, or copy safety.
- [ ] GODSN-CK-STRUCTURE-03-02 — Every value receiver is safe on an independent copy.
- [ ] GODSN-CK-STRUCTURE-03-03 — The resulting method set satisfies every intended interface.

### GODSN-SC-STRUCTURE-04 — Poor quality: Generics precede a real type relationship

A type parameter or constraint makes one implementation more abstract without serving several real types.
Generics should preserve a current static relationship; a speculative constraint hierarchy fails.

#### Checklist

- [ ] GODSN-CK-STRUCTURE-04-01 — Every type parameter relates current supported types.
- [ ] GODSN-CK-STRUCTURE-04-02 — Every constraint contains only operations the implementation requires.
- [ ] GODSN-CK-STRUCTURE-04-03 — A simpler concrete or interface design would not serve the same callers more clearly.

## Performance

### GODSN-SC-PERFORMANCE-01 — Edge case: Value semantics copy expensive or non-copyable state

A receiver, parameter, or return value contains large data, resource identity, or synchronization state.
Value semantics should remain safe and proportionate; accidental large or invalid copying fails.

#### Checklist

- [ ] GODSN-CK-PERFORMANCE-01-01 — No value copy duplicates non-copyable state.
- [ ] GODSN-CK-PERFORMANCE-01-02 — Every large repeated value copy is justified by the caller contract.

### GODSN-SC-PERFORMANCE-02 — Poor quality: Ownership causes hidden allocation or retention

A package copies, retains, or returns reference-bearing data. The ownership choice should meet caller
independence without avoidable allocation or long-lived retention; an unexplained cost fails.

#### Checklist

- [ ] GODSN-CK-PERFORMANCE-02-01 — Every defensive copy protects a stated independence boundary.
- [ ] GODSN-CK-PERFORMANCE-02-02 — No retained reference extends data lifetime without a caller-visible reason.

## Aesthetics

### GODSN-SC-AESTHETICS-01 — Normal case: Package-qualified APIs form a clear vocabulary

Callers use the package through exported functions, types, and methods. The complete surface should read as a
small coherent vocabulary; redundant or scattered concepts fail.

#### Checklist

- [ ] GODSN-CK-AESTHETICS-01-01 — Exported declarations form one coherent package vocabulary.
- [ ] GODSN-CK-AESTHETICS-01-02 — Public names remain clear after package qualification.

### GODSN-SC-AESTHETICS-02 — Poor quality: The API exposes more shape than behavior

The public surface compiles but requires callers to understand implementation structure, configuration, or
wide provider interfaces. A shallow API that hides little complexity fails.

#### Checklist

- [ ] GODSN-CK-AESTHETICS-02-01 — Callers can use the API without understanding internal representation.
- [ ] GODSN-CK-AESTHETICS-02-02 — Every public configuration choice changes behavior callers genuinely need.

## Usage

### GODSN-SC-USAGE-01 — Normal case: Zero value and construction are predictable

A caller creates a value directly or through a constructor. The valid creation path and initial behavior
should be obvious, safe, and documented; surprising mandatory setup fails.

#### Checklist

- [ ] GODSN-CK-USAGE-01-01 — The zero value is usable whenever no invariant forbids it.
- [ ] GODSN-CK-USAGE-01-02 — Every mandatory constructor communicates why direct zero-value use is invalid.

### GODSN-SC-USAGE-02 — Expected failure: Callers inspect error identity

A caller branches on a sentinel, exported error type, or wrapped cause. The returned error should preserve
only the identity promised by the package and remain compatible with `errors.Is` or `errors.As`; string-only or
accidental identity fails.

#### Checklist

- [ ] GODSN-CK-USAGE-02-01 — Every programmatically inspectable error has a stable public contract.
- [ ] GODSN-CK-USAGE-02-02 — Every intended wrapped identity remains discoverable.
- [ ] GODSN-CK-USAGE-02-03 — No caller contract depends on matching human error text.

### GODSN-SC-USAGE-03 — Edge case: Nil and empty values differ at a boundary

A slice, map, pointer, or interface crosses serialization, equality, or public API boundaries. Nil and empty
forms should be chosen deliberately and documented where callers can observe them; accidental distinction
fails.

#### Checklist

- [ ] GODSN-CK-USAGE-03-01 — Every observable nil-versus-empty distinction is deliberate.
- [ ] GODSN-CK-USAGE-03-02 — Every nil input allowed by the contract is safe.
- [ ] GODSN-CK-USAGE-03-03 — Every nil return state allowed by the contract is safe.

## Consistency

### GODSN-SC-CONSISTENCY-01 — Rule violation: Mutable ownership changes across similar methods

Related methods alternately retain, copy, or transfer slices, maps, buffers, or pointers without saying so.
One documented ownership model should govern each boundary; inconsistent aliasing fails.

#### Checklist

- [ ] GODSN-CK-CONSISTENCY-01-01 — Every reference-bearing input has one explicit ownership rule.
- [ ] GODSN-CK-CONSISTENCY-01-02 — Every reference-bearing output has one explicit ownership rule.
- [ ] GODSN-CK-CONSISTENCY-01-03 — Related methods apply the same ownership rule unless their contracts distinguish it.

### GODSN-SC-CONSISTENCY-02 — Rule violation: Receiver choices conflict within one type

Methods on one type use receiver forms that imply incompatible mutation or identity semantics. The receiver
set should represent one coherent type model; unexplained mixing fails.

#### Checklist

- [ ] GODSN-CK-CONSISTENCY-02-01 — Receiver choices are consistent across the method set.
- [ ] GODSN-CK-CONSISTENCY-02-02 — Each exceptional receiver choice has a distinct semantic reason.

### GODSN-SC-CONSISTENCY-03 — Rule violation: Documentation, errors, and behavior disagree

The public declaration describes one contract while runtime errors or ownership implement another. All
caller-visible forms should express the same behavior; contradictory surfaces fail.

#### Checklist

- [ ] GODSN-CK-CONSISTENCY-03-01 — Public documentation matches current behavior.
- [ ] GODSN-CK-CONSISTENCY-03-02 — Returned error identities match the documented error contract.
- [ ] GODSN-CK-CONSISTENCY-03-03 — Documented ownership matches actual aliasing.
- [ ] GODSN-CK-CONSISTENCY-03-04 — Documented ownership matches actual resource lifetime.

## Risk

### GODSN-SC-RISK-01 — Rule violation: A reusable API panics on an ordinary failure

Expected input, dependency, I/O, or domain failure reaches reusable code. The API should return an actionable
error unless the governing contract requires panic; an ordinary failure that terminates the caller fails.

#### Checklist

- [ ] GODSN-CK-RISK-01-01 — No expected operational failure is represented by panic.
- [ ] GODSN-CK-RISK-01-02 — Every programmer-invariant panic is distinguishable from an ordinary failure.

### GODSN-SC-RISK-02 — Rule violation: A resource leaks on an alternate path

A function acquires a file, body, connection, timer, or similar resource and exits through success, error, or
early return. Every owning path should release it at the correct time; any leaked or prematurely closed path
fails.

#### Checklist

- [ ] GODSN-CK-RISK-02-01 — Every acquired resource has exactly one owner.
- [ ] GODSN-CK-RISK-02-02 — Every owner releases its resource on every terminal path.
- [ ] GODSN-CK-RISK-02-03 — No cleanup runs before the resource's required lifetime ends.

### GODSN-SC-RISK-03 — Adversarial: A caller mutates an aliased value after return

A caller intentionally changes a supplied or returned slice, map, buffer, or pointer. The package should
either isolate its state or document the shared view; corruption through an unstated alias fails.

#### Checklist

- [ ] GODSN-CK-RISK-03-01 — Caller mutation cannot corrupt state promised to be independent.
- [ ] GODSN-CK-RISK-03-02 — Every intentionally shared view exposes its aliasing contract.

### GODSN-SC-RISK-04 — Adversarial: Typed nil or dependency errors mimic safe failure

An implementation returns a typed nil in an error interface or exposes a dependency's identity through `%w`.
The apparent error contract should not trick callers or freeze an implementation detail; hidden non-nil or
accidental identity fails.

#### Checklist

- [ ] GODSN-CK-RISK-04-01 — Successful paths return a literal nil error interface.
- [ ] GODSN-CK-RISK-04-02 — No wrapped dependency error becomes public without deliberate caller support.

### GODSN-SC-RISK-05 — Rule violation: A returned error disappears

A function call returns an error, but the caller neither handles it nor makes an explicit documented discard.
Every returned error should affect control flow or carry a deliberate reason for being ignored; accidental
loss fails.

#### Checklist

- [ ] GODSN-CK-RISK-05-01 — Every returned error is handled or explicitly discarded.
- [ ] GODSN-CK-RISK-05-02 — Every explicit error discard has a documented reason.
- [ ] GODSN-CK-RISK-05-03 — Added error context preserves every promised error identity.

## Overall

### GODSN-SC-OVERALL-01 — Normal case: The design is coherent from caller to resource

The complete package should present a small API, predictable values, deliberate abstraction, explicit
ownership, ordinary error flow, and closed resource lifetimes. A gap between those elements fails the whole.

#### Checklist

- [ ] GODSN-CK-OVERALL-01-01 — The complete design is understandable from the caller-facing contract.
- [ ] GODSN-CK-OVERALL-01-02 — Internal choices preserve every public ownership promise.
- [ ] GODSN-CK-OVERALL-01-03 — Internal choices preserve every public failure promise.

### GODSN-SC-OVERALL-02 — Adversarial: Compilation and tests mask an unsafe contract

The code compiles and its current tests pass, but a typed nil, alias, method-set mismatch, resource path, or
speculative abstraction still harms callers. Mechanical success must not substitute for design correctness.

#### Checklist

- [ ] GODSN-CK-OVERALL-02-01 — Acceptance is not based solely on compilation.
- [ ] GODSN-CK-OVERALL-02-02 — Acceptance is not based solely on current test success.
- [ ] GODSN-CK-OVERALL-02-03 — Every caller-visible edge in this checklist remains satisfied together.
