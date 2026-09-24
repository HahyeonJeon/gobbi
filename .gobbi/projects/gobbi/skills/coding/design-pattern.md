# Design Patterns

This file is the pattern set Coding Ideation reads in Phase 2 before class and method design. Coding Execution reads it only for the patterns named by that accepted design.

The set is the 23 object-oriented patterns published by Gamma, Helm, Johnson, and Vlissides in *Design Patterns* (Addison-Wesley, 1994). The wording and examples below are original. They are not the book.

Record a selected pattern by its heading, including the word Pattern. The examples are Python so the roles and calls are easy to see. Class and method design uses the project's language. The examples are not files to copy into the project.

## Creational

### Abstract Factory Pattern

An abstract factory creates a family of related objects. The caller asks for each kind of object and uses the abstract types. It never names the concrete classes. One concrete factory builds one whole family, so a light button is never paired with a dark checkbox.

Use this when several product kinds must change together. If there is only one product kind, Factory Method Pattern is enough. If the work is a sequence of steps that assemble one object, use Builder Pattern.

```python
class Button:
    def paint(self):
        raise NotImplementedError

class Checkbox:
    def paint(self):
        raise NotImplementedError

class LightButton(Button):
    def paint(self):
        return "light-button"

class LightCheckbox(Checkbox):
    def paint(self):
        return "light-checkbox"

class DarkButton(Button):
    def paint(self):
        return "dark-button"

class DarkCheckbox(Checkbox):
    def paint(self):
        return "dark-checkbox"

class WidgetFactory:
    def button(self):
        raise NotImplementedError

    def checkbox(self):
        raise NotImplementedError

class LightFactory(WidgetFactory):
    def button(self):
        return LightButton()

    def checkbox(self):
        return LightCheckbox()

class DarkFactory(WidgetFactory):
    def button(self):
        return DarkButton()

    def checkbox(self):
        return DarkCheckbox()

def form(factory):
    return factory.button().paint(), factory.checkbox().paint()
```

### Builder Pattern

A builder constructs one object through named steps. A director can run those steps in order, but it does not know how the finished object is represented. The caller collects the result from the builder. The same steps can produce a plain text report or an HTML report.

Use this when construction has several steps and the representation can vary. Do not use it when one constructor already states the object, or when the varying part is which class gets created rather than how one object is filled in.

```python
class Report:
    def __init__(self):
        self.parts = []

class ReportBuilder:
    def title(self, text):
        raise NotImplementedError

    def line(self, text):
        raise NotImplementedError

    def result(self):
        raise NotImplementedError

class TextReportBuilder(ReportBuilder):
    def __init__(self):
        self.report = Report()

    def title(self, text):
        self.report.parts.append(text.upper())

    def line(self, text):
        self.report.parts.append(text)

    def result(self):
        return "\n".join(self.report.parts)

class ReportDirector:
    def __init__(self, builder):
        self.builder = builder

    def daily(self, heading, items):
        self.builder.title(heading)
        for item in items:
            self.builder.line(item)
        return self.builder.result()
```

### Factory Method Pattern

A factory method lets a class create an object without naming the concrete class. The base class calls the method and works with the returned product. A subclass implements the method and chooses the concrete product.

Use this when one varying type is decided by a subclass. If several product kinds must stay matched, use Abstract Factory Pattern. If the new object should be a copy of an existing instance, use Prototype Pattern.

```python
class Exporter:
    def export(self, rows):
        document = self.make_document()
        document.write(rows)
        return document

    def make_document(self):
        raise NotImplementedError

class CsvDocument:
    def write(self, rows):
        self.text = "\n".join(",".join(row) for row in rows)

class PdfDocument:
    def write(self, rows):
        self.pages = [list(row) for row in rows]

class CsvExporter(Exporter):
    def make_document(self):
        return CsvDocument()

class PdfExporter(Exporter):
    def make_document(self):
        return PdfDocument()
```

### Prototype Pattern

