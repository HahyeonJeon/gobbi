# Python — Idiom Review Frame

Child doc for the evaluator reviewing a Python change-set for **idiom** quality. It is the Python-specific
companion to [`../coding/evaluation.md`](../coding/evaluation.md): that frame grades the language-agnostic
**property** of good code; this frame grades whether the property is expressed in idiomatic Python 3.12. A
change can satisfy a property yet express it in un-Pythonic code, or read as fluent Python while failing a
property — so both frames are read, and each perspective is graded against both.

Two concrete property-vs-idiom pairs:

- **Usage** — `coding` asks "can a fresh caller use the unit from its signature and doc alone?"; `python`
  asks "does the signature express that *in Python* — descriptive `snake_case` names, keyword-only options,
  precise `list[str]` / `X | None` annotations, a Google `Raises:` section, and no speculative `**kwargs`?"
- **Risk** — `coding` asks "is untrusted input validated at the boundary?"; `python` asks "is it validated
  by an explicit check that raises (never a bare `assert`, which `-O` strips), with subprocess arg-lists over
  `shell=True`, `secrets` over `random`, and no `pickle` / `eval` on untrusted data?"

The frame is loaded through the parent skill's P5 router (`evaluation.md` — *when grading the Python idiom of
a change-set*) and applied at P8, where the reviewer reads both this frame and `../coding/evaluation.md`. It
grades the idiom at the **Python 3.12** floor and is tool-agnostic: any formatter, linter, or type checker
named below is an example, not a locked command.

