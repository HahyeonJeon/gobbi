# Coding Principles

This document holds six design principles that apply to procedural and object-oriented code alike: simplicity,
modularization, reusability, readability, naming, and intuitive public API. Each entry has a description of the
principle and its reason, a good example, and a labeled anti-pattern. Simplicity decides whether a unit exists;
the other entries shape each unit that remains.

## Simplicity

**Description.** Write the least mechanism that meets a current need. Most overengineered code should not
exist: units that only forward calls, wrappers with one use, classes that hold one function, and options kept
for later. Each adds a name to learn and a place to change, and none adds behavior. Apply two tests:

- **Inline test.** Ask of each unit: "If I inline it into its callers, do they get longer, repeat a rule, or
  expose a secret?" A secret is the one decision or fact that only this unit changes. If all three answers are
  no, inline the unit.
- **Current caller test.** Every parameter, option, hook, and variant has a caller today. Delete each one that
  has none.

**Good example.** One function holds the tax rule. Inlining it would repeat the rate and the rounding in each
caller, so it stays.

```python
from decimal import Decimal

TAX_RATE = Decimal("0.10")


def tax(amount: Decimal) -> Decimal:
    return (amount * TAX_RATE).quantize(Decimal("0.01"))


assert tax(Decimal("25.00")) == Decimal("2.50")
```

**Anti-pattern: a class that only forwards calls, a class that holds one function, and an option with no
caller.** Inlining both classes gives the good example.

```python
from decimal import Decimal


class TaxCalculator:
    def __init__(self, rate: Decimal = Decimal("0.10"), rounding: str | None = None) -> None:
        self.rate = rate
        self.rounding = rounding  # no caller sets this

    def calculate(self, amount: Decimal) -> Decimal:
        return (amount * self.rate).quantize(Decimal("0.01"))


class TaxService:  # only forwards to TaxCalculator
    def __init__(self, calculator: TaxCalculator) -> None:
        self.calculator = calculator

    def compute_tax(self, amount: Decimal) -> Decimal:
        return self.calculator.calculate(amount)


assert TaxService(TaxCalculator()).compute_tax(Decimal("25.00")) == Decimal("2.50")
```

## Modularization

**Description.** Modularization gives each unit one conceptual definition, one responsibility, one boundary,
and one-way relationships. A reader then finds where a change goes from the definition alone, and the unit
can change its private parts without breaking callers. Before you create a directory, file, public class,
or public function, write one line for each term. If a line fails, split, merge, or move the unit. Private
helpers need only a good name.

- **Conceptual definition:** one sentence in domain words, with no "and".
- **Responsibility:** its secret, the one decision or fact that only this unit changes.
- **Boundary:** what it hides, and the named neighbours it never imports. Keep the public surface small: other
  code imports only the names the unit chooses to share.
- **Relationship:** what it uses and what uses it. Dependencies point one way, with no cycles.

The same terms set the defaults for directories and files. An existing project or framework layout wins.

- Start flat. Make a directory only when needed: when its files share one conceptual definition,
  responsibility, and boundary, whether that is a domain concept or a layer. Nest at most 2 levels under the
  package root, and make no directory for one file.
- Make no `utils/`, `common/`, `helpers/`, `misc/`, or `shared/`. Move each function to the unit that uses it.
- A new file needs a new conceptual definition. Split a file when its definition needs "and", not when it is
  long.

**Good example.** A flat package, and a module that passes all four lines and shares one public name.

```text
shop/
  cart.py       # the items a shopper will buy
  pricing.py    # the price of one order line; uses nothing in shop
  checkout.py   # charging for a cart; uses cart and pricing
```

```python
# pricing.py
# Conceptual definition: the price of one order line.
# Responsibility: the tax rate and rounding.
# Boundary: hides _TAX_RATE and shares only quote; never imports cart or checkout.
# Relationship: uses nothing in shop; checkout uses quote.
from decimal import Decimal

__all__ = ["quote"]

_TAX_RATE = Decimal("0.10")


def quote(unit_price: Decimal, quantity: int) -> Decimal:
    subtotal = unit_price * quantity
    return subtotal + (subtotal * _TAX_RATE).quantize(Decimal("0.01"))


assert quote(Decimal("2.50"), 4) == Decimal("11.00")
```