A prototype creates a new object by copying an existing one. The copy carries the state that a constructor would not know. After the copy is returned, changing the original must not change the copy.

Use this when the useful starting state already lives in an instance. Do not use it when the caller can pass the initial values to a constructor.

```python
import copy

class Playlist:
    def __init__(self, name, tracks):
        self.name = name
        self.tracks = list(tracks)

    def clone(self):
        return copy.deepcopy(self)

seed = Playlist("morning", ["a", "b"])
other = seed.clone()
other.tracks.append("c")
# seed.tracks is still ["a", "b"]
```

### Singleton Pattern

A singleton keeps one instance and gives every caller that same instance. Construction stays inside the class. Callers use an access method instead of a public constructor.

Use this only when there is truly one shared lifetime. If a test or another caller needs a different instance, pass the object in. If many uses share only part of their state, look at Flyweight Pattern instead.

```python
class Config:
    _instance = None

    def __init__(self, values):
        self.values = dict(values)

    @classmethod
    def load(cls, values):
        if cls._instance is None:
            cls._instance = cls(values)
        return cls._instance

    @classmethod
    def current(cls):
        if cls._instance is None:
            raise RuntimeError("Config.load was not called")
        return cls._instance
```

## Structural

### Adapter Pattern

An adapter lets a caller keep its interface while an existing class does the work through a different interface. The adapter translates each call. The existing class stays unchanged and does not know about the caller's interface.

Use this when you cannot change either side. If the new class should hide several types behind a simpler entry, use Facade Pattern. If it should add behavior and keep the same interface, use Decorator Pattern.

```python
class CelsiusSensor:
    def read_celsius(self):
        return 21.5

class FahrenheitReader:
    def read_fahrenheit(self):
        raise NotImplementedError

class SensorAdapter(FahrenheitReader):
    def __init__(self, sensor):
        self.sensor = sensor

    def read_fahrenheit(self):
        return self.sensor.read_celsius() * 9 / 5 + 32

reader = SensorAdapter(CelsiusSensor())
reader.read_fahrenheit()
```

### Bridge Pattern

A bridge splits a caller-facing abstraction from its implementation so each can vary on its own. The abstraction holds an implementor and forwards the work it does not own. Adding a new caller-facing variant does not require a new implementation class, and the reverse is also true.

Use this when you can name two independent reasons to add a class. Do not use it when the split is only a choice of directory. Directories belong to codebase structure.

```python
class Sender:
    def send(self, message):
        raise NotImplementedError

class EmailSender(Sender):
    def send(self, message):
        return f"email:{message}"

class SmsSender(Sender):
    def send(self, message):
        return f"sms:{message}"

class Notice:
    def __init__(self, sender):
        self.sender = sender

    def deliver(self, message):
        return self.sender.send(message)

class UrgentNotice(Notice):
    def deliver(self, message):
        return self.sender.send(f"URGENT {message}")
```

### Composite Pattern

A composite lets the caller treat one item and a group of items through the same operations. A leaf handles one item. A composite stores children and applies the same operation to them. Groups can contain groups.

Use this when the caller's operation means the same thing for an item and for a group. Do not use it when the group operation is a different operation from the item operation.

```python
class Node:
    def cost(self):
        raise NotImplementedError

class Task(Node):
    def __init__(self, amount):
        self.amount = amount

    def cost(self):
        return self.amount

class Project(Node):
    def __init__(self):
        self.children = []

    def add(self, node):
        self.children.append(node)

    def cost(self):
        return sum(child.cost() for child in self.children)
```

### Decorator Pattern

A decorator adds behavior to an object by wrapping it. The wrapper has the same interface as the object it wraps. Wrappers can stack, so each combination does not need its own subclass. The caller talks to the outer wrapper.

Use this when additions are optional and can be combined. If the wrapper must change the interface, use Adapter Pattern. If its job is to control access, use Proxy Pattern.

