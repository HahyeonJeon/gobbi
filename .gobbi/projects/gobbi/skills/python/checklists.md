# Python — Implementation Checklist Register

A copyable binary PASS/FAIL register for a Python implementation change-set. The evaluator copies the
activated items into the phase checklist's `## Prepared Baseline Additions` and ticks each against the diff; the
executor runs them as a Procedure step P8 self-review. Tick a box when resolved and annotate PASS or
FAIL. This register deepens, it does not restate: every item carries a `SKILL.md` anchor (`H{n}` = a
hard invariant, `final P{n}` = a final principle) that resolves to its verbatim clause through
`evaluation.md`'s rule-key legend; nothing is checked that `SKILL.md` does not teach. Each item is ONE
atomically-answerable question naming its general subject and its special cases, so no source hazard is
narrowed. Groups: Hard invariants · Design judgment · Operation & evidence; the split-out hard checks
continue at `PY-CHECK-16`–`PY-CHECK-24` and a performance-idiom check at `PY-CHECK-25`, after the
operation group, so `PY-CHECK-09`–`PY-CHECK-15` stay stable for the seed scenarios that cross-reference
them.

## Hard invariants

- [ ] `PY-CHECK-01` — PASS if code and every declaring surface agree with the declared minimum Python
  version; FAIL if syntax, stdlib use, the checker target, the CI matrix, or `requires-python`
  contradicts it. *(H1)*
- [ ] `PY-CHECK-02` — PASS if imports only bind definitions and executable behavior enters through an
  explicit callable or `__main__` gate; FAIL if import time does required I/O, opens a connection,
  spawns work, parses CLI args, or configures root logging. *(H2)*
- [ ] `PY-CHECK-03` — PASS if every mutable value is per-owner — no mutable call/dataclass default, no
  hidden mutable module global, no cross-test fixture leak; FAIL if a mutable object is shared by
  default. *(H3)*
- [ ] `PY-CHECK-04` — PASS if external validation raises explicitly and every handler catches only a
  named recoverable exception with its meaning preserved; FAIL if `assert` validates input (stripped
  under `-O`), a bare/`BaseException`/continue-on-`Exception` catch hides a defect, or a check-then-act
  race replaces scoped EAFP. *(H4, H5)*
- [ ] `PY-CHECK-05` — PASS if untrusted content is never executed or unsafely deserialized — no
  `eval`/`exec`/pickle/unsafe loader, subprocess arguments passed as a list (no `shell=True` over
  untrusted text), and `secrets` not `random` for security material; FAIL on any code-execution,
  unsafe-deserialization, shell-injection, or predictable-secret path. *(H6)*
- [ ] `PY-CHECK-06` — PASS if every resource and task has a deterministic owner that releases on every
  path (success, partial acquisition, failure) via a context manager, `ExitStack`/`AsyncExitStack`, or
  `finally`; FAIL if release relies on GC, `__del__`, shutdown, or weak references, or work outlives
  its owner unobserved. *(H9)*
- [ ] `PY-CHECK-07` — PASS if cancellation propagates, a timeout bounds every wait, the event loop is
  never blocked, fan-out bounds task creation and retained memory, shutdown is explicit, and shared
  compound state is synchronized; FAIL on a swallowed `CancelledError`, a deadline-less/unbounded await,
  blocking-loop work, an orphan task, missing shutdown, or a GIL-atomicity assumption. *(H12)*
- [ ] `PY-CHECK-08` — PASS if durable writes are atomic and versioned wherever correctness depends on
  surviving interruption (write-temp, `os.replace`, `fsync` before rename, a versioned format); FAIL if
  a partial write can corrupt the next read or the format is unversioned. *(H11)*

## Design judgment

- [ ] `PY-CHECK-09` — PASS if each class has evidence that identity, invariants across calls, or
  several behaviors over owned state must travel together, and reuse is via composition or a narrow
  `Protocol`/shallow ABC (cooperative `super()` where inheritance is kept), not a deep nominal
  hierarchy; FAIL if a function plus plain data preserves the semantics with less surface (a one-method
  class, `Manager` wrapper, or getter/setter pair), or a deep inheritance chain stands in for
  composition. *(final P3)*
