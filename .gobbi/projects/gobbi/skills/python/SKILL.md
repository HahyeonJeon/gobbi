---
name: python
description: "MUST load before writing or reviewing Python code. The concrete Python-idiom layer beneath the language-agnostic coding standard — naming, design, conventions, typing, data models, control flow, resources, concurrency, and packaging."
allowed-tools: Read, Grep, Glob, Bash
---

# Python

The concrete Python-idiom layer, and the layer that sits UNDER `coding`. The `coding` standard states the
language-agnostic properties of good software; this skill says what those properties look like in idiomatic
Python 3.12 — the naming and formatting conventions, the type-system idioms, the data models, the
control-flow and resource patterns, the concurrency and packaging idioms, and the tooling. It specializes
those properties for Python; it does not repeat them.

An agent MUST load `coding/SKILL.md` and `principles/SKILL.md` alongside this skill and keep them in context —
it sits on top of them and assumes them. Its Procedure operationalizes their disciplines for Python —
study-first, design-with-the-user, bottom-up construction, and blast-radius awareness — citing each at the
step it governs rather than restating it; loaded standalone, its deferrals have nothing beneath them.

Load it before writing or reviewing any Python code. The Principles, Rules, and Procedure below carry an
ordinary typed module from first read to review without opening anything else; a step sends you to a child
doc when a decision needs more depth — unit and API design, naming and style conventions, deep typing,
concurrency, testing, packaging, performance, interoperability, or the idiom review frame.

---

## Principles

> **Design the Python surface with the user, from references, before you build it.**

The units a Python module exposes — its modules, classes, dataclasses, protocols, functions, methods,
parameters, and their names — are design commitments, not implementation leftovers: once callers depend on
them, a wrong boundary or a misleading name is cheap to change on paper and expensive after bodies exist.
Shape each unit and its name from prior art — this codebase's patterns first, then adjacent libraries and the
community — show the concrete surface to the user, and confirm it before writing a body, rather than
reverse-engineering it from whatever the implementation happened to need. Python makes the shortcut tempting —
you can bind a name or reach for a class at any keystroke — so deciding the surface deliberately, and with the
user, is what keeps the module coherent instead of idiosyncratic.

> **Speak Python's protocols, not another language's ceremony.**

Python code is written against a small set of shared protocols: iterables, mappings, context managers,
callables, path-like objects, and the data model. Code that uses those protocols directly needs no adapter
classes, no manual index loops, no getter/setter pairs, and no imported nominal hierarchies. A module
transliterated from Java or C# reads as ceremony a Python reader has to decode before understanding it.
Reaching for the protocol the language already defines is what makes code look native rather than
translated.

> **Types describe relationships at boundaries.**

Python's type system is gradual: advisory at runtime, and strongest as a description of how a unit connects
to its callers. An annotation earns its place when it tells a reader how inputs, outputs, callbacks, and
stored state relate. It loses its value when it degrades into redundant noise, or pretends to validate data
that only a runtime check can. The payoff concentrates at the public boundary, where the annotation is the
caller's contract; inside a function, inference already carries the weight. Types document the shape of the
connection, not the values that flow through it.

> **Attempt the operation, then handle its named failure.**

Python favors trying an operation and catching the specific exception it raises over checking every
precondition first. Done well, this keeps the attempted operation atomic and sidesteps the check-then-act
race where the world changes between the look and the leap. It stays safe only when the guarded region is
the single operation expected to fail and the caught exception names exactly that failure. Validating first
is the better choice when the check itself is the contract, or when the action is expensive or irreversible.
The judgment is which of the two fits the operation, not a blanket preference for either.

> **Make ownership and lifetime visible in the syntax.**

A resource, a task, or a piece of state has a lifetime, and Python has syntax that makes that lifetime
visible: `with` and `async with` for resources, iterators and generators for streamed data, task groups for
concurrent work, explicit return values for ownership. When the lifetime is written into the syntax, a
reader sees who owns the thing and when it ends. When it is left implicit — a file closed by the chance
timing of garbage collection, a task launched and forgotten, state reachable through a module global —
ordinary failure turns into a leak, a shutdown race, or action at a distance. The construct that shows the
lifetime is the one that belongs there.

> **Prefer values and transformations over shared mutation.**

Python binds names to objects, so aliasing is invisible: after `a = b = []`, a mutation through `a` is a
mutation through `b`, and nothing in a signature warns that an argument is shared. The Python answer is to
reach for the immutable form the language already gives — a `tuple`, a `frozenset`, a `dataclass(frozen=True)`
value object — and for a function that returns a new result rather than editing its argument, so each value
has one stable interpretation. Owned mutable containers are still fine when a single owner and a clear
mutation boundary make the alias visible again. Python is not a functional language, so this is a bias, not a
mandate: the immutable or freshly-returned form is the default, and a shared-and-mutated value is a
deliberate, visible decision. The invisible alias is the bug that reproduces once a week.