```python
class DataSource:
    def read(self):
        raise NotImplementedError

class FileSource(DataSource):
    def read(self):
        return "payload"

class ChecksumSource(DataSource):
    def __init__(self, inner):
        self.inner = inner

    def read(self):
        data = self.inner.read()
        return f"{data}#{len(data)}"

class LogSource(DataSource):
    def __init__(self, inner):
        self.inner = inner

    def read(self):
        data = self.inner.read()
        self.last = data
        return data

source = LogSource(ChecksumSource(FileSource()))
source.read()
```

### Facade Pattern

A facade gives callers a few operations that stand in front of a set of types. The facade calls those types in the right order. The subsystem types do not depend on the facade, and callers that truly need them can still use them.

Use this when ordinary callers should not assemble the subsystem themselves. Do not use it to invent behavior the subsystem does not already perform.

```python
class Encoder:
    def encode(self, text):
        return text.encode("utf-8")

class Store:
    def save(self, blob):
        self.blob = blob

class Notifier:
    def done(self):
        return "saved"

class Archive:
    def __init__(self):
        self.encoder = Encoder()
        self.store = Store()
        self.notifier = Notifier()

    def keep(self, text):
        self.store.save(self.encoder.encode(text))
        return self.notifier.done()
```

### Flyweight Pattern

A flyweight shares the state that is the same across many uses. Each use passes in the state that differs. A factory returns the existing flyweight when the shared state matches, instead of storing a full copy in every object.

Use this when the repeated state does not change per use. Do not use it when that state can change per object. One shared instance with no per-use state is Singleton Pattern, not this pattern.

```python
class Glyph:
    def __init__(self, char):
        self.char = char

    def draw(self, x, y):
        return f"{self.char}@{x},{y}"

class GlyphFactory:
    def __init__(self):
        self._cache = {}

    def get(self, char):
        if char not in self._cache:
            self._cache[char] = Glyph(char)
        return self._cache[char]

factory = GlyphFactory()
a1 = factory.get("a")
a2 = factory.get("a")
# a1 is a2; the position is passed to draw, not stored on the glyph
a1.draw(0, 0)
a2.draw(10, 0)
```

### Proxy Pattern

A proxy has the same interface as the real object and controls access to it. It may check a rule, create the real object on the first call, or stand in for an object that lives somewhere else. The caller uses the proxy and does not hold the real object.

Use this when something must decide whether or when the real object is reached. If the extra class only translates a different interface, use Adapter Pattern. If it only adds behavior around a call the caller could already make, use Decorator Pattern.

```python
class Document:
    def body(self):
        raise NotImplementedError

class RealDocument(Document):
    def __init__(self, text):
        self.text = text

    def body(self):
        return self.text

class LazyDocument(Document):
    def __init__(self, loader):
        self.loader = loader
        self._real = None

    def body(self):
        if self._real is None:
            self._real = RealDocument(self.loader())
        return self._real.body()
```

## Behavioral

### Chain of Responsibility Pattern

A chain passes a request along an ordered list of handlers. The sender gives the request to the first handler and does not choose who handles it. Each handler either handles the request or forwards it.

Use this when more than one handler might own the request. If the handler is already known, call it directly. If every interested object must see the request, use Observer Pattern.

```python
class Handler:
    def __init__(self, nxt=None):
        self.nxt = nxt

    def handle(self, request):
        if self.nxt:
            return self.nxt.handle(request)
        return None

class AuthHandler(Handler):
    def handle(self, request):
        if request.get("user") is None:
            return "denied"
        return super().handle(request)

class LimitHandler(Handler):
    def handle(self, request):
        if request.get("amount", 0) > 100:
            return "over-limit"
        return super().handle(request)

chain = AuthHandler(LimitHandler())
chain.handle({"user": "ada", "amount": 40})
```

### Command Pattern

A command turns a request into an object. The object stores the receiver and the arguments. An invoker starts the command later and does not know the receiver. The caller can queue the command, log it, or run it again.

