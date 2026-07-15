# Python — Unit & API Design

Child doc of the `python` skill for Python 3.12 unit and API forks beyond the parent tables: function or class,
signatures, class/dataclass patterns, composition, data models, and exception surfaces. An ordinary module
decides from `SKILL.md` alone; read here only on a genuine fork.

This doc **deepens, and does not restate,** the parent floor: `SKILL.md` § Procedure P3 (the six design acts),
the § Principles it operationalizes (function-first, boundary protocols, failure shape, mutation and lifetime,
the narrow input surface — `final P9`), and the § Rules *"Signatures and data models"* default. `convention.md`
owns name spelling; `typing.md` owns the type form of `Self`, `Protocol`, `ParamSpec`, and generics; this doc
owns the design choice and Python mechanics. Constructs are valid at Python 3.12; tool and library names are
illustrative, not a lock.

**One bottom-up design sequence:** module tree → candidate functions and data → only earned classes →
signatures, errors, and test seams → body stubs. Revisit an earlier step when a later seam exposes a bad
choice.

## Contents

1. [Function-first and callable design](#1-function-first-and-callable-design)
2. [Parameter and signature shape](#2-parameter-and-signature-shape)
3. [Class and dataclass patterns](#3-class-and-dataclass-patterns)
4. [Composition, delegation, and extension](#4-composition-delegation-and-extension)
5. [Data-model selection depth](#5-data-model-selection-depth)
6. [Failure-surface design](#6-failure-surface-design)

---

## 1. Function-first and callable design

The decisive question is whether state has a lifetime across calls. Default to a function; a class earns its
keep only for persistent identity, invariants across calls, or several operations over the same owned state.

- **Design the call first.** Put every fact one result needs in the arguments, return it instead of storing it
  for a later getter, and add an object only when calls share identity, hold an invariant, or expose several
  operations over owned state.
- **Keep the core value-in / value-out.** Put file, network, and clock work at the edges.
- **A configured callable is a closure or `functools.partial`, not a one-method class.** `partial` when setup
  only binds leading arguments; a closure when setup validates or derives private values. Collapse a class
  whose whole surface is `__init__` plus one method or `__call__`.
- **A module of functions and constants is a namespace** when there is no per-instance state — clearer than a
  class of `@staticmethod`s or a global singleton. Choose a class only when instances carry meaningful,
  independent state.

```python
import functools
from collections.abc import Callable

def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(value, high))

def make_clamp(low: float, high: float) -> Callable[[float], float]:
    if low > high:                       # a closure validates once, then returns the callable
        raise ValueError("low must not exceed high")
    def clamp_to(value: float) -> float:
        return clamp(value, low, high)
    return clamp_to

to_unit = functools.partial(clamp, low=0.0, high=1.0)   # partial binds pure configuration
```

## 2. Parameter and signature shape

This section owns a signature's *shape*: order, the positional/keyword boundary, defaults, and how wide the
input surface is. `convention.md` owns spelling; `typing.md` owns the annotation.

- **Caller-first ordering** — primary subject, required context, then rare options; the call reads like a
  sentence, not the body's consumption order.
- **Positional-only `/` when the name conveys no caller meaning** — a builtin-like unnamed value, or when
  keyword use must never become a contract. Do not hide a meaningful public name just to reserve a rename.
- **Keyword-only `*` at ambiguity** — flags and modes, same-typed alternatives, or any value whose position
  does not identify its purpose. No fixed count; two same-typed options may already require keywords.
- **Kill the boolean trap** — make booleans keyword-only; use an `Enum` for two or more named states (§ 5);
  split functions when the branches carry different contracts.
- **Sentinel vs `None`.** If `None` is a valid value, use a private sentinel for "not supplied". A private
  sentinel *class* appears in strict annotations; a bare `object()` cannot. Callers never import it.
- **Narrow the input surface** — the Python act behind `final P9` and coding Principle 17. Demand only the
  values the unit uses, in the plainest truthful form. When the body reads a few fields of a record, do not
  take the whole `dataclass`, `TypedDict`, or config aggregate as one opaque parameter — stamp coupling that
  hides the real dependency. Pass the fields, a small purpose-built `frozen` value object, or a `Protocol`
  exposing exactly the operations and attributes used (§ 5 picks among those). Replace a deeply-nested
  annotation the caller must decode with a named intermediate type. Keep an aggregate whole only when the unit
  uses it as one concept — the parameter-object case.
- **A parameter object** when roughly four or five arguments form one concept, or a cluster always moves
  together — a frozen value with that concept's invariants (§ 3), not an `Options` bag. First check whether the
  long signature hides several jobs or a missing collaborator.
- **`*args` for a homogeneous variadic, `**kwargs` only for transparent forwarding** (typed with `ParamSpec` —
  `typing.md`). A public catch-all for future flexibility hides the contract and defeats introspection.

The bad→good input-surface example:

```python
from dataclasses import dataclass
from typing import Protocol

@dataclass(frozen=True)
class AppConfig:                # a broad app config — many fields, most unrelated to fetching
    base_url: str
    timeout_s: float
    retries: int
    log_level: str
    api_key: str

def fetch(cfg: AppConfig) -> bytes: ...            # bad: uses only timeout_s + retries — stamp coupling on 3 unused fields

def fetch(*, timeout_s: float, retries: int) -> bytes: ...   # good: the two fields it uses, keyword-only

@dataclass(frozen=True)
class RetryBudget:              # good: a small purpose-built frozen value with exactly the used surface
    timeout_s: float
    retries: int

def fetch_budgeted(budget: RetryBudget) -> bytes: ...

class FetchPolicy(Protocol):                       # good: a Protocol exposing exactly the attributes the unit uses
    timeout_s: float
    retries: int

def fetch_with(policy: FetchPolicy) -> bytes: ...

type Headers = dict[str, str]                       # name a deeply-nested annotation the caller must decode
type RouteHeaders = dict[str, Headers]
```

## 3. Class and dataclass patterns

**Does the class earn its keep?** Start with a function over plain data; add a class only when state and
behavior must live together (`final P3`). Nothing below applies until that test passes. Pick a form by
semantics, switch on evidence.

| Option | Choose when | Evidence to switch |
|---|---|---|
| Function + plain data | the default: one transformation, no identity or cross-call invariant | calls must share identity, preserve an invariant, or expose several behaviors over owned state → a class |
| `dataclass` | a named record wanting generated construction, equality, and repr | private construction steps, an exposed field could be invalid, or identity/lifecycle dominates value equality → a plain class |
| Frozen value `dataclass` | a shareable, cacheable value, no in-place mutation | mutation is essential, or pointed-to objects stay mutable and break the value contract |
| Plain class | state and behavior travel together, incl. lifecycle or private construction | the surface is only stored fields plus generated value behavior → `dataclass`; one configured call → closure/`partial` |
| `slots=True` leaf value | many instances make memory material and stray attributes should fail | a wide base, a same-name class-level default, or two slotted bases with overlapping slots make the layout brittle |
| Alternate `@classmethod` | a named form (`from_json`/`from_row`) needs conversion before normal construction | mode flags accumulate in `__init__`; keep named constructors, funnel each through the primary constructor so validation has one home |
| Public attribute / `property` / method | expose the attribute directly; a `property` only for a cheap, total computation over owned state | the read does I/O or may fail → an explicit method |

Keep mechanics subordinate. H3 owns `field(default_factory=...)` for a mutable default.
`field(init=False, repr=False)` hides a derived/internal field from generated `__init__`/`__repr__`;
`field(compare=False)` drops an operational or sensitive field from equality; `kw_only=True` forces keyword
construction; `slots=True` removes the per-instance `__dict__`. A `frozen=True` instance is hashable only if
*every* field is — a `list`/`dict`/`set` field raises `TypeError` at hash time, not construction, so use a
`tuple`/`frozenset` for a key; freezing is shallow (pointed-at objects stay mutable); derive a frozen field in
`__post_init__` via `object.__setattr__`. An alternate constructor's precise `Self` return is `typing.md`'s.

```python
from dataclasses import dataclass, field

@dataclass(frozen=True, slots=True, kw_only=True)
class Invoice:
    lines: tuple[str, ...] = ()                      # tuple, not list → the frozen value stays hashable
    currency: str = "USD"
    _line_count: int = field(default=0, init=False, repr=False)

    def __post_init__(self) -> None:
        if len(self.currency) != 3:
            raise ValueError("currency must be a 3-letter code")
        object.__setattr__(self, "_line_count", len(self.lines))   # frozen: bypass to set a derived field

    @classmethod
    def empty(cls, *, currency: str = "USD") -> "Invoice":
        return cls(currency=currency)

    @property
    def line_count(self) -> int:                     # cheap + total → a property
        return self._line_count

    def render_pdf(self) -> bytes:                    # I/O can fail → a method, not a property
        ...
```

## 4. Composition, delegation, and extension

Prefer composition and structural relationships to deep inheritance:

- **Hold collaborators as attributes.** Receive a collaborator at a visible construction boundary and hold it;
  do not inherit merely to obtain behavior. Composition keeps the surfaces independent; inheritance welds them.
- **Delegate a responsibility, not an API.** Forward only the operation your contract promises, translate its
  result or errors, and keep the collaborator private. A wrapper forwarding every method unchanged is shallow.
- **Strategy, variants, factory.** Vary one behavior with a callable, not a subclass. Keep interchangeable
  variants in an explicit name→callable (or name→class) registry assembled at the application boundary — hidden
  import-time registration makes availability depend on import order. A factory function or `@classmethod` picks
  the concrete type so callers do not branch.
- **Mixins only for an orthogonal, self-contained capability** that defines what it uses, needs no private init
  order, and cooperates through `super()`. Several fields, sibling assumptions, or lifecycle overrides signal a
  collaborator instead.
- **Split a god-object** when it holds unrelated subsystem collaborators or its methods touch disjoint field
  sets. Extract one owner per cohesive state set, then compose them behind a small orchestration function.

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
        return Ranker(registry[name])    # registry built + passed at the assembly boundary
    except KeyError as err:
        raise ValueError(f"unknown ranking strategy: {name}") from err
```

PEP 695 is the 3.12 generic form; `typing.md` owns variance and bounds.

## 5. Data-model selection depth

Pick by caller semantics — no data model is mandatory. Test equality, hashing, mutability, iteration,
serialization, and pattern-matching separately: identical field annotations do not imply identical runtime
contracts.

| Option | Choose when | Evidence to switch |
|---|---|---|
| Plain arguments | transient data local to one call | several values form one concept with shared invariants → a purpose-built value; a long list may instead reveal several jobs or a collaborator |
| `dataclass` | you own construction and want a named record — value equality/repr, invariants, or behavior — with no accidental `==` against a bare tuple | must stay a mapping → `TypedDict`; keep tuple behavior → `NamedTuple`; private construction/identity/lifecycle → a plain class |
| `NamedTuple` | positional/tuple compatibility or lightweight unpacking is part of the contract (`x, y =`) | no unpacking, indexing, or tuple equality needed → `dataclass` for named access and controlled mutability |
| `TypedDict` | the value must *stay* a dict — JSON in/out or a documented `**kwargs` shape — static mapping checks only; no methods, defaults, or validation | you own construction or need defaults, validation, methods, or invariants → `dataclass` or class |
| Plain class | private construction steps prevent an exposed invalid state, or identity and lifecycle dominate value equality | the object is only a named value record → `dataclass` |
| `Enum` | a closed set needs runtime identity, iteration, or methods; give every external boundary a deliberate, stable `.value` | only a lightweight closed set of literal values is needed → `Literal` |
| `Literal` | the closed choices need no runtime object | identity, iteration, methods, or stable boundary encoding join the contract → `Enum` |

Migrate at one boundary — a named alternate constructor and an explicit serializer — not at every call site; a
scattered `asdict`, tuple index, or enum coercion leaves the old shape as an unwritten second API. Release
timing and distribution compatibility belong to `packaging.md`.

| From → to | First move | Compatibility hazard |
|---|---|---|
| `TypedDict` / mapping → `dataclass` | add `from_dict` / `to_dict`; move internals first | absent keys, extra keys, in-place mutation |
| `NamedTuple` → `dataclass` | add a named converter; replace positional construction | unpacking (`x, y =`), indexing, tuple `==` |
| `dataclass` → frozen value | remove every in-place mutation; derive in `__post_init__` (§ 3) | callers that mutated a field in place |
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

## 6. Failure-surface design

The parent picks EAFP vs validate-first per operation; this section designs the whole failure surface — the
exception hierarchy, the data those exceptions carry, and each function's raise-vs-return shape.

- **One domain base.** A single base exception; add a subclass only for a category a caller branches on in its
  own `except`, or that stays stable across implementations. A category no caller distinguishes reuses the most
  specific built-in. Grow the tree when a distinction is needed, not speculatively.
- **Carry structured attributes.** Attach the machine-readable facts (offending id, limit, service) as
  exception attributes; the message is for humans. Callers branch on the type and read a documented attribute —
  never parse the text.
- **Translate at the boundary.** Only where the public abstraction changes, `raise DomainError(...) from err`
  so the original traceback survives; inside the package let the built-in propagate. Never translate a
  programmer defect.
- **Raise-vs-return is an API property** — consistent and documented. Mirror the standard library's pairing
  (`d[k]` raises, `d.get(k)` returns `None`). Do not expose an `exists()` plus a `get()` when state can change
  between the calls — offer one atomic operation.

```python
class OrderError(Exception):
    """Base for every error this package raises."""

class OutOfStock(OrderError):
    def __init__(self, sku: str, *, requested: int, available: int) -> None:
        self.sku = sku                              # structured attributes, not a parsed message
        self.requested = requested
        self.available = available
        super().__init__(f"{sku}: requested {requested}, available {available}")

def reserve(sku: str, quantity: int, stock: dict[str, int]) -> None:
    try:
        available = stock[sku]                      # EAFP: the missing-key path is atomic
    except KeyError as err:
        raise OrderError(f"unknown sku: {sku}") from err   # translate at the boundary, preserve the cause
    if quantity > available:                        # LBYL: this check IS the contract
        raise OutOfStock(sku, requested=quantity, available=available)
```

Public raise-vs-return shape by situation:

| Situation | Public shape |
|---|---|
| a malformed value can be rejected before any effect | a documented validation error, raised before construction |
| a resource may change between check and use | one atomic operation that reports absence or conflict |
| absence is routine | return `None`, or expose a distinct lookup — not an exception for ordinary branching |
| absence violates the requested operation | raise one stable domain category, never a leaked transport error |