> **Use the standard vocabulary until evidence earns an escape.**

Python's built-ins and standard library are the shared vocabulary every Python reader already knows, and
they are portable and fast enough for most work. A third-party dependency is worth its cost when it supplies
a mature capability the standard library does not — a real parser, a real cryptographic primitive — not when
it saves a few lines the stdlib already expresses clearly. A lower-level or interpreter-specific technique —
a C extension, a micro-optimized inner loop, a reliance on a CPython detail — is earned only by profiling,
compatibility, or interoperability evidence, never by intuition. The plain, widely-understood form is the
default; the escape from it is a decision backed by a measurement or a real gap.

---

## Rules

### Must-Follow

- **MUST honor one declared Python floor** — a new project targets Python 3.12+, and the syntax, stdlib use,
  dependency metadata, type-check target, and CI versions all agree with it, with the test matrix running
  the minimum and the latest. A floor that disagrees across these surfaces ships code that passes on the
  author's interpreter and breaks on the declared one.
- **MUST format with one deterministic autoformatter at 88 columns and 4-space indents** — take the
  formatter's whitespace, quote style, implicit line continuation, and stable trailing commas as
  authoritative. Hand-tuned layout drifts between files and adds noise to every diff. (Every tool named in
  this skill — a formatter, a linter, a type checker — is an example; the rule is the property, not the
  tool.)
- **MUST use PEP 8 naming with a leading underscore for internal names** — `snake_case` functions and
  variables, `PascalCase` classes, `UPPER_CASE` constants, `Error`-suffixed exception classes, and a public,
  internal, and subclass surface each chosen on purpose. A name kept accurate after behavior changes; a stale
  name misleads every later reader.
- **MUST keep imports explicit, grouped, absolute, and import-safe** — no wildcard imports, a deliberate
  `__all__` where a public surface is exported, and no network, disk, process, or other side-effecting work
  run at import time. An import with side effects turns `import module` into an action and makes the module
  unusable as a library.
- **MUST gate executable behavior behind `if __name__ == "__main__"`** delegating to a typed, importable
  `main`. A module whose body runs the program on import cannot be reused or tested without triggering it.
- **MUST write Google-style docstrings on public modules, classes, functions, and methods** — a PEP 257
  summary line plus the behavior, parameters, returns, raised exceptions, side effects, and constraints a
  reader cannot see in the signature. A docstring that restates the annotations adds nothing; one that omits
  the raised exceptions hides the contract.
- **MUST annotate every maintained signature and exported value** — parameters, return (`-> None` included),
  built-in generics (`list[str]`, `dict[str, int]`), `X | None` unions, PEP 695 native type parameters for
  generics, and a narrow `Protocol` or ABC for structural inputs — then run a strict type checker and let
  local variables infer. The deep typing surface (decorators, variance, stubs, runtime-annotation access)
  carries the same strict discipline.
- **MUST narrow `Any` or untyped boundary data to a precise type at the boundary immediately** — restore the
  type relationship with validation, a `TypedDict`, a `Protocol`, or a typed adapter before the dynamic value
  enters maintained logic. An unnarrowed `Any` spreads silently across every call it touches.
- **MUST keep each type suppression local, coded, and reasoned, and use `cast` only for a verified static
  fact** — an inline ignore names the checker's diagnostic code and states the fact that makes it safe, and a
  `cast` explains knowledge the checker cannot see rather than forcing an incompatible design to pass. A
  blanket or unexplained suppression hides a real type error.
- **MUST use immutable defaults and keyword-only optional behavior** — express an optional argument with
  `None` plus a sentinel, or a `default_factory`, never a shared mutable object; make flags, modes, timeouts,
  and any option among several same-typed ones keyword-only. A positional boolean at a call site tells the
  reader nothing about which flag it sets.
- **MUST accept the narrowest useful interface and return an ownership-clear value** — take the least
  specific type that works (`Iterable`, `Sequence`, `Mapping`, path-like) and hand back a value whose
  ownership and mutability are clear. Select the data model by semantics: a `dataclass` for named value
  state, a `TypedDict` for a typed interchange mapping, a `NamedTuple` for positional-tuple compatibility, an
  `Enum` for a closed symbolic set, a plain class when behavior and invariants dominate.
- **MUST prefer composition and protocols over deep nominal inheritance** — reach for a `Protocol` or a
  shallow ABC and hold collaborators as attributes before building an inheritance chain; document any public
  subclass API and call `super()` cooperatively where it exists; expose a `property` only for a cheap,
  side-effect-free computed value. A deep hierarchy built for reuse couples every subclass to the base's
  internals.
- **MUST keep a comprehension to one transform plus at most one filter** — a comprehension that does more
  becomes a loop; stream with a generator when materializing the whole sequence is unnecessary; return a
  concrete `list`/`dict`/`set` when the caller must replay, index, measure, or own it. A three-clause nested
  comprehension is harder to read than the loop it replaced.
