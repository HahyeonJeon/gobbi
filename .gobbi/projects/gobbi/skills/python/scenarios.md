# Python — Implementation Scenario Library

Good, bad, and adversarial Python implementation cases. Load only when a Python implementation task is
being evaluated, or when an executor runs a pre-handoff idiom self-check. This library deepens, it does
not restate: every case exercises a `SKILL.md` rule or principle and teaches nothing new — its
`Exercises` line anchors to hard invariants (`H{n}`) and final principles (`final P{n}`), each
resolving to its verbatim `SKILL.md` clause through `evaluation.md`'s rule-key legend, and its
`Checklist IDs` line points at the binary items in `checklists.md`. Snippets are inline; each case
describes a shape to recognize, not runnable code. Cases group under Hard invariants · Design
judgment · Bottom-up operation.

## Hard invariants

### PY-SCENARIO-01 — Mutable default leaks state
- **Axis:** Hard invariant.
- **Situation:** a function accumulates labels, or a dataclass owns a mutable collection.
- **Good handling:** `None` or a sentinel, or `field(default_factory=list)`, gives one container per
  owner; a two-call or two-instance test proves the containers stay separate.
- **Bad handling:** `def add(label, labels=[])` or `items: list[str] = []` shares one object across
  every call or instance.
- **Adversarial probe:** the single happy-path call passes — call the function twice, or construct two
  instances and mutate one, to expose the shared object.
- **Exercises:** H3, final P6.
- **Checklist IDs:** `PY-CHECK-03`, `PY-CHECK-14`.

### PY-SCENARIO-02 — Trust-boundary shortcut becomes code execution or disclosure
- **Axis:** Hard invariant.
- **Situation:** a CLI accepts a serialized cache path and a command argument, then mints a reset
  token.
- **Good handling:** the decoded data is bounded and validated; a non-executable format with a schema
  replaces `pickle`; subprocess arguments pass as a list; the token comes from `secrets`; only a named
  recoverable exception is caught; the token is redacted from repr, log, and error.
- **Bad handling:** `assert` validates the input, `pickle.loads` consumes the cache, `shell=True`
  interpolates the argument, `random` mints the token, a broad `except` treats an unexpected defect as
  a handled case, and an f-string log prints the token.
- **Adversarial probe:** run under `-O` (the `assert` vanishes), feed a malicious pickle or a shell
  metacharacter, send oversized input, and trigger a failure path that logs locals.
- **Exercises:** H4, H5, H6, H7, H8.
- **Checklist IDs:** `PY-CHECK-04`, `PY-CHECK-05`, `PY-CHECK-23`, `PY-CHECK-24`.

### PY-SCENARIO-05 — Structured async ownership and cancellation
- **Axis:** Hard invariant + evidence-earned escape.
- **Situation:** an async fan-out fetches many inputs under a deadline.
- **Good handling:** the workload justifies async; a `TaskGroup` owns the work; every wait has a
  timeout or deadline; task creation and active operations are bounded; clients use `async with`;
  `CancelledError` re-raises; blocking calls move off the loop; shutdown is explicit.
- **Bad handling:** a bare `create_task`, a deadline-less await, unbounded eager task creation, a
  swallowed `CancelledError`, a synchronous client on the loop, or a GIL-atomicity assumption.
- **Adversarial probe:** one child fails, one hangs past its deadline, the parent cancels, and the
  input count is large enough to expose retained-task memory.
- **Exercises:** H9, H12, final P6, final P8.
- **Checklist IDs:** `PY-CHECK-06`, `PY-CHECK-07`, `PY-CHECK-15`.

### PY-SCENARIO-06 — Import-time side effect and a dialect enforced as law
- **Axis:** Hard invariant + design judgment.
- **Situation:** a package module opens a DB connection, reads config, or configures root logging at
  import, and a reviewer flags an 88-column or import-style deviation as a hard failure.
- **Good handling:** imports bind definitions only; work enters through an explicit typed
  `main()`/callable; formatting, naming, and import style follow project config.
- **Bad handling:** module-level I/O runs on import; a style default is enforced as universal law over
  a reasoned project exception.
- **Adversarial probe:** import the module inside a test or a spawned subprocess and watch the side
  effect fire; point the checker at a project whose config differs from the default.
- **Exercises:** H2, softened style.
- **Checklist IDs:** `PY-CHECK-02`, `PY-CHECK-12`.

### PY-SCENARIO-07 — Durable persistence and release hygiene
- **Axis:** Hard invariant.
- **Situation:** a service persists state to a file and ships as a package.
- **Good handling:** write-temp, `os.replace`, `fsync`, and a versioned format (H11); explicit UTF-8
  encoding, timezone-aware timestamps, a monotonic deadline (H10); externalized output sorted with no
  reliance on `dict`/`set` order (H14); a documented API change deprecated with a migration path (H13);
  generated code regenerated from its owner (H16); the wheel built, clean-installed, and smoke-tested
  rather than run from the checkout (H15).
