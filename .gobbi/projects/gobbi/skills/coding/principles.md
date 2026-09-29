# Coding Principles

This document holds six design principles that apply to procedural and object-oriented code alike: simplicity,
modularization, reusability, readability, naming, and intuitive public API. Each entry has a description of the
principle and its reason, a good example, and a labeled anti-pattern. Simplicity decides whether a unit exists;
the other entries shape each unit that remains.

## Simplicity

**Description.** Write the least mechanism that meets a current need. Most overengineered code should not
exist: units that only forward calls, wrappers with one use, classes that hold one function, and options kept
for later. Each adds a name to learn and a place to change, and none adds behavior. A class with one method and
no state is usually better as a function. Apply two tests:

- **Inline test.** Ask of each unit: "If I inline it into its callers, do they get longer, repeat a rule, or
  expose a secret?" A secret is what only this unit changes: one decision, or the facts about one concept. If
  all three answers are no, inline the unit.
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
caller.** Inlining `TaxService`, deleting `rounding`, and turning `TaxCalculator` into a function with a
constant rate gives the good example.

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

**Description.** Modularization applies the [Ontology](../ontology/SKILL.md) facets and kinds to code. It gives
each unit one conceptual definition, one secret, one boundary, one-way relationships, and the data it owns. A
reader then finds where a change goes from the definition alone, and the unit can change its private parts
without breaking callers. Before you create a directory, file, public class, or public function, write its five
facet lines in the design record: the Ideation design, or the Execution handoff when there was no Ideation. A
public class or function also gets a caller contract. Together these are the unit's Modularization lines.
Source code does not carry them as comments. If a line fails, split, merge, or move the unit. Private helpers
need only a good name.

- **Conceptual definition** (the Definition facet): one sentence in domain words, with no "and".
- **Responsibility:** its secret, which is what only this unit changes: one decision, or the facts about one
  concept.
- **Boundary:** what it hides, and the named neighbours it never imports. Keep the public surface small: other
  code imports only the names the unit chooses to share.
- **Relationship:** what it uses, what uses it, and the Ontology units it realizes. Dependencies point one way,
  with no cycles.
- **Properties:** the data it owns, with types, invariants, and whether each value is stable or changing; `None`
  when it owns none.
- **Caller contract** (public classes and functions only): the code form of the Function or Action type that the
  unit realizes. For a Function, state its inputs, its output, and the errors it raises; it changes nothing. For
  an Action type, state its parameters, the checks that raise errors, the data it changes, its side effects, and
  its allowed callers. A public class or function that realizes neither states inputs, output, and errors, as
  for a Function.

"Caller contract" is coding's name for the fields that the [Ontology record](../ontology/record.md) keeps under
Palantir names. Each part maps to one field:

| Caller contract part | Record field |
|---|---|
| Function inputs | Function `parameters` |
| Function output (the return value) | Function `output` |
| Function errors | None; only the caller contract states them |
| Action type parameters | Action type `parameters` |
| Checks that raise errors | Action type `submissionCriteria` |
| The error result | None; the record gives every Action type one failure result: nothing changes, and the failed criterion is named |
| The data it changes | Action type `operations` |
| Side effects | Action type `sideEffects` |
| Allowed callers | The `run` grants of each Security policy that targets the Action type; a `propose` grant adds a proposer, not a caller |

A Function's `reads` belongs in the Relationship line. Directories and files state only the five facet lines.

Record ids are lowerCamelCase; code uses its language's case, so the Action type `delayFlight` is the Python
function `delay_flight`.