- **MUST iterate over values, not indices** — loop directly over an iterable, and reach for `enumerate`,
  `zip`, and tuple unpacking instead of `range(len(...))` and manual index bookkeeping; use `match` only for a
  genuine structural alternative, not a plain equality chain. An index loop is a C-style habit that Python's
  iteration protocol makes unnecessary.
- **MUST scope EAFP to the single operation expected to fail and preserve exception meaning** — put only that
  one operation in the `try`, catch the specific exception it raises, and do the success work in `else`;
  raise the most specific built-in exception, add a domain exception only for a stable category callers will
  branch on, and chain with `raise NewError(...) from err` so the original traceback survives. A translated
  exception that drops `from` erases the real cause.
- **MUST use a context manager for deterministic resource lifetime on every path** — wrap files, locks,
  transactions, temporary resources, and network clients in `with` or `async with`, and use
  `ExitStack`/`AsyncExitStack` when the set of resources is dynamic. A resource closed only on the happy path
  leaks whenever an exception skips the close.
- **MUST make I/O boundaries explicit** — specify the text encoding (UTF-8) at every persisted or network
  boundary, use `pathlib.Path` for high-level path work (the `os` layer only for genuinely low-level needs),
  and represent instants as timezone-aware datetimes with durations measured on a monotonic clock. An
  unspecified encoding decodes differently on another machine.
- **MUST make persistence durable where correctness needs it** — replace a file atomically (write a temporary
  file, then `os.replace` it over the target), `fsync` before the rename when a crash must not lose committed
  data, and version a durable on-disk format so an old reader detects a new layout. A half-written file left
  by a crash mid-write corrupts the data the next run trusts. Format and native-durability depth is the
  parent-level floor.
- **MUST log through a module-level logger with parameterized messages** — bind `logging.getLogger(__name__)`,
  pass values as logging arguments rather than pre-formatted strings, and emit once at the boundary that
  handles the failure (`logger.exception` for the traceback); a library configures no root logging and leaves
  that to the application. A library that configures the root logger hijacks its consumer's logging.
- **MUST parse configuration and CLI input at the boundary into typed domain values** — read the environment,
  config file, or argument vector once at the edge, convert it to typed values, and distinguish absent from
  empty from invalid; send diagnostics to `stderr` and return an exit code from `main`, keeping import inert.
  Config read scattered through business logic makes behavior depend on ambient state. Depth is the
  parent-level floor.
- **MUST choose the concurrency model from the workload and give it structured ownership** — async for
  I/O-bound waiting, threads for blocking or GIL-releasing calls, processes for CPU-bound work; own concurrent
  tasks with a `TaskGroup`, bound the in-flight work, and make cancellation, timeouts, shutdown, and
  shared-state synchronization explicit; never block the event loop with a synchronous call. Deep concurrency
  cases carry the same discipline.
- **MUST validate untrusted data before use and choose safe primitives** — validate and bound input crossing
  a trust boundary, pass subprocess arguments as a list, use a safe serializer for untrusted data, draw
  security material from `secrets`, and gate dynamic import or plugin loading behind an allowlist. Untrusted
  input used without a check is both a correctness and a security hole.
- **MUST test behavior across golden, edge, failure, and adversarial cases** — assert observable behavior
  (return values, raised exception type and message, recorded effects) rather than internal steps;
  parametrize a contract exercised over many inputs; use fixtures for resource setup and teardown; make time,
  randomness, and concurrency deterministic; and reproduce a reported defect with a failing test before
  fixing it. This is the parent-level testing floor.
- **MUST ship a distributable project from a `src/` layout with a `pyproject.toml`** — declare the build
  backend, project metadata, `requires-python`, runtime and optional dependencies, package data, entry
  points, and a `py.typed` marker when the package is typed; build a wheel and an sdist and smoke-test the
  installed artifact from a clean environment, not the checkout. This is the parent-level packaging floor.
- **MUST evolve a documented public API deliberately** — deprecate with a `DeprecationWarning` and a
  migration note before removal, keep backward compatibility for documented APIs across the support window,
  and remove a compatibility branch only after the declared support floor advances past it. A silently changed
  or removed public name breaks every downstream caller at once. This is the parent-level floor.
- **MUST base a Python performance change on measurement, and prefer a better built-in or data structure to
  hand-tuned code** — profile a representative workload to find the real hot path, and reach first for the
  C-implemented built-in, the right `dict`/`set`, or a generator before a clever inner loop; trade
  readability for speed only when a measurement on the target workload justifies it. This is the parent-level
  performance floor.
- **MUST isolate and document any CPython, operating-system, or native assumption** — put an
  interpreter-specific detail, an OS-specific path or behavior, or a native/foreign-code boundary behind a
  narrow, documented adapter with a pure-Python reference where feasible, so the assumption is visible and
  testable instead of silently baked into ordinary code. This is the parent-level interoperability floor.
