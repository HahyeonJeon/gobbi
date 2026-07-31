---
name: python
description: "MUST load before writing or reviewing Python code. The concrete Python-idiom layer beneath the language-agnostic coding standard — naming, design, conventions, typing, data models, control flow, resources, concurrency, and packaging."
allowed-tools: Read, Grep, Glob, Bash
---

# Python

The concrete Python-idiom layer, sitting UNDER `coding`. The `coding` standard states the language-agnostic
properties of good software; this skill says what they look like in idiomatic Python 3.12 — conventions,
type-system idioms, data models, control-flow and resource patterns, and concurrency and packaging idioms. It
specializes those properties for Python; it does not repeat them, and assumes the `coding` and gobbi
behavioral layers are already in context.

Load it before writing or reviewing any Python code. The Principles, Rules, and Procedure below carry an
ordinary typed module from first read to review without opening anything else; a Procedure step (P2) routes
you to a child doc only when a decision needs depth the parent floor does not carry.

---

## Principles

> **1. Study the Python contract and neighboring code before design.**

The parent says study first; the Python delta is the concrete contract — `requires-python` and the CI matrix,
the artifact type (library / app / CLI / service / script / notebook), the tool strictness in force, and the
import surface, callers, and local idioms. Those surfaces, not the abstract problem, decide which syntax,
entry boundary, compatibility promise, and verification path are valid.

> **2. Design the Python surface with the user, from references.**

The delta the parent lacks is what the surface is made of — module tree, functions and earned classes,
dataclasses and protocols, signatures and annotations, error and ownership shapes. Python lets an accidental
public binding appear at one keystroke, so the surface must be shown and confirmed before bodies make it
costly to change.

> **3. Start with a function and plain data; define a class only when state and behavior must live together.**

Unlike languages that require a class for every unit, Python lets a plain function over plain typed data be
the whole answer, so the first decision is whether a class is earned at all — only for persistent identity,
invariants across calls, or several behaviors over owned state. That choice comes before deciding what the
unit exposes.

> **4. Express boundary relationships with Python protocols and types.**

A unit's connection to its callers is carried by structural `Protocol`s and gradual annotations — advisory at
runtime, worth the most at the public boundary where they are the caller's contract. An annotation describes
the connection's shape but never checks the values through it, so validating untrusted data stays a separate
runtime act.

> **5. Choose the failure shape from the operation.**

Python offers two shapes and the choice is the design act: narrow EAFP — one atomic operation in the `try`,
catch the exception naming its failure, success work in `else` — fits when a check-then-act race is possible.
Validate-first fits when the check is the contract or the effect is expensive or irreversible; the operation
decides, neither is a default.

> **6. Make lifetime visible and keep mutation local.**

In Python a binding aliases an object with no signature warning, so a shared mutable value and an
implicitly-closed resource are both invisible until they fail. Write the lifetime into the syntax — `with` /
`async with`, generators, a `TaskGroup`, a returned owner — and prefer the immutable form (`tuple`,
`frozenset`, a `frozen` dataclass); a container owned by one holder with a visible mutation boundary is fine.

> **7. Build a typed skeleton, then grow minimal verified slices.**

The parent says build bottom-up; the Python delta is the concrete gate — a skeleton of modules, typed
signatures, and stubs that imports cleanly and type-checks green before a single body exists. Then grow one
type-checked slice at a time, so a structural mistake surfaces while it is still one step back.

> **8. Use Python's standard vocabulary until evidence earns an escape.**

Built-ins and the standard library are the vocabulary every Python reader shares, portable and fast enough for
most work. An escape — a third-party dependency, added concurrency, native code, an interpreter-specific
micro-optimization — is earned only by a demonstrated capability gap or profiling/compatibility evidence,
never intuition.

> **9. Demand only the Python inputs the unit uses, in a signature the caller can read.**

The parent narrows the input surface (coding Principle 17); this is its Python shape. Principle 4 owns the
*type mechanism* of a boundary — the `Protocol`, the annotation; this principle owns how *little* the boundary
demands and how *plainly* the call reads. When a unit reads two fields of a record, do not demand the whole
`dataclass`, `TypedDict`, or aggregate as one opaque parameter — that is stamp coupling, and it hides the real
dependency. Pass those fields, a small purpose-built `frozen` value object, or a `Protocol` exposing exactly
the operations and attributes used. Prefer explicit, well-named parameters, often keyword-only when options
could be confused. Never force the caller to decode a deeply-nested annotation — container layers or union
branches — before it can build an argument. The caller reads what to pass from the signature, not by studying
the aggregate definition. Keep a cohesive aggregate whole only when the unit truly uses it as one concept.