- [ ] `PY-CHECK-10` — PASS if the data model was chosen by caller semantics with alternatives still
  open (`dataclass` for named value state, `TypedDict` for an interchange mapping, `NamedTuple` for
  positional compatibility, `Enum` for a closed set, a plain class for behavior-and-invariants), and a
  value object's equality and hash are consistent with it immutable where hashed; FAIL if one form is
  treated as mandatory without its contract trigger, a stringly-typed `dict` or parallel collections
  stand in for a named shape, or `unsafe_hash` sits over mutable fields. *(data model — softened)*
- [ ] `PY-CHECK-11` — PASS if the caller-visible contract is precise — protocols and annotations
  describe the operations used, the interface is the narrowest useful one, options are keyword-only, a
  decorator or wrapper preserves the wrapped signature and metadata (`functools.wraps`,
  `ParamSpec`/return `TypeVar`), and dynamic input is validated separately; FAIL if the type is
  needlessly concrete or falsely broad, erased to `Any`/`Callable[..., Any]`, papered with a `cast`,
  hidden behind speculative `*args`/`**kwargs`, a decorator erases the wrapped signature, or the type is
  treated as the validation. *(final P4)*
- [ ] `PY-CHECK-12` — PASS if formatting, naming, docstring, property, comprehension, iteration,
  import-style, path handling, logging, layout, and dependency choices follow project convention or a
  reasoned exception, with properties and dunders kept cheap and high-level paths using `pathlib`; FAIL
  if a style default is enforced as law, a dense comprehension/lambda/walrus hides control flow,
  `range(len(...))` replaces value iteration, `os.path` string-munging replaces `pathlib`, a property or
  `__repr__`/`__eq__`/`__hash__` hides I/O, or `print` and a logger are mixed. *(style — softened)*

## Operation & evidence

- [ ] `PY-CHECK-13` — PASS if modules, public and cross-unit signatures, annotations, error shapes,
  ownership, and test seams were concrete and type-check green before any behavior body; FAIL if the
  interface fell out of finished bodies. *(final P2, final P7)*
- [ ] `PY-CHECK-14` — PASS if the implementation grew in minimal behavior slices, each with focused
  evidence at the slice; FAIL if the first evidence arrives only after a whole-feature pass.
  *(final P7)*
- [ ] `PY-CHECK-15` — PASS if every added complexity — a concurrency model, dependency,
  native/interpreter assumption, optimization, suppression, or skipped/`xfail` test — is justified by
  workload, capability-gap, profile, or a tracked reason with a re-enable, and final verification is
  fresh; FAIL if it was added on intuition, a microbenchmark backs a system claim, a suppression has no
  live reason, or only the final claim was asserted. *(final P8 — softened delivery/perf)*

## Hard invariants (continued)

- [ ] `PY-CHECK-16` — PASS if every persisted or network boundary names an explicit encoding (UTF-8),
  instants are timezone-aware, and durations use a monotonic clock; FAIL on an ambient encoding, a
  naive datetime, or a wall-clock duration. *(H10)*
- [ ] `PY-CHECK-17` — PASS if every documented public-API change is deprecated with a migration path or
  declared an explicit break; FAIL if a documented API changes silently. *(H13)*
- [ ] `PY-CHECK-18` — PASS if no code depends on `dict`/`set` iteration order in any context unless that
  order is the type's explicit, tested contract (externalized output sorted or contract-tested); FAIL
  on any reliance on incidental unordered order. *(H14)*
- [ ] `PY-CHECK-19` — PASS if a shipped distribution is built, installed, imported, and smoke-tested
  from the artifact in a clean environment, the console entry point, module `__main__`, and CLI resolve
  to one callable, and `py.typed`, `__all__`, docs, the runtime surface, package data, and extras agree
  across surfaces; FAIL if shipping is verified only from the checkout, the entry points resolve to
  different callables, or a declaration surface disagrees with what the code loads. *(H15)*
- [ ] `PY-CHECK-20` — PASS if generated code is produced only by regenerating from its owner or input;
  FAIL on any hand-edit of generated code. *(H16)*
