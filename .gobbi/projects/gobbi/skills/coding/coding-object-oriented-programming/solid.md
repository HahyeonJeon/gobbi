# SOLID

This document holds the five SOLID principles, as named by Robert C. Martin. Each entry gives
the rule, the violation sign, the usual fix, the over-application sign, and a violation → fix example.

## Single Responsibility Principle

**Rule.** A class, module, or function answers to one actor: one person, team, or role whose requests change
it.

**Violation sign.** One unit changes for requests from different actors. A change for one actor can break
behavior another actor relies on.

**Usual fix.** Move each actor's part into its own unit. The part that serves another actor is often a plain
function, not a new class.

**Over-application sign.** Classes with one method each, a class per verb, or split parts that always change
together. Several methods that serve the same actor belong in one unit.

**Violation.** Finance owns the total, and the web team owns the HTML layout, but both edit `Invoice`.

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Invoice:
    lines: list[tuple[str, int]]  # (item, cents)

    def total_cents(self) -> int:  # finance's rule
        return sum(cents for _, cents in self.lines)

    def to_html(self) -> str:  # the web team's layout
        items = "".join(f"<li>{item}: {cents / 100:.2f}</li>" for item, cents in self.lines)
        return f"<ul>{items}</ul><p>Total {self.total_cents() / 100:.2f}</p>"


assert Invoice([("pen", 150), ("pad", 300)]).total_cents() == 450
```

**Fix.** `Invoice` keeps finance's rule. The layout moves to a function that the web team owns.

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Invoice:
    lines: list[tuple[str, int]]  # (item, cents)

    def total_cents(self) -> int:
        return sum(cents for _, cents in self.lines)


def invoice_html(invoice: Invoice) -> str:
    items = "".join(f"<li>{item}: {cents / 100:.2f}</li>" for item, cents in invoice.lines)
    return f"<ul>{items}</ul><p>Total {invoice.total_cents() / 100:.2f}</p>"


assert invoice_html(Invoice([("pen", 150)])).endswith("<p>Total 1.50</p>")
```

## Open-Closed Principle

**Rule.** Where new variants keep arriving, add a variant by adding code, not by editing code that already
works.

**Violation sign.** Each new variant edits the same `if` or `match` chains in several functions, and a missed
chain fails only at run time.