Use this when the request must exist apart from the moment it runs. If the caller can call the receiver immediately and does not need to keep the request, do not add a command. If the need is to save an object's state rather than the request, use Memento Pattern.

```python
class Lamp:
    def __init__(self):
        self.on = False

    def toggle(self):
        self.on = not self.on

class ToggleCommand:
    def __init__(self, lamp):
        self.lamp = lamp

    def execute(self):
        self.lamp.toggle()

class Remote:
    def __init__(self):
        self.history = []

    def press(self, command):
        command.execute()
        self.history.append(command)
```

### Interpreter Pattern

An interpreter represents a small language as a tree of objects. Each grammar rule is a class. A terminal expression handles one symbol. A nonterminal expression handles one rule by asking its children to interpret. A context holds the state those expressions read or write.

Use this when the grammar is small and stable. Do not use it for a large grammar, or when there is no language to evaluate. A new operation over objects that are not grammar rules is Visitor Pattern.

```python
class Expr:
    def eval(self, env):
        raise NotImplementedError

class Number(Expr):
    def __init__(self, value):
        self.value = value

    def eval(self, env):
        return self.value

class Name(Expr):
    def __init__(self, name):
        self.name = name

    def eval(self, env):
        return env[self.name]

class Add(Expr):
    def __init__(self, left, right):
        self.left = left
        self.right = right

    def eval(self, env):
        return self.left.eval(env) + self.right.eval(env)

tree = Add(Name("x"), Number(2))
tree.eval({"x": 40})
```

### Iterator Pattern

An iterator walks the elements of a collection without showing how the collection stores them. The collection creates the iterator. The caller asks for the next element until the walk is finished. The iterator keeps the position.

Use this when storage may change and the caller only needs to visit elements. Do not use it when the walk itself is the business operation.

```python
class ListIterator:
    def __init__(self, items):
        self.items = items
        self.index = 0

    def has_next(self):
        return self.index < len(self.items)

    def next(self):
        item = self.items[self.index]
        self.index += 1
        return item

class Names:
    def __init__(self, items):
        self.items = list(items)

    def iterator(self):
        return ListIterator(self.items)

walk = Names(["ada", "bea"]).iterator()
while walk.has_next():
    walk.next()
```

### Mediator Pattern

A mediator is the only object that knows how colleagues affect one another. A colleague sends a notice to the mediator. The mediator decides which other colleagues should act. Colleagues do not call one another.

Use this when direct calls among the colleagues would form a web. Do not use it for one direct call between two objects. A middle object that only forwards, and makes no decision, is not a mediator.

```python
class Dialog:
    def __init__(self):
        self.title = TitleField(self)
        self.save = SaveButton(self)

    def changed(self, source):
        if source is self.title:
            self.save.enabled = bool(self.title.text)

class TitleField:
    def __init__(self, dialog):
        self.dialog = dialog
        self.text = ""

    def set_text(self, text):
        self.text = text
        self.dialog.changed(self)

class SaveButton:
    def __init__(self, dialog):
        self.dialog = dialog
        self.enabled = False
```

### Memento Pattern

A memento stores enough of an object's state to restore it later. The originator creates the memento and is the only object that reads it. A caretaker keeps the memento and later gives it back. The caretaker does not look inside.

Use this when restore is required and the saved fields must stay hidden. If another object may read those fields, this pattern does not fit. If the thing to store is a request rather than the object's state, use Command Pattern.

```python
class EditorMemento:
    def __init__(self, text):
        self._text = text

class Editor:
    def __init__(self, text):
        self.text = text

    def save(self):
        return EditorMemento(self.text)

    def restore(self, memento):
        self.text = memento._text

class History:
    def __init__(self):
        self._saved = []

    def push(self, memento):
        self._saved.append(memento)

    def pop(self):
        return self._saved.pop()
```

### Observer Pattern

An observer registers with a subject and learns when the subject's state changes. The subject keeps the list of observers and notifies them. It does not know what each observer will do. Each observer updates itself.