- **MUST keep reusable logic in importable, typed modules, not in a notebook or script body** — a notebook or
  script orchestrates (seed randomness, record the environment and inputs) and routes the real work through a
  typed `main` with explicit errors and tests proportional to reuse and risk. Production logic trapped in a
  notebook cell cannot be imported, typed, or tested.

### Must-Not-Follow

- **NEVER add `from __future__ import annotations` as boilerplate, and NEVER read or mutate raw
  `__annotations__`** — a blanket future-import silently changes how frameworks that read annotations at
  runtime behave, and raw `__annotations__` may hold strings or unresolved forms. Fix: use ordinary 3.12
  annotations, quote a genuine forward reference, and add the future-import only for a demonstrated import
  cycle after auditing runtime consumers; read annotations through `inspect.get_annotations` or
  `typing.get_type_hints`.
- **NEVER use a mutable default argument or a mutable dataclass field default** — the object is created once
  and shared across every call, so one caller's mutation leaks into the next. Fix: default to `None` with a
  sentinel, or use `field(default_factory=...)`.
- **NEVER use a bare `except`, catch `BaseException` in ordinary logic, or catch `Exception` just to
  continue, return a default, or hide a defect** — a blanket catch swallows `KeyboardInterrupt`,
  `SystemExit`, and real bugs alike. Fix: name the specific recoverable exceptions and make any fallback
  observable, so an unexpected error still surfaces.
- **NEVER use `assert` to validate external input** — assertions state internal invariants and are stripped
  when Python runs with `-O`, so a validating assert vanishes in production. Fix: check the condition
  explicitly and raise a real exception.
- **NEVER `eval`/`exec` untrusted text, unpickle or otherwise unsafely deserialize untrusted data, build a
  shell command from untrusted text or default `shell=True`, or use `random` for security material** — each
  hands an attacker code execution or a predictable secret. Fix: use a constrained parser with a schema, a
  subprocess argument list, and `secrets`.
- **NEVER let a secret, token, or PII reach a Python leak surface** — a value dropped into `__repr__` /
  `repr()`, a pytest fixture, `%`-style or f-string log arguments, or an exception's `__notes__` and traceback
  is copied into logs, test output, and error reports that outlive the request. Fix: redact the field in
  `__repr__`, inject the secret from the environment or a secret store rather than a literal, and log only a
  stable non-sensitive identifier.
- **NEVER perform required I/O, open a connection, spawn work, parse CLI arguments, or configure root logging
  at import time** — importing a module must be a safe, inert act. Fix: move the work into a function or the
  `main` entry point the caller invokes deliberately.
- **NEVER use wildcard imports, invented dunder names, or name-mangling as ordinary privacy** — a wildcard
  import pollutes the namespace and hides a name's origin, and `__dunder` mangling is not access control.
  Fix: import names explicitly, prefix a non-public name with `_`, and list the public surface in `__all__`.
- **NEVER expose a public catch-all `*args`/`**kwargs` for speculative compatibility, and NEVER write manual
  getter/setter methods by habit** — an untyped catch-all hides the real contract, and getter/setter pairs
  are ceremony Python does not need. Fix: state the actual parameters; expose a public attribute directly and
  promote it to a `property` only when it later needs behavior.
- **NEVER hide expensive or failure-prone work behind a `property`, `__repr__`, equality, hashing, or another
  special method** — callers expect those to be cheap and total, and a slow or throwing dunder breaks
  debugging, logging, and set/dict use. Fix: expose the work as an explicit named method.
- **NEVER compress nested transforms, exception handling, an assignment side effect, or several rules into
  one comprehension, lambda, or conditional expression** — density there hides control flow a reader must
  trace. Fix: name the intermediate steps as ordinary statements.
- **NEVER depend on `dict` or `set` iteration order unless it is that type's explicit, tested contract** —
  `dict` preserves insertion order, but `set` order and any incidental ordering are not stable to rely on.
  Fix: sort the externalized output when reproducibility matters.
- **NEVER return a live mutable internal container** from a method or property — the caller can mutate your
  object's private state through the reference. Fix: return a copy or an immutable view, or expose narrow
  mutation methods, unless shared mutation is the documented contract.
- **NEVER rely on garbage collection, `__del__`, interpreter shutdown, or weak references for required
  cleanup or durability** — their timing is not guaranteed and may never run. Fix: release the resource
  deterministically with a context manager or an explicit close on every path.
- **NEVER swallow a `CancelledError`, launch an unobserved fire-and-forget task, block the event loop, or
  assume the GIL makes a compound operation atomic; NEVER add concurrency as an optimization without workload
  evidence and a shutdown design** — each turns concurrency into a leak, a hang, or a race. Fix: re-raise
  `CancelledError`, own every task in a `TaskGroup` and keep a strong reference, move blocking work off the
  loop, and guard shared state with an explicit lock, a queue, or immutability.
