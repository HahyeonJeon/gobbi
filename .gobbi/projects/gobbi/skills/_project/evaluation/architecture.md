# Project Evaluation — Architecture Perspective

This perspective answers one question: is the code structurally sound within the existing system? Load this skill when evaluating project output — implementations, refactoring, configuration changes — from a structural and design angle.

The evaluator's job is to find design problems, not to propose rewrites.



---

## Core Principle

> **Fit within the existing design, or change the design deliberately.**

New code that imports a pattern inconsistent with the rest of the codebase creates drift — two ways of doing the same thing, neither authoritative. This is not always wrong, but it must be intentional and traceable. Unintentional pattern divergence is a structural failure.

> **Abstractions should reduce complexity, not create it.**

An abstraction that requires the reader to understand more than the code it replaced has made the codebase harder to work with. The test is whether the abstraction is learnable from existing usage without reading its implementation.

---

## Evaluation Lenses

### Pattern Consistency

Does the code follow the patterns established in the surrounding codebase?

Read the existing implementations in the same area. Identify the dominant patterns for error handling, data transformation, component composition, and module boundaries. The deliverable should fit these patterns — or, if it diverges, that divergence should be justified by the nature of the new code and not simply a matter of agent preference or unfamiliarity.

Inconsistent patterns are not style issues — they are maintenance costs. Future agents reading this code will be confused about which pattern to follow.

### Coupling and Cohesion

Are module boundaries respected? Does each unit do one thing?

Coupling: does the deliverable reach into another module's internals, or rely on implementation details that aren't exposed as a stable interface? Tight coupling makes isolated change impossible — modifying one component cascades unpredictably.

Cohesion: does each function, class, or module have a single, clear purpose? Mixed responsibilities make code harder to test, harder to reuse, and harder to understand.

### Type Safety

Are types used precisely, or are they working around the type system?

Assess how the code uses the type system in place — whether TypeScript, Go, or another typed language. Look for casts that bypass type checking, `any`-equivalent escapes, type assertions without prior narrowing, or data shapes passed as loose maps when a typed structure would make intent clear.

Types are documentation the compiler enforces. Where the deliverable weakens type precision, it weakens the compiler's ability to catch future mistakes.

### Extensibility

Does the code extend naturally, or does it fight the existing design?

Changes that would make future extension difficult — hard-coded specifics where variability is clearly needed, structural decisions that assume the current shape of the data will never change — are design problems, not just aesthetic ones. Assess whether the deliverable was designed for the immediate case only, when the surrounding code clearly anticipates evolution.

---

## Signals Worth Investigating

These patterns are not automatically failures, but each warrants examination:

- A new abstraction that duplicates an existing one with slightly different semantics
- Accessing internal state of another module that was not designed to be consumed externally
- Type casts or escape hatches used where a type guard or discriminated union would work
- A function or module that grew to handle two or more unrelated concerns
- A pattern introduced here that no other part of the codebase uses

---

## Output Expectations

Report findings as specific, traceable observations. Name the file, the construct, and the structural problem. Distinguish between violations of the existing design (the code fights the codebase) and missing design choices (the code introduces something new without a clear home). Rate severity: whether the issue creates ongoing maintenance costs (significant) or is a localized inconsistency unlikely to spread (minor).

Do not propose alternative implementations. Describe the problem clearly enough that the implementer can reason about the right solution in context.