**Anti-pattern: a one-file dump directory with no one conceptual definition, responsibility, or boundary.**

```python
# shop/utils/helpers.py, the only file in utils/.
# Its definition needs "and" (dates and tax), and both kinds of change edit it.
from datetime import date
from decimal import Decimal

TAX_RATE = Decimal("0.10")  # public, so any module may import and depend on it


def parse_day(text: str) -> date:
    return date.fromisoformat(text)


def tax(amount: Decimal) -> Decimal:
    return amount * TAX_RATE


assert parse_day("2026-01-02").day == 2
```

## Reusability

**Description.** A reusable unit, such as a function, a class, or a module, serves a new caller without edits.
It does one job and takes everything it needs as explicit inputs. Reuse comes from small units with one job,
not from one unit that knows every caller. Generalize after the third real use; a flag added for one caller is
a sign of reuse forced too early.

**Good example.** One small job, explicit inputs, and no knowledge of any caller.

```python
from collections.abc import Callable


def retry[T](call: Callable[[], T], attempts: int = 3) -> T:
    for _ in range(attempts - 1):
        try:
            return call()
        except TimeoutError:
            pass
    return call()


calls: list[int] = []


def flaky() -> str:
    calls.append(1)
    if len(calls) < 3:
        raise TimeoutError
    return "ok"


assert retry(flaky) == "ok" and len(calls) == 3
```

**Anti-pattern: each new caller added a flag, so every caller now depends on every other caller's case.**

```python
import json


def export(
    rows: list[dict[str, str]],
    for_api: bool = False,
    legacy: bool = False,
    excel: bool = False,
) -> str:
    if legacy:
        rows = [{key.upper(): value for key, value in row.items()} for row in rows]
    if for_api:
        return json.dumps({"data": rows})
    separator = ";" if excel else ","
    return "\n".join(separator.join(row.values()) for row in rows)


assert export([{"a": "1", "b": "2"}], excel=True) == "1;2"
```

## Readability

