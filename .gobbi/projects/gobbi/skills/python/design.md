# Python — Unit & API Design

Child doc of the `python` skill: the deep reference for shaping a Python unit and its public API at the 3.12
baseline — the function-vs-class call, the signature shape, the class and dataclass patterns, the composition
idioms, the data-model tie-breaks, and the exception-surface design. The `SKILL.md` § Procedure P3 (*Design
the units, decomposed*) names the one-line choice in a table; this
doc gives the patterns behind each choice. An ordinary module makes these choices from the parent tables
alone — read here when a design decision is genuinely on a fork.

This doc **deepens, and does not restate,** these parent surfaces: the principles *"Speak Python's protocols,
not another language's ceremony"* and *"Prefer values and transformations over shared mutation"*; the
§ Procedure P3a *Function vs class* and § Procedure P3b *Protocol vs ABC vs inheritance vs composition*
tables; the § Procedure P3d *Data model*, *Return shape*, and *Failure model* tables; and the rules *"MUST accept the narrowest useful
interface and return an ownership-clear value"*, *"MUST prefer composition and protocols over deep nominal
inheritance"*, *"MUST use immutable defaults and keyword-only optional behavior"*, and *"MUST scope EAFP to
the single operation expected to fail"*. Those tables and rules are the floor; the sections below give the
mechanics. Two neighbours own what this doc points at rather than restates: `convention.md` owns how every
name is spelled and cased — this doc owns the *shape* of a signature, not the spelling of its parameters —
and `typing.md` owns the type-level form of `Self`, `Protocol`, and generics — this doc owns the design
choice, not its annotation. Every construct here is valid at Python 3.12; tool and library names are
examples, never a lock.

## Contents

