# OOP Principles

This document holds the four object-oriented principles: encapsulation, abstraction, inheritance, and
polymorphism. Each entry has a description of the principle and its reason, a good example, and a labeled
anti-pattern. Principles that apply to procedural code too are in [Coding Principles](../principles.md).

## Encapsulation

**Description.** An object keeps its data private and changes it only through its own methods, so the rules
that keep the data valid live in one place. When any code can write a field, every writer must repeat the
rule, and one missed writer breaks it. Callers also depend on the field layout, so the class cannot change how
it stores data. A plain record with no rule to protect may keep public fields.

**Good example.** Only the constructor and `withdraw` write the balance, and both keep it at zero or more.

```python
class Account:
    def __init__(self, balance: int = 0) -> None:
        if balance < 0:
            raise ValueError(f"cannot open with {balance}")
        self._balance = balance

    @property
    def balance(self) -> int:
        return self._balance

    def withdraw(self, amount: int) -> None:
        if amount <= 0 or amount > self._balance:
            raise ValueError(f"cannot withdraw {amount}")
        self._balance -= amount


account = Account(100)
account.withdraw(30)
assert account.balance == 70
```

**Anti-pattern: callers change the balance and repeat the rule.**

```python
from dataclasses import dataclass


@dataclass
class Account:
    balance: int = 0


def pay_bill(account: Account, amount: int) -> None:
    if 0 < amount <= account.balance:  # every caller must remember this rule
        account.balance -= amount


account = Account(100)
pay_bill(account, 30)
account.balance -= 500  # nothing stops a caller that forgot the rule
assert account.balance == -430
```

## Abstraction

**Description.** A type exposes what an operation does and hides how it does it. The caller uses a name and a
promise, not the steps behind them. Callers then stay unchanged when the steps change, and a reader thinks at
one level at a time. An abstraction that hides nothing only adds a name to learn, which is why an interface
with one implementation is usually not worth its cost.

**Good example.** Callers ask one question, `allow()`, and never see the time window.

```python
import time
from collections import deque


class RateLimiter:
    """Allows at most `limit` calls in any `window` seconds."""

    def __init__(self, limit: int, window: float) -> None:
        self._limit = limit
        self._window = window
        self._calls: deque[float] = deque()

    def allow(self) -> bool:
        now = time.monotonic()
        while self._calls and now - self._calls[0] > self._window:
            self._calls.popleft()
        if len(self._calls) >= self._limit:
            return False
        self._calls.append(now)
        return True


limiter = RateLimiter(limit=2, window=60)
assert [limiter.allow() for _ in range(3)] == [True, True, False]
```

**Anti-pattern: the fields are private, but every caller must know the algorithm.**

```python
import time
from collections import deque


class RateLimiter:
    def __init__(self, limit: int, window: float) -> None:
        self._limit = limit
        self._window = window
        self._calls: deque[float] = deque()

    def prune(self, now: float) -> None:
        while self._calls and now - self._calls[0] > self._window:
            self._calls.popleft()

    def has_room(self) -> bool:
        return len(self._calls) < self._limit

    def record(self, now: float) -> None:
        self._calls.append(now)


limiter = RateLimiter(limit=2, window=60)
now = time.monotonic()
limiter.prune(now)  # a caller that skips this step or changes the order gets a wrong answer
if limiter.has_room():
    limiter.record(now)
```

## Inheritance

**Description.** A subclass is a kind of its base. It takes the base's interface and code, and it must keep
every promise the base makes. Callers can then use many subtypes through one base type. Inheritance also ties
the subclass to every method of the base, so a subclass made only to reuse code inherits operations that break
its own rules.

**Good example.** Every error is a kind of `PaymentError`, and callers handle all of them through the base.

```python
class PaymentError(Exception):
    """Base for every payment failure. Callers catch this one type."""


class CardDeclined(PaymentError):
    pass


class GatewayTimeout(PaymentError):
    def __init__(self, seconds: float) -> None:
        super().__init__(f"gateway timed out after {seconds}s")
        self.seconds = seconds


failures: list[str] = []
for failure in [CardDeclined("card 4000"), GatewayTimeout(30)]:
    try:
        raise failure
    except PaymentError as error:  # both subtypes work through the base
        failures.append(type(error).__name__)
assert failures == ["CardDeclined", "GatewayTimeout"]
```

**Anti-pattern: a subclass made only to reuse `list` code.** The fix holds a `list` in a private field and
exposes only `push`, `pop`, and `top`.

```python
class Stack(list[int]):
    def push(self, item: int) -> None:
        self.append(item)

    def top(self) -> int:
        return self[-1]


stack = Stack()
stack.push(1)
stack.push(2)
stack.insert(0, 99)  # inherited list methods break the last-in, first-out rule
stack.sort(reverse=True)
assert stack.top() == 1  # the most recent push was 2
```

## Polymorphism

**Description.** Different types answer the same call in their own way. The caller makes the call and does not
check which type it holds, so a new type needs a new class, not an edit to every function that tests types.
When the set of types is closed and new operations keep arriving, one `match` per operation is the better form;
the [Visitor Pattern](design-pattern.md#visitor-pattern) is the class form of the same choice.

**Good example.** `total_area` works for any shape, including shapes added later.

```python
from dataclasses import dataclass
from math import pi
from typing import Protocol


class Shape(Protocol):
    def area(self) -> float: ...


@dataclass
class Circle:
    radius: float

    def area(self) -> float:
        return pi * self.radius**2


@dataclass
class Rectangle:
    width: float
    height: float

    def area(self) -> float:
        return self.width * self.height


def total_area(shapes: list[Shape]) -> float:
    return sum(shape.area() for shape in shapes)


assert round(total_area([Circle(1), Rectangle(2, 3)]), 2) == 9.14
```

**Anti-pattern: the same type test repeated in each function while new shapes keep arriving.**

```python
from dataclasses import dataclass
from math import pi


@dataclass
class Circle:
    radius: float


@dataclass
class Rectangle:
    width: float
    height: float


def area(shape: Circle | Rectangle) -> float:
    if isinstance(shape, Circle):
        return pi * shape.radius**2
    return shape.width * shape.height


def perimeter(shape: Circle | Rectangle) -> float:  # the same test again
    if isinstance(shape, Circle):
        return 2 * pi * shape.radius
    return 2 * (shape.width + shape.height)


assert area(Rectangle(2, 3)) == 6  # a new Triangle must edit both functions
```
