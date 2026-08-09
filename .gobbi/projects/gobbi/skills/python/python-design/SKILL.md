---
name: python-design
description: "MUST load when Python APIs, modules, functions, classes, objects, errors, data ownership, or resource lifetimes are designed or reviewed."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Python Design

Python Design helps authors and reviewers choose coherent Python runtime and API behavior: modules, functions,
classes, errors, data ownership, and resource lifetimes. It favors the smallest design that makes a caller's
required behavior and failure paths explicit.

Project contracts and supported runtimes constrain every choice. This skill does not choose written form,
static typing policy, workspace placement, package-distribution semantics, or project tools.

## Principles

### Design from the observable contract inward

Callers need behavior, failure, mutation, and lifetime rules they can rely on. Keep implementation details
private until a caller's current need makes them part of the contract.

### Let state and ownership earn objects

Use functions and simple data for direct behavior; introduce a class when durable state, identity, invariants, or
cohesive behavior need one owner. State who may mutate, retain, close, or reuse a value when that can affect a
caller.

### Keep failure and cleanup deliberate

Expected failures need an observable recovery boundary, and acquired resources need an owner for every exit path.
A design is incomplete when its normal path hides either fact.

## Rules

- **MUST bind the affected callers, observable behavior, invalid states, expected failures, compatibility
  position, and applicable resource lifetime before changing an API or runtime boundary.** Do not let a local
  implementation detail silently become a public contract.
- **MUST make mutation, aliasing, retention, ownership transfer, and cleanup explicit whenever mutable data or a
  resource crosses a module, object, or public API boundary.** Each acquired resource has an owner on normal,
  failure, and cancellation paths that apply.
- **MUST choose functions, classes, inheritance, composition, adapters, factories, and other patterns from a
  current caller, invariant, state, or integration need.** A familiar pattern alone is not evidence for a new
  abstraction.
- **MUST preserve useful failure information at a boundary where a caller can decide or recover.** Do not catch,
  translate, or suppress an expected failure without naming the resulting contract and recovery behavior.
- **NEVER treat an annotation or static type result as runtime validation.** Runtime acceptance, parsing, and
  error behavior remain part of the API design; `python-typing` models their static representation.
- **NEVER use this skill to choose names or formatting, type-checker configuration, package discovery, or
  distribution artifacts.** Route those concerns to `python-conventions`, `python-typing`, `python-toolchain`,
  `python-project-structure`, or `python-packaging` respectively.

## Preferences

### Functions, classes, and modules

PREFER a function and direct data when behavior is stateless and its inputs and outputs express the whole
contract. PREFER a class when one cohesive owner needs durable state, identity, an invariant, or coordinated
resource lifetime; a current framework contract or real polymorphic boundary can justify a different shape.

### Dependencies and patterns

PREFER direct composition and explicit dependencies over factories, service locators, inheritance hierarchies, or
strategy objects until multiple real callers or implementations need that seam. A framework extension point,
stable external protocol, or independently varying behavior is evidence for the corresponding pattern; document
the relationship it preserves.

### Errors and validation

PREFER a boundary-specific exception or result that lets the caller distinguish expected domain, input, and
dependency failures without exposing irrelevant internals. Preserve a useful causal exception where it affects
recovery; a public compatibility contract or a caller that cannot act on the detail can justify translation.

### Data and resources

PREFER an immutable value or an explicit copy boundary when callers must not share mutation. PREFER a context
manager when a resource supports deterministic scoped cleanup; Python's context-manager protocol is designed for
the `with` statement. [Python `contextlib`](https://docs.python.org/3/library/contextlib.html) A shared mutable
object or explicit close lifecycle is valid when its identity, owner, and release contract are visible.

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.