1. [Function-first and callable design](#1-function-first-and-callable-design)
2. [Parameter and signature shape](#2-parameter-and-signature-shape)
3. [Class and dataclass patterns](#3-class-and-dataclass-patterns)
4. [Composition, delegation, and extension](#4-composition-delegation-and-extension)
5. [Data-model selection depth](#5-data-model-selection-depth)
6. [Failure-surface design](#6-failure-surface-design)

---

## 1. Function-first and callable design

The parent P3a *Function vs class* table gives the one-line trigger; the deciding question is whether state has
a lifetime that spans calls. Default to a plain function — it is the smallest deep unit, and a class only
earns its keep once one of the table's class triggers (identity, invariants across calls, state that travels
with behavior) actually fires.

- **Design the call, then work inward** — the `coding` contract-first floor, applied to Python: put every
  fact one result needs in the arguments, return the result rather than storing it for a later getter, and
  introduce an object only when calls share identity, hold an invariant over time, or expose several
  operations over the same owned state.
- **Keep the pure core separate from I/O** — the parent's side-effect-boundary floor: push file, network,
  and clock work to the edges so the core is a value-in / value-out function.
- **One configured callable is a closure or `functools.partial`, not a one-method class.** Bind leading
  arguments with `functools.partial` when the configuration is pure argument-binding; reach for a closure when
  setup validates or derives private values before returning the callable. A class whose entire surface is
  `__init__` plus one `__call__`/method is a function wearing a class — collapse it.
- **A module of functions and constants is a namespace.** When the grouping is a namespace rather than an
  instance — no per-instance state to carry — a module of top-level functions and `UPPER_CASE` constants beats
  a class of `@staticmethod`s or a single global singleton. Reach for a class only when instances would hold
  meaningful, independent state.

```python
import functools
from collections.abc import Callable

def clamp(value: float, low: float, high: float) -> float:
    """Return value confined to the inclusive [low, high] range."""
    return max(low, min(value, high))

def make_clamp(low: float, high: float) -> Callable[[float], float]:
    """Build a one-argument clamp, validating its bounds once up front."""
    if low > high:
        raise ValueError("low must not exceed high")
    def clamp_to(value: float) -> float:
        return max(low, min(value, high))
    return clamp_to

# functools.partial binds pure configuration — no validation or derived state
to_unit = functools.partial(clamp, low=0.0, high=1.0)
```

## 2. Parameter and signature shape

This section owns the *shape* of a signature — the order, the positional/keyword boundary, the defaults.
How each parameter is spelled and cased (`snake_case`, avoiding builtin shadows) is `convention.md`'s § 1;
the type-level annotation of each parameter is `typing.md`'s.

- **Caller-first ordering.** Order parameters the way the call site reads: the primary subject first, required
  context next, then rare options — not the order in which the body happens to consume them. The signature
  should read like a sentence at the call site.
- **Positional-only `/` when the name is not part of the contract.** Put a `/` after parameters whose *name*
  carries no meaning for the caller — a value that mirrors a builtin's unnamed argument, or one whose keyword
  form you never want callers to depend on. Do not add `/` merely to reserve the right to rename a genuinely
  useful public parameter; a meaningful name is part of the contract.
- **Keyword-only `*` past the readability threshold.** Force a parameter keyword-only when it is a flag or
  mode, when it is one of several same-typed arguments (so position is ambiguous), or whenever a positional
  value at the call site would say nothing about which knob it sets. The threshold is call-site ambiguity, not
  a fixed count — two same-typed options is already past it.
- **Kill the boolean trap.** A bare `True`/`False` at a call site is unreadable — the reader cannot tell which
  flag it is. Make every boolean keyword-only, or replace a two-plus-state flag with an `Enum` (§ 5). When two
  branches carry genuinely different contracts, split them into separate functions.
- **Sentinel vs `None` default.** When `None` is itself a valid argument value, `None` cannot also mean "not
  supplied". Use a private sentinel to distinguish "caller passed nothing" from "caller passed `None`" — a
  dedicated sentinel *class* (not a bare `object()`) lets the sentinel appear in the annotation under strict
  typing. Keep it private; callers never import it.
- **A parameter object past ~4–5 arguments, or when several move together.** When a signature grows long, or a
  cluster of parameters always travels as a unit, group them into a frozen dataclass (§ 3) and pass one value.
  It must name one concept and hold that concept's invariants — not be an `Options` bag for leftovers; first
  check whether the long signature means the function is doing several jobs, or the cluster belongs to a
  collaborator.
- **`*args` / `**kwargs` only for a real variadic or a transparent pass-through.** Legitimate uses are a
  homogeneous variadic (`min(*xs)`, `*layers: Mapping[str, V]`) and a wrapper that forwards verbatim to a
  wrapped callable (typed with `ParamSpec` — see `typing.md`). A public catch-all added "for future
  flexibility" hides the real contract and defeats introspection — state the actual parameters instead.

```python
from collections.abc import Mapping

class _Missing:
    """Private sentinel type — distinct from every real value, including None."""

_MISSING = _Missing()

def lookup[V](
    mapping: Mapping[str, V],
    key: str,
    /,
    default: V | None | _Missing = _MISSING,
    *,
    raise_missing: bool = False,
) -> V | None:
    """Return mapping[key]; a keyword-only flag selects raise-vs-default on absence."""
    try:
        return mapping[key]
    except KeyError:
        if raise_missing:
            raise
        return None if isinstance(default, _Missing) else default
```

```python
# boolean trap — the call site is opaque
thumb = resize(image, True, False)

# keyword-only names each flag where it is read
thumb = resize(image, preserve_aspect=True, upscale=False)
```

## 3. Class and dataclass patterns

The parent floor picks a `dataclass` for named value state and warns off deep inheritance and expensive
properties. The mechanics of building one well:

- **Field mechanics.** Use `field(default_factory=...)` for any mutable field default — never a bare mutable
  literal, which is shared across instances. `field(init=False, repr=False)` hides a derived or internal field
  from the generated `__init__`/`__repr__`, and `compare=False` drops an operational or sensitive field from
  equality when it is not part of value identity. Set `kw_only=True` (decorator-wide or per field) to force
  keyword construction (§ 2), and `slots=True` to remove the per-instance `__dict__`.
- **`frozen=True` for a value object.** A frozen dataclass is immutable, and hashable *only when every field
  is itself hashable* — then it is safe to share, cache, and use as a dict/set key. A `list`/`dict`/`set`
  field (like `Invoice.lines` below) leaves instances unhashable: the `TypeError` fires when an instance is
  hashed, not at construction, so switch such a field to a `tuple`/`frozenset` when the value must serve as a
  key. `frozen=True` does not freeze the objects a field points at either. Derive a computed field in
  `__post_init__` via `object.__setattr__`, since ordinary attribute assignment is blocked on a frozen
  instance.
- **`__slots__` (via `slots=True`) when instances are many.** It cuts memory and forbids accidental attribute
  creation. The caveats: it conflicts with a class-level default value for the same name, and multiple
  inheritance from two slotted classes with overlapping slots fails — reach for it on leaf value types, not on
  a wide base.
- **Alternate constructors are `@classmethod`s.** Offer named constructors (`from_json`, `from_row`) rather
  than overloading `__init__` with mode flags; convert the input, then funnel through the primary constructor
  so validation lives in one place. Return the own type — the precise `Self` annotation that keeps this
  correct for subclasses is `typing.md`'s.
- **Property design: cheap and total only.** Expose a public attribute directly; promote it to a `property`
  only when a read later needs a cheap computed value over owned state. A read that does I/O or can raise is a
  method, not a property — callers expect attribute access to be free and safe.

```python
from dataclasses import dataclass, field

@dataclass(frozen=True, slots=True, kw_only=True)
class Invoice:
    lines: list[str] = field(default_factory=list)     # mutable default → factory
    currency: str = "USD"
    _line_count: int = field(default=0, init=False, repr=False)

    def __post_init__(self) -> None:
        if len(self.currency) != 3:                     # cross-field validation
            raise ValueError(f"currency must be a 3-letter code: {self.currency!r}")
        object.__setattr__(self, "_line_count", len(self.lines))  # frozen: bypass to set derived

    @classmethod
    def empty(cls, *, currency: str = "USD") -> "Invoice":
        return cls(currency=currency)
```

```python
class Account:
    def __init__(self, entries: list[int]) -> None:
        self._entries = entries

    @property
    def balance(self) -> int:            # cheap + total: a sum over owned state
        return sum(self._entries)

    def fetch_statement(self) -> bytes:  # does I/O and can fail → a method, not a property
        ...
```

## 4. Composition, delegation, and extension

The parent rule prefers composition and protocols to deep inheritance. The idioms that put that into practice:

- **Hold collaborators as attributes.** A unit that needs another object's behaviour *holds* it — received at
  a visible construction boundary — and calls it; it does not inherit it to get at it. Composition keeps the
  two surfaces independent; inheritance welds them.
- **Delegate a responsibility, not an API.** Forward only the narrow operation your own API promises, and
  translate the collaborator's results or errors so consumers never depend on the internal object. A wrapper
  that forwards every method unchanged is the shallow case the `coding` deep-unit floor warns against —
  callers stay coupled to the collaborator's model.
- **Strategy is a callable; variants are a registry; construction is a factory.** Pass a function to vary one
  behaviour, rather than demanding a subclass. Hold interchangeable variants in a name→callable (or name→class)
  registry, and build that registry explicitly at the assembly boundary — hidden import-time registration
  makes availability depend on import order. Let a factory function or `@classmethod` choose the concrete type
  from an input, so callers never branch on it.
- **Mixins only for an orthogonal, self-contained capability.** A mixin that reaches for attributes it does
  not define is hidden coupling. Use one only when it adds an independent capability, needs no private
  initialization order, and cooperates through `super()`. A mixin carrying several fields, sibling
  assumptions, or lifecycle overrides is an implicit framework — use a collaborator instead.
- **Split a god-object by responsibility** — the `coding` single-responsibility floor: the Python tells are a
  class holding unrelated subsystem collaborators, or methods that each touch a disjoint set of fields.
  Extract an owner around each cohesive state set, then compose them behind a small orchestration function.

```python
from collections.abc import Callable, Mapping, Sequence

type Score[T] = Callable[[T], float]     # a strategy is one callable; PEP 695 native generic alias

class Ranker[T]:
    def __init__(self, score: Score[T]) -> None:
        self._score = score              # composition: hold the strategy as an attribute

    def ranked(self, items: Sequence[T]) -> list[T]:
        return sorted(items, key=self._score, reverse=True)

def make_ranker[T](name: str, registry: Mapping[str, Score[T]]) -> Ranker[T]:
    try:
        score = registry[name]           # registry built + passed at the assembly boundary
    except KeyError as err:
        raise ValueError(f"unknown ranking strategy: {name}") from err
    return Ranker(score)
```

The generic parameter uses the PEP 695 native form — the baseline for every generic example — while its
variance and bound mechanics stay `typing.md`'s.

```python
class Cache:
    def __init__(self, store: dict[str, bytes]) -> None:
        self._store = store              # composition: hold the collaborator

    def get(self, key: str) -> bytes | None:
        return self._store.get(key)      # delegate just the slice you expose
```

## 5. Data-model selection depth

The parent P3d *Data model* table names the trigger for each shape; here are the tie-breaks between the close
calls and the migration paths when a shape outgrows its choice.

- **`dataclass` vs `NamedTuple`.** Both are records. Choose a `NamedTuple` only when tuple/positional
  compatibility or lightweight unpacking is part of the contract (e.g. a coordinate returned for `x, y =`).
  Otherwise choose a `dataclass`: named access, controlled mutability, and no accidental `==` with a bare
  tuple of the same length.
- **`dataclass` vs `TypedDict`.** Use a `TypedDict` when the data must *stay a dict* — a JSON payload in or
  out, or a documented `**kwargs` shape — and you only want type-checking over the mapping. It carries no
  methods, no defaults, and does not validate. Use a `dataclass` when you own construction and want invariants
  or behaviour.
- **`dataclass` vs a plain class.** Use a plain class when valid construction needs private steps, when an
  exposed field could otherwise represent invalid state, or when identity and lifecycle dominate value
  equality. Use a `dataclass` when a named value with generated equality and repr is what you want.
- **`Enum` vs `Literal`.** Use an `Enum` for a closed set that needs identity, iteration, or methods, and
  encode a deliberate, stable `.value` at every external boundary. Use a `Literal` for a lightweight closed
  set of literal values with no runtime object to carry (its type-level mechanics are `typing.md`'s).
- **Check each contract separately.** Equality, hashing, mutability, iteration, serialization, and
  pattern-matching are independent — identical field annotations do not imply identical runtime contracts, so
  compare the ones your callers actually depend on.

Migrate at one boundary — a named alternate constructor and an explicit serializer — rather than changing the
representation at every call site; a scattered `asdict`, tuple index, or enum coercion leaves the old shape as
an unwritten second API. Release timing and distribution compatibility belong to `packaging.md`.

| From → to | First move | Compatibility hazard |
|---|---|---|
| `TypedDict` / mapping → `dataclass` | add `from_dict` / `to_dict`; move internals first | absent keys, extra keys, in-place mutation |
| `NamedTuple` → `dataclass` | add a named converter; replace positional construction | unpacking (`x, y =`), indexing, tuple `==` |
| `dataclass` → `frozen` value object | remove every in-place mutation; derive in `__post_init__` (§ 3) | callers that mutated a field in place |
| string constants → `Enum` | decode at input; encode a stable `.value` at output | raw string comparison, concatenation, serialization |

```python
from dataclasses import dataclass
from typing import TypedDict

class RowDict(TypedDict):          # interchange shape: stays a dict (JSON in/out)
    id: str
    score: float

@dataclass(frozen=True, slots=True)
class Row:                          # owned record: construction is validated
    id: str
    score: float

    @classmethod
    def from_dict(cls, raw: RowDict) -> "Row":
        return cls(id=raw["id"], score=float(raw["score"]))
```

```python
from enum import Enum

class Mode(Enum):                   # closed symbolic set with identity + iteration
    READ = "r"
    WRITE = "w"
    APPEND = "a"
```

## 6. Failure-surface design

The parent P3d *Failure model* table picks EAFP vs LBYL per operation; this section designs the failure surface
as a whole — the exception hierarchy the package exposes, the data those exceptions carry, and the
raise-vs-return shape of each function.

- **One domain base, subclasses earned by branch.** Give the package a single base exception, and add a
  subclass only for a category a caller will actually branch on with its own `except`, or that stays stable
  across implementations. A category no caller distinguishes does not earn a class — reuse the most specific
  built-in instead. Grow the tree when a distinction is needed, never pre-build a deep hierarchy.
- **Carry structured attributes, not just a message.** Attach the machine-readable facts (the offending id,
  the limit, the service) as exception attributes; the formatted message is for humans. Callers branch on the
  exception type and read a documented attribute — never parse the message text.
- **Translate at the boundary, preserving the cause.** When a built-in exception would leak an implementation
  detail across your public boundary, translate it to a domain exception with `raise DomainError(...) from
  err` so the original traceback survives. Do this only where the abstraction changes — inside the package,
  let the specific built-in propagate; a programmer defect is never a translation candidate.
- **Raise-vs-return is an API property.** Whether a function raises on absence or returns a sentinel is part
  of its contract, and it should be consistent and documented. Mirror the standard library's own pairing — a
  raising form for the exceptional case, a returning form for the ordinary one (as `d[k]` raises while
  `d.get(k)` returns `None`). Do not expose an `exists()` plus a `get()` when state can change between the two
  calls — offer one atomic operation instead.

```python
class OrderError(Exception):
    """Base for every error this package raises."""

class OutOfStock(OrderError):
    """Requested quantity exceeds available stock — a category callers branch on."""

    def __init__(self, sku: str, *, requested: int, available: int) -> None:
        self.sku = sku                              # structured attributes: the machine contract
        self.requested = requested
        self.available = available
        super().__init__(f"{sku}: requested {requested}, available {available}")

def reserve(sku: str, quantity: int, stock: dict[str, int]) -> None:
    try:
        available = stock[sku]                      # EAFP: the missing-key path is atomic
    except KeyError as err:
        raise OrderError(f"unknown sku: {sku}") from err   # translate at the boundary
    if quantity > available:                        # LBYL: this check IS the contract
        raise OutOfStock(sku, requested=quantity, available=available)
```

The public raise-vs-return shape follows the situation:

| Situation | Public shape |
|---|---|
| a malformed value can be rejected before any effect | a documented validation error, raised before construction |
| a resource may change between check and use | one atomic operation that reports absence or conflict |
| absence is routine | return `None`, or expose a distinct lookup — not an exception for ordinary branching |
| absence violates the requested operation | raise one stable domain category, never a leaked transport error |

```python
def parse_or_raise(text: str) -> int:
    """Return the parsed int; raise ValueError when the text is not a number."""
    return int(text)                                # raising form: a bad value is exceptional

def parse_or_none(text: str) -> int | None:
    """Return the parsed int, or None when the text is not a number."""
    try:
        return int(text)                            # returning form: absence is ordinary
    except ValueError:
        return None
```
