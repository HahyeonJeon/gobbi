# Python — Static Typing

Child doc of the `python` skill: the version-sensitive Python 3.12 reference for annotations, generics,
decorators, protocols, stubs, runtime-annotation consumers, and checker suppressions. The `SKILL.md` Procedure
step P2 router sends a reader here when a change reaches one of those forks; an ordinary typed module stays on
the parent common path. Every construct here is valid at Python 3.12; tool names are examples.

Project configuration is authoritative: use its checker and profile. A new project defaults to the strict
profile below — a project default, not a universal mandate; precise public and cross-unit annotations and
runtime validation of untrusted boundary data (`H8`) hold regardless of profile.

This doc **deepens, and does not restate,** four parent surfaces — `final P4` (boundary relationships), the
*softened typing* default, `H8` (validate untrusted boundary data at runtime), and `H18` (never read raw
`__annotations__`). It owns the type-level mechanics, `Literal` included (§5): `design.md` decides whether a
literal-selected API is the right caller contract and points here for its spelling. `final P9` stays the
caller-readability anchor: when a boundary annotation becomes a deeply-nested structure the caller must decode,
revisit the boundary rather than disguising it with typing syntax.

## Contents

1. [The strict profile](#1-the-strict-profile)
2. [Modern annotation syntax](#2-modern-annotation-syntax)
3. [Native type parameters (PEP 695)](#3-native-type-parameters-pep-695)
4. [Generics in depth](#4-generics-in-depth)
5. [Structural and special forms](#5-structural-and-special-forms)
6. [Any, object, cast, and suppressions](#6-any-object-cast-and-suppressions)
7. [Runtime annotations and forward references](#7-runtime-annotations-and-forward-references)
8. [Shipping types: py.typed and stubs](#8-shipping-types-pytyped-and-stubs)
9. [Running the type checker](#9-running-the-type-checker)

---

## 1. The strict profile

The strict profile is the new-project default (a project may configure otherwise): the checker is configured so
all of these hold and the maintained tree checks to zero.

| Surface | Strict condition |
|---|---|
| Maintained functions/methods | every parameter typed, explicit return including `-> None`; an untyped `def` is an error, not a silent `Any` |
| Exported and module-level values | a declared type where inference is not self-evident — public constants, class attributes, container fields whose element type inference cannot see |
| Local variables | inferred; annotate only to widen/narrow deliberately or when inference fails (`items: list[Row] = []`) |
| Implicit `Any` | rejected — an unannotated parameter, an untyped call result, or a signature-erasing decorator is an error, not spreading `Any` |
| Redundant/dead constructs | warn — an unreachable branch, a redundant `cast`, an *unused* suppression are reported, so annotations do not rot |
| Optional access | attribute or index access on a possibly-`None` value is an error until it is narrowed |

Where strictness cannot reach — an untyped third-party surface, a dynamic payload — isolate it behind a typed
adapter (§6, §8); never relax the whole module. Annotate the skeleton's public and cross-unit relationships
first and type-check that surface green before any body exists (`final P7`); let locals infer as slices grow.

## 2. Modern annotation syntax

Write the modern forms only; the legacy aliases are noise.

| Need | Modern 3.12 form | Never in new code |
|---|---|---|
| Built-in generics | `list[str]`, `dict[str, int]`, `tuple[int, ...]`, `set[Row]` | `typing.List` / `Dict` / `Tuple` |
| Union / optional | `int \| str`, `X \| None` | `Optional[X]`, `Union[X, Y]` |
| Behavioral input | the narrowest useful `collections.abc` protocol (`Iterable`, `Sequence`, `Mapping`, `Callable`, `Iterator`) — the type-level face of the parent's *"accept the narrowest useful interface"* | those names imported from `typing` |
| Result | a concrete type whose ownership is clear | an ownership-ambiguous abstraction |
| What `typing` still owns | `Protocol`, `TypedDict`, `Literal`, `Final`, `cast`, `overload`, `Self`, `assert_type`, `Any`, `TYPE_CHECKING` | `typing` for anything with a built-in / `collections.abc` home |

## 3. Native type parameters (PEP 695)

PEP 695 is the default generic form at 3.12: the type parameter is declared inline, scoped to the unit that owns
it — no module-level `TypeVar` to import and share. `def first[T](xs: Sequence[T]) -> T`, `class Stack[T]: ...`,
`type Vector = list[float]`, `type Pair[T] = tuple[T, T]`.

| Mechanism | Behaviour |
|---|---|
| Bounds | `def largest[T: Comparable](...) -> T:` constrains `T` to subtypes of `Comparable` |
| Constraints | `def concat[T: (str, bytes)](...) -> T:` restricts `T` to exactly one of a fixed set (`str` or `bytes`), never a common supertype |
| Variance | inferred per parameter; you cannot mark it on the native param. Drop to an explicit `TypeVar("T_co", covariant=True)` only to declare a variance inference cannot derive (§4) |
| `type` statement | a lazily-evaluated alias (`TypeAliasType`); forward references inside resolve lazily, so an alias may name a type defined later |

## 4. Generics in depth

| Form | When needed | Mechanics |
|---|---|---|
| Legacy `TypeVar` | a declared variance (`covariant` / `contravariant`), or one variable shared across several module-level signatures | `bound=T` accepts subtypes; a constraint tuple `TypeVar("T", str, bytes)` accepts only fixed members. Otherwise prefer inline PEP 695 |
| `ParamSpec` | preserve a callable contract through a decorator | `Callable[..., Any]` erases the wrapped signature; `ParamSpec` keeps it so callers still type-check: `def timed[**P, R](fn: Callable[P, R]) -> Callable[P, R]:` with `functools.wraps(fn)`, `*args: P.args`, `**kwargs: P.kwargs` |
| `TypeVarTuple` | variadic shape relationships a fixed set of type variables cannot express | `*Ts` relates arbitrary-arity tuples or array shapes: `def move[*Ts](xs: tuple[*Ts]) -> tuple[*Ts]:` |
| `Self` | a fluent method, copy, or alternate constructor returning its own type | annotate `Self`, not the class name (breaks for subclasses) or a hand-rolled bound `TypeVar`: `def with_header(self, ...) -> Self: ...` |

## 5. Structural and special forms

| Form | Mechanics and choice |
|---|---|
| `Protocol` | the shape a caller must satisfy without nominal inheritance (`final P4` made concrete). `@runtime_checkable` permits `isinstance(x, P)`, but verifies **presence only**, not signatures or returns — not proof of full conformance |
| `Protocol` vs `ABC` | a `Protocol` for a structural match with implementers you do not own; an `ABC` for an owned base with shared behavior and an explicit subclass / `register` contract. The wider function-vs-class-vs-protocol choice is Procedure step P3 (steps 2–3) and the *softened data model* default; this is the type-mechanics half |
| `TypedDict` | a typed shape over a `dict` interchange record (JSON, config) that must stay a `dict`. `total=False` makes every key optional; `Required` / `NotRequired` set it per key. It does **not** validate runtime data; narrow untrusted input at the boundary (§6) first |
| `overload` | several typed signatures over one implementation — `@overload` stubs ONLY when the input choice determines the return type (e.g. a `Literal` flag selecting the result). The implementation carries no `@overload`; its signature is the union of the stubs |
| `Literal` | a closed set of literal values, `Literal["r", "w", "rw"]` — this doc owns that type-level mechanism |
| `Final` | `x: Final = ...` for a name that must not be reassigned or overridden |
| `assert_type` | `assert_type(expr, T)` — a compile-time assertion that the inferred type is `T` (a durable regression guard in tests) |
| `reveal_type` | `reveal_type(x)` — a checker-only probe (no import) while debugging inference |
| `@override` (3.12) | mark a method meant to override a base; the checker flags a typo'd or drifted name that would otherwise create a silent new method |

## 6. Any, object, cast, and suppressions

Mechanics behind the *softened typing* default (narrow untyped input; local coded suppressions; `cast` only for
a verified fact):

- `object` is the safe top type — any value assigns, but use requires narrowing, so checking stays active.
  `Any` is assignable both ways and disables checking through every call it reaches. Prefer `object` plus
  narrowing; reserve `Any` for a genuinely untyped boundary, narrowed on the next line.
- Narrow with `isinstance`, an `assert` on an internal invariant, a `match` on structure, or a user-defined
  `TypeGuard[T]` (PEP 647). At 3.12 use `TypeGuard` (the tighter `TypeIs` is a later runtime — see the §7
  forward note).
- `cast(T, x)` has no runtime effect; use it only for a verified static fact the checker cannot see, e.g. a
  value validated dynamically just above. Never `cast` an incompatible design past the checker — that hides a
  real error.
- Keep a suppression inline, diagnostic-coded, and reasoned:
  `# type: ignore[arg-type]  # third-party stub is wrong; value validated above`. A code-free `# type: ignore`
  is banned — it hides every future error on that line. Keep the unused-suppression warning on.
  `# pyright: ignore[rule]` follows the same discipline.

## 7. Runtime annotations and forward references

Mechanics behind `H18` (never read raw `__annotations__`) and the *softened typing* default's *"add
`from __future__ import annotations` only on evidence"*:

- Do not add `from __future__ import annotations` (PEP 563) by default: it stringizes *every* annotation,
  breaking runtime annotation readers that cannot evaluate the strings. At 3.12 the default is real annotation
  objects (framework-safe); add it ONLY for a demonstrated import cycle, after auditing the module's runtime
  annotation consumers.
- Never read raw `__annotations__` — it may be absent on a plain function, hold strings (under a future-import
  or unresolved forward ref), and on a class not merge inherited entries. Use
  `inspect.get_annotations(obj, eval_str=True)` or `typing.get_type_hints(obj)` — both resolve forward
  references; `get_type_hints` also merges inherited class annotations and strips `Annotated` metadata unless
  `include_extras=True`.
- Quote a genuine forward reference — a self-referential type (`def insert(self, node: "Node") -> None:`) or a
  name imported only for typing. Guard a typing-only import behind `if TYPE_CHECKING:` to avoid a runtime import
  cost or cycle; the quoted name resolves through the helpers above.

> **Forward note (beyond the 3.12 baseline).** Python 3.13 adds the tighter `TypeIs`. Python 3.14 supersedes
> PEP 563: PEP 649 (amended by PEP 749) evaluates annotations lazily as real objects via `__annotate__` — the
> deferral benefit *without* stringization — and adds `annotationlib` with explicit `VALUE` / `FORWARDREF` /
> `STRING` formats as the supported low-level API. Write toward the PEP 649 model, do not rely on PEP 563 string
> behavior, and prefer `annotationlib` over raw attribute access once the target runtime includes it.

## 8. Shipping types: py.typed and stubs

| Choice | When |
|---|---|
| Inline annotations | your own code — one source of truth the checker and reader share |
| `.pyi` stub | a surface you cannot annotate inline: a C / extension module, or third-party code you do not control |
| `py.typed` marker | an inline-typed package ships an empty `py.typed` (PEP 561) so downstream checkers pick up its types; declare it as package data so it reaches the built wheel (`packaging.md` owns metadata mechanics) |
| Stub resolution | a `.pyi` takes checker priority over `.py` and types the public surface only; for an untyped dependency, a typeshed `types-*` distribution supplies a stub-only package |
| Keep stubs true | keep every stub signature synchronized with the implementation — a drifted stub is a silent false contract (the parent's *"name kept accurate after behavior changes"* discipline, as for a docstring) |

## 9. Running the type checker

- Run a single strict checker over the whole maintained tree, to zero, in CI. mypy and pyright are examples;
  the rule is *one strict checker run to zero*, not a specific tool.
- The strict profile (§1) — `strict = true` or `typeCheckingMode = "strict"` in `pyproject.toml` — is the
  default; a project may tune a specific error code with a written reason, but the baseline is strict everywhere
  and a per-code relaxation is a documented exception.
- Type-check at both the minimum and the latest supported runtime — a construct valid at the latest floor can be
  invalid at the declared minimum (the parent's runtime-floor rule).
- The checker never runs in production, so a passing check is not a substitute for validating untrusted data —
  that stays a runtime check (§6, `H8`).
