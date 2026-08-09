# Python Design Evaluation Checklist

This unchecked source evaluates one runtime/API design governed by [`python-design`](SKILL.md). It covers Python
APIs, modules, functions, classes, errors, ownership, and resource lifetimes; written form, static type-modeling,
workspace placement, packaging, and tool choice remain with sibling skills.

## Design lifecycle

### Observable contract

- [ ] The affected callers, observable behavior, valid and invalid states, expected failures, compatibility position, and applicable resource lifetime are identified.
- [ ] A public API boundary distinguishes consumer-visible behavior from private implementation detail.
- [ ] Each mutable value or resource crossing a module, object, or public API boundary has an identified mutation, retention, ownership, or cleanup contract.
- [ ] Each expected failure has an observable caller decision or recovery boundary.

### Abstraction choice

- [ ] Each function, class, inheritance, composition, adapter, factory, or other pattern has a current caller, invariant, state, or integration reason.
- [ ] A class identifies the durable state, identity, invariant, cohesive behavior, or lifetime it owns.
- [ ] A direct function or value design remains available where no owned state, identity, or relationship needs an object.
- [ ] A changed exception preserves or intentionally translates the failure information a caller needs to recover.

## Development lifecycle

### Runtime behavior

- [ ] Normal, invalid, failure, cancellation, and applicable cleanup paths identify their resource owner and release behavior.
- [ ] A context-managed resource has a scoped cleanup contract, and an explicitly closed resource has a visible close owner and lifetime.
- [ ] An ownership or copy boundary prevents unintended mutation where consumers require independence.
- [ ] A static annotation or static-check result is not represented as runtime parsing, validation, or error behavior.

## Product lifecycle

### Consumer boundaries

- [ ] A changed public API or error contract identifies its affected callers and compatibility consequence.
- [ ] Runtime behavior, ownership, failure, and lifetime information needed by a public consumer remains observable without revealing unnecessary internals.
- [ ] No API-design account selects source names or formatting, a type checker, package discovery, a distribution artifact, or installed-consumer behavior.
- [ ] A design pattern is not justified solely by familiarity, a test seam, or a speculative future implementation.