- **NEVER add a runtime dependency for a capability the standard library already expresses clearly, and NEVER
  hand-roll a substitute for a mature security, protocol, or parser library to stay "stdlib-only"** — both
  trade the wrong amount of dependency for the wrong reason. Fix: use the stdlib when it is sufficient, and
  take the mature dependency when the capability is real (cryptography, parsing, wire protocols).
- **NEVER mock the unit under test or assert its private choreography** — a test bound to internal call order
  breaks on every refactor and proves nothing about behavior. Fix: substitute only at the true boundary (I/O,
  network, clock) and assert observable behavior. (Testing floor.)
- **NEVER skip or `xfail` a test without a tracked reason and a falsifiable re-enable condition** — a
  silently skipped test hides a regression. Fix: annotate the skip with its tracking reference and the
  condition under which it must run again. (Testing floor.)
- **NEVER test only the checkout when shipping a package** — code that imports fine from the source tree can
  fail after a wheel install with undeclared data or dependencies. Fix: install the built artifact into a
  clean environment and smoke-test it. (Packaging floor.)
- **NEVER hand-edit generated code** — the next regeneration overwrites the edit and the two silently
  diverge. Fix: change the generator or its input and regenerate; keep generated files apart from
  hand-maintained ones. (Interoperability floor.)
- **NEVER optimize a Python hot path from intuition alone, or cite a microbenchmark for a system-level
  claim** — Python's costs (attribute lookup, allocation, the GIL, interpreter overhead) are not reliably
  predictable by eye, and a microbenchmark ignores end-to-end effects. Fix: profile the real workload and
  benchmark at the level of the claim. (Performance floor.)

---

## Procedure

This procedure **operationalizes** the meta-disciplines for Python; it does not restate them. `coding/SKILL.md`
and `principles/SKILL.md` are loaded alongside this skill (Intro), and every step **cites** the meta-principle
it enforces and adds only the Python-specific act — "`coding` P7" names a `coding/SKILL.md` principle, "gobbi
P2" a `principles/SKILL.md` principle, whose body you read in its own skill.

Author or review Python in eight steps: **P1–P4 lock the task and design its surface with the user**; **P5–P8
build, verify, and review it.** A parent-level Rule marked a *floor* pushes its depth to a child doc, and
**P2 is the router** that names each child and its trigger. **Author mode** runs all eight steps. **Review
mode** (`coding` P1 / gobbi P5) runs P1–P4 read-only — reconstructing and grading the existing design rather
than designing a new one (P4 becomes a reconstruction) — skips the behavior-writing steps P5–P6, and grades
read-only at P7–P8, editing nothing unless the user authorizes a fix.

### P1 — Study and lock the task

Make the task concrete and study everything the design must fit, before designing anything (`coding` P1 /
gobbi P1, P4). Lock **What / Why / How**, in-scope and out-of-scope, and the success criteria with the user,
or cite an already-locked Scope Contract when one exists (gobbi P4, P5). Read the **Python contract**:
`requires-python` and the CI version matrix; whether the target is a library, an application, a CLI, a
service, a script, or a notebook; the existing public API and its conventions; and the tool configuration —
the formatter line length, the linter rule set, the type-checker strictness — so the change matches the
settings already in force. A new project with no stated floor defaults to Python 3.12+; the artifact type
decides the entry shape (importable module + `main`, console entry point, service loop) and the packaging
obligations that surface later. Read the **surrounding code** — its patterns, naming, error-handling, and
module layout — so new code looks like it belongs, and find the proven **prior art** (in-repo first, then
adjacent libraries, then the community). Read the project rules and applicable mistakes. **Declare author vs
review mode.**
For an **edit**, map the affected set — target plus callers, tests, docs, mirrors or generated code, and
config — with CRUD + 5W1H over all of it (gobbi P9 / `coding` P15). For a **bug**, reproduce the failure and
trace it to its root cause before designing a repair (gobbi P8 / `coding` P9).

**P1 is complete when** the task is stated as What/Why/How + in/out scope + success criteria (or a cited
Scope Contract); the Python contract is known (supported runtimes, artifact type, public surface,
type-checking strictness, entry boundary, compatibility obligations); the surrounding patterns, prior art,
rules, and mistakes are read; the mode is declared; and — for an edit — the affected set is mapped, or — for
a bug — the failure reproduces and its root is named.

### P2 — Load the child docs for the forks in play

Read the specialized guidance **before** the decision it governs, not after (`coding` P1 / gobbi P1). An
ordinary typed module fires none of these — the parent floor carries the common path. Detect the active forks
in the task and read the relevant child first; re-check when the design changes; never make a load-bearing
P3/P4 decision before its active child is read.


