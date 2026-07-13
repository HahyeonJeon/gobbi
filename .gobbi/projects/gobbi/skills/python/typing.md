# Python — Static Typing

Child doc of the `python` skill: the deep, version-sensitive reference for Python's static type system at
the 3.12 baseline. The `SKILL.md` § Procedure P2 router sends a reader here when a change touches
annotations, a public API, generics, decorators, `Protocol`s, stubs, runtime-annotation consumers, or a
type-checker suppression. An ordinary typed module needs none of this — the parent floor already carries the
common path.

This doc **deepens, and does not restate,** four parent surfaces: the principle *"Types describe
relationships at boundaries"*, and the rules *"MUST annotate every maintained signature and exported value"*,
*"MUST narrow `Any` or untyped boundary data to a precise type at the boundary immediately"*, *"MUST keep
each type suppression local, coded, and reasoned, and use `cast` only for a verified static fact"*, and
*"NEVER add `from __future__ import annotations` as boilerplate, and NEVER read or mutate raw
`__annotations__`"*. Those rules are the floor; the sections below give the mechanics. Every construct here
is valid at Python 3.12; tool names are examples, never a lock.

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

"Strict on all maintained code" is the parent floor (*"MUST annotate every maintained signature and exported
value"*). Concretely, strict means the checker is configured so that all of the following hold, and the
maintained tree checks to zero:

- **Every maintained function and method is fully annotated** — each parameter typed, and an explicit return
  including `-> None`. No `def` is left untyped, and an untyped `def` is an error, not a silent `Any`.
- **Every exported and module-level value carries a declared type** where inference is not self-evident —
  public constants, class attributes, and container fields whose element type inference cannot see.
- **Local variables stay inferred.** Annotate a local only to widen or narrow deliberately, or where
  inference genuinely fails (an empty container that is filled later: `items: list[Row] = []`).
- **Implicit `Any` is rejected** — an unannotated parameter, an untyped call result, or an untyped decorator
  that erases the wrapped signature all surface as errors rather than spreading `Any`.
- **Redundant and dead constructs warn** — an unreachable branch, a redundant `cast`, and an *unused*
  suppression are reported, so the annotations do not rot silently.
- **Optional access is guarded** — attribute or index access on a possibly-`None` value is an error until the
  value is narrowed.

Where strictness cannot reach — an untyped third-party surface, a dynamic payload — the fix is to isolate it
behind a typed adapter (§6, §8), never to relax the whole module. The boundary is narrow on purpose.

## 2. Modern annotation syntax

At 3.12, write the modern forms only; the legacy aliases are noise:

- **Built-in generics** — `list[str]`, `dict[str, int]`, `tuple[int, ...]`, `set[Row]`. Never
  `typing.List` / `typing.Dict` / `typing.Tuple`.
- **Union with `|`** — `int | str`, and `X | None` for an optional. Never `Optional[X]` or `Union[X, Y]` in
  new code.
- **`collections.abc` for behavioral inputs** — accept the narrowest useful protocol (`Iterable`,
  `Sequence`, `Mapping`, `Callable`, `Iterator`) imported from `collections.abc`, not from `typing`; return a
  concrete type whose ownership is clear. This is the type-level face of the parent's *"accept the narrowest
  useful interface"* rule.
- **`typing` only for what it still owns** — `Protocol`, `TypedDict`, `Literal`, `Final`, `cast`, `overload`,
  `Self`, `assert_type`, `Any`, `TYPE_CHECKING`. Everything else has a built-in or `collections.abc` home.

```python
from collections.abc import Iterable, Mapping

def index_by_id(rows: Iterable[Row]) -> dict[str, Row]:
    return {row.id: row for row in rows}

def load(path: str, *, headers: Mapping[str, str] | None = None) -> Response: ...
```

## 3. Native type parameters (PEP 695)

PEP 695 syntax is the default generic form at 3.12. It declares the type parameter inline, scoped to the unit
that owns it — no module-level `TypeVar` object to import and share.

```python
def first[T](xs: Sequence[T]) -> T:                 # generic function
    return xs[0]

class Stack[T]:                                     # generic class
    def push(self, item: T) -> None: ...
    def pop(self) -> T: ...

type Vector = list[float]                           # type alias statement
type Pair[T] = tuple[T, T]                          # generic type alias
```

- **Bounds** — `def largest[T: Comparable](xs: Iterable[T]) -> T:` constrains `T` to subtypes of `Comparable`.
- **Constraints** — `def concat[T: (str, bytes)](a: T, b: T) -> T:` restricts `T` to exactly one of a fixed
  set (`str` or `bytes`), never a common supertype.
- **Variance is inferred.** With native syntax the checker infers covariance / contravariance per parameter;
  you do not — and cannot — mark it on the native param. Drop to an explicit
  `TypeVar("T_co", covariant=True)` only when you must declare a variance the inference cannot derive (§4).
- **The `type` statement builds a lazily-evaluated alias** (`TypeAliasType`) — forward references inside an
  alias resolve lazily, so an alias may name a type defined later in the module.

## 4. Generics in depth

- **Legacy `TypeVar` — when it is still needed.** Use an explicit `TypeVar` for a declared variance
  (`covariant=True` / `contravariant=True`), or when one type variable must be shared across several
  module-level signatures. `bound=T` accepts subtypes of a bound; a constraint tuple `TypeVar("T", str, bytes)`
  accepts only members of a fixed set. Otherwise prefer the inline PEP 695 form.
- **`ParamSpec` — preserve a callable contract through a decorator.** A decorator typed
  `Callable[..., Any]` erases the wrapped signature; `ParamSpec` keeps it, so callers of the decorated
  function still type-check.

  ```python
  from collections.abc import Callable
  import functools

  def timed[**P, R](fn: Callable[P, R]) -> Callable[P, R]:
      @functools.wraps(fn)
      def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
          return fn(*args, **kwargs)
      return wrapper
  ```

- **`TypeVarTuple` — variadic shape relationships.** `*Ts` relates arbitrary-arity tuples or array shapes
  where a fixed set of type variables cannot: `def move[*Ts](xs: tuple[*Ts]) -> tuple[*Ts]:`.
- **`Self` — return-your-own-type.** Annotate a fluent method, a copy, or an alternate constructor with `Self`
  rather than naming the class (which breaks for subclasses) or hand-rolling a bound `TypeVar`:
  `def with_header(self, key: str, value: str) -> Self: ...`.

## 5. Structural and special forms

- **`Protocol` — structural typing.** Define the shape a caller must satisfy without demanding nominal
  inheritance; this is the parent principle *"Types describe relationships at boundaries"* made concrete. A
  `@runtime_checkable` protocol permits `isinstance(x, P)`, but the runtime check verifies method **presence
  only**, not signatures or return types — do not treat a passing `isinstance` as proof of full conformance.
- **`Protocol` vs `ABC`.** Reach for a `Protocol` when you do not own the implementers and want a structural
  match; reach for an `ABC` when you own a base that carries shared concrete behavior and want an explicit
  subclass / `register` contract. (The wider function-vs-class-vs-protocol choice is split across the parent P3a/P3b tables; this
  is the type-mechanics half.)
- **`TypedDict` — a typed shape over a mapping.** Types a `dict` used as an interchange record (JSON, config)
  that must stay a `dict`. `total=False` makes every key optional; `Required` / `NotRequired` set it per key.
  A `TypedDict` types a mapping — it does **not** validate runtime data; narrow untrusted input at the
  boundary (§6) before trusting the shape.
- **`overload` — one implementation, several typed signatures.** Declare `@overload` stubs ONLY when the
  input choice determines the return type — for example a `Literal` flag that selects the result type. The
  implementation body carries no `@overload` and its signature is the union of the stubs.
- **The precision forms** — `Literal["r", "w", "rw"]` for a closed set of literal values; `x: Final = ...`
  for a name that must not be reassigned or overridden; `assert_type(expr, T)` for a compile-time assertion
  that the inferred type is `T` (a durable regression guard in tests); `reveal_type(x)` as a checker-only
  probe (no import) while debugging inference.
- **`@override` (3.12)** — mark a method that is meant to override a base method; the checker flags a typo'd
  or drifted override name that would otherwise create a silent new method.

## 6. Any, object, cast, and suppressions

This section is the mechanics behind the parent rules *"MUST narrow `Any` ... immediately"* and *"MUST keep
each type suppression local, coded, and reasoned, and use `cast` only for a verified static fact"*.

- **`object` vs `Any`.** `object` is the safe top type — anything assigns to it, but you must narrow before
  you use it, so the checker still protects you. `Any` is the unsafe escape — assignable in both directions,
  it disables checking and spreads silently through every call it touches. Prefer `object` plus narrowing;
  reserve `Any` for a genuinely untyped boundary value that you narrow on the next line.
- **Narrowing tools** — `isinstance`, an `assert` on an internal invariant, a `match` on structure, or a
  user-defined `TypeGuard` (PEP 647) function that returns `TypeGuard[T]`. (Python 3.13 adds the tighter
  `TypeIs`; at the 3.12 baseline use `TypeGuard`.)
- **`cast(T, x)`** — has no runtime effect; it tells the checker to treat `x` as `T`. Use it ONLY for a
  static fact the checker cannot see but you have established (e.g. a value you validated dynamically a line
  earlier). Never use `cast` to force an incompatible design past the checker — that hides a real type error.
- **Coded, reasoned suppressions.** An inline suppression names the diagnostic code and states the fact that
  makes it safe: `# type: ignore[arg-type]  # third-party stub is wrong; value is validated above`. A blanket
  `# type: ignore` with no code is banned — it silences every future error on that line too. Strict mode's
  unused-suppression warning keeps the set honest. Some checkers spell this `# pyright: ignore[rule]`; the
  discipline is identical — local, coded, reasoned.

## 7. Runtime annotations and forward references

This section is the mechanics behind the parent rule *"NEVER add `from __future__ import annotations` as
boilerplate, and NEVER read or mutate raw `__annotations__`"*.

- **Why the future-import is off by default.** `from __future__ import annotations` (PEP 563) stringizes
  *every* annotation in the module. That silently breaks frameworks that read annotations at runtime — they
  receive strings and must evaluate them, and some cannot. At 3.12 the default is real annotation objects,
  which is framework-safe. Add the future-import ONLY for a demonstrated import cycle, and only after auditing
  the module's runtime annotation consumers.
- **3.14 supersedes it.** PEP 649 (as amended by PEP 749) makes annotations lazily evaluated as real objects
  via an `__annotate__` function — the deferral benefit *without* PEP 563's stringization. So the future-import
  is a shrinking special case, not a default; write toward the PEP 649 model and do not rely on PEP 563
  string behavior.
- **Read annotations through the supported helpers, never raw `__annotations__`.** Raw `__annotations__` may
  be absent on a plain function, may hold strings (under a future-import or an unresolved forward ref), and on
  a class does not merge inherited entries. Use `inspect.get_annotations(obj, eval_str=True)` or
  `typing.get_type_hints(obj)` — both resolve forward references; `get_type_hints` also merges inherited class
  annotations and strips `Annotated` metadata unless you pass `include_extras=True`.
- **Forward references.** Quote a genuine forward reference — a self-referential type
  (`def insert(self, node: "Node") -> None:`) or a name imported only for typing. Guard a typing-only import
  behind `if TYPE_CHECKING:` to avoid a runtime import cost or cycle; the quoted reference then resolves
  through the reader helpers above.
- **3.14 awareness.** 3.14 adds `annotationlib` with explicit `VALUE` / `FORWARDREF` / `STRING` formats as the
  supported low-level annotation API; prefer it over raw attribute access once the target runtime includes it.

## 8. Shipping types: py.typed and stubs

- **Inline vs stub.** Annotate your own code inline — one source of truth that the checker and the reader
  share. Reserve stub files (`.pyi`) for a surface you cannot annotate inline: a C / extension module, or a
  third-party library you do not control.
- **The `py.typed` marker.** A package that ships inline annotations includes an empty `py.typed` file
  (PEP 561) so downstream checkers pick up its types; it must be declared as package data so it lands in the
  built wheel (the metadata mechanics live in `packaging.md`).
- **Stub resolution.** A `.pyi` stub takes priority over the `.py` for the checker and types the public
  surface only. For a third-party library with no inline types, a stub-only distribution (a `types-*` package
  from typeshed) supplies them.
- **Keep stubs true.** A stub that drifts from its implementation is a silent lie — the parent's *"a name kept
  accurate after behavior changes"* discipline applies to a stub's signatures exactly as to a docstring.

## 9. Running the type checker

- **One strict checker, gated.** Run a single strict type checker over the whole maintained tree, to zero, in
  CI. mypy and pyright are examples; the rule is *one strict checker run to zero*, not a specific tool.
- **Config is an example, not a lock.** The strict profile (§1) — expressed as `strict = true` or
  `typeCheckingMode = "strict"` in `pyproject.toml` — is the default. A project may tune a specific error code
  with a written reason, but the baseline is strict everywhere, and a per-code relaxation is a documented
  exception, not the norm.
- **Check the whole version matrix.** Type-check at both the minimum and the latest supported runtime — a
  typing construct valid at the latest floor can be invalid at the declared minimum (the parent's
  runtime-floor rule).
- **The checker is advisory at runtime.** It never runs in production, so a passing check is not a substitute
  for validating untrusted data — that stays a runtime check (§6, and the parent's trust-boundary rule).
