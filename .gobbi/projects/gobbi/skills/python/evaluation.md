# Python — Idiom Review Frame

Child doc for the evaluator (and the executor's pre-handoff self-check) grading a Python change-set for **idiom**
quality — the Python-specific companion to [`../coding/evaluation.md`](../coding/evaluation.md). That frame grades
the language-agnostic **property** of good code; this one grades whether the property is expressed in idiomatic
Python 3.12. A change can satisfy a property yet read as un-Pythonic, or read as fluent Python yet fail a
property, so both frames are read and each perspective graded against both — `coding` grades the property,
`python` its Python expression (an explicit raising check over a stripped `assert`, `secrets` over `random`, no
`pickle`/`eval` on untrusted data).

This frame does not restate the parent — it POINTS: the good/bad/adversarial cases live in
[`scenarios.md`](scenarios.md) (`PY-SCENARIO-*`), the binary checks in [`checklists.md`](checklists.md)
(`PY-CHECK-*`), and the rules and principles they exercise live in [`SKILL.md`](SKILL.md). This file owns the
seven idiom lenses, the case/check selection procedure, the recommended verifications, the perspective
anti-patterns, the Overall anchors, the preserve list, and the rule-key legend. It adds no evaluator artifact:
each system still writes exactly **nine** outputs — seven perspective files, `overall.md`, and the copied phase
`checklist.md`. It loads through the parent's Procedure step P2 router, applies at Procedure step P8, grades at
the Python 3.12 floor, and is tool-agnostic.

---

## Rule-key legend — the single crosswalk

Every `scenarios.md` case and `checklists.md` item names its source by `H1`–`H18`, `final P1`–`final P8`, or a
softened-default label, and resolves here to the verbatim opening clause of the `SKILL.md` rule or principle it
names — the **sole crosswalk**, so a rule change propagates through one legend, not three copies. Gate A holds it
closed: every "Resolves to" clause is a live substring of `SKILL.md`.

This numeric legend replaces the former named-key legend, collapsing each merged rule set into one `H{n}` and
re-pointing the principle keys per §4: protocol-first + typing → `final P4`; lifetime-in-syntax +
values-over-mutation → `final P6`; the EAFP *principle* → `final P5` (the choice) + `H4` (failure-preservation);
standard-vocabulary → `final P8`. No former key points at an absent clause. (`final P{n}` = a final principle;
`Procedure step P{n}` = a Procedure step — never a bare `P{n}` that could mean either.)

| Anchor | Resolves to — verbatim opening clause in `SKILL.md` |
|---|---|
| `H1` | "MUST keep the declared Python floor consistent" |
| `H2` | "MUST keep imports inert and gate executable behavior behind an entry point" |
| `H3` | "NEVER use a mutable call or dataclass default" |
| `H4` | "NEVER hide unexpected failure with a bare `except`, `BaseException`, or catch-`Exception`-to-continue" |
| `H5` | "NEVER use `assert` to validate external input" |
| `H6` | "NEVER execute or deserialize untrusted content" |
| `H7` | "NEVER expose a secret, token, or PII through a repr, log, fixture, exception, or traceback" |
| `H8` | "MUST validate and bound untrusted boundary data before use and gate dynamic import or plugin loading" |
| `H9` | "MUST release required resources deterministically on every path" |
| `H10` | "MUST make persisted text, instants, and deadlines unambiguous" |
| `H11` | "MUST use atomic, durable, versioned persistence where correctness depends on surviving" |
| `H12` | "MUST own concurrent tasks, propagate cancellation, enforce timeouts and deadlines, keep blocking" |
| `H13` | "NEVER silently change or remove a documented public API" |
| `H14` | "NEVER depend on `dict` or `set` iteration order in any context" |
| `H15` | "MUST verify a shipped distribution from built artifacts in a clean environment" |
| `H16` | "NEVER hand-edit generated code" |
| `H17` | "NEVER return a live reference to a mutable internal container" |
| `H18` | "NEVER read or consume raw `__annotations__`" |
| `final P1` | "Study the Python contract and neighboring code before design." |
| `final P2` | "Design the Python surface with the user, from references." |
| `final P3` | "Start with a function and plain data; define a class only when state and behavior must live together." |
| `final P4` | "Express boundary relationships with Python protocols and types." |
| `final P5` | "Choose the failure shape from the operation." |
| `final P6` | "Make lifetime visible and keep mutation local." |
| `final P7` | "Build a typed skeleton, then grow minimal verified slices." |
| `final P8` | "Use Python's standard vocabulary until evidence earns an escape." |
| softened style | "Style and spelling — follow the project's configured dialect" |
| softened typing | "Typing — default to precise public and cross-unit annotations, local inference, and immediate isolation" |
| softened data model | "Signatures and data models — prefer clear keyword options, the least-demanding truthful input interface" |
| softened performance idiom | "Python expression and boundary choices — prefer the clearest native form." |
| softened concurrency/deps | "Concurrency and dependencies — default to synchronous standard-library code." |
| softened delivery/evidence | "Delivery and evidence — prefer behavior-focused tests and the established layout, with evidence" |

A softened anchor's spelling variants (`style (soft)`, `data model — softened`, `performance idiom (soft)`,
`final P8 — softened delivery/perf`) each resolve to the matching `softened …` row above.

