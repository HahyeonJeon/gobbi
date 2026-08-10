# Python Typing Evaluation Checklist

This unchecked source evaluates one Python static type-modeling decision governed by
[`python-typing`](SKILL.md). It covers truthful annotations, type expressions, narrowing, generics, protocols,
and public type surfaces; runtime validation and checker selection remain with their owning sibling skills.

## Design lifecycle

### Truthful type contract

- [ ] The relevant runtime/API states, values, failures, ownership, and supported Python versions are identified before the static model is assessed.
- [ ] Each public annotation or type surface describes an accepted runtime/API contract rather than an unimplemented behavior.
- [ ] Unvalidated, decoded, dynamic, or external input remains distinct from a trusted domain value until the runtime boundary accepts, parses, or rejects it.
- [ ] A static annotation, cast, or clean type-check result is not represented as runtime validation or executable correctness evidence.

### Abstraction and escape hatches

- [ ] Each union, literal, enum, or dedicated domain type makes its valid variants and consumer-visible distinctions identifiable.
- [ ] Each generic preserves a current input/output, container, or capability relationship that a consumer needs.
- [ ] Each `Protocol` represents a current structural capability rather than a speculative class hierarchy or runtime check.
- [ ] Each `Any`, unchecked cast, ignore directive, or deliberately broad public type identifies its boundary, compatibility need, or unavailable type information.

## Development lifecycle

### Source and tool boundaries

- [ ] Annotations and type expressions use the project's supported Python-version syntax and configured type-model rules.
- [ ] An imprecise escape hatch remains local enough that its loss of static information does not silently spread through unrelated public surfaces.
- [ ] Type-model changes do not select a type checker, checker command, or annotation-formatting rule outside the project's configuration.
- [ ] Runtime parsing, validation, exception behavior, and resource lifetime remain with `python-design` rather than type syntax alone.

## Product lifecycle

### Published type information

- [ ] A public type-surface change identifies the affected consumer and compatibility consequence.
- [ ] When a distributed package claims inline type support, its public types and `py.typed` marker promise agree with the packaged artifact boundary.
- [ ] Stub or inline type information intended for a package consumer is routed to `python-packaging` for artifact inclusion and installed behavior.
- [ ] No typing account presents a clean static model as proof of runtime validation, package-install behavior, or release readiness.
