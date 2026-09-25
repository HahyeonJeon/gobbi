---
name: coding-object-oriented-programming
description: "Coding Object-Oriented Programming defines preferences for designing classes, interfaces, and public APIs with OOP principles, SOLID, and design patterns."
allowed-tools: Read
skill-type: preference
---

# Coding Object-Oriented Programming

Coding Object-Oriented Programming sets the defaults for class, interface, and public API design, and indexes
entries for the four OOP principles, the five SOLID principles, and 20 design patterns. The general design
principles for procedural and object-oriented code are in [Coding Principles](../principles.md). Use it when code
design, implementation, or review creates, changes, or judges classes, objects, interfaces, and their
responsibilities and relationships.

## Principles

### Default to no pattern

Most code needs functions, plain data, and a few classes, not a pattern. A pattern adds types and indirection,
so it must solve a problem the code has now.

### Name the force before the abstraction

An interface, base class, or pattern is worth its cost only when it answers a present force: two or more
variants that exist now, a caller that must not depend on a detail, or a test seam that a test uses.
Duplication costs less than the wrong abstraction, so wait for the force instead of guessing it.

### Design the public API from the caller's side

A public API is good when a first-time caller can find the entry point and succeed with built-in values.
Internal structure may change freely as long as that first call stays easy.

### Prefer the language's own form

Many patterns shrink to a language feature, such as a function argument, a generator, a module-level object,
or a `match`. Use that form when it states the same design with less code.

---

## Rules

- **MUST state, for every added interface, base class, or pattern, the present force it answers and the
  simpler form it replaces.** A guessed future need is not a force, and neither is an interface with one
  implementation and no test double.