- [ ] `PY-CHECK-21` — PASS if no method or property returns a live mutable internal container — it
  returns a copy, an immutable view (`tuple`/`frozenset`/`MappingProxyType`), or a snapshot; FAIL if a
  caller can mutate private state through a returned reference. *(H17)*
- [ ] `PY-CHECK-22` — PASS if annotations are introspected only through `inspect.get_annotations()` or
  `typing.get_type_hints()` and no blanket `from __future__ import annotations` changes a
  runtime-annotation consumer; FAIL if raw `__annotations__` (or `__dict__['__annotations__']`) is read
  or consumed. *(H18)*
- [ ] `PY-CHECK-23` — PASS if secrets, tokens, and PII are redacted from every leak surface — a repr, a
  log argument, a fixture, an exception, and a traceback — and no full untrusted payload is logged; FAIL
  if a sensitive value reaches any of those surfaces. *(H7)*
- [ ] `PY-CHECK-24` — PASS if untrusted boundary data is validated and bounded before use (`Path`
  containment against traversal, a size bound against a decompression bomb) and dynamic loading is
  gated; FAIL if boundary input is used unchecked, left unbounded, accepts newly-widened or
  less-validated input, or a dynamic load runs ungated. *(H8)*

## Operation & evidence (continued)

- [ ] `PY-CHECK-25` — PASS if collection handling uses the efficient native form — membership and
  lookup via a `set`/`dict` (not an O(n) `in list`/linear scan on growable data), a large or unbounded
  sequence streamed through a generator/iterator (not fully materialized), and an ownership-clear
  concrete return only when the caller must replay, index, measure, or own it; FAIL on a linear
  membership scan on growable data, needless full materialization, or a return that is a live internal
  container or a single-use iterator the caller cannot re-consume. *(performance idiom — softened)*

## Guaranteed coverage map

Every hard invariant `H1`–`H18` is anchored by at least one check, and every check is exercised by at
least one seed scenario in `scenarios.md`.

| Check | Anchor(s) | Seed scenario |
|---|---|---|
| `PY-CHECK-01` | H1 | `PY-SCENARIO-04` |
| `PY-CHECK-02` | H2 | `PY-SCENARIO-06` |
| `PY-CHECK-03` | H3 | `PY-SCENARIO-01` |
| `PY-CHECK-04` | H4, H5 | `PY-SCENARIO-02` |
| `PY-CHECK-05` | H6 | `PY-SCENARIO-02` |
| `PY-CHECK-06` | H9 | `PY-SCENARIO-05` |
| `PY-CHECK-07` | H12 | `PY-SCENARIO-05` |
| `PY-CHECK-08` | H11 | `PY-SCENARIO-07` |
| `PY-CHECK-09` | final P3 | `PY-SCENARIO-03` |
| `PY-CHECK-10` | data model (soft) | `PY-SCENARIO-03` |
| `PY-CHECK-11` | final P4 | `PY-SCENARIO-03` |
| `PY-CHECK-12` | style (soft) | `PY-SCENARIO-06` |
| `PY-CHECK-13` | final P2, final P7 | `PY-SCENARIO-04` |
| `PY-CHECK-14` | final P7 | `PY-SCENARIO-01`, `PY-SCENARIO-04` |
| `PY-CHECK-15` | final P8 | `PY-SCENARIO-04`, `PY-SCENARIO-05` |
| `PY-CHECK-16` | H10 | `PY-SCENARIO-07` |
| `PY-CHECK-17` | H13 | `PY-SCENARIO-07` |
| `PY-CHECK-18` | H14 | `PY-SCENARIO-07` |
| `PY-CHECK-19` | H15 | `PY-SCENARIO-07` |
| `PY-CHECK-20` | H16 | `PY-SCENARIO-07` |
| `PY-CHECK-21` | H17 | `PY-SCENARIO-08` |
| `PY-CHECK-22` | H18 | `PY-SCENARIO-08` |
| `PY-CHECK-23` | H7 | `PY-SCENARIO-02` |
| `PY-CHECK-24` | H8 | `PY-SCENARIO-02` |
| `PY-CHECK-25` | performance idiom (soft) | `PY-SCENARIO-09` |