Use this when observers come and go, and each one decides what the notice means. If the dependents are fixed and few, call them directly. If one handler should consume the notice so others do not see it, use Chain of Responsibility Pattern.

```python
class Feed:
    def __init__(self):
        self._observers = []
        self.item = None

    def subscribe(self, observer):
        self._observers.append(observer)

    def publish(self, item):
        self.item = item
        for observer in list(self._observers):
            observer.update(self)

class Inbox:
    def __init__(self):
        self.items = []

    def update(self, feed):
        self.items.append(feed.item)

feed = Feed()
inbox = Inbox()
feed.subscribe(inbox)
feed.publish("hello")
```

### State Pattern

A state pattern gives each mode of an object its own class. The context holds the current state and forwards caller operations to it. A state may replace the context's current state. The caller does not switch on the mode.

Use this when behavior changes as the object moves from one mode to another. If the caller chooses an algorithm once and that choice is not a mode of the object, use Strategy Pattern.

```python
class Gate:
    def __init__(self):
        self.state = LockedState()

    def insert_ticket(self):
        self.state.insert_ticket(self)

    def pass_through(self):
        self.state.pass_through(self)

class LockedState:
    def insert_ticket(self, gate):
        gate.state = UnlockedState()

    def pass_through(self, gate):
        raise RuntimeError("locked")

class UnlockedState:
    def insert_ticket(self, gate):
        return None

    def pass_through(self, gate):
        gate.state = LockedState()
```

### Strategy Pattern

A strategy pattern keeps interchangeable algorithms behind one operation. The context holds one strategy and calls it at the varying step. The caller, or the context, supplies the strategy from outside. The algorithms do not inherit from the context, and they do not choose one another.

Use this when the algorithms are substitutes and the choice is not a changing mode of the object. If the choice changes because the object entered a new mode, use State Pattern. If every class shares the same step order and only some steps differ, use Template Method Pattern.

```python
class Tax:
    def amount(self, subtotal):
        raise NotImplementedError

class LocalTax(Tax):
    def amount(self, subtotal):
        return subtotal * 0.05

class ExportTax(Tax):
    def amount(self, subtotal):
        return 0

class Order:
    def __init__(self, tax):
        self.tax = tax

    def total(self, subtotal):
        return subtotal + self.tax.amount(subtotal)
```

### Template Method Pattern

A template method fixes the order of steps in a base class. The base class implements the steps that never change. A subclass implements only the steps that vary. The caller calls the template method, not the varying steps.

Use this when the order is the same for every subclass. If the order itself varies, use Strategy Pattern. If only one class exists, there is no varying step to override.

```python
class Importer:
    def run(self, raw):
        rows = self.parse(raw)
        self.check(rows)
        self.save(rows)
        return len(rows)

    def parse(self, raw):
        raise NotImplementedError

    def check(self, rows):
        if not rows:
            raise ValueError("empty")

    def save(self, rows):
        self.stored = list(rows)

class CsvImporter(Importer):
    def parse(self, raw):
        return [line.split(",") for line in raw.splitlines() if line]
```

### Visitor Pattern

A visitor adds an operation across a fixed set of element types without putting that operation on the element classes. Each element has an accept method that calls the visitor method for its own type. A concrete visitor implements one whole operation. A different operation is a new visitor, not a new method on every element.

Use this when the element types stay stable and the operations grow. If there is only one operation, put it on the element. If the element types change as often as the operations, the split does not help.

```python
class Number:
    def __init__(self, value):
        self.value = value

    def accept(self, visitor):
        return visitor.visit_number(self)

class Add:
    def __init__(self, left, right):
        self.left = left
        self.right = right

    def accept(self, visitor):
        return visitor.visit_add(self)

class Eval:
    def visit_number(self, node):
        return node.value

    def visit_add(self, node):
        return node.left.accept(self) + node.right.accept(self)

Add(Number(2), Number(3)).accept(Eval())
```