| Read | When |
|---|---|
| `design.md` | a unit or API design decision needs depth — function-vs-class, parameter and signature shape, dataclass and class patterns, composition, data-model selection, or failure-surface design (deepens P3) |
| `convention.md` | applying the naming, formatting, docstring, import, or comment conventions needs their full mechanics (deepens P3e naming and P6) |
| `typing.md` | a change touches annotations, public API, generics, decorators, Protocols, stubs, runtime-annotation consumers, or type-checker suppressions |
| `concurrency.md` | a change starts tasks or uses async, threads, processes, executors, queues, locks, or timeouts, or shares state across them |
| `testing.md` | behavior changes, or tests are written or reviewed |
| `packaging.md` | a project, package, or CLI is created; metadata, dependencies, entry points, build, or distribution change; or a documented public API is deprecated or evolved |
| `performance.md` | performance, scale, a hot path, large data, memory, caching, or profiling is in scope |
| `interoperability.md` | code crosses into subprocess, native/FFI, the buffer protocol, serialization or a durable on-disk format, generated code, reflection, plugins, or notebook productionization |
| `evaluation.md` | grading the Python idiom of a change-set (see P8) |

The parent Rules stay the floor after a child loads. **P2 is complete when** every active trigger has its one
child loaded, and no P3/P4 design decision depends on guidance that was skipped.

### P3 — Design the units, decomposed

Design the surface as ordered design acts, not one flat construct-pick (`coding` P2/P3/P4) — the module, its
public boundary, the absolute acyclic import direction, the entry point, and the inert import-time boundary
are the frame these acts fill. Work the sub-steps in order; `design.md` deepens each.

**P3a — Identity and responsibility** (`coding` P4/P3). State each unit's one responsibility in a single
sentence; if the sentence needs an "and", split the unit. Run the deep-unit and shallow-wrapper check — each
unit must hide substantial work behind a simple interface, and a pass-through that forwards a call while
hiding nothing is not a unit. Pick the container with the *Function vs class* table.

| Choose | When | Evidence that changes the choice |
|---|---|---|
| a plain function | the behavior is stateless, or state is passed in and a result returned | persistent identity, invariants, or state that spans calls |
| a `dataclass` or class | invariants must hold across calls, or behavior and its state travel together | the data is only a typed interchange shape with no behavior |
| a closure / `functools.partial` | you need one configured callable, not a new type | callers need named state, inspection, or several operations |
| a module of functions + constants | the grouping is a namespace, not an instance | instances would carry meaningful independent state |

**P3b — Relationships and structure** (`coding` P3/P4). Decide how the units collaborate: composition over
deep nominal inheritance, a `Protocol` or shallow ABC for a structural boundary, the ownership of each state
set, the import direction, one authoritative home per rule or constant (`coding` P12), and the concurrency
model. Use the two tables.

| Choose | When | Avoid |
|---|---|---|
| a `Protocol` | callers pass any object with the right methods; you own neither the callers nor a base | requiring nominal inheritance from implementations you do not own |
| an ABC | you want a shared base with some concrete behavior and an explicit subclass/`register` contract | an ABC used only to satisfy a type checker |
| concrete inheritance | there is a genuine is-a with shared implementation and a documented subclass API | a base whose init or override contract is implicit |
| composition | you need another object's behavior but not its identity — hold it as an attribute | a deep hierarchy with cross-cutting overrides |

| Choose | When | Required design evidence |
|---|---|---|
| synchronous | the work is CPU-light and sequential; there is no waiting to overlap | no concurrency overhead or lifetime model is needed |
| async (`asyncio`) | many I/O-bound waits to overlap in one thread, and the call path is async end to end | async APIs end to end; one event-loop boundary; bounded tasks |
| threads | blocking or GIL-releasing calls (a C extension, blocking I/O in a synchronous library) | thread-safe collaborators; explicit shutdown and timeouts |
| processes | CPU-bound work that must run in parallel past the GIL | a serializable boundary; startup and copy cost justified by measurement |

**P3c — Contracts and verification seams** (`coding` P2/P6). Sketch every public and cross-unit interface
**before any body**: its name, inputs, outputs, ownership and mutability of the result, errors, side effects,
sync-vs-async behavior, and invariants. Design the **test seam** into the same sketch — separate the pure
decision core from I/O, make collaborators injectable, keep time, randomness, and concurrency controllable,
and name the observable outcome a focused check will assert. Consider a **second shape** before committing to
the first that compiles, and carry the runner-up into the P4 gate as the alternative. A completed sketch lets
a caller infer inputs, ownership, blocking-vs-async behavior, and failure categories without reading a body.

**P3d — Data and failure model** (`coding` P2/P16). With these tables, choose the data model and its identity,
mutability, equality, and ownership; EAFP-vs-validation per operation; the exception hierarchy and its
translation boundary; resource cleanup, cancellation, the logging boundary, and the boundary representation.

| Choose | When | Notes |
|---|---|---|
| plain args / return | the data is transient and local | do not name a record prematurely |
| `dataclass` | a named record of fields with behavior or invariants; `frozen=True` for a value object | use factories for mutable fields; review hash semantics |
| `TypedDict` | a typed shape over a mapping (JSON, config) that must stay a `dict` | types a `dict`; does not validate runtime input |
| `NamedTuple` | a small immutable record needing tuple/positional compatibility | avoid when tuple position is not part of the contract |
| `Enum` | a closed set of named symbolic values | keep serialized values deliberate and stable |
| a plain class | behavior and invariants dominate the data | keep construction valid and the public surface small |