- **Bad handling:** a partial write corrupts the next read; ambient encoding, a naive datetime, a
  wall-clock duration; incidental `dict` order externalized; a silent API break; a hand-edited
  generated file; checkout-only shipping.
- **Adversarial probe:** interrupt mid-write; run on another machine, locale, or clock; reorder inputs;
  pin a downstream caller to the old API; regenerate the generated file; install the wheel in a clean
  venv.
- **Exercises:** H10, H11, H13, H14, H15, H16.
- **Checklist IDs:** `PY-CHECK-08`, `PY-CHECK-16`, `PY-CHECK-17`, `PY-CHECK-18`, `PY-CHECK-19`,
  `PY-CHECK-20`.

### PY-SCENARIO-08 — Leaked internal state and unsafe annotation introspection
- **Axis:** Hard invariant (both user-re-hardened footguns).
- **Situation:** a class exposes its collection, and a framework introspects annotations at runtime.
- **Good handling:** return a copy or an immutable view (`tuple`/`frozenset`/`MappingProxyType`)
  (H17); read annotations via `inspect.get_annotations()` or `typing.get_type_hints()` (H18).
- **Bad handling:** return `self._items` live; read raw `__annotations__`, which misreads under
  `from __future__ import annotations`.
- **Adversarial probe:** a caller mutates the returned container and corrupts private state; add
  `from __future__ import annotations` so raw annotation reads return unresolved strings.
- **Exercises:** H17, H18.
- **Checklist IDs:** `PY-CHECK-21`, `PY-CHECK-22`.

## Design judgment

### PY-SCENARIO-03 — A class that has not earned its state
- **Axis:** Design judgment.
- **Situation:** a stateless normalization is proposed as `NormalizerManager.__init__` plus one method.
- **Good handling:** begin with `normalize(record, policy) -> NormalizedRecord`; use plain typed data
  (or a `dataclass` only if a named record helps); introduce a class later only if validated state,
  identity, or several operations must persist together.
- **Bad handling:** a one-method class, getters and setters, a static-method namespace, or an
  inheritance point for hypothetical reuse.
- **Adversarial probe:** remove the instance and pass its fields as arguments — if nothing semantic is
  lost, the class was ceremony.
- **Exercises:** final P3, final P4.
- **Checklist IDs:** `PY-CHECK-09`, `PY-CHECK-10`, `PY-CHECK-11`.

## Bottom-up operation

### PY-SCENARIO-04 — Skeleton-first vertical growth
- **Axis:** Bottom-up operation.
- **Situation:** a new parser package needs an input adapter, a parser, a domain result, a CLI entry,
  and tests.
- **Good handling:** first study the declared Python contract (floor, artifact type, consumers, tool
  strictness, neighboring idioms); then materialize the package and module tree, public signatures,
  annotations, the result shape, error types, and test seams; confirm import and type-check green at
  the declared floor; then implement one parser slice with its focused test, then one boundary slice at
  a time.
- **Bad handling:** fill every body in one pass, discover the public signature after implementation,
  add tests only after the whole feature is entangled, and add a dependency or optimization from
  intuition.
- **Adversarial probe:** ask for evidence at the first structural checkpoint and after each slice — a
  single final green suite does not prove incremental growth.
- **Exercises:** H1, final P1, final P2, final P7, final P8.
- **Checklist IDs:** `PY-CHECK-01`, `PY-CHECK-13`, `PY-CHECK-14`, `PY-CHECK-15`.

### PY-SCENARIO-09 — O(n) membership and full materialization on growable data
- **Axis:** Bottom-up operation (performance idiom).
- **Situation:** a hot path tests membership against a growing collection and builds a result from a
  large or unbounded input.
- **Good handling:** membership and lookup use a `set`/`dict`; a large or one-shot input streams
  through a generator; a concrete collection is returned only when the caller must replay, index,
  measure, or own it.
- **Bad handling:** `x in big_list` inside a loop scans linearly on every iteration; `list(huge_iter)`
  materializes the whole input; a live internal list is returned where a snapshot or an iterator would
  do.
- **Adversarial probe:** grow n — the linear-scan cost and the materialized memory both blow up where a
  `set` lookup and a generator stay flat.
- **Exercises:** final P8, softened performance.
- **Checklist IDs:** `PY-CHECK-25`, `PY-CHECK-12`, `PY-CHECK-15`.

## Candidate additional cases

One-line cases that reuse an existing hazard as a discriminator, none duplicating a seed above: a
secret in `__repr__` or a log (H7); a resource closed only on the happy path (H9); a synchronous call
blocking the event loop (H12); a `range(len(...))` index loop where value iteration reads clearer
(softened); a signature-erasing decorator missing `ParamSpec` / `functools.wraps` (final P4); a
`dict[str, Any]` where a `dataclass` fits the semantics (data model — softened).