---

## Selecting cases and checks

Run this after the evaluation Stage 0 target read and before locking the Stage 1 Frames.

1. **Load all three** — this file, [`scenarios.md`](scenarios.md), and [`checklists.md`](checklists.md), plus
   [`../coding/evaluation.md`](../coding/evaluation.md) for the independent language-agnostic axis.
2. **Map the diff to its Python surfaces** — runtime floor and imports; trust boundaries; resources and
   concurrency; persistence and packaging; public API and data model; typing and runtime introspection; style;
   performance; implementation history.
3. **Select the activated cases and checks.** Take every applicable `PY-SCENARIO-*` and its listed `PY-CHECK-*`
   IDs, plus any check whose `H{n}`/default applies directly with no close seed match. Record a specific
   `n/a: {reason}` for an inapplicable hard check the surface could plausibly activate — never omit it silently.
4. **Stage, do not copy prose.** Put the selected `PY-CHECK-*` items into the copied phase checklist under exactly
   `## Stage 1 Additions`, keeping their IDs and wording from `checklists.md` and editing neither source. Every
   evaluation still walks all seven perspectives — one the change does not exercise is still walked and may record
   zero findings. The triad adds no tenth output: findings stay in the seven perspective files + `overall.md`, and
   the filled `checklist.md` stays the coverage register.
5. **Demand bottom-up evidence for `final P7`.** One final green suite proves only final state; require ordered
   evidence of both checkpoints — a typed skeleton that imports and type-checks green before behavior
   (`PY-CHECK-13`) and focused verification after each slice (`PY-CHECK-14`, `PY-SCENARIO-04`). First evidence
   arriving only after a whole-feature pass fails the bottom-up check.

---

## Perspectives

Each lens lists its **Activated** case/check IDs and its anti-patterns; the recommended verifications follow in
one consolidated section.

### Project

**Lens**: Does the Python approach fit the **declared runtime, artifact type, and consumer surface** — no foreign
ceremony over a simpler protocol, no dependency the stdlib covers, no silent narrowing to one interpreter, OS, or
the checkout?

**Activated**: `PY-SCENARIO-03`, `-04`, `-05`, `-06`, `-07`, `-09` · `PY-CHECK-01`, `-02`, `-13`, `-15`, `-19`.

| Anti-pattern | Correction |
|---|---|
| **Transliterated ceremony** | Reach for the protocol Python already defines, not a ported Java/C# structure |
| **A dependency for a stdlib job** | Take a dependency only for a real capability gap the stdlib lacks |
| **Works on my machine / my checkout** | Test the declared minimum and the installed artifact, not just the author's tree |

### Structure

**Lens**: Are the **modules, imports, data models, protocols, and object lifetimes** idiomatic — semantics-fit
data models, composition over deep inheritance, deliberate exports, owned mutable state, and decorators that
preserve typed metadata?

**Activated**: `PY-SCENARIO-01`, `-03`, `-05`, `-08` · `PY-CHECK-03`, `-06`, `-09`, `-10`, `-11`, `-13`, `-14`,
`-21`, `-22`.

