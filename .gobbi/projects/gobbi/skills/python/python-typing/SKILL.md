---
name: python-typing
description: "Python Typing provides overridable preferences for truthful annotations, narrowing, generics, protocols, public type surfaces, and controlled imprecision."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Python Typing

Python Typing guides truthful static models for annotations, narrowing, generics, protocols, public type surfaces, and controlled imprecision.

Use it when authors or reviewers model states and relationships after runtime and API behavior are known. It does not provide runtime validation or choose names, runtime behavior, package layout, or tools.

## Principles

### Model the contract that exists

Types should make valid states and important relationships clear without promising behavior the runtime does not
provide. Python itself does not enforce function and variable annotations at runtime.

### Keep uncertainty at the boundary

Unvalidated or dynamic values should remain visibly uncertain until the runtime/API boundary accepts, parses, or
rejects them. A static model supports that design but cannot replace the runtime evidence.

### Earn abstraction from a relationship

Use a generic or protocol when it preserves a current relationship among values or capabilities. A concrete type
is clearer when no such relationship has a consumer.

## Rules

- **MUST model annotations and public type surfaces from the accepted runtime/API states, values, failures,
  ownership, and supported Python versions.** Route the runtime contract to `python-design` before using a type
  expression to describe it.
- **MUST keep unvalidated, decoded, dynamic, or external input distinct from a trusted domain value until the
  owning runtime boundary validates or rejects it.** An annotation, cast, or successful static check is not that
  validation. [Python `typing`](https://docs.python.org/3/library/typing.html)
- **MUST make every `Any`, unchecked cast, ignore directive, or deliberately broad public type local and
  explainable by an identified boundary, compatibility need, or unavailable type information.** Do not let an
  imprecise escape hatch silently spread through a public surface.
- **MUST keep a published package's type-information promise consistent with its installed distribution when the
  project makes that promise.** `python-packaging` owns inclusion of stubs or a `py.typed` marker in artifacts.
- **MUST use structural protocols and generics only for a current consumer-visible capability or relationship.**
  A nominal class hierarchy, runtime validation, and lifecycle behavior remain `python-design` decisions.
- **NEVER select a universal type checker, type-check command, or annotation formatting rule.** Tool selection is
  `python-toolchain`; written spacing and source form are `python-conventions` concerns.

## Preferences

### Public and local annotations

PREFER explicit annotations for stable public APIs and infer simple local implementation detail when inference
keeps the same reader-visible contract. An unstable inferred public surface, generated declaration contract, or
project checker requirement justifies a more explicit local or public annotation.

### States and uncertainty

PREFER a direct union, literal, enum, or dedicated domain type when variants have distinct valid states, rather
than correlated optional fields or a broad catch-all type. A deliberately open integration or a backward-compatible
public extension point can justify a broader model when its uncertainty stays visible.

### Generics and protocols

PREFER the smallest generic that preserves a visible input/output or container relationship. PREFER a
`Protocol` when a consumer genuinely depends on a capability shared by structurally compatible objects; Python's
typing documentation defines protocols for this static structural-subtyping use. [Python `typing.Protocol`](https://docs.python.org/3/library/typing.html#typing.Protocol)
A single implementation, concrete API, or framework-required nominal type is evidence to avoid that abstraction.

### Distributed type information

PREFER inline types or stubs that match the public package contract when a project publishes type information.
PEP 561 specifies that a package claiming inline type support includes a `py.typed` marker; packaging decides how
that marker and any stubs enter an artifact. [PEP 561](https://peps.python.org/pep-0561/) A private application or
package with no published typing promise may keep its type information within its project boundary.

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.