---

## Rules

### Hard invariants (H1–H18)

The non-negotiable floor — silent-corruption, unsafe-execution, leak, race, durability, and false-artifact
footguns. Each is `imperative — why; fix`; a merged invariant keeps the union of its sources, and where a
source mixed a hazard with a judgment call, only the hazard stays hard.

- **H1 — MUST keep the declared Python floor consistent** across syntax, stdlib use, metadata, type-check
  target, and CI — a disagreeing floor breaks on the promised runtime; align every surface and run the matrix
  at the minimum and the latest.
- **H2 — MUST keep imports inert and gate executable behavior behind an entry point** — import-time I/O,
  connections, spawned work, arg parsing, or root-logging config breaks reuse, tests, and subprocesses; move
  it into a typed `main` behind `if __name__ == "__main__"`.
- **H3 — NEVER use a mutable call or dataclass default** — it is created once and shared across calls and
  instances, so one mutation leaks into the next; use `None` plus a sentinel, or `field(default_factory=...)`.
- **H4 — NEVER hide unexpected failure with a bare `except`, `BaseException`, or catch-`Exception`-to-continue,
  and NEVER drop a translated exception's cause** — broad catches swallow defects and shutdown signals, and a
  lost cause erases the traceback; catch the named recoverable exception, keep any fallback observable, and
  chain with `raise ... from err`.
- **H5 — NEVER use `assert` to validate external input** — `-O` strips it, so the check vanishes in
  production; check explicitly and raise a real exception before constructing domain state.
- **H6 — NEVER execute or deserialize untrusted content** (`eval`/`exec`, `pickle`, unsafe loaders),
  interpolate it into a shell, or draw security material from `random` — each grants code execution or a
  predictable secret; use a bounded schema parser, a subprocess argument list, and `secrets`.
- **H7 — NEVER expose a secret, token, or PII through a repr, log, fixture, exception, or traceback** — those
  surfaces outlive the request; redact the field and log a stable non-sensitive identifier.
- **H8 — MUST validate and bound untrusted boundary data before use and gate dynamic import or plugin loading
  behind an allowlist** — unchecked input is a correctness and a security hole; narrow it into a safe domain
  form at the boundary.
- **H9 — MUST release required resources deterministically on every path** — GC, `__del__`, shutdown, and
  weakrefs are not timely and may never run; use a context manager or `ExitStack`/`AsyncExitStack`, or an
  explicit `finally` close.
- **H10 — MUST make persisted text, instants, and deadlines unambiguous** — ambient encodings, naive
  datetimes, and wall-clock durations vary by machine and clock; name the encoding (UTF-8) and timezone, and
  measure durations on a monotonic clock.
- **H11 — MUST use atomic, durable, versioned persistence where correctness depends on surviving
  interruption** — a partial write corrupts the next read; write a temp file, `fsync` before the rename when a
  crash must not lose committed data, `os.replace` over the target, and version the format.
- **H12 — MUST own concurrent tasks, propagate cancellation, enforce timeouts and deadlines, keep blocking
  work off the event loop, bound fan-out, drive explicit shutdown, and synchronize shared compound state** —
  otherwise work leaks, hangs, retains unbounded tasks, or races; use structured ownership (`TaskGroup`),
  bounded deadlines (`asyncio.timeout`), queues/locks/immutability, and an explicit shutdown.
- **H13 — NEVER silently change or remove a documented public API** — a caller cannot tell an accident from
  policy; deprecate with a `DeprecationWarning` and a migration path, or declare the break.
- **H14 — NEVER depend on `dict` or `set` iteration order in any context** unless that order is the type's
  explicit, tested contract — incidental order is not stable across runs and corrupts reproducible output;
  sort the externalized output, or define and test an ordering contract.
- **H15 — MUST verify a shipped distribution from built artifacts in a clean environment** — a checkout
  import hides missing data, entry points, and dependencies; build the wheel and sdist, install, import, and
  smoke-test the artifact, not the source tree.
- **H16 — NEVER hand-edit generated code** — the next regeneration overwrites it and the two diverge; change
  the generator or its input and regenerate.