- **MUST keep the learning depth of every public API at 2 or less.** Learning depth is the longest chain of
  project types a first-time caller must learn for the first successful call; count it as
  [Intuitive Public API](../principles.md#intuitive-public-api) defines.
- **NEVER subclass only to reuse code.** A subclass must keep every promise of its base and be used through the
  base; otherwise call a shared function or hold the other object in a field.
- **MUST name a chosen pattern by its exact entry heading, including the word `Pattern`.** For example, write
  `Strategy Pattern`, not `strategy` or `policy object`.
- **MUST follow the accepted design and the project's conventions before this skill's defaults.** When a
  default here conflicts with them, keep the accepted design and report the conflict.

---

## Preferences

### Form and Structure

#### Pick the simplest form that holds the design

- Use, in this order: a function, plain data such as a `dataclass`, a module of functions, a class, then an
  interface or a pattern. Take the next form only when the current one cannot hold the needed state, rule, or
  variation.
- Use a class when data and the rules that keep it valid belong together, as
  [Encapsulation](oop-principles.md#encapsulation) shows.

#### Declare an interface where it is used

- Declare an interface next to the code that calls it, with only the methods that code calls. In Python, use
  `typing.Protocol`, and use `abc.ABC` only when implementations share base code.
- Use a `Callable` type instead of a one-method interface when the operation holds no state.

#### Keep inheritance shallow

- Default to one level of concrete classes under a base. Go deeper only when a framework you use requires it.

### Public API

#### Make the first call work with built-in values

- Prefer keyword arguments with defaults to option objects. When an option object is needed, make it one flat
  `dataclass` of built-in values, so learning depth stays at 2.
- Return built-in types or one result type, not an object the caller must study to reach the value.

#### Name by the caller's task

- Name classes and methods for what the caller gets or does, and check each name with
  [Naming](../principles.md#naming).

### Selection

#### Match a design smell to a principle

- Find the row that matches what the code shows, and apply "Check first" before you change the design. Each
  principle has an over-applied form, and "Check first" catches it.

  | You see | Check first | Consider |
  |---|---|---|
  | Callers change fields directly and repeat the same validity check. | Is it plain data with no rule to protect? Then public fields are fine. | [Encapsulation](oop-principles.md#encapsulation) |
  | Callers must call several low-level methods in the right order to do one task. | Is there only one caller? Then a local function may be enough. | [Abstraction](oop-principles.md#abstraction) |
  | A subclass exists only to reuse the base's code, or the tree is deeper than one level. | Can a shared function or a field hold the reused code? | [Inheritance](oop-principles.md#inheritance) |
  | New types keep arriving, and each one edits the same type tests in many functions. | Is the set of types closed? Then one `match` per operation is fine. | [Polymorphism](oop-principles.md#polymorphism) |
  | A function or class only forwards calls to one other unit, or an option has no current caller. | Would inlining it make any caller longer or expose a secret? | [Simplicity](../principles.md#simplicity) |
  | One module mixes unrelated jobs, or every name in it is public. | Do the jobs always change together? Then keep them together. | [Modularization](../principles.md#modularization) |
  | The same code appears for the third time, or a shared function grows one flag per caller. | Are there only two copies? Then keep the duplication. | [Reusability](../principles.md#reusability) |
  | Names such as `process`, `data`, or `Manager`, or a name that repeats its owner. | Does a domain name exist for the thing? Use it. | [Naming](../principles.md#naming) |
  | Deep `if` nesting, or a flag argument that picks a behavior. | Can one condition or an early return state the same rule? | [Readability](../principles.md#readability) |
  | A first-time caller must build nested project types before the first call. | Can keyword arguments with defaults replace the nested types? | [Intuitive Public API](../principles.md#intuitive-public-api) |
  | One class changes for requests from different people or teams. | Do its parts always change together? Then keep one class. | [Single Responsibility Principle](solid.md#single-responsibility-principle) |
  | Each new variant edits the same `if` chains in several functions. | Is the set of variants closed? Then keep the `match`. | [Open-Closed Principle](solid.md#open-closed-principle) |
  | A subclass raises on, ignores, or narrows a base method, or callers check `isinstance` first. | Can the base promise less, so that every subtype keeps the promise? | [Liskov Substitution Principle](solid.md#liskov-substitution-principle) |
  | Implementers or test fakes stub methods they never use. | Does every caller use the whole interface? Then keep it whole. | [Interface Segregation Principle](solid.md#interface-segregation-principle) |
  | Business logic creates its own database, network, or clock object, so a test cannot replace it. | Can the object or a function be passed in as an argument, with no new interface? | [Dependency Inversion Principle](solid.md#dependency-inversion-principle) |

#### Match the problem sign, not the pattern name

- Choose a pattern from what the code shows, not from a word in the request. Use the "Check first" form when it
  solves the problem, and consider the pattern only when it does not.

  | You see | Check first | Consider |
  |---|---|---|
  | Several related objects must come from the same family, such as all test or all live services. | Does only one family exist? Then create the objects directly. | [Abstract Factory Pattern](design-pattern.md#abstract-factory-pattern) |
  | A constructor has many parts, some repeated or order-dependent, and a half-built object must not escape. | Do keyword arguments with defaults or a `dataclass` cover it? | [Builder Pattern](design-pattern.md#builder-pattern) |
  | The same "which class do I create" branch appears in several places. | Does one function that returns the object cover it? | [Factory Method Pattern](design-pattern.md#factory-method-pattern) |
  | New objects start as copies of a configured instance. | Does `dataclasses.replace` or a function with defaults cover it? | [Prototype Pattern](design-pattern.md#prototype-pattern) |
  | Exactly one instance of a resource must exist per process. | Can you create it once at startup and pass it in? | [Singleton Pattern](design-pattern.md#singleton-pattern) |
  | An existing class does the job, but its interface does not fit your code. | Is there one call site? Then convert with one function. | [Adapter Pattern](design-pattern.md#adapter-pattern) |
  | Class names combine two dimensions, and each new option multiplies the classes. | Is one dimension only a value? Then pass it as a parameter. | [Bridge Pattern](design-pattern.md#bridge-pattern) |
  | Items and groups of items in a tree must answer the same call. | Do plain nested data and one recursive function cover it? | [Composite Pattern](design-pattern.md#composite-pattern) |
  | Optional additions such as retry, cache, or logging combine in many ways. | Is there one fixed addition? Then put it in the class or at the call site. | [Decorator Pattern](design-pattern.md#decorator-pattern) |
  | Callers repeat the same sequence of calls into several subsystem classes. | Does the sequence appear only once? Then leave it inline. | [Facade Pattern](design-pattern.md#facade-pattern) |
  | Callers check access, delay creation, or reach a remote object before each use. | Is there one caller? Then check at the call site. | [Proxy Pattern](design-pattern.md#proxy-pattern) |
  | Several handlers may take a request, and their set or order changes by configuration. | Are the handlers fixed and few? Then use one `if` chain. | [Chain of Responsibility Pattern](design-pattern.md#chain-of-responsibility-pattern) |
  | A request must be undone, queued, logged, or run later. | Is no undo needed? Then store a function or a `functools.partial`. | [Command Pattern](design-pattern.md#command-pattern) |
  | Callers index internal storage or rewrite the same traversal at each call site. | Does a generator function cover it? | [Iterator Pattern](design-pattern.md#iterator-pattern) |
  | Many objects update each other directly, and one interaction rule edits several classes. | Are there two objects and one call? Then keep the direct call. | [Mediator Pattern](design-pattern.md#mediator-pattern) |
  | Several reactions must follow an event, and the set of reactions changes. | Are the reactions fixed and few? Then call them directly. | [Observer Pattern](design-pattern.md#observer-pattern) |
  | Several methods branch on the same status field, and transitions are scattered. | Are modes and events few? Then use an `Enum` field and one `match` per event. | [State Pattern](design-pattern.md#state-pattern) |
  | One function branches on a kind to compute the same result in different ways. | Is the set closed and small? Then keep the `match`. | [Strategy Pattern](design-pattern.md#strategy-pattern) |
  | Subclasses repeat the same step order and differ in one or two steps. | Can the varying steps be function arguments? | [Template Method Pattern](design-pattern.md#template-method-pattern) |
  | Many operations run over a stable set of node types. | Does one `match` on the node type per operation cover it? | [Visitor Pattern](design-pattern.md#visitor-pattern) |

---

## References

| Name | Description |
|---|---|
| [OOP Principles](oop-principles.md) | Encapsulation, abstraction, inheritance, and polymorphism, each with a description of the principle and its reason, a good example, and an anti-pattern. |
| [SOLID](solid.md) | The five SOLID principles, each with its rule, violation sign, usual fix, over-application sign, and a violation and fix example. |
| [Design Patterns](design-pattern.md) | 20 creational, structural, and behavioral patterns, each with a short description of what it is and one example. |
| [Coding Principles](../principles.md) | Simplicity, modularization, reusability, readability, naming, and intuitive public API for procedural and object-oriented code, including how to count learning depth. |