**Usual fix.** Put everything one variant needs in one place: a table of values and functions, a
[Strategy Pattern](design-pattern.md#strategy-pattern), or one class per variant.

**Over-application sign.** An extension point for a behavior that has one form. For example, a discount that is
either a rate or nothing needs a `rate: Decimal = Decimal(0)` argument, not a `Discount` interface with a
`NoDiscount` class.

**Violation.** Export formats arrive often, and each one edits both functions.

```python
import json


def render(rows: list[dict[str, str]], fmt: str) -> str:
    if fmt == "csv":
        return "\n".join([",".join(rows[0])] + [",".join(row.values()) for row in rows])
    if fmt == "json":
        return json.dumps(rows)
    raise ValueError(fmt)


def content_type(fmt: str) -> str:
    if fmt == "csv":
        return "text/csv"
    if fmt == "json":
        return "application/json"
    raise ValueError(fmt)


assert content_type("json") == "application/json"
```

**Fix.** A new format adds one table entry, and no working function changes.

```python
import json
from collections.abc import Callable
from dataclasses import dataclass


@dataclass(frozen=True)
class Format:
    content_type: str
    render: Callable[[list[dict[str, str]]], str]


def _csv(rows: list[dict[str, str]]) -> str:
    return "\n".join([",".join(rows[0])] + [",".join(row.values()) for row in rows])


FORMATS: dict[str, Format] = {
    "csv": Format("text/csv", _csv),
    "json": Format("application/json", json.dumps),
}

assert FORMATS["csv"].render([{"id": "1"}]) == "id\n1"
```

## Liskov Substitution Principle

**Rule.** A subtype must work anywhere its base type works. It may not demand more from its inputs than the
base does, and it may not promise less about its results.

**Violation sign.** A subtype raises on, ignores, or narrows a method of its base. Callers start to check
`isinstance` before a call.

**Usual fix.** Make the subtype keep the base's promise, or make the base promise less, so every subtype can
keep it. When neither works, the type is not a subtype and needs its own type.

**Over-application sign.** Refusing any subtype that adds methods or accepts more input. A subtype may do more
than its base; it may not do less.

**Violation.** The base accepts text of any length, but the SMS subtype rejects long text.

```python
from typing import override


class Notifier:
    def send(self, text: str) -> list[str]:
        """Delivers text of any length and returns the parts it sent."""
        return [text]


class SmsNotifier(Notifier):
    @override
    def send(self, text: str) -> list[str]:
        if len(text) > 160:  # a stronger demand than the base makes
            raise ValueError("SMS text is over 160 characters")
        return [text]


def alert(notifier: Notifier, text: str) -> int:
    return len(notifier.send(text))


assert alert(Notifier(), "x" * 200) == 1  # alert(SmsNotifier(), "x" * 200) raises
```

**Fix.** The SMS subtype keeps the base's promise by splitting long text itself.

```python
from typing import override


class Notifier:
    def send(self, text: str) -> list[str]:
        """Delivers text of any length and returns the parts it sent."""
        return [text]


class SmsNotifier(Notifier):
    @override
    def send(self, text: str) -> list[str]:
        return [text[start : start + 160] for start in range(0, len(text), 160)] or [""]


def alert(notifier: Notifier, text: str) -> int:
    return len(notifier.send(text))


assert alert(SmsNotifier(), "x" * 200) == 2
```

## Interface Segregation Principle

**Rule.** A caller depends only on the operations it uses. Split a wide interface along the ways its callers
use it.

**Violation sign.** Implementers or test fakes stub methods they never use. A change to an unused method still
forces the caller's code to change or rebuild.

**Usual fix.** Let each caller declare a small interface with only the methods it calls. One class can satisfy
several of them.

**Over-application sign.** A one-method interface for every method, or a split of an interface that every
current caller uses in full.

**Violation.** `checksum` reads only, but its fake must stub three methods.

```python
from typing import Protocol


class Storage(Protocol):
    def read(self, key: str) -> bytes: ...
    def write(self, key: str, data: bytes) -> None: ...
    def delete(self, key: str) -> None: ...
    def list_keys(self) -> list[str]: ...


def checksum(storage: Storage, key: str) -> int:
    return sum(storage.read(key)) % 256


class FakeStorage:
    def read(self, key: str) -> bytes:
        return b"\x01\x02"

    def write(self, key: str, data: bytes) -> None:
        raise NotImplementedError

    def delete(self, key: str) -> None:
        raise NotImplementedError

    def list_keys(self) -> list[str]:
        raise NotImplementedError


assert checksum(FakeStorage(), "a") == 3
```

**Fix.** `checksum` declares the one method it uses. The real storage class still satisfies it.

```python
from typing import Protocol


class Readable(Protocol):
    def read(self, key: str) -> bytes: ...


def checksum(source: Readable, key: str) -> int:
    return sum(source.read(key)) % 256


class FakeSource:
    def read(self, key: str) -> bytes:
        return b"\x01\x02"


assert checksum(FakeSource(), "a") == 3
```

## Dependency Inversion Principle

**Rule.** High-level policy does not create or import low-level detail. The policy states what it needs in its
own terms, and the caller supplies something that meets that need.

**Violation sign.** Business logic creates its own database, network, file, or clock object. A test then needs
the real resource, and a change of vendor edits business code.

**Usual fix.** Pass the dependency in as an argument. Type it with a `Callable` when the policy needs one
operation, or with a small `Protocol` owned by the policy when it needs several.

**Over-application sign.** An interface for every class, an interface with one implementation and no test
double, or a dependency-injection container for a small program. Pass the concrete object until a second
implementation or a used test double exists.

**Violation.** `Checkout` creates its own mail client, so no test can run it without a mail server.

```python
class SmtpClient:
    def deliver(self, host: str, to: str, body: str) -> None:
        raise ConnectionError(f"no network access to {host}")


class Checkout:
    def __init__(self) -> None:
        self._mail = SmtpClient()  # the policy creates the detail itself

    def complete(self, email: str, cents: int) -> None:
        self._mail.deliver("smtp.example.com", email, f"Paid {cents / 100:.2f}")


try:
    Checkout().complete("ada@example.com", 1250)
except ConnectionError:
    pass  # every test of Checkout ends here
```

**Fix.** `Checkout` names the one operation it needs. Production passes a function that uses the mail client,
and the test passes a function that records the call. No interface class is needed.

```python
from collections.abc import Callable

type SendReceipt = Callable[[str, str], None]  # (address, body), owned by the checkout side


class Checkout:
    def __init__(self, send_receipt: SendReceipt) -> None:
        self._send_receipt = send_receipt

    def complete(self, email: str, cents: int) -> None:
        self._send_receipt(email, f"Paid {cents / 100:.2f}")


sent: list[tuple[str, str]] = []
Checkout(lambda to, body: sent.append((to, body))).complete("ada@example.com", 1250)
assert sent == [("ada@example.com", "Paid 12.50")]
```