Every graded scenario cites the parent skill's own teaching **rule or principle by a short key** — "the
EAFP rule", "the context-manager rule", "the immutable-default rule". These keys are this frame's shorthand,
not literal headings: `python/SKILL.md` states its rules as bullets under `### Must-Follow` and
`### Must-Not-Follow`, so each key resolves to that rule's verbatim opening clause through the
[Rule keys](#rule-keys) legend below. The frame keys by rule, never by a principle number
(`../coding/evaluation.md` numbers `coding`'s P1–P16; the `python` skill does not number its rules).
Scenarios are drawn from the parent design's fifteen seed scenarios (`S1`–`S15`) and include adversarial
probes, so Stage 2 walks each frame once without a separate adversarial pass. Nothing is graded that the
parent skill does not teach.

---

## Contents

- [Project](#project) — the Python approach fits the runtime, artifact type, and consumers
- [Structure](#structure) — modules, data models, protocols, and lifetimes are shaped idiomatically
- [Performance](#performance) — iteration, data structure, and concurrency idioms backed by evidence
- [Aesthetics](#aesthetics) — reads like one disciplined Python codebase
- [Usage](#usage) — the API is usable from its signature, annotations, docstring, and exception surface
- [Consistency](#consistency) — conventions and declarations agree across source, tests, metadata, runtime
- [Risk](#risk) — the Python footguns that fail silently, leak, race, or run hostile input
- [Overall](#overall-stage-3--python-specific-anchors) — four Python-specific holistic questions + preserve-list
- [Recommended verifications](#recommended-verifications-idiom-level) — the idiom-level capability table
- [Rule keys](#rule-keys) — each scenario key → the parent rule's verbatim opening clause

---

## Rule keys

Every scenario key below resolves to the parent rule or principle's verbatim opening clause in
[`SKILL.md`](SKILL.md) — the locator, not the whole rule (the full rule, with its rationale and fix, stays
owned by the parent). Two keys may resolve to one parent rule when they name different clauses of it. This
legend is what makes the parent-to-child trace resolvable without a literal heading.

| Key (this frame) | Resolves to — the opening clause in `SKILL.md` |
|---|---|
| the protocol-first principle | Principle: "Speak Python's protocols, not another language's ceremony." |
| the lifetime-in-syntax principle | Principle: "Make ownership and lifetime visible in the syntax." |
| the values-over-mutation principle | Principle: "Prefer values and transformations over shared mutation." |
| the standard-vocabulary principle | Principle: "Use the standard vocabulary until evidence earns an escape." |
| the Python-floor rule | "MUST honor one declared Python floor" |
| the formatting rule | "MUST format with one deterministic autoformatter at 88 columns and 4-space indents" |
| the naming rule | "MUST use PEP 8 naming with a leading underscore for internal names" |
| the import-safety rule | "MUST keep imports explicit, grouped, absolute, and import-safe" |
| the __main__-gate rule | "MUST gate executable behavior behind `if __name__ == "__main__"`" |
| the docstring rule | "MUST write Google-style docstrings on public modules, classes, functions, and methods" |
| the typing rule | "MUST annotate every maintained signature and exported value" (+ the narrow-`Any`-at-the-boundary and coded-suppression clauses) |
| the immutable-default rule | "MUST use immutable defaults and keyword-only optional behavior" (immutable-default clause) |
| the keyword-only rule | "MUST use immutable defaults and keyword-only optional behavior" (keyword-only clause) |
| the narrowest-interface rule | "MUST accept the narrowest useful interface and return an ownership-clear value" |
| the data-model-selection rule | "MUST accept the narrowest useful interface and return an ownership-clear value" (the select-the-data-model-by-semantics clause) |
| the composition-over-inheritance rule | "MUST prefer composition and protocols over deep nominal inheritance" |
| the comprehension rule | "MUST keep a comprehension to one transform plus at most one filter" |
| the iterate-over-values rule | "MUST iterate over values, not indices" |
| the EAFP rule | "MUST scope EAFP to the single operation expected to fail and preserve exception meaning" |
| the context-manager rule | "MUST use a context manager for deterministic resource lifetime on every path" |
| the I/O-boundary rule | "MUST make I/O boundaries explicit" |
| the logging rule | "MUST log through a module-level logger with parameterized messages" |
| the concurrency-model rule | "MUST choose the concurrency model from the workload and give it structured ownership" |
| the untrusted-data rule | "MUST validate untrusted data before use and choose safe primitives" |
| the testing rule | "MUST test behavior across golden, edge, failure, and adversarial cases" |
| the packaging rule | "MUST ship a distributable project from a `src/` layout with a `pyproject.toml`" |
| the performance-measurement rule | "MUST base a Python performance change on measurement, and prefer a better built-in or data structure to hand-tuned code" |
| the interoperability-isolation rule | "MUST isolate and document any CPython, operating-system, or native assumption" |
| the runtime-annotation rule | "NEVER add `from __future__ import annotations` as boilerplate, and NEVER read or mutate raw `__annotations__`" |
| the no-mutable-default rule | "NEVER use a mutable default argument or a mutable dataclass field default" |
| the no-bare-except rule | "NEVER use a bare `except`, catch `BaseException` in ordinary logic, or catch `Exception` just to continue…" |
| the no-assert-on-input rule | "NEVER use `assert` to validate external input" |
| the no-unsafe-deserialization rule | "NEVER `eval`/`exec` untrusted text, unpickle or otherwise unsafely deserialize untrusted data, build a shell command from untrusted text or default `shell=True`, or use `random` for security material" |
| the no-secret-leak rule | "NEVER let a secret, token, or PII reach a Python leak surface" |
| the no-getter-setter rule | "NEVER expose a public catch-all `*args`/`**kwargs` for speculative compatibility, and NEVER write manual getter/setter methods by habit" |
| the no-expensive-dunder rule | "NEVER hide expensive or failure-prone work behind a `property`, `__repr__`, equality, hashing, or another special method" |
| the no-dense-comprehension rule | "NEVER compress nested transforms, exception handling, an assignment side effect, or several rules into one comprehension, lambda, or conditional expression" |
| the no-live-internal-container rule | "NEVER return a live mutable internal container" |
| the no-gc-cleanup rule | "NEVER rely on garbage collection, `__del__`, interpreter shutdown, or weak references for required cleanup or durability" |
| the no-swallowed-cancellederror rule | "NEVER swallow a `CancelledError`, launch an unobserved fire-and-forget task, block the event loop, or assume the GIL makes a compound operation atomic…" |

---

## Project

**Lens**: Does the change use a Python approach that fits its **declared runtime, artifact type, and consumer
surface** — no foreign ceremony over a simpler protocol, no dependency the stdlib already covers, no silent
narrowing to one interpreter, OS, or the checkout?

### Seed scenarios with attached checklists

**A public parse-a-config-file API fits a library's shape (S1) — the import-safety rule, the Python-floor rule, the standard-vocabulary principle**
- The entry/import shape fits the artifact type: an importable module with no required I/O, connection, or CLI parsing at import time.
- The declared `requires-python` floor is honored — syntax and stdlib use are valid at 3.12, not silently dependent on a newer feature.
- A stdlib capability (`pathlib`, `tomllib`) is used where it serves; no third-party dependency is added for a job the stdlib already expresses clearly.

**A three-stage read-decompress-parse pipeline picks its model from the workload, not the author's word "async" (S8) — the concurrency-model rule, the standard-vocabulary principle**
- The approach fits the runtime and the work: I/O-bound stages use async or threads, CPU-bound stages use processes; one model is not forced across every stage.
- No stage relies on the GIL for correctness, and the CPU stage is not left on the event loop where it stalls the I/O it shares with.
- Any lower-level or CPython-specific technique is justified by profiling, compatibility, or interoperability evidence — not by intuition.

**A library-plus-CLI is built as a distributable artifact, not a checkout (S12) — the packaging rule, the Python-floor rule**
- The artifact type (a distributable package) drives the shape: a `src/` layout with a `pyproject.toml` whose `requires-python` agrees with the declared floor.
- Package data, entry points, optional-feature extras, and the `py.typed` marker are declared, not assumed to travel with the source tree.
- The distribution claim is checked against the built wheel and sdist in a clean environment — not only against the source checkout.

**Foreign ceremony or a needless dependency stands in for a simpler protocol (adversarial) (S13, S8) — the protocol-first principle, the standard-vocabulary principle**
- A `Manager` / adapter wrapper, a nominal-only interface, or an imported framework layer is checked against the plain function, `dataclass`, `Protocol`, or iterator that would express the same intent natively.
- A new runtime dependency is checked for a real capability gap (a mature parser, a cryptographic primitive) rather than a few lines the stdlib already covers.

### Recommended verifications

| Tool | Use for |
|---|---|
| Read `requires-python` / CI matrix against the syntax and stdlib the change uses | Detect a runtime-floor claim the code contradicts |
| Read the entry / import shape against the stated artifact type (lib / CLI / service / script / notebook) | Confirm the shape fits the consumer surface |
| Check each new import against the manifest and the stdlib | Detect a dependency added for a stdlib-covered capability |
| Install the built artifact into a clean environment and import it | Detect silent reliance on the checkout |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Transliterated ceremony** | A Java/C# structure ported wholesale reads as decode-work to a Python reader. Reach for the protocol Python already defines |
| **A dependency for a stdlib job** | A third-party package added to save a few stdlib lines is pure supply-chain cost. Use the stdlib when it suffices; take the dependency only for a real capability |
| **"Works on my machine / my checkout"** | Code validated only on the author's interpreter or source tree hides a floor or packaging break. Test the declared minimum and the installed artifact |

---

## Structure

**Lens**: Are the **modules, imports, data models, protocols, and object lifetimes** shaped idiomatically —
semantics-fit data models, composition over deep inheritance, deliberate exports, owned mutable state, and
decorators that preserve typed metadata?

### Seed scenarios with attached checklists

**The data model is selected by semantics (S14) — the data-model-selection rule**
- The model matches the meaning across every case the seed names: behavior-and-invariants → a plain class; named value state → a `dataclass`; a typed interchange mapping → a `TypedDict`; a closed symbolic set → an `Enum`; positional-tuple compatibility → a `NamedTuple`.
- No stringly-typed `dict` record stands in for a named shape, and no parallel collections encode what one record should hold.

**An immutable value object is shaped for safe identity, comparison, and caching (S2) — the immutable-default rule, the no-expensive-dunder rule, the values-over-mutation principle**
- The record is `frozen=True` (or otherwise immutable), with a `default_factory` for any mutable field rather than a shared mutable default.
- Equality and hashing are deliberate and consistent (no `unsafe_hash` over mutable fields), and no `__repr__`, `__eq__`, `__hash__`, or `property` hides I/O or failure-prone work.

**A typed retry/timing decorator preserves the caller's contract (S5) — the typing rule, the protocol-first principle**
- The wrapped signature survives: PEP 695 / `ParamSpec` plus a return type-var and `functools.wraps` keep the name, parameters, and return type visible to callers and the type checker.
- The decorator does not erase the contract to `Callable[..., Any]`, and no `cast` papers over a real type mismatch it introduces.

**A dynamic set of resources is opened and released with ownership visible in the syntax (S9) — the context-manager rule, the lifetime-in-syntax principle**
- The resource set is owned by `ExitStack` / `AsyncExitStack` with register-on-acquire, so ownership and teardown order are written into the syntax.
- Cleanup does not depend on accumulating handles in a list closed only on the happy path.

**A Java/C#-transliterated module is refactored to native protocols (S13) — the protocol-first principle, the composition-over-inheritance rule, the no-getter-setter rule**
- Manual getter/setter pairs, a `Manager` wrapper that hides nothing, nominal-only interfaces, and `range(len(...))` index loops are flagged for a `dataclass`, `property`, `Protocol`, iterator, or plain function.
- Ceremony is not accepted as "good OOP"; the change reads as one Python author, not a port.

**A deep inheritance chain or a leaked internal container hides the real shape (adversarial) (S13, S2) — the composition-over-inheritance rule, the no-live-internal-container rule**
- A deep nominal hierarchy built for reuse is checked against composition plus a `Protocol` or shallow ABC; a public subclass API, if kept, is documented with cooperative `super()`.
- No method or property returns a live mutable internal container that lets a caller mutate private state through the reference.

### Recommended verifications

| Tool | Use for |
|---|---|
| Read each new record against the data-model decision table (class / dataclass / TypedDict / Enum / NamedTuple) | Detect a semantics-mismatched or stringly-typed model |
| `grep` for circular-import patterns and read the import direction across the change | Confirm cohesive modules with acyclic, one-directional imports |
| `inspect.signature` a decorated callable; read `__all__` and the export surface | Confirm decorator metadata survives and exports are deliberate |
| Trace whether any returned container aliases private state | Detect a leaked live internal container |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **A stringly-typed record** | A `dict[str, Any]` standing in for a named shape loses every invariant and annotation. Pick the data model that matches the semantics |
| **A signature-erasing decorator** | `Callable[..., Any]` throws away the caller's contract. Preserve the wrapped signature with `ParamSpec` + `functools.wraps` |
| **Inheritance for reuse** | A deep hierarchy couples every subclass to the base's internals. Hold collaborators by composition; reach for a `Protocol` before a base class |

---

## Performance

**Lens**: Is the change **efficient enough in idiomatic Python** — the right iteration, data structure, and
concurrency idiom, with any complexity-increasing change backed by a profile of a representative workload?

### Seed scenarios with attached checklists

**Collection transforms, including streaming a million rows, use the right iteration idiom (S3) — the comprehension rule, the iterate-over-values rule, the performance-measurement rule**
- Iteration is over values, using `enumerate`, `zip`, and unpacking rather than `range(len(...))` and manual index bookkeeping.
- A comprehension stays one transform plus at most one filter; a denser transform is a loop, and a large or one-shot sequence streams through a generator instead of full materialization.
- Membership tests use a `set` or `dict`, not a linear scan; a concrete collection is returned only when the caller must replay, index, measure, or own it.

**A read-decompress-parse pipeline matches each stage's idiom to I/O-vs-CPU, with evidence (S8) — the concurrency-model rule, the performance-measurement rule**
- Each stage is measured before the model is chosen: async or threads for the I/O-bound stages, processes for the CPU-bound parse; the choice is not "make it all async".
- Fan-out bounds task creation and retained memory, not only concurrent entry: a `Semaphore` alone caps active operations while a producer can still create and hold one task/future per input, so bounding memory needs a bounded work queue, streaming, or a pull-based worker pool — and no stage leans on the GIL as synchronization.

**An optimization trades clarity for an unmeasured gain (adversarial) (S3, S8) — the performance-measurement rule, the standard-vocabulary principle**
- Any code-complicating optimization cites a profile of the target workload; the clear form stands until a measurement identifies the real hot path.
- A microbenchmark is not cited for a system-level claim; the benchmark is taken at the level of the claim.

### Recommended verifications

| Tool | Use for |
|---|---|
| Trace the worst-case input through the hot path and state its big-O | Detect an accidental quadratic or a linear membership scan on growable data |
| `grep` loops for per-iteration I/O and for full materialization where a generator would stream | Detect N+1 calls and needless materialization |
| Read the concurrency model against each stage's I/O-vs-CPU character | Detect one model forced across mismatched stages |
| Confirm each complexity-increasing optimization cites a representative-workload profile | Detect optimization from intuition alone |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Index-loop habit** | `for i in range(len(xs))` is a C-style habit Python's iteration protocol makes unnecessary. Iterate over values with `enumerate` / `zip` |
| **One concurrency model for every stage** | "Make it async" over a CPU-bound stage stalls the loop and grows futures unbounded. Match the model to the workload and bound the fan-out |
| **Unmeasured cleverness** | A dense inner loop that complicates the code for an unprofiled gain is waste. Keep the clear form until a profile justifies the complex one |

---

## Aesthetics

**Lens**: Does the change read like **one disciplined Python codebase** — deterministic formatting, PEP 8
naming, explicit imports, Google docstrings that add what the signature cannot, and idioms that clarify
rather than compress?

### Seed scenarios with attached checklists

**A public parse-config API reads native (S1) — the docstring rule, the naming rule, the formatting rule**
- The Google-style docstring states behavior, parameters, returns, raised exceptions, side effects, and constraints — and does not restate the annotations.
- Names follow PEP 8 (`snake_case` functions, `PascalCase` classes, `UPPER_CASE` constants, `Error`-suffixed exceptions) and stay true after any behavior change.
- The diff passes the deterministic autoformatter at 88 columns / 4 spaces, with no hand-tuned layout churn mixed into the behavior change.

**Collection transforms clarify rather than compress (S3) — the comprehension rule, the no-dense-comprehension rule**
- Each comprehension reads at a glance (one transform, at most one filter); a three-level or side-effecting comprehension is turned back into a named loop.
- Imports are explicit and grouped with no wildcard, so each name's origin is visible.

**A typed decorator stays readable through its wrapping (S5) — the naming rule, the no-dense-comprehension rule**
- `functools.wraps` keeps the wrapped name and docstring truthful, so the decorated unit does not read as an anonymous wrapper.
- No nested transform, exception handling, or several rules are compressed into one lambda or conditional expression.

**A neat idiom compresses control flow a reader must decode (adversarial) (S3, S5) — the no-dense-comprehension rule, the docstring rule**
- A walrus, pattern-match, or comprehension is used only where it clarifies; one that folds the common and exceptional paths into a single dense expression is unfolded.
- Comments explain the Python surprise (the rationale, the constraint), not a narration of what the line plainly does.

### Recommended verifications

| Tool | Use for |
|---|---|
| Run the formatter in check mode over the diff | Detect non-deterministic or hand-tuned layout |
| Read names at call sites for PEP 8 conformance and post-change accuracy | Detect stale or convention-breaking names |
| `grep` for wildcard imports and dense multi-clause comprehensions | Detect namespace pollution and compression that hides control flow |
| Check each comment against the code it sits above | Detect what-narration instead of a why |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **A docstring that restates the types** | Repeating the annotations adds nothing. Document behavior, raises, side effects, and constraints the signature cannot show |
| **A three-level comprehension** | Density there hides the control flow a reader must trace. Name the intermediate steps as an ordinary loop |
| **A wildcard import** | `from module import *` hides each name's origin and pollutes the namespace. Import names explicitly and list the public surface in `__all__` |

---

## Usage

**Lens**: For the **next caller** — can they use each changed unit from its signature, annotations,
docstring, and exception surface alone, with ownership, blocking-vs-async, and failure categories all
explicit?

### Seed scenarios with attached checklists

**A parse-config API is usable from its signature alone (S1) — the keyword-only rule, the typing rule, the docstring rule, the no-getter-setter rule**
- Optional behavior (a strict mode, flags, timeouts) is keyword-only with intention-revealing names, so no bare positional boolean appears at the call site.
- Parameters and the return value carry precise annotations (`Path`, `list[str]`, `X | None`) with no `Any` leak, and the docstring's `Raises:` names the stable exception category a caller can branch on.
- No speculative `*args` / `**kwargs` catch-all hides the real contract.

**A typed decorator keeps the caller's contract visible (S5) — the typing rule**
- A caller sees the wrapped unit's real parameters and return type through the decorator; the type checker still enforces the signature.
- No `Any` erasure and no `cast` hide a mismatch the caller would hit at runtime.

**A runtime-annotation consumer stays usable across the version matrix (S6) — the runtime-annotation rule, the typing rule**
- Annotations are read through supported helpers (`inspect.get_annotations`, `typing.get_type_hints`), never raw `__annotations__`, so the consumer works across 3.12→3.14.
- No blanket `from __future__ import annotations` is added that silently changes how a framework reading annotations at runtime behaves.

**The chosen data model exposes a usable surface (S14) — the data-model-selection rule, the narrowest-interface rule**
- Fields are named where position is not part of the contract; the public surface is inferable without reading the implementation.
- The unit accepts the narrowest useful interface (`Iterable`, `Sequence`, `Mapping`, path-like) and returns a value whose ownership and mutability are clear.

**Correct use depends on a hidden call-order, ambient global, or a falsely-typed interface (adversarial) (S1, S14) — the narrowest-interface rule, the keyword-only rule**
- A first-time caller is simulated from each new signature and docstring alone; if correct use depends on a module-level global, import-time setup, or another Python-side precondition the annotations and docstring do not express, the interface is flagged incomplete.
- An accepted interface is checked for being neither needlessly concrete (a `list` demanded where `Sequence` works) nor falsely broad (an `Iterable` accepted where the body needs to index or replay).

### Recommended verifications

| Tool | Use for |
|---|---|
| Simulate a first-time caller from each new signature + docstring | Detect call-site fragility and hidden-precondition reliance |
| Read the annotations and the docstring `Raises:` for each exported unit | Confirm the contract and error categories are visible without the body |
| `inspect.signature` a decorated or wrapped callable | Confirm the caller-visible contract survives |
| Read each runtime-annotation access against the supported helper | Detect raw `__annotations__` use that breaks across versions |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **A positional boolean flag** | `f(data, True)` tells the reader nothing about which mode it sets. Make flags and options keyword-only with clear names |
| **An `Any` in a public signature** | `Any` erases the caller's contract and spreads silently. Narrow to a precise type at the boundary |
| **A hidden call-order** | A unit correct only after an undocumented setup call is a trap. Surface the requirement in the interface |

---

## Consistency

**Lens**: Do **conventions and declarations agree across source, tests, metadata, and runtime** — one Python
floor, one docstring dialect and line length and typing profile, entry points that name the same callable,
tests that import the installed artifact, and every suppression carrying a live reason?

### Seed scenarios with attached checklists

**A library-plus-CLI keeps its declarations in agreement (S12) — the packaging rule, the __main__-gate rule**
- The console entry point, the module `main`, and the CLI invocation all resolve to the same callable.
- The `py.typed` marker, `__all__`, the public docs, and the runtime surface agree; declared package data and extras match what the code loads.
- Tests import the installed artifact, not the checkout, so an undeclared dependency or data file surfaces before release.

**A test matrix stays consistent with the declared floor (S11) — the testing rule, the runtime-annotation rule**
- The matrix runs the minimum and the latest supported version, consistent with `requires-python`.
- Every skipped or `xfail` test carries a tracked reason and a falsifiable re-enable condition, so a silently disabled test cannot hide a regression.

**A runtime-annotation consumer keeps one annotation model across versions (S6) — the runtime-annotation rule**
- The annotation-evaluation approach is consistent across the 3.12→3.14 matrix, tested at the minimum and the latest.
- No future-import or raw `__annotations__` access makes one version behave differently from another.

**A library's logging and diagnostics follow one convention (S15) — the logging rule**
- Diagnostics go through a module-level logger with parameterized messages everywhere, not `print` in one place and a logger in another.
- The library configures no root logging, leaving that to the application, consistently across its modules.

**A suppression, skip, or compat branch has no live reason, or the Python floor disagrees across surfaces (adversarial) (S11, S12) — the Python-floor rule, the typing rule**
- Each type-ignore, `xfail`, and compatibility branch is checked for a coded reason and a removal condition tied to the support floor.
- The declared floor is cross-read across `pyproject.toml`, the CI matrix, the tool configuration, the docs, and the code; a disagreement is flagged, not assumed harmless.

### Recommended verifications

| Tool | Use for |
|---|---|
| Read the Python floor across `pyproject.toml`, CI, tool config, docs, and code | Detect a floor that disagrees between surfaces |
| Trace the entry point, module `main`, and CLI to their target callable | Confirm they resolve to one callable |
| Diff the Python declaration surfaces that must co-change — `py.typed`, stubs, `__all__`, docstrings, entry points, `pyproject.toml` metadata | Detect a Python declaration left stale when the code it describes changed |
| `grep` for `type: ignore`, `xfail`, `skip`, and compat branches without a reason | Detect suppressions with no live justification |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **A floor that disagrees between surfaces** | A `requires-python` that the CI matrix or the syntax contradicts ships code that breaks on the declared minimum. Make every surface agree |
| **A silently skipped test** | A skip with no tracked reason hides a regression behind a green run. Annotate the skip with its reference and re-enable condition |
| **Tests that import the checkout** | Code that imports fine from the source tree can fail after a wheel install. Import the installed artifact in the test |

---

## Risk

**Lens**: Which **Python footgun** makes this change fail silently, leak a resource, race, execute hostile
input, or behave differently off the author's machine?

### Seed scenarios with attached checklists

**A CLI takes untrusted archive paths, command args, and a serialized cache and mints a reset token (S10) — the untrusted-data rule, the no-unsafe-deserialization rule, the no-secret-leak rule, the no-assert-on-input rule**
- Untrusted input is validated and bounded at the boundary by an explicit check that raises — never a bare `assert`, which `-O` strips; archive extraction enforces `Path` containment against traversal and a size bound against a decompression bomb.
- Subprocess arguments are passed as a list (no `shell=True` on untrusted text); no untrusted data is `pickle`-loaded, `eval`-ed, or `exec`-ed; security material is drawn from `secrets`, not `random`.
- No secret, token, or PII reaches a leak surface — a `__repr__`, an f-string log argument, a fixture, or an exception's traceback.

**A shared cache lookup distinguishes miss from corrupt from concurrent eviction (S4) — the EAFP rule, the no-bare-except rule**
- Only `cache[key]` sits in the `try`, catching the specific `KeyError`, with the success work in `else`; there is no `if key in cache` then `cache[key]` check-then-act race.
- A broad handler does not treat an unexpected defect (corruption, an eviction race) as a plain cache miss.

**An async fan-out with a deadline survives one failure, one hang, and a parent cancellation (S7) — the concurrency-model rule, the no-swallowed-cancellederror rule, the context-manager rule**
- Tasks are owned by a `TaskGroup` with `asyncio.timeout`, and the fan-out bounds task creation and retained memory (a `Semaphore` alone caps concurrent entry, not the number of tasks/futures held); each client is an async context manager, so a partial failure still releases every resource.
- `CancelledError` is re-raised, never swallowed; no orphan `create_task` runs unobserved; no synchronous client blocks the event loop.
- Shutdown, timeouts, and synchronization are explicit: shared state touched by concurrent tasks is guarded by a lock, a queue, or immutability, and no compound operation assumes the GIL makes it atomic.

**A dynamic set of acquisitions fails on the fifth and unwinds in reverse (S9) — the context-manager rule, the no-gc-cleanup rule, the EAFP rule**
- `ExitStack` / `AsyncExitStack` registers each resource on acquisition, so a failure at #5 releases #1–#4 in reverse without relying on GC or `__del__`.
- A cleanup exception does not erase the original failure; exception meaning and traceback are preserved.

**Shared, global, and internal mutable state is contained (S2, S11) — the no-mutable-default rule, the no-live-internal-container rule, the testing rule**
- No mutable default argument or mutable dataclass field default is shared across calls.
- No hidden mutable module global carries state between calls; module-level state is avoided or explicitly owned with a visible mutation boundary.
- No autouse or session-scoped test fixture leaks mutable state across tests.
- No method or property returns a live internal container a caller can mutate through the reference.

**Behavior does not depend on the author's machine (S10, S12) — the I/O-boundary rule, the interoperability-isolation rule**
- Persisted and network boundaries specify an explicit text encoding (UTF-8); high-level path work uses `pathlib.Path`; instants are timezone-aware and durations are measured on a monotonic clock.
- Subprocess calls pass an argument list, and any CPython, operating-system, or native assumption sits behind a documented adapter with a pure-Python reference where feasible — not baked into ordinary code.

**A runtime-annotation consumer introspects safely (S6) — the runtime-annotation rule**
- Annotations are read through supported helpers, not raw `__annotations__` that may hold strings or unresolved forms; no blanket future-import changes a framework's runtime behavior.

**A distributable package builds and installs from a clean environment (S12) — the packaging rule**
- The wheel and sdist install into a clean environment with no undeclared data or dependency, and the entry points smoke-test from the install.

**A library's logging leaks no sensitive or high-cardinality payload (S15) — the no-secret-leak rule, the logging rule**
- No secret, token, PII, or full untrusted payload is logged; values pass as logging arguments, not pre-formatted f-strings; the library does not hijack the consumer's root logging.

**A "small cleanup" silently widens a Python trust boundary (adversarial) (S10, S4) — the untrusted-data rule, the no-assert-on-input rule, the no-unsafe-deserialization rule**
- Any change touching a Python trust mechanism — a `pickle` / `eval` / `exec` call, a `subprocess` invocation, an input parser, or a swap of an explicit `raise` for a strippable `assert` — is reviewed against the prior trust surface, even when it looks like cleanup.
- A boundary that newly deserializes untrusted data, drops a bound, or accepts wider or less-validated input is flagged, not waved through as a refactor.

### Recommended verifications

| Tool | Use for |
|---|---|
| `grep` for `pickle` / `eval` / `exec` / `shell=True` / `random` on any untrusted path, and `assert` on external input | Audit the injection, deserialization, and validation surface |
| `grep` for bare `except`, `except Exception:` used to continue, and swallowed `CancelledError` | Detect broad catches and lost cancellation |
| Trace every resource-acquiring path for a context manager or `ExitStack` on the failure branch | Confirm deterministic release on every path, not just the happy one |
| `grep` for secrets in `__repr__`, log f-strings, and fixtures; install the wheel in a clean env | Detect secret leaks and undeclared-dependency build breaks |
| `grep` for mutable module globals, mutable default args, and autouse / session fixtures | Detect shared, global, and cross-test mutable state |
| Read persisted / subprocess / time boundaries for explicit encoding, `pathlib.Path`, tz-aware instants, and arg-list calls | Detect behavior that changes off the author's machine |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **`assert` as input validation** | An `assert` guarding external input vanishes under `-O`. Check explicitly and raise a real exception |
| **A broad `except` that hides a defect** | Catching `Exception` to continue swallows real bugs and treats corruption as a miss. Name the recoverable exception; make any fallback observable |
| **Cleanup only on the happy path** | A resource released only when nothing fails leaks on every exception. Use a context manager or `ExitStack` so release is guaranteed |

---

## Overall (Stage 3) — Python-specific anchors

Step back from the per-perspective passes and check the change-set holistically against the four
Python-specific failure modes.

| Mode | What it looks like in a Python change-set |
|---|---|
| **Foreign translation** | Java/C++/JS ceremony — index loops, getter/setter pairs, nominal-only interfaces, `Manager` classes, callback pyramids — where a protocol, iterator, context manager, `dataclass`, or plain function is clearer |
| **Dynamic cleverness** | Reflection, metaprogramming, monkeypatching, a descriptor, or a type suppression hiding a contract that could be explicit |
| **False convenience** | A short idiom hiding shared state, a broad `except`, implicit I/O, unbounded materialization, or an untracked task lifetime |
| **Version illusion** | Passes on the author's interpreter or checkout while contradicting the declared floor, the installed package, the runtime-annotation model, the target OS, or the concurrency semantics |

**Preserve-list anchors specific to Python idiom** — what a strong change already got right, which REVISE
iterations must not undo: small protocol-shaped interfaces; precise, readable annotations; clear iteration
and data-model choices; narrow EAFP with meaningful exception chains; deterministic, context-managed
lifetimes; behavior-focused tests; genuinely-sufficient stdlib solutions; and measured performance
improvements that keep a portable, clear baseline.

---

## Recommended verifications (idiom-level)

Capabilities, not locked commands — every tool named across this frame is an example. Run the capability the
change's scope activates; confirm the idiom-level property in the right column.

| Capability | Confirms |
|---|---|
| Parse / compile on the declared minimum, and test the minimum and the latest supported version | Runtime-floor honesty across the version matrix |
| Run the autoformatter in check mode | Deterministic 88-column layout |
| Run the linter and import checks | Import, naming, broad-except, async, and security smells |
| Run a strict type checker | Complete signatures, no implicit `Any`, valid generics / decorators / suppressions |
| Run the focused tests, then the full suite | Correctness on the change, then regression across the suite |
| Build the wheel and sdist, install into a clean environment, and smoke-test the entry points | Distribution truth — no undeclared data or dependency |
| Exercise cancellation, partial acquisition, malformed input, and the minimum version | Failure-path idiom under the cases the happy path skips |
| Profile and benchmark representative data when a performance change is claimed | Evidence for a complexity-increasing optimization |
| Inspect `__all__`, the import surface, and `inspect.signature` | Caller-visible API and preserved decorator metadata |
| Audit trust boundaries for `pickle` / `eval` / `exec` / `shell` / `random` / secrets / logging | Safe primitives and no leaked sensitive data |