| Anti-pattern | Correction |
|---|---|
| **A stringly-typed record** | Pick the data model matching the semantics; a `dict[str, Any]` loses every invariant and annotation |
| **A signature-erasing decorator** | Preserve the wrapped signature with `ParamSpec` + `functools.wraps`, not `Callable[..., Any]` |
| **Inheritance for reuse** | Hold collaborators by composition; reach for a `Protocol` before a base class |

### Performance

**Lens**: Is the change **efficient enough in idiomatic Python** — the right iteration, data structure, and
concurrency idiom, with any complexity-increasing change backed by a profile of a representative workload?

**Activated**: `PY-SCENARIO-05`, `-09` · `PY-CHECK-07`, `-14`, `-15`, `-25`.

| Anti-pattern | Correction |
|---|---|
| **Index-loop habit** | Iterate over values with `enumerate`/`zip`, not `range(len(xs))` |
| **One concurrency model for every stage** | Match the model to the workload and bound the fan-out; async over a CPU stage stalls the loop |
| **Unmeasured cleverness** | Keep the clear form until a profile justifies the complex one |

### Aesthetics

**Lens**: Does the change read like **one disciplined Python codebase** — deterministic formatting, PEP 8 naming,
explicit imports, Google docstrings that add what the signature cannot, and idioms that clarify rather than
compress?

**Activated**: `PY-SCENARIO-06`, `-09` · `PY-CHECK-12`, `-13`.

| Anti-pattern | Correction |
|---|---|
| **A docstring that restates the types** | Document behavior, raises, effects, and constraints the signature cannot show |
| **A three-level comprehension** | Name the intermediate steps as an ordinary loop; density hides the control flow |
| **A wildcard import** | Import explicitly and list the public surface in `__all__` |

### Usage

**Lens**: For the **next caller** — can they use each changed unit from its signature, annotations, docstring, and
exception surface alone, with ownership, blocking-vs-async, and failure categories explicit?

**Activated**: `PY-SCENARIO-03`, `-08` · `PY-CHECK-10`, `-11`, `-17`, `-22`.

| Anti-pattern | Correction |
|---|---|
| **A positional boolean flag** | Make flags and options keyword-only with clear names; `f(data, True)` says nothing |
| **An `Any` in a public signature** | Narrow to a precise type at the boundary; `Any` erases the contract and spreads |
| **A hidden call-order** | Surface an undocumented setup requirement in the interface |

### Consistency

**Lens**: Do **conventions and declarations agree across source, tests, metadata, and runtime** — one Python
floor, one docstring dialect and line length and typing profile, entry points naming the same callable, tests
importing the installed artifact, and every suppression carrying a live reason?

**Activated**: `PY-SCENARIO-04`, `-06`, `-07`, `-08` · `PY-CHECK-01`, `-12`, `-15`, `-17`, `-18`, `-19`, `-20`,
`-22`.

| Anti-pattern | Correction |
|---|---|
| **A floor that disagrees between surfaces** | Make every surface agree; a `requires-python` the CI or syntax contradicts breaks on the minimum |
| **A silently skipped test** | Annotate every skip with its tracked reason and re-enable condition |
| **Tests that import the checkout** | Import the installed artifact; a source-tree import hides a wheel break |

### Risk

**Lens**: Which **Python footgun** makes this change fail silently, leak a resource, race, execute hostile input,
or behave differently off the author's machine?

**Activated**: `PY-SCENARIO-01`, `-02`, `-05`, `-07`, `-08` · `PY-CHECK-03`, `-04`, `-05`, `-06`, `-07`, `-08`,
`-16`, `-18`, `-21`, `-23`, `-24`.

| Anti-pattern | Correction |
|---|---|
| **`assert` as input validation** | Check explicitly and raise a real exception; an `assert` vanishes under `-O` |
| **A broad `except` that hides a defect** | Name the recoverable exception and keep any fallback observable |
| **Cleanup only on the happy path** | Use a context manager or `ExitStack` so release is guaranteed on every path |

---

## Recommended verifications

