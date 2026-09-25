# Design Patterns

This document holds 20 design patterns from *Design Patterns* by Gamma, Helm, Johnson, and Vlissides (1994),
grouped as creational, structural, and behavioral. Each entry says what the pattern is and gives one typed
Python example; to decide whether a pattern fits, use the
[problem-sign table](SKILL.md#match-the-problem-sign-not-the-pattern-name).

## Creational

Creational patterns control how objects are created.

### Abstract Factory Pattern

The Abstract Factory Pattern creates a family of related objects through one interface, so the objects of one
family always match. Here `Services` is the factory, and the test family pairs a fixed clock with a sender that
records mail instead of sending it.

```python
from collections.abc import Callable
from datetime import datetime
from typing import Protocol

type Clock = Callable[[], datetime]
type Send = Callable[[str, str], None]  # (address, body)


class Services(Protocol):  # abstract factory: one method per product kind
    def clock(self) -> Clock: ...
    def sender(self) -> Send: ...


class LiveServices:
    def clock(self) -> Clock:
        return datetime.now

    def sender(self) -> Send:
        return lambda to, body: print(f"mail to {to}: {body}")


class TestServices:
    def __init__(self) -> None:
        self.sent: list[str] = []

    def clock(self) -> Clock:
        return lambda: datetime(2026, 1, 1)

    def sender(self) -> Send:
        return lambda to, body: self.sent.append(f"{to}: {body}")


def remind(services: Services, to: str) -> None:
    today = services.clock()()
    services.sender()(to, f"due {today:%Y-%m-%d}")


test = TestServices()
remind(test, "ada@example.com")
assert test.sent == ["ada@example.com: due 2026-01-01"]
```

### Builder Pattern

The Builder Pattern assembles one complex object through named steps and checks the whole object once, in
`build()`. Here `where` may repeat, so keyword arguments alone cannot express the query.

```python
from dataclasses import dataclass
from typing import Self


@dataclass(frozen=True)
class Query:
    table: str
    filters: tuple[str, ...]
    limit: int | None


class QueryBuilder:
    def __init__(self, table: str) -> None:
        self._table = table
        self._filters: list[str] = []
        self._limit: int | None = None

    def where(self, condition: str) -> Self:
        self._filters.append(condition)
        return self

    def limit(self, count: int) -> Self:
        self._limit = count
        return self

    def build(self) -> Query:
        if self._limit is not None and self._limit <= 0:
            raise ValueError("limit must be positive")
        return Query(self._table, tuple(self._filters), self._limit)


query = QueryBuilder("orders").where("paid").where("total > 10").limit(5).build()
assert query.filters == ("paid", "total > 10")
```

### Factory Method Pattern

The Factory Method Pattern lets a subclass choose which object a base class's workflow creates, through one method
the subclass overrides. Here `load` is the shared workflow, and each subclass's `parser` method is the factory
method.

```python
import json
from abc import ABC, abstractmethod
from collections.abc import Callable

type Parse = Callable[[str], dict[str, str]]


def parse_env(text: str) -> dict[str, str]:
    pairs = (line.partition("=") for line in text.splitlines() if line)
    return {key: value for key, _, value in pairs}


class ConfigLoader(ABC):
    def load(self, text: str) -> dict[str, str]:
        data = self.parser()(text)
        return {key.strip().lower(): value.strip() for key, value in data.items()}

    @abstractmethod
    def parser(self) -> Parse: ...  # the factory method


class EnvLoader(ConfigLoader):
    def parser(self) -> Parse:
        return parse_env


class JsonLoader(ConfigLoader):
    def parser(self) -> Parse:
        return json.loads


assert EnvLoader().load("HOST = db\n") == {"host": "db"}
assert JsonLoader().load('{"Port": "5432"}') == {"port": "5432"}
```

### Prototype Pattern

The Prototype Pattern creates a new object by copying a configured instance, then changes only what differs. Here
`clone` copies deeply, and the last lines show the shared-list bug that a shallow copy causes.

```python
import copy
from dataclasses import dataclass, field, replace
from typing import Self


@dataclass
class Campaign:
    subject: str
    recipients: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)

    def clone(self) -> Self:
        return copy.deepcopy(self)


template = Campaign("Spring sale", tags=["promo", "email"])
april = template.clone()
april.recipients.append("ada@example.com")
assert template.recipients == []  # the prototype is unchanged

shallow = replace(template)  # copies only the top level
shallow.tags.append("sms")
assert template.tags == ["promo", "email", "sms"]  # the list is shared
```

### Singleton Pattern

The Singleton Pattern makes sure a class has exactly one instance per process and gives one access point to it.
Here `settings()` creates the one object on the first call, and code that takes `Settings` as an argument stays
testable.

```python
import functools
import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    database_url: str
    debug: bool


@functools.cache
def settings() -> Settings:
    return Settings(
        database_url=os.environ.get("DATABASE_URL", "sqlite:///local.db"),
        debug=os.environ.get("DEBUG") == "1",
    )


def connection_label(config: Settings) -> str:
    return config.database_url.split(":", 1)[0]


assert settings() is settings()
assert connection_label(Settings("postgres://db", debug=False)) == "postgres"
```

## Structural

Structural patterns control how objects are combined into larger structures.

### Adapter Pattern

The Adapter Pattern wraps an existing object so that it fits an interface your code already uses. Here checkout
uses `Payments`, and `AcmePayments` adapts a vendor client that works in cents.

```python
from decimal import Decimal
from typing import Protocol


class Payments(Protocol):  # target: the interface checkout already uses
    def charge(self, amount: Decimal, card: str) -> str: ...


class AcmePayClient:  # adaptee: a vendor class you cannot change
    def create_charge(self, cents: int, source: str) -> dict[str, str]:
        return {"id": f"ch_{cents}", "source": source}


class AcmePayments:  # adapter
    def __init__(self, client: AcmePayClient) -> None:
        self._client = client

    def charge(self, amount: Decimal, card: str) -> str:
        return self._client.create_charge(int(amount * 100), card)["id"]


def checkout(payments: Payments, total: Decimal) -> str:
    return payments.charge(total, card="tok_visa")


assert checkout(AcmePayments(AcmePayClient()), Decimal("12.50")) == "ch_1250"
```

### Bridge Pattern

The Bridge Pattern splits a concept into two sides that vary on their own, such as what a document says and how it
is rendered. Here two documents and two renderers take four classes, and a third of each makes six classes, not
nine.

```python
from dataclasses import dataclass
from typing import Protocol


class Renderer(Protocol):  # implementor
    def title(self, text: str) -> str: ...
    def line(self, text: str) -> str: ...


class TextRenderer:
    def title(self, text: str) -> str:
        return text.upper()

    def line(self, text: str) -> str:
        return f"- {text}"


class HtmlRenderer:
    def title(self, text: str) -> str:
        return f"<h1>{text}</h1>"

    def line(self, text: str) -> str:
        return f"<p>{text}</p>"


@dataclass
class Receipt:  # abstraction: holds any renderer
    renderer: Renderer

    def show(self, total: str) -> str:
        return "\n".join([self.renderer.title("Receipt"), self.renderer.line(f"Paid {total}")])


@dataclass
class Invoice:
    renderer: Renderer

    def show(self, total: str) -> str:
        return "\n".join([self.renderer.title("Invoice"), self.renderer.line(f"Due {total}")])


assert Receipt(TextRenderer()).show("9.00") == "RECEIPT\n- Paid 9.00"
assert Invoice(HtmlRenderer()).show("9.00") == "<h1>Invoice</h1>\n<p>Due 9.00</p>"
```

### Composite Pattern

The Composite Pattern lets callers treat one item and a group of items the same way through one interface, so they
can process a tree without checking node kinds. Here a bundle's price combines the prices of its items, and bundles
can hold bundles.

```python
from dataclasses import dataclass, field
from decimal import Decimal
from typing import Protocol


class Priced(Protocol):
    def price(self) -> Decimal: ...


@dataclass
class Product:  # leaf
    name: str
    unit_price: Decimal

    def price(self) -> Decimal:
        return self.unit_price


@dataclass
class Bundle:  # composite
    name: str
    items: list[Priced] = field(default_factory=list)
    discount: Decimal = Decimal(0)

    def price(self) -> Decimal:
        return sum((item.price() for item in self.items), Decimal(0)) - self.discount


desk = Bundle("desk set", [Product("lamp", Decimal(30)), Product("mat", Decimal(10))], Decimal(5))
office = Bundle("office", [desk, Product("chair", Decimal(90))])
assert office.price() == Decimal(125)
```

### Decorator Pattern

The Decorator Pattern wraps an object in another object with the same interface to add behavior before or after its
calls, and the wrappers can stack in any order. Here `Retrying` adds retries to any `Fetcher`.

```python
from typing import Protocol


class Fetcher(Protocol):
    def fetch(self, url: str) -> str: ...


class FlakyFetcher:  # concrete component: fails on the first call
    def __init__(self) -> None:
        self.calls = 0

    def fetch(self, url: str) -> str:
        self.calls += 1
        if self.calls == 1:
            raise TimeoutError(url)
        return f"body of {url}"


class Retrying:  # decorator
    def __init__(self, inner: Fetcher, attempts: int = 3) -> None:
        self._inner = inner
        self._attempts = attempts

    def fetch(self, url: str) -> str:
        for _ in range(self._attempts - 1):
            try:
                return self._inner.fetch(url)
            except TimeoutError:
                pass
        return self._inner.fetch(url)


assert Retrying(FlakyFetcher()).fetch("/a") == "body of /a"
```

### Facade Pattern

The Facade Pattern gives one simple entry point for a common task that needs several subsystem classes. Here the
function `publish` is the whole facade.

```python
class Transcoder:
    def to_mp4(self, path: str) -> str:
        return path.rsplit(".", 1)[0] + ".mp4"


class Thumbnailer:
    def frame(self, video: str, second: int) -> str:
        return f"{video}@{second}s.jpg"


class Storage:
    def __init__(self) -> None:
        self.files: list[str] = []

    def upload(self, path: str) -> str:
        self.files.append(path)
        return f"https://cdn.example.com/{path}"


def publish(path: str, storage: Storage) -> str:
    video = Transcoder().to_mp4(path)
    storage.upload(Thumbnailer().frame(video, second=1))
    return storage.upload(video)


storage = Storage()
assert publish("talk.mov", storage) == "https://cdn.example.com/talk.mp4"
assert storage.files == ["talk.mp4@1s.jpg", "talk.mp4"]
```

### Proxy Pattern

The Proxy Pattern stands in for another object with the same interface and controls access to it, for example to
check permission, delay creation, cache results, or reach a remote object. Here `GuardedReports` checks the role
and opens the slow archive only on first use.

```python
from typing import Protocol


class Reports(Protocol):
    def read(self, report_id: str) -> str: ...


class ReportArchive:  # real subject: slow to open
    def read(self, report_id: str) -> str:
        return f"report {report_id}"


class GuardedReports:  # proxy
    def __init__(self, role: str) -> None:
        self._role = role
        self._archive: ReportArchive | None = None

    def read(self, report_id: str) -> str:
        if self._role != "auditor":
            raise PermissionError(report_id)
        if self._archive is None:
            self._archive = ReportArchive()
        return self._archive.read(report_id)


def show(reports: Reports, report_id: str) -> str:
    return reports.read(report_id)


assert show(GuardedReports("auditor"), "q3") == "report q3"
```

## Behavioral

Behavioral patterns assign responsibilities between objects and control how they communicate.

### Chain of Responsibility Pattern

The Chain of Responsibility Pattern passes a request along an ordered list of handlers until one of them takes it.
Here each department configures its own list of approvers, and `approve` returns the board when no approver takes
the amount.

```python
from collections.abc import Callable
from decimal import Decimal

type Approver = Callable[[Decimal], str | None]  # a name, or None to pass the request on


def team_lead(amount: Decimal) -> str | None:
    return "team lead" if amount <= 500 else None


def director(amount: Decimal) -> str | None:
    return "director" if amount <= 5000 else None


def approve(amount: Decimal, chain: list[Approver]) -> str:
    for approver in chain:
        if (name := approver(amount)) is not None:
            return name
    return "board"  # the default when no handler takes the request


sales: list[Approver] = [team_lead, director]
assert approve(Decimal(120), sales) == "team lead"
assert approve(Decimal(9000), sales) == "board"
```

### Command Pattern

The Command Pattern turns a request into an object, so the request can be stored, queued, logged, or undone apart
from the moment it runs. Here each command saves what its own undo needs, and the history undoes the last command.

```python
from dataclasses import dataclass
from typing import Protocol


class Command(Protocol):
    def execute(self, doc: list[str]) -> None: ...
    def undo(self, doc: list[str]) -> None: ...


@dataclass
class Append:
    line: str

    def execute(self, doc: list[str]) -> None:
        doc.append(self.line)

    def undo(self, doc: list[str]) -> None:
        doc.pop()


@dataclass
class Replace:
    index: int
    line: str
    old: str = ""

    def execute(self, doc: list[str]) -> None:
        self.old, doc[self.index] = doc[self.index], self.line

    def undo(self, doc: list[str]) -> None:
        doc[self.index] = self.old


doc: list[str] = []
history: list[Command] = [Append("hello"), Replace(0, "hi")]
for command in history:
    command.execute(doc)
history.pop().undo(doc)
assert doc == ["hello"]
```

### Iterator Pattern

The Iterator Pattern gives the elements of a collection one at a time, without showing how the collection stores
them. Here a generator function lets callers loop over every item and never see the API's pages.

```python
from collections.abc import Iterator


class PagedClient:  # a fake API that returns two items per page
    def __init__(self, items: list[str]) -> None:
        self._items = items

    def page(self, number: int) -> list[str]:
        return self._items[number * 2 : number * 2 + 2]


def all_items(client: PagedClient) -> Iterator[str]:
    number = 0
    while page := client.page(number):
        yield from page
        number += 1


client = PagedClient(["a", "b", "c", "d", "e"])
assert list(all_items(client)) == ["a", "b", "c", "d", "e"]
```

### Mediator Pattern

The Mediator Pattern moves the rules for how several objects affect each other into one object, so the objects talk
to that object and not to each other. Here `SignupForm` is the one place that knows how the controls affect each
other.

```python
from collections.abc import Callable


class Control:  # colleague: reports changes only to the mediator
    def __init__(self, on_change: Callable[[], None], enabled: bool = True) -> None:
        self.value = ""
        self.enabled = enabled
        self._on_change = on_change

    def type(self, value: str) -> None:
        self.value = value
        self._on_change()


class SignupForm:  # mediator
    def __init__(self) -> None:
        self.email = Control(self._update)
        self.company = Control(self._update, enabled=False)
        self.submit = Control(self._update, enabled=False)

    def _update(self) -> None:
        work = self.email.value.endswith("@acme.com")
        self.company.enabled = work
        self.submit.enabled = "@" in self.email.value and (not work or bool(self.company.value))


form = SignupForm()
form.email.type("ada@acme.com")
assert form.company.enabled and not form.submit.enabled
form.company.type("Acme")
assert form.submit.enabled
```

### Observer Pattern

The Observer Pattern lets an object notify a changing set of listeners when an event happens, without knowing who
they are. Here `Orders` knows only that listeners exist, and `subscribe` returns the function that unsubscribes.

```python
from collections.abc import Callable
from dataclasses import dataclass


@dataclass(frozen=True)
class OrderPaid:
    order_id: str
    cents: int


type Listener = Callable[[OrderPaid], None]


class Orders:  # subject
    def __init__(self) -> None:
        self._listeners: list[Listener] = []

    def subscribe(self, listener: Listener) -> Callable[[], None]:
        self._listeners.append(listener)
        return lambda: self._listeners.remove(listener)

    def pay(self, order_id: str, cents: int) -> None:
        event = OrderPaid(order_id, cents)
        for listener in list(self._listeners):
            listener(event)


log: list[str] = []
orders = Orders()
unsubscribe = orders.subscribe(lambda event: log.append(f"receipt {event.order_id}"))
orders.subscribe(lambda event: log.append(f"stats +{event.cents}"))
orders.pay("A1", 900)
unsubscribe()
orders.pay("A2", 100)
assert log == ["receipt A1", "stats +900", "stats +100"]
```

### State Pattern

The State Pattern moves each mode's behavior into its own state object, so an object changes its behavior when its
mode changes. Here the `Review` mode holds its own data, the set of approvers, which is why state classes fit.

```python
from __future__ import annotations

from typing import Protocol


class State(Protocol):
    def approve(self, doc: Document, reviewer: str) -> None: ...


class Draft:
    def approve(self, doc: Document, reviewer: str) -> None:
        doc.state = Review()  # the author's approval sends the draft to review


class Review:
    def __init__(self) -> None:
        self.approvers: set[str] = set()

    def approve(self, doc: Document, reviewer: str) -> None:
        self.approvers.add(reviewer)
        if len(self.approvers) == 2:
            doc.state = Published()


class Published:
    def approve(self, doc: Document, reviewer: str) -> None:
        raise ValueError("already published")


class Document:  # context
    def __init__(self) -> None:
        self.state: State = Draft()

    def approve(self, reviewer: str) -> None:
        self.state.approve(self, reviewer)


doc = Document()
for reviewer in ["author", "ana", "ana", "ben"]:
    doc.approve(reviewer)
assert isinstance(doc.state, Published)
```

### Strategy Pattern

The Strategy Pattern puts interchangeable algorithms behind one operation and lets the caller choose which one to
use. Here `total` calls the chosen `TaxRule`, and `RateTax` is a class, not a bare function, because it holds its
rate.

```python
from dataclasses import dataclass
from decimal import Decimal
from typing import Protocol


class TaxRule(Protocol):
    def amount(self, subtotal: Decimal) -> Decimal: ...


@dataclass(frozen=True)
class RateTax:
    rate: Decimal

    def amount(self, subtotal: Decimal) -> Decimal:
        return subtotal * self.rate


class ExportTax:
    def amount(self, subtotal: Decimal) -> Decimal:
        return Decimal(0)


def total(subtotal: Decimal, tax: TaxRule) -> Decimal:
    return subtotal + tax.amount(subtotal)


assert total(Decimal(100), RateTax(Decimal("0.05"))) == Decimal(105)
assert total(Decimal(100), ExportTax()) == Decimal(100)
```

### Template Method Pattern

The Template Method Pattern fixes the order of an algorithm's steps in a base class and lets subclasses fill in the
steps that vary. Here `render` fixes the order, and `footer` is an optional hook that only `StockReport` overrides.

```python
from abc import ABC, abstractmethod
from datetime import date


class Report(ABC):
    title: str

    def render(self, day: date) -> str:  # the template method
        lines = [f"{self.title} for {day:%Y-%m-%d}", *self.rows(day)]
        if footer := self.footer():
            lines.append(footer)
        return "\n".join(lines)

    @abstractmethod
    def rows(self, day: date) -> list[str]: ...  # a required step

    def footer(self) -> str:  # a hook with a default
        return ""


class SalesReport(Report):
    title = "Sales"

    def rows(self, day: date) -> list[str]:
        return ["north: 12", "south: 7"]


class StockReport(Report):
    title = "Stock"

    def rows(self, day: date) -> list[str]:
        return ["pens: 40"]

    def footer(self) -> str:
        return "Counted at 09:00"


assert SalesReport().render(date(2026, 3, 1)).startswith("Sales for 2026-03-01")
assert StockReport().render(date(2026, 3, 1)).endswith("Counted at 09:00")
```

### Visitor Pattern

The Visitor Pattern adds new operations over a fixed set of element types without editing those types, with one
visitor class per operation and one method per element type. Here `Evaluate` and `Show` are two operations over
`Num` and `Add`.

```python
from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


class Visitor[R](Protocol):
    def num(self, node: Num) -> R: ...
    def add(self, node: Add) -> R: ...


@dataclass
class Num:
    value: int

    def accept[R](self, visitor: Visitor[R]) -> R:
        return visitor.num(self)


@dataclass
class Add:
    left: Num | Add
    right: Num | Add

    def accept[R](self, visitor: Visitor[R]) -> R:
        return visitor.add(self)


class Evaluate:
    def num(self, node: Num) -> int:
        return node.value

    def add(self, node: Add) -> int:
        return node.left.accept(self) + node.right.accept(self)


class Show:
    def num(self, node: Num) -> str:
        return str(node.value)

    def add(self, node: Add) -> str:
        return f"({node.left.accept(self)} + {node.right.accept(self)})"


tree = Add(Num(1), Add(Num(2), Num(3)))
assert tree.accept(Evaluate()) == 6
assert tree.accept(Show()) == "(1 + (2 + 3))"
```