**Description.** A reader can tell what a unit does from its signature and shape, without tracing its calls.
Code is read far more often than it is written, and a wrong reading leads to a wrong change. Choose names
with [Naming](#naming), and check while writing:

- Every input and output has a type, and a small typed class replaces a `dict` with known keys.
- No boolean or integer flag argument chooses between two behaviors.
- Control flow stays flat: one condition states one rule, and an early return replaces a nested `else`.

**Good example.** The name, the types, and one condition state the whole rule.

```python
from dataclasses import dataclass

FREE_SHIPPING_CENTS = 5000
STANDARD_FEE_CENTS = 499


@dataclass(frozen=True)
class Order:
    total_cents: int
    is_member: bool


def shipping_fee_cents(order: Order) -> int:
    if order.is_member or order.total_cents >= FREE_SHIPPING_CENTS:
        return 0
    return STANDARD_FEE_CENTS


assert shipping_fee_cents(Order(total_cents=1000, is_member=False)) == 499
```

**Anti-pattern: a `dict` with known keys, a flag argument, and nested branches hide the same rule.**

```python
def process(d: dict[str, int], f: int = 0) -> int:
    r = 499
    if f == 1:
        r = 0
    else:
        if "t" in d:
            if d["t"] >= 5000:
                r = 0
    return r


assert process({"t": 6000}) == 0
```

## Naming

**Description.** A name uses the domain's one term for its concept and says only what its context does not. Two
terms for one concept make a reader ask whether the two differ, and repeated or empty words make a name longer,
not more exact. A short name is a result of the checks below, not a goal, so keep each word the context does
not already say, such as the unit in `total_cents`. Check each new name, file, and directory:

- **One term per concept.** Take the term from the user's request, spec, or data first. Next, search the
  existing code and reuse its term. Next, use the standard domain or library term. Coin a term only when none
  exists.
- **No repeated context.** A member does not repeat its owner, and a file does not repeat its directory:
  `invoice.load`, not `invoice.load_invoice`; `billing/invoice.py`, not `billing/billing_invoice.py`. A class
  may share its module's name, as `decimal.Decimal` does.
- **Drop test.** Remove one word. If the name stays true and unique in its scope, the word was noise.
- **Whole words.** Use only abbreviations the project or domain already lists, such as `url` or `id`, and never
  `mgr` or `cfg`. Casing follows the language.
- **No empty words.** Use no `Manager`, `Helper`, `Data`, `process`, `utils`, `common`, or `misc`.
- **Files and directories.** Use one word by default. Use two only when the concept itself is two words, such
  as `line_item.py` or `rate_limit.py`, or when one word is ambiguous among siblings. Never abbreviate to reach
  one word, and do not shadow a standard-library module, such as `random.py`.

**Good example.** In `billing/invoice.py`, each name adds one fact its container does not state.

```python
from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class Line:
    price: Decimal
    quantity: int


@dataclass(frozen=True)
class Invoice:
    lines: tuple[Line, ...]

    def total(self) -> Decimal:
        return sum((line.price * line.quantity for line in self.lines), Decimal(0))


assert Invoice((Line(Decimal("2.50"), 4),)).total() == Decimal("10.00")
```

**Anti-pattern: in `billing/billing_invoice_utils.py`, every name repeats its context or adds an empty word.**

```python
from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class InvoiceLineItemData:
    line_item_unit_price: Decimal
    line_item_quantity: int


@dataclass(frozen=True)
class InvoiceDataManager:
    invoice_line_items_list: tuple[InvoiceLineItemData, ...]

    def calculate_invoice_total_amount(self) -> Decimal:
        items = self.invoice_line_items_list
        return sum((i.line_item_unit_price * i.line_item_quantity for i in items), Decimal(0))


manager = InvoiceDataManager((InvoiceLineItemData(Decimal("2.50"), 4),))
assert manager.calculate_invoice_total_amount() == Decimal("10.00")
```

## Intuitive Public API

**Description.** A first-time caller can find the entry point, make the first successful call with built-in
values, and guess the next call from the names. Later calls reuse the names, argument order, and types the
caller already knows. Every project type a caller must learn before the first call is a cost paid by each new
user. Count that cost as **learning depth**, the longest chain of project types the caller must learn for the
first successful call:

- The entry point, such as a function or a class, is level 1. A project type that the caller must build or
  call to use the entry point is level 2. A project type needed to build a level-2 type is level 3, and so on.
- Built-in and standard-library types, such as `str`, `int`, `list`, `Path`, and `datetime`, do not count. An
  argument with a working default does not count either, because the first call does not need it.
- Keep learning depth at 2 or less. A chain such as public API → second API → argument dataclass → nested
  argument type is too deep, however natural each step looks alone.

**Good example.** The first call needs only `Client` (depth 1). A caller who tunes retries learns one flat
type, `Retry` (depth 2).

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Retry:
    attempts: int = 3
    base_seconds: float = 0.5
    factor: float = 2.0


class Client:
    def __init__(self, base_url: str, *, retry: Retry = Retry()) -> None:
        self.base_url = base_url
        self.retry = retry

    def get(self, path: str) -> str:
        return self.base_url + path


client = Client("https://api.example.com")
assert client.get("/users") == "https://api.example.com/users"
tuned = Client("https://api.example.com", retry=Retry(attempts=5))
assert tuned.retry.attempts == 5
```

**Anti-pattern: a depth-4 chain before the first call.** The good example above is its fix: defaults remove
the required types, and the remaining option type is flat.

```python
from dataclasses import dataclass


@dataclass
class Backoff:  # level 4
    base_seconds: float
    factor: float


@dataclass
class RetryPolicy:  # level 3
    attempts: int
    backoff: Backoff


@dataclass
class Session:  # level 2
    base_url: str
    retry: RetryPolicy


class Client:  # level 1
    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, path: str) -> str:
        return self.session.base_url + path


client = Client(Session("https://api.example.com", RetryPolicy(3, Backoff(0.5, 2.0))))
assert client.get("/users") == "https://api.example.com/users"
```