Capabilities are binding; tool names are examples. First run the generic ordered pipeline the scope activates —
format → lint → strict type-check → focused tests → full tests → build (clean-install import + smoke-test) —
owned by `SKILL.md` Procedure step P7. Then add the Python-idiom-specific verifications below.

| Capability | Confirms |
|---|---|
| Parse/import at the declared floor; test the minimum and latest supported version | Floor honesty across the matrix (`H1`); inert imports (`H2`) |
| Read each new record against the data-model menu; `grep` circular imports and read the import direction; check each new import against the manifest and stdlib | Semantics-fit model (softened data model); cohesive, acyclic modules; no stdlib-covered dependency |
| Simulate a first-time caller from each new signature + docstring alone; read the `Raises:` and the annotations | Caller-usable contract, hidden-precondition reliance, and visible error categories (`final P4`) |
| Confirm the typed skeleton imports/type-checks green before bodies; review history for per-slice evidence | `final P7`; rejects a final-green-only claim (`PY-CHECK-13`/`-14`) |
| Exercise `-O`, malformed/oversized input, partial acquisition, cancellation, deadline expiry; `grep` mutable globals, mutable default args, and autouse/session fixtures | Failure-path idiom (`H4`–`H9`, `H12`); shared/global/cross-test mutable state (`H3`) |
| Interrupt persistence; read encoding, `pathlib.Path`, tz-aware instants, monotonic durations, externalized order, and format version | Portability and durability (`H10`, `H11`, `H14`) |
| `inspect.signature` a decorated callable; read `__all__` and the co-changing declaration surfaces (`py.typed`, stubs, docstrings, entry points, metadata); trace whether a returned container aliases private state; read annotation access against the supported helper | Caller surface, deliberate exports (`final P4`), no stale declaration, `H17`/`H18` |
| Build the wheel + sdist and smoke-test from the clean install, not the checkout | Distribution truth (`H15`) — entry points and package data resolve from the artifact |
| Profile representative data; trace worst-case complexity/materialization at the level of the claim | Evidence for a performance escape (softened performance idiom) |
| `grep` the trust surface — `pickle`/`eval`/`exec`/`shell=True`/`random` on untrusted paths, `assert` on external input, secrets in reprs/log f-strings/fixtures, dynamic loads; check each comment states a why | Safe primitives, no leaked sensitive data (`H5`–`H8`); no what-narration |
| `grep` for `type: ignore`, `xfail`, `skip`, and compat branches without a reason, and for wildcard imports and dense multi-clause comprehensions | A suppression with a live reason + removal condition; namespace pollution and control flow a reader must decode |

---

## Overall (Stage 3) — Python-specific anchors

Step back from the per-perspective passes and check the change-set against the four Python failure modes, then
against what exists only **between** lenses — a clean interface hiding unsafe runtime validation, an efficient
pipeline losing cancellation, or a final green result hiding whole-feature-first construction.

| Mode | What it looks like in a Python change-set |
|---|---|
| **Foreign translation** | Java/C++/JS ceremony — index loops, getter/setter pairs, nominal-only interfaces, `Manager` classes, callback pyramids — where a protocol, iterator, context manager, `dataclass`, or plain function is clearer |
| **Dynamic cleverness** | Reflection, metaprogramming, monkeypatching, a descriptor, a `cast`, or a type suppression hiding a contract that could be explicit |
| **False convenience** | A short idiom hiding shared state, a broad `except`, implicit I/O, a live internal alias, unbounded materialization, or an untracked task lifetime |
| **Version illusion** | Passes on the author's interpreter, checkout, locale, clock, or OS — or on one final green run — while the declared floor, the installed package, the runtime-annotation model, the concurrency semantics, or the incremental method does not |

**Preserve-list anchors specific to Python idiom** — what a strong change already got right, which REVISE
iterations must not undo: small protocol-shaped interfaces; precise, readable annotations; clear iteration and
data-model choices; narrow EAFP with meaningful exception chains; deterministic, context-managed lifetimes;
typed-skeleton and per-slice evidence; behavior-focused tests; genuinely-sufficient stdlib solutions; and measured
performance improvements that keep a portable, clear baseline. If none apply, state `none — every Python-idiom
surface needs revision`.
