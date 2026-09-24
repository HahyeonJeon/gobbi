# SOLID

This file describes the five SOLID principles. Coding Ideation reads it in Phase 2 while designing classes and methods. Coding Execution reads it while implementing the accepted design. Execution does not replace that design to chase a principle.

The name SOLID was popularized by Robert C. Martin. The wording and examples below are original. The examples are Python so the shape is easy to see. Design and code use the project's language. The examples are not files to copy into the project.

A principle applies when it keeps the accepted responsibilities, boundaries, and relationships clear. It does not require an extra class that the concept does not need.

## Single Responsibility Principle

A class or method has one reason to change. That reason is one responsibility. If a type both calculates a total and sends mail, a change to the mail format and a change to the total rule both edit the same type. Split those responsibilities. Callers can still run them in order.

Do not split a type that has one reason to change into empty pieces. One cohesive responsibility can include several methods.

```python
class OrderTotal:
    def amount(self, lines):
        return sum(line.price * line.quantity for line in lines)

class OrderMail:
    def __init__(self, sender):
        self.sender = sender

    def send_receipt(self, address, amount):
        self.sender.send(address, f"Total {amount}")

class Checkout:
    def __init__(self, totals, mail):
        self.totals = totals
        self.mail = mail

    def complete(self, lines, address):
        amount = self.totals.amount(lines)
        self.mail.send_receipt(address, amount)
        return amount
```

## Open-Closed Principle

A type is open for extension and closed for modification when new behavior arrives as a new type, and existing callers keep using the type they already know. Adding a discount should not require a new branch inside every order method that already works.

Use this when the set of variants is expected to grow. Do not build an extension point for a behavior that has only one form.

```python
class Discount:
    def apply(self, amount):
        raise NotImplementedError

class NoDiscount(Discount):
    def apply(self, amount):
        return amount

class RateDiscount(Discount):
    def __init__(self, rate):
        self.rate = rate

    def apply(self, amount):
        return amount * (1 - self.rate)

class PricedOrder:
    def __init__(self, discount):
        self.discount = discount

    def total(self, amount):
        return self.discount.apply(amount)
```

## Liskov Substitution Principle

A caller that uses a base type must be able to receive a subtype and still get the behavior it was promised. The subtype may add detail. It may not refuse a call the base type accepts, or change the meaning of a result the caller already relies on.

If `save` on a store means the value is kept, a subtype that raises on every `save` cannot stand in for that store. Give that subtype a different type, or narrow the base promise so every subtype can keep it.

```python
class Store:
    def save(self, key, value):
        raise NotImplementedError

    def load(self, key):
        raise NotImplementedError

class MemoryStore(Store):
    def __init__(self):
        self._data = {}

    def save(self, key, value):
        self._data[key] = value

    def load(self, key):
        return self._data[key]

def remember(store, key, value):
    store.save(key, value)
    return store.load(key)
```

## Interface Segregation Principle

A caller should depend only on the operations it uses. A wide type that forces a reader to implement `write`, or a writer to implement `search`, couples callers to work they do not do. Split the type along the callers' real uses.

Do not split an interface that every current caller uses in full. The split follows callers, not a wish for more types.

```python
class Readable:
    def read(self, key):
        raise NotImplementedError

class Writable:
    def write(self, key, value):
        raise NotImplementedError

class MemoryDocument(Readable, Writable):
    def __init__(self):
        self._data = {}

    def read(self, key):
        return self._data[key]

    def write(self, key, value):
        self._data[key] = value

def show(source, key):
    return source.read(key)
```

## Dependency Inversion Principle

High-level work depends on an abstraction it owns, not on a concrete lower-level type. The concrete type implements that abstraction and is supplied from outside. A checkout can depend on a `Notifier` and receive an email sender, a test double, or another sender without naming those classes.

The abstraction should say what the high-level work needs. It should not copy the concrete type's details and call that a dependency inversion.

```python
class Notifier:
    def send(self, address, message):
        raise NotImplementedError

class EmailNotifier(Notifier):
    def send(self, address, message):
        return f"email to {address}: {message}"

class CheckoutNotice:
    def __init__(self, notifier):
        self.notifier = notifier

    def finished(self, address, amount):
        return self.notifier.send(address, f"paid {amount}")

notice = CheckoutNotice(EmailNotifier())
notice.finished("ada@example.com", 20)
```