| Return | When |
|---|---|
| a concrete `list`/`dict`/`set` | the caller replays, indexes, measures, or owns the result |
| a generator / `Iterator` | the sequence streams, may be large or unbounded, or is consumed once |

| Choose | When | Failure shape |
|---|---|---|
| EAFP — try the op, catch the specific exception | the operation is atomic and the failure is the exception's job (a missing key, an absent file) | one operation in `try`; catch the named expected error; success work in `else` |
| LBYL — validate first, then act | the check is the contract, the action is expensive or irreversible, or no race is possible | reject with a specific error before domain construction; a precheck aids diagnostics but does not prove success |

| Boundary | Input form | Internal form | Output rule |
|---|---|---|---|
| High-level filesystem path | `str` or `os.PathLike[str]` at the API edge | `Path` | preserve path semantics; resolve only when required |
| Persisted human text | bytes from storage or a text stream | `str` | encode and decode UTF-8 explicitly at the edge |
| Binary protocol or opaque payload | bytes-like input with documented ownership | `bytes` or an owned buffer | never decode without a named text encoding |
| Time instant | an aware `datetime` | aware UTC or a domain-required zone | serialize the zone or offset explicitly |
| Duration / deadline | a numeric duration or `timedelta` at the API | monotonic-clock arithmetic | never subtract naive wall-clock instants |

**P3e — Names for intent** (`coding` P5 / gobbi P3). Choose a deliberate, intention-revealing name for every
module, class, function, method, parameter, and meaningful variable or state field — drawn from the
references and the surrounding vocabulary. Naming is a design act done here, not a casing chore done while
typing; `convention.md` owns only the spelling and casing of the name you choose.

**P3 is complete when** every unit has a one-sentence responsibility and a hidden-complexity boundary;
relationships, ownership, and import direction are fixed; every public and cross-unit contract is sketched
with its test seam; every data shape and failure path has an owner, a lifetime, and an unambiguous mutation
or cleanup policy; and every unit, function, method, and parameter has an intent-revealing name — all before
any body exists. `design.md` deepens these choices.

### P4 — Confirm the design and names with the user

Confirm the designed surface with the user before building it (gobbi P3/P4). This is a lightweight checkpoint
that **defers to** gobbi P3/P4 — not a rebuilt negotiation engine. Present a reference-backed **design
packet**: the module tree, each unit's identity and responsibility, the relationships, the sketched
interfaces, the classes/functions/methods, the parameters, the names, the data, error, effect, and ownership
model, and the verification seams — shown as a concrete skeleton of signatures and names, not prose. Offer 2–3
reference-backed options with trade-offs and a recommendation wherever a genuine fork exists (the P3c
runner-up is one), and record explicit approval — or cite an already-explicit user decision rather than
re-asking a settled one. In the gobbi workflow this rides the DISCUSSION sub-phase. **Author mode only:** in
review mode this step is a read-only reconstruction of the existing design, graded rather than negotiated.

**P4 is complete when** the user has approved the surface — units, relationships, interfaces, names, and the
error and effect model — or an already-explicit decision is cited; in review mode, when the existing design
is reconstructed and graded without an edit.

### P5 — Build the skeleton first

Materialize the approved design before any behavior (`coding` P7 / gobbi P2). Create the module, type,
signature, and stub skeleton that matches the surface approved at P4 — modules and classes in place,
dataclass fields declared, every function and method carrying its typed parameters, return annotation, and
approved name, with bodies left as stubs and no behavior. Verify the skeleton imports cleanly and type-checks
before growing any body, so the structure is concrete and reviewable while it is still cheap to change; if it
exposes a structural defect, revise the design back through P2–P4 rather than working around it in a body.

**P5 is complete when** the skeleton matches the approved design, imports cleanly, and passes the type checker
— with no behavior body yet.

### P6 — Grow in minimal verified steps

Grow the bodies bottom-up, one verified slice at a time (`coding` P7). Start from the smallest reversible
slice — the unit whose contract the rest depends on — implement it, and **verify that slice** with its
focused check before starting the next; firm up each signature and stub as you learn what it must carry.
Apply the § Rules conventions as you write (deepened by `convention.md`): naming and exports, grouped
absolute imports and an inert import time, 88-column formatting, Google docstrings, typed signatures with
keyword-only options and sentinel defaults, direct value iteration, narrow EAFP, context-managed resources,
module-logger diagnostics, and config or CLI input parsed at the boundary. Follow the convention the
surrounding code already sets where it does not contradict a Rule. Update every affected doc, caller, and
test in the **same slice** that changes it, never "code now, docs later" (gobbi P6 / `coding` P15). Add no
error handling, abstraction, configuration, or option beyond what the contract needs, and finish every
in-scope path with no placeholder behavior; note an adjacent improvement as a follow-up rather than building
it now (`coding` P8 / gobbi P5, P10).