- **H17 — NEVER return a live reference to a mutable internal container** — a caller can mutate your private
  state through it (silent aliasing, H3's class); return a copy, an immutable view
  (`tuple`/`frozenset`/`MappingProxyType`), or a defensive snapshot.
- **H18 — NEVER read or consume raw `__annotations__`** (or `__dict__['__annotations__']`) — it may hold
  unresolved strings or forward refs and misreads under `from __future__ import annotations`, a correctness
  bug; read them through `inspect.get_annotations()` or `typing.get_type_hints()`.

### Judgment defaults

Everything outside the hard set is a default with its deciding evidence, not a mandate. Prefer the form below;
choose otherwise when the named condition holds.

- **Style and spelling — follow the project's configured dialect; a new project defaults to one deterministic
  88-column formatter, PEP 8 names with a leading `_` for internal names, Google-style public docstrings, and
  explicit grouped absolute imports.** A public docstring states behavior, parameters, returns, raised
  exceptions, effects, and constraints the signature cannot show, and an exporting module defines a deliberate
  `__all__`. Prefer defined dunders and `_internal` names over invented dunders, wildcards, or name-mangling;
  choose another length, dialect, layout, or casing only when config or an external interface requires it.
- **Typing — default to precise public and cross-unit annotations, local inference, and immediate isolation of
  dynamic boundaries.** Use built-in generics, `X | None`, native type parameters, structural protocols,
  signature-preserving decorator types, and a project-appropriate strict checker; validate untyped input, then
  adapt it to a `TypedDict`, protocol, or domain value before maintained logic. Keep each suppression local,
  coded, and explained; use `cast` only for a verified static fact. Add `from __future__ import annotations`
  only on evidence (an import cycle, an audited runtime consumer, generated code), never as boilerplate; never
  confuse an annotation with runtime validation, and keep H18 intact when annotations are inspected.
- **Signatures and data models — prefer clear keyword options, the least-demanding truthful input interface,
  ownership-clear results, and composition.** Pick plain args, a
  `dataclass`, `TypedDict`, `NamedTuple`, `Enum`, closure, or class by caller semantics — none is mandatory.
  Flags, modes, timeouts, and same-typed alternatives are usually clearer keyword-only; replay, indexing,
  measurement, or ownership earns a concrete collection over an iterator. Keep every special method —
  `property`, `__repr__`, `__eq__`, `__hash__`, comparison/arithmetic dunders — cheap and total, since callers
  expect them so and a slow or throwing dunder breaks debugging, logging, and set/dict use; put expensive or
  failure-prone work in an explicit named method. Choose a positional option, inheritance, a catch-all
  `*args`/`**kwargs`, or a manual accessor only when compatibility, a documented subclass contract, forwarding
  behavior, or the failure shape justifies it; speculative extensibility is not evidence. Treat the
  aggregate-as-parameter and deeply-nested-annotation anti-patterns as input-surface smells: if the unit
  reads only part of a `dataclass`, `TypedDict`, or config object, expose the actual dependency directly or
  through a narrow `Protocol`. For example, replace `def fetch(cfg: AppConfig)` (reading only two fields)
  with `def fetch(*, timeout_s: float, retries: int)`.
- **Python expression and boundary choices — prefer the clearest native form.** Direct iteration,
  `enumerate`, `zip`, unpacking, a loop past one transform plus one filter, generators for one-pass streams,
  and `pathlib` for high-level paths usually show intent best. Keep a narrow EAFP `try` around only the
  expected operation with success work in `else`, and validate first when the check is the contract or an
  effect is expensive or irreversible. Parse environment, config, and CLI input once at the edge into typed
  values, distinguishing absent / empty / invalid; prefer a module logger with parameterized messages, let the
  application own root logging, and emit a traceback once at the handling boundary. Choose an index, a dense
  expression, an `os` primitive, or a dependency only when the caller contract, operation, project convention,
  low-level need, or a real capability gap explains it.
- **Concurrency and dependencies — default to synchronous standard-library code.** Select async for end-to-end
  I/O waiting, threads for blocking or GIL-releasing calls, and processes for measured CPU parallelism; take a
  mature third-party parser, protocol, or security library when the stdlib lacks the capability. Add either
  only when workload, interoperability, shutdown, or capability evidence outweighs its lifecycle and
  supply-chain cost; H12 still governs every chosen concurrency model.
- **Delivery and evidence — prefer behavior-focused tests and the established layout, with evidence
  proportional to the claim.** Cover the golden path plus edge, failure, and adversarial cases; assert returns,
  exception type and message, and visible effects; make time, randomness, and concurrency deterministic; and
  reproduce a defect with a failing test before repairing it. Substitute at a real boundary (I/O, network,
  clock, randomness, process), not private choreography, and give every skip or `xfail` a tracked reason and a
  falsifiable re-enable condition. A new distributable project normally uses `pyproject.toml` and a `src/`
  layout, notebook/script logic lives in typed importable modules, performance work starts from a
  representative profile, and an interpreter / OS / native / serialization / plugin / notebook boundary sits
  behind a documented adapter with a pure-Python reference where feasible. Choose another shape when an
  existing layout, a compatibility constraint, an end-to-end benchmark, or a boundary contract supports it; a
  microbenchmark supports only a micro-level claim.

This floor keeps safety without pretending one class, data model, concurrency model, container, formatter,
docstring density, or package layout is mandatory for every codebase.

---

## Procedure

**MUST load `coding/SKILL.md` and `principles/SKILL.md` first** and keep them in context — this Procedure
**operationalizes** their disciplines for Python; it does not restate them.

Run P1–P8 in **author mode**; in **review mode**, run P1–P4 read-only to reconstruct and grade the existing
design, skip P5–P6, and grade read-only at P7–P8, editing nothing unless the user authorizes a fix. **P2 is
the router** for specialized depth; these steps plus the parent Rules are the floor for an ordinary typed
module.

### P1 — Study and lock the task

Study everything the design must fit before designing. Lock What/Why/How + in/out scope + success with the
user, or cite a Scope Contract. Read the relevant specs, design notes, README, public-API and operator docs,
project rules, prior failure evidence, neighboring modules, callers, tests, and local prior art. Read the
concrete **Python contract**: `requires-python` and the CI matrix; the artifact type (library / app / CLI /
service / script / notebook); import and entry surfaces; documented compatibility; formatter, linter, and
type-checker config; packaging metadata; and installed-artifact obligations. A new project with no declared
floor defaults to Python 3.12+, but all floor-bearing surfaces must agree (H1). Record the boundary conditions
— trusted vs untrusted inputs, sync vs async callers, resource and task lifetimes, durability, data volume,
OS/interpreter assumptions, documented public names — and flag every boundary that needs runtime validation.
**Declare author vs review mode.** For an **edit**, map the affected set (callers, tests, docs,
generated/mirrored files, config, public consumers) with CRUD + 5W1H. For a **bug**, reproduce, then trace to
the root before repair.

**P1 is complete when** scope and success are explicit (or a Scope Contract cited), the Python contract is
known, patterns and prior art are read, the mode is declared, and the affected set or reproduced root is
recorded.

### P2 — Load the child docs for the forks in play

Read each child **before** the decision it governs; re-run routing when the design changes. An ordinary typed
module needs no specialist design child to be valid, but any Python implementation uses the scenario and
checklist material at P8 before handoff (an evaluator enters it through `evaluation.md`).

| Read | When |
|---|---|
| `design.md` | a unit or API choice needs depth — function-vs-class, signature shape, dataclass and class patterns, composition, data-model selection, ownership, or failure surface |
| `convention.md` | naming, formatting, docstring, import, or comment mechanics need the full project/default convention |
| `typing.md` | annotations, a public boundary, generics, decorators, Protocols, stubs, runtime-annotation consumers, or type-checker suppressions |
| `concurrency.md` | async tasks, threads, processes, executors, queues, locks, shared state, cancellation, timeouts, deadlines, or shutdown |
| `testing.md` | behavior changes, or tests are written or reviewed |
| `packaging.md` | a project, package, or CLI is created; metadata, dependencies, entry points, package data, build, distribution, or documented API evolution changes |
| `performance.md` | performance, scale, a hot path, large data, memory, caching, profiling, or benchmarking |
| `interoperability.md` | a subprocess, native/FFI, buffer, serialization, durable-format, reflection, plugin, generated-code, or production-notebook boundary |
| `scenarios.md` | a Python implementation is self-reviewed before handoff (P8) or evaluated — the good/bad/adversarial cases the task activates (an evaluator loads it through `evaluation.md`) |
| `checklists.md` | the same self-review or evaluation — the activated binary `PY-CHECK-*` items (an evaluator loads it through `evaluation.md`) |
| `evaluation.md` | grading the Python idiom of a change-set — it routes the evaluator to the relevant lenses, scenarios, checks, and verifications (see P8) |

The parent Rules stay the floor after a child loads. **P2 is complete when** every active fork is loaded
before its decision, and the pre-handoff or evaluation path includes the triad routing above.

### P3 — Design the units, decomposed

Design the surface as ordered design acts, not one flat construct-pick, before any body; `design.md` deepens
each act.

1. **Frame the module.** Fix its one responsibility, the absolute acyclic import direction, the inert
   import boundary, the entry point, the public names, and one authoritative home per rule or constant.
2. **Start with functions and plain data.** Give every proposed unit one responsibility and a
   hidden-complexity boundary. Introduce a class only when identity, invariants across calls, or several
   behaviors over owned state must travel together; use a configured closure / `functools.partial` when one
   callable is enough, and a module of functions when the grouping is only a namespace.
3. **Express relationships.** Prefer composition; use a `Protocol` for a structural capability you do not own,
   an ABC for shared behavior plus an explicit subclass / `register` contract, and concrete inheritance only
   for a documented is-a. Choose synchronous execution first; select async (I/O waiting), threads
   (blocking / GIL-releasing calls), or processes (measured CPU parallelism) only from workload and lifetime
   evidence.
4. **Sketch contracts and a runner-up.** For every public and cross-unit interface record its name, inputs,
   output, ownership and mutability, annotations, exceptions, effects, sync-vs-async behavior, invariants, and
   focused test seam; keep one credible alternative for the P4 gate.
5. **Choose data and failure shapes by semantics.** Use plain args for transient local data, a `dataclass`
   for a named record (`frozen=True` for a value object), `TypedDict` for a mapping-shaped interchange
   contract, `NamedTuple` for tuple compatibility, `Enum` for a closed symbolic set, and a class when behavior
   and invariants dominate — none is mandatory. Return a concrete `list`/`dict`/`set` when the caller replays,
   indexes, measures, or owns it; otherwise a generator / `Iterator`. Choose narrow EAFP or validate-first from
   the operation's race, contract, and effect.
6. **Make boundary representations explicit.** Decide the text encoding (UTF-8), path form (`Path` internally,
   `str` / `os.PathLike` at the edge), aware-time representation, monotonic duration/deadline, serialization,
   exception translation, resource cleanup, cancellation, logging ownership, and mutation boundary. Name each
   module, unit, method, parameter, and state field for intent; `convention.md` owns only spelling and casing.

For each resource, task, or mutable value, name the owner and every terminal path (creation, success, failure,
cancellation, timeout, shutdown) and the form a caller receives — an immutable result, an owned copy, or a
documented mutation method.

**P3 is complete when** each unit has an earned container and one responsibility; relationships, ownership, and
import direction are fixed; every contract, alternative, data/failure shape, lifetime, mutation boundary, and
test seam is concrete; and no behavior body exists.

### P4 — Confirm the design and names with the user

Run the design-with-user gate on the Python **design packet** — the module tree, function and earned-class
choices, relationships, sketched interfaces and annotations, names, the data/failure/effect/lifetime/ownership
models, the verification seams, and the P3 runner-up. Record approval, or cite an already-explicit decision;
in the Gobbi workflow this rides the DISCUSSION stage. **Author mode only:** in review mode, reconstruct
and grade the existing packet without editing.

**P4 is complete when** the author-mode surface is approved (or a prior decision cited), or the review-mode
surface is reconstructed and graded.

### P5 — Build the skeleton first

Materialize the approved design before any behavior: create only the module, type, field, signature, error,
and test-seam skeleton — every maintained boundary carrying complete parameter and return annotations
(`-> None` included), bodies left as stubs. Verify it imports cleanly and passes the type checker before
growing any body; if it exposes a structural defect, return through P2–P4 rather than hiding it in a body.

**P5 is complete when** the skeleton matches the approved packet, imports cleanly, and type-checks green with
no behavior implemented.

### P6 — Grow in minimal verified steps

Grow the bodies bottom-up, one verified slice at a time: implement the smallest dependency-setting slice
first, **verify that slice** (format, lint, type, focused test) before the next, and firm up each signature as
you learn. Apply the § Rules floor and the active child guidance as you write, and follow the surrounding code
where it does not contradict a Rule. Update every affected doc, caller, config, and test in the **same
slice**; add nothing beyond the contract and finish every in-scope path with no placeholder. Extract an
abstraction only on real recurrence with one shared reason to change; record adjacent work without doing it.

**P6 is complete when** every in-scope path is implemented with no placeholder, each slice had fresh focused
evidence before the next, and every affected surface moved in lockstep.

### P7 — Verify the whole change

Prove the whole change after the per-slice checks, in this fixed order, fixing a failure before the next:
**format** (deterministic
autoformatter, check mode) → **lint** (imports, naming, broad-except, security smells) → **type-check**
(strict: complete signatures, no implicit `Any`, valid generics and suppressions) → **focused tests** →
**full tests** (regressions) → **build** (wheel + sdist, clean-install import + smoke test, when a
distributable package is touched). The tool names are examples; the ordered capability is the rule. Add the
boundary-specific checks the scope activates — concurrency shutdown/deadlines, persistence-interruption,
security, compatibility, platform, or performance. For a bug, re-run the original P1 reproducer.

**P7 passes only when** every applicable check exits clean on fresh output, the reproducer no longer fires,
and the installed artifact — not only the checkout — satisfies every distribution claim.

### P8 — Review: trace to the approved design and affected set

Review on two axes, then trace to the approved design. Grade the language-agnostic **property** with
`../coding/evaluation.md` and the Python **idiom** with `evaluation.md` — the two axes are independent. For an
executor's pre-handoff check,
read `scenarios.md` for the task-relevant good/bad/adversarial probes, then answer the activated binary
`PY-CHECK-*` items from `checklists.md` — a failed item returns to its owning step. An evaluator enters through
`evaluation.md`, which loads `scenarios.md` + `checklists.md` and records checks through the existing
evaluation-output contract, not a new output. Then run **traceability**: every approved design item (P4) maps
to an implemented unit, interface, name, error shape, ownership boundary, and test seam; every scope item maps
to a diff line and nothing exceeds it; every affected-set file (P1) is updated or a justified no-op; every
success criterion has fresh evidence; and no caller, test, or doc is stale.

**P8 is complete when** both reviews pass, all activated binary checks pass, the code traces to the approved
design, names, scope, and affected set with no stale dependent, and every success criterion has fresh
evidence.

---

## References

One owner per borrowed fact; the body states the fact and this register names its owner.

- [`coding/SKILL.md`](../coding/SKILL.md#scope--language-agnostic) — owns the language-agnostic properties of
  good software (design, construction, craftsmanship) that this skill specializes into concrete Python idioms.
- [`principles/SKILL.md`](../principles/SKILL.md) — owns the ten gobbi behavioral principles that this skill's
  Procedure operationalizes for Python.
- [PEP 8](https://peps.python.org/pep-0008/), [PEP 20](https://peps.python.org/pep-0020/),
  [PEP 257](https://peps.python.org/pep-0257/),
  [Black code style](https://black.readthedocs.io/en/stable/the_black_code_style/current_style.html), and the
  [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html) — the new-project naming,
  layout, import, 88-column, readability, and docstring defaults.
- [PEP 484](https://peps.python.org/pep-0484/), [PEP 544](https://peps.python.org/pep-0544/),
  [PEP 585](https://peps.python.org/pep-0585/), [PEP 604](https://peps.python.org/pep-0604/),
  [PEP 612](https://peps.python.org/pep-0612/), [PEP 646](https://peps.python.org/pep-0646/),
  [PEP 695](https://peps.python.org/pep-0695/) — the type-hint model, `Protocol` structural subtyping,
  built-in generics, `X | None` unions, `ParamSpec`, `TypeVarTuple`, and native type parameters.
- [Python typing specification](https://typing.python.org/en/latest/spec/) — gradual-typing rules beyond the
  individual PEPs.
- *Effective Python* (Brett Slatkin, 3rd ed.) — idiom selections for the data model, comprehensions, EAFP, and
  resources.
- [pytest documentation](https://docs.pytest.org/) — parametrization and fixture idioms.
- [Python Packaging User Guide](https://packaging.python.org/) and [PEP 621](https://peps.python.org/pep-0621/)
  — the `pyproject.toml` metadata and `src/`-layout packaging floor.
- [asyncio](https://docs.python.org/3/library/asyncio.html),
  [contextlib](https://docs.python.org/3/library/contextlib.html), and
  [pathlib](https://docs.python.org/3/library/pathlib.html) — the structured-concurrency (`TaskGroup`,
  `asyncio.timeout`), context-manager (`ExitStack`), and high-level path idioms.
- [Python security considerations](https://docs.python.org/3/library/security_warnings.html) and
  [secrets](https://docs.python.org/3/library/secrets.html) — trust-boundary primitives (subprocess,
  serialization, security material).
