# SOLID

This document holds the five SOLID principles, as named by Robert C. Martin. Each entry has a description of the
principle, its reason, its usual fix, and its over-applied form; a good example that shows the fix; and a labeled
anti-pattern that shows the violation.

## Single Responsibility Principle

**Description.** A class, module, or function answers to one actor: one person, team, or role whose requests
change it. An actor is one source of change, and a unit's secret, as
[Modularization](../principles.md#modularization) defines it, belongs to one actor. When one unit serves two
actors, a change for one actor can break behavior the other relies on. Move each actor's part into its own unit;
the part that serves another actor is often a plain function, not a new class. The over-applied form is a class
per method or per verb, or split parts that always change together: several methods that serve the same actor
belong in one unit.

**Good example.** `Invoice` keeps finance's rule, and the layout is a function that the web team owns.

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

**Anti-pattern: finance owns the total and the web team owns the HTML layout, but both edit `Invoice`.**

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

## Open-Closed Principle

**Description.** Where new variants keep arriving, add a variant by adding code, not by editing code that already
works. Otherwise each new variant edits the same `if` or `match` chains in several functions, and a missed chain
fails only at run time. The usual fix puts everything one variant needs in one place: a table of values and
functions, a [Strategy Pattern](design-pattern.md#strategy-pattern), or one class per variant. The over-applied
form is an extension point for a behavior that has one form. For example, a discount that is either a rate or
nothing needs a `rate: Decimal = Decimal(0)` argument, not a `Discount` interface with a `NoDiscount` class.

**Good example.** A new format adds one table entry, and no working function changes.

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

**Anti-pattern: export formats arrive often, and each one edits both functions.**

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

## Liskov Substitution Principle

**Description.** A subtype must work anywhere its base type works. It may not demand more from its inputs than
the base does, and it may not promise less about its results. A subtype that raises on, ignores, or narrows a base
method makes callers check `isinstance` before a call. The usual fix makes the subtype keep the base's promise, or
makes the base promise less so that every subtype can keep it; when neither works, the type is not a subtype and
needs its own type. The over-applied form is refusing any subtype that adds methods or accepts more input; a
subtype may do more than its base, but not less.

**Good example.** The SMS subtype keeps the base's promise by splitting long text itself.

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

**Anti-pattern: the base accepts text of any length, but the SMS subtype rejects long text.**

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

## Interface Segregation Principle

**Description.** A caller depends only on the operations it uses, so split a wide interface along the ways its
callers use it. Otherwise implementers and test fakes stub methods they never use, and a change to an unused
method still forces the caller's code to change or rebuild. The usual fix lets each caller declare a small
interface with only the methods it calls, and one class can satisfy several of them. The over-applied form is a
one-method interface for every method, or a split of an interface that every current caller uses in full.

**Good example.** `checksum` declares the one method it uses, and the real storage class still satisfies it.

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

**Anti-pattern: `checksum` only reads, but its fake must stub three methods it never uses.**

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

## Dependency Inversion Principle

**Description.** High-level policy does not create or import low-level detail. The policy states what it needs in
its own terms, and the caller supplies something that meets that need. Otherwise a test of the policy needs the
real database, network, file, or clock, and a change of vendor edits business code. The usual fix passes the
dependency in as an argument, typed with a `Callable` or a small `Protocol` that the policy owns, as
[Declare an interface where it is used](SKILL.md#declare-an-interface-where-it-is-used) describes. The
over-applied form is an interface for every class or a dependency-injection container for a small program. An
interface with one implementation is usually not worth its cost, so the concrete object or a function is often
enough until a second implementation or a test double needs the seam.

**Good example.** `Checkout` names the one operation it needs. Production passes a function that uses the mail
client, and the test passes a function that records the call. No interface class is needed.

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

**Anti-pattern: `Checkout` creates its own mail client, so no test can run it without a mail server.**

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