**P6 is complete when** every in-scope path is implemented with no placeholder behavior, each slice had fresh
focused evidence before the next began, and every affected doc, caller, and test changed in lockstep.

### P7 — Verify the whole change

Prove the whole change after the per-slice checks (`coding` P7; a bug's fix re-checked per `coding` P9 /
gobbi P8). Run the checks in this fixed order, and fix a failure before moving to the next: **format** (the
deterministic autoformatter in check mode) → **lint** (import, naming, broad-except, and security smells) →
**type-check** (a strict checker: complete signatures, no implicit `Any`, valid generics and suppressions) →
**focused tests** (the tests for the changed behavior) → **full tests** (the whole suite for regressions) →
**build** (wheel + sdist and a clean-environment install smoke test, when the change touches a distributable
package). The tool names are examples; the ordered capability is the rule. For a bug, re-run the original P1
reproducer and confirm it no longer fires.

**P7 passes only when** every applicable check exits clean on fresh output, the original bug no longer
reproduces, and the installed artifact — not only the checkout — satisfies every distribution claim.

### P8 — Review: trace to the approved design and affected set

Review on two axes and then trace the result to the approved design (`coding` P2/P5/P15, gobbi P5/P9).
Grade the language-agnostic **property** with `../coding/evaluation.md` (is the code well-designed,
well-built, well-crafted) and the Python **idiom** with `evaluation.md` (is that property expressed in good
Python); a change can satisfy the property yet read as un-Pythonic, or read as fluent Python while failing a
property. Then run the **traceability** pass: every approved design item (P4) maps to an implemented unit,
interface, or name; every scope item maps to a diff line and nothing exceeds it; every affected-set file (P1)
is consistently updated or is a justified no-op; every success criterion has fresh evidence; and no caller,
test, or doc is left stale.

**P8 is complete when** both the property and the idiom review pass, the finished code traces to the approved
design, names, scope, and affected set with no stale dependent, and every success criterion has fresh evidence.

---

## References

One owner per borrowed fact; the body states the fact and this register names its owner.

- [`coding/SKILL.md`](../coding/SKILL.md#scope--language-agnostic) — owns the language-agnostic properties of
  good software (design, construction, craftsmanship), cited as "`coding` P#", that this skill specializes
  into concrete Python idioms.
- [`principles/SKILL.md`](../principles/SKILL.md) — owns the ten gobbi behavioral principles, cited as
  "gobbi P#", that this skill's Procedure operationalizes for Python.
- [PEP 8](https://peps.python.org/pep-0008/) — the naming, layout, and import conventions.
- [Black code style](https://black.readthedocs.io/en/stable/the_black_code_style/current_style.html) — the
  88-column line-length default.
- [PEP 20](https://peps.python.org/pep-0020/) — the readability-first idiom bias.
- [PEP 257](https://peps.python.org/pep-0257/) — the docstring summary conventions.
- [PEP 484](https://peps.python.org/pep-0484/), [PEP 544](https://peps.python.org/pep-0544/),
  [PEP 585](https://peps.python.org/pep-0585/), [PEP 604](https://peps.python.org/pep-0604/),
  [PEP 612](https://peps.python.org/pep-0612/), [PEP 646](https://peps.python.org/pep-0646/),
  [PEP 695](https://peps.python.org/pep-0695/) — the type-hint model, `Protocol` structural subtyping,
  built-in generics, `X | None` unions, `ParamSpec`, `TypeVarTuple`, and native type parameters.
- [Python typing specification](https://typing.python.org/en/latest/spec/) — the gradual-typing rules and
  best practices beyond the individual PEPs.
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html) — the Google docstring
  dialect.
- *Effective Python* (Brett Slatkin, 3rd ed.) — the idiom selections for the data model, comprehensions,
  EAFP, and resource management.
- [pytest documentation](https://docs.pytest.org/) — the parametrization and fixture testing idioms.
- [Python Packaging User Guide](https://packaging.python.org/) and [PEP 621](https://peps.python.org/pep-0621/)
  — the `pyproject.toml` metadata and `src/`-layout packaging floor.
- [asyncio documentation](https://docs.python.org/3/library/asyncio.html) — the structured-concurrency
  idioms (`TaskGroup`, `asyncio.timeout`).
- [contextlib documentation](https://docs.python.org/3/library/contextlib.html) — the `ExitStack` and
  context-manager idioms.
- [pathlib documentation](https://docs.python.org/3/library/pathlib.html) — the high-level path-handling
  idiom.
- [Python security considerations](https://docs.python.org/3/library/security_warnings.html) and
  [secrets](https://docs.python.org/3/library/secrets.html) — the trust-boundary primitives (subprocess,
  serialization, security material).