Keep computing and changing apart, because Functions return results and only Action types commit changes
([Ontology Rules](../ontology/SKILL.md#rules)). A function that realizes a Function returns a value and changes
nothing: it sets no field, writes no record, and sends no message. Each Action type has one public entry point.
It checks the submission criteria, applies its operations, sends the side effects, and returns the result or
raises the error. No second public function makes the same change.

The same terms set the defaults for directories and files. An existing project or framework layout wins.

- Start flat. Make a directory only when needed: when its files share one conceptual definition,
  responsibility, and boundary, whether that is a domain concept or a layer. Nest at most 2 levels under the
  package root, and make no directory for one file.
- Make no `utils/`, `common/`, `helpers/`, `misc/`, or `shared/`. Move each function to the unit that uses it.
- A new file needs a new conceptual definition. Split a file when its definition needs "and", not when it is
  long.

**Good example.** A flat package for the [Flight sample](../ontology/examples/area.yaml). Each file
realizes one Object type, with its Action types, or one Function.

```text
airline/
  flight.py       # one scheduled flight; uses nothing in airline
  airport.py      # one airport where flights depart or arrive; uses nothing in airline
  booking.py      # one passenger's seat on one flight; uses flight
  connection.py   # whether two bookings connect; uses booking, flight, and airport
```

The design record gives these lines for `flight.py`. The code keeps only the Properties that Delay flight needs.

- **Conceptual definition:** one scheduled trip of one aircraft between two airports on one date.
- **Responsibility:** which schedule changes a flight may take.
- **Boundary:** hides `_DELAYABLE`; shares `Flight`, `FlightState`, `InvalidDelay`, and `delay_flight`; never
  imports `booking`.
- **Relationship:** uses nothing in `airline`; `booking` and `connection` use `Flight`; realizes the Object type
  Flight (`flight`) and the Action type Delay flight (`delayFlight`).
- **Properties:** `number: str` and `departure_date: date`, stable; `state: FlightState`,
  `estimated_departure: datetime`, `estimated_arrival: datetime`, and `delay_reason: str`, changing. Both
  estimated times are in UTC, with `tzinfo=UTC`. The estimated arrival is later than the estimated departure;
  `Flight` raises `ValueError` otherwise.

The public function `delay_flight` also gets its caller contract, from the Delay flight fields:

- **Caller contract:** `delay_flight(flight, new_estimated_departure, reason, *, notify) -> Flight`, where
  `new_estimated_departure` is a UTC `datetime`. Checks: it raises `InvalidDelay` unless the flight's state is
  `scheduled` and the new time is later than the current estimated departure. Error result: the flight is
  unchanged, no one is notified, and the error names the failed check. Changes: both estimated times move by the
  same amount, and the reason is set. Side effects: notifies each booked passenger, by calling `notify` once with
  the delayed flight after the change. `notify` is the sender that the caller passes in, not a Delay flight
  parameter. Allowed callers: operations-control code, as the Ops-control policy grant to run `delayFlight`
  states.

```python
# airline/flight.py
from collections.abc import Callable
from dataclasses import dataclass, replace
from datetime import UTC, date, datetime
from enum import StrEnum

__all__ = ["Flight", "FlightState", "InvalidDelay", "delay_flight"]


class FlightState(StrEnum):
    SCHEDULED = "scheduled"
    DEPARTED = "departed"
    ARRIVED = "arrived"
    CANCELLED = "cancelled"


_DELAYABLE = frozenset({FlightState.SCHEDULED})


class InvalidDelay(ValueError):
    pass


@dataclass(frozen=True)
class Flight:
    number: str
    departure_date: date
    state: FlightState
    estimated_departure: datetime
    estimated_arrival: datetime
    delay_reason: str = ""

    def __post_init__(self) -> None:
        if self.estimated_arrival <= self.estimated_departure:
            raise ValueError("estimated arrival is not later than estimated departure")


def delay_flight(
    flight: Flight,
    new_estimated_departure: datetime,
    reason: str,
    *,
    notify: Callable[[Flight], None],
) -> Flight:
    if flight.state not in _DELAYABLE:
        raise InvalidDelay(f"state is {flight.state}, not scheduled")
    if new_estimated_departure <= flight.estimated_departure:
        raise InvalidDelay("new estimated departure is not later")
    shift = new_estimated_departure - flight.estimated_departure
    delayed = replace(
        flight,
        estimated_departure=new_estimated_departure,
        estimated_arrival=flight.estimated_arrival + shift,
        delay_reason=reason,
    )
    notify(delayed)
    return delayed


on_time = Flight(
    number="ZZ101",
    departure_date=date(2026, 3, 1),
    state=FlightState.SCHEDULED,
    estimated_departure=datetime(2026, 3, 1, 9, 0, tzinfo=UTC),
    estimated_arrival=datetime(2026, 3, 1, 11, 0, tzinfo=UTC),
)
sent: list[Flight] = []
new_departure = datetime(2026, 3, 1, 9, 30, tzinfo=UTC)
late = delay_flight(on_time, new_departure, "crew rest", notify=sent.append)
assert late.estimated_arrival == datetime(2026, 3, 1, 11, 30, tzinfo=UTC)
assert sent == [late]
```

**Anti-pattern: a one-file dump directory, and a rule hard-coded in code.** Its definition needs "and" (dates
and connection times), so both kinds of change edit it. `MIN_CONNECTION` hard-codes a rule that belongs to Airport
data: each airport sets its own minimum connection time, and people must be able to review it
([Ontology Rules](../ontology/SKILL.md#rules)). `connection_ok` also drops the name
`meets_minimum_connection_time`, the Python form of `meetsMinimumConnectionTime`.

```python
# airline/utils/helpers.py, the only file in utils/.
from datetime import UTC, date, datetime, timedelta

MIN_CONNECTION = timedelta(minutes=45)  # hard-coded value; public, so any module may depend on it


def parse_day(text: str) -> date:
    return date.fromisoformat(text)


def connection_ok(arrival: datetime, departure: datetime) -> bool:
    return departure - arrival >= MIN_CONNECTION


arrival = datetime(2026, 3, 1, 11, 30, tzinfo=UTC)
assert not connection_ok(arrival, datetime(2026, 3, 1, 12, 0, tzinfo=UTC))
```

## Reusability

**Description.** A reusable unit, such as a function, a class, or a module, serves a new caller without edits.
It does one job and takes everything it needs as explicit inputs. Reuse comes from small units with one job,
not from one unit that knows every caller. Generalize after the third real use; a flag added for one caller is
a sign of reuse forced too early.

**Good example.** One small job, explicit inputs, and no knowledge of any caller.

```python
from collections.abc import Callable


def retry[T](call: Callable[[], T], attempts: int) -> T:
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


assert retry(flaky, attempts=3) == "ok" and len(calls) == 3
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
  as `rate_limit.py`, or when one word is ambiguous among siblings. Never abbreviate to reach one word, and do
  not shadow a standard-library module, such as `random.py`.

**Good example.** In `billing/invoice.py`, each name adds one fact its container does not state.

```python
from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class Line:
    unit_price: Decimal
    quantity: int


@dataclass(frozen=True)
class Invoice:
    lines: tuple[Line, ...]

    def total(self) -> Decimal:
        return sum((line.unit_price * line.quantity for line in self.lines), Decimal(0))


assert Invoice((Line(Decimal("2.50"), 4),)).total() == Decimal("10.00")
```

**Anti-pattern: in `billing/billing_invoice_utils.py`, every name repeats its context or adds an empty word.**

```python
from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class InvoiceLineData:
    invoice_line_unit_price: Decimal
    invoice_line_quantity: int


@dataclass(frozen=True)
class InvoiceDataManager:
    invoice_lines_list: tuple[InvoiceLineData, ...]

    def calculate_invoice_total_amount(self) -> Decimal:
        lines = self.invoice_lines_list
        return sum((i.invoice_line_unit_price * i.invoice_line_quantity for i in lines), Decimal(0))


manager = InvoiceDataManager((InvoiceLineData(Decimal("2.50"), 4),))
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

**Good example.** The first call needs only `Client` (depth 1). A caller who tunes retries passes one keyword
argument, so the depth stays 1.

```python
def _send(url: str) -> str:  # stands in for the network call
    return f"200 {url}"


class Client:
    def __init__(self, base_url: str, *, attempts: int = 3) -> None:
        self.base_url = base_url
        self.attempts = attempts

    def get(self, path: str) -> str:
        for _ in range(self.attempts - 1):
            try:
                return _send(self.base_url + path)
            except TimeoutError:
                pass
        return _send(self.base_url + path)


client = Client("https://api.example.com")
assert client.get("/users") == "200 https://api.example.com/users"
tuned = Client("https://api.example.com", attempts=5)
assert tuned.get("/users") == "200 https://api.example.com/users"
```

**Anti-pattern: a depth-4 chain before the first call.** The good example above is its fix: defaults remove
the required types, and a keyword argument replaces the nested option types.

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
