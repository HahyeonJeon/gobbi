# Coding skill family

## Intent

The [Coding root](../../../skills/coding/SKILL.md) is a navigation-only domain skill for code design,
planning, implementation, independent review, and object-oriented design preferences. It routes every
applicable direct child and owns no lifecycle procedure, sequence, state, gate, recovery policy, or child
judgment.

The family has five direct children. The four operations are `coding-ideation`, `coding-planning`,
`coding-execution`, and `coding-review`. The one preference is `coding-object-oriented-programming`. The
canonical skills own their live procedures and preferences. Top-level Ideation, Planning, Study, Execution,
and Evaluation skills are gone without an alias. This design records the current family shape, ownership,
routing, and Review meaning without copying skill procedures.

## Family and ownership

| Skill | Type | Current owner | Authority boundary |
|---|---|---|---|
| [Coding](../../../skills/coding/SKILL.md) | Domain | Discovers every direct child whose applicability contract matches the current bounded unit. | Owns navigation only. It never conducts Cowork or Workflow work. |
| [Coding Ideation](../../../skills/coding/coding-ideation/SKILL.md) | Operation | Owns study with the OOP child and Coding Principles, discussion with independent subagents, a three-level design, and a user-confirmation stop with a draft and a resume entry, then one indexed result for an unresolved material code-design choice. | Stops before Planning or realization. |
| [Coding Planning](../../../skills/coding/coding-planning/SKILL.md) | Operation | Owns decomposition, grouping, order, and dispatch for defined code work. It takes leaves and writer frontiers from the accepted design; with no Ideation result, the caller's topic contract is the design. | Stops before implementation recipes. Coding Execution may order work only inside one accepted task. |
| [Coding Execution](../../../skills/coding/coding-execution/SKILL.md) | Operation | Owns implementation, verification, repair, one checklist pass, and handoff for one code task with no open material code-design choice, whether or not Coding Ideation ran. It also owns code-specialist selection, affected-code reach, one local thinking guide, and the caller's commit-or-retain policy. | Gains no Review or acceptance authority. |
| [Coding Review](../../../skills/coding/coding-review/SKILL.md) | Operation | Reviews one exact frozen code subject independently and writes `report.md` plus a working `checklist.md`. | Derives a contract-gate verdict that Cowork and Workflow gate on. No target-mutation right, `gate.md` write, correction, or acceptance authority. |
| [Coding Object-Oriented Programming](../../../skills/coding/coding-object-oriented-programming/SKILL.md) | Preference | Owns the defaults for classes, interfaces, and inheritance, and the OOP principle, SOLID, and design pattern entries. | Owns no procedure, stage, or design decision. Accepted designs and project conventions come before its defaults. |

Language, framework, platform, tool, and product-domain skills retain their specialist judgments
without becoming lifecycle drivers.

Composition is one-way:

```text
Cowork manager  --------------------------------> matching coding child
Workflow manager -------------------------------> matching coding child
direct caller    -------------------------------> matching coding child
```

Removed generic lifecycle skills never dispatch into Coding. The root never stores lifecycle state or
becomes a prerequisite for direct child use.

## Routing and caller conduct

- The root applies exactly when at least one child applies. Load every currently matching child. Do not load a
  future dependent child before its own start contract is current.
- Cowork and Workflow keep their existing stages, paths, participant policy, commit policy, `review` call,
  gates, acceptance, and handoffs. They select matching children directly inside those stages.
- Route by the productive subject and owned outcome, not by whether the repository contains code. Keep
  consistency-bound tests, configuration, schemas, generated views, documents, behavior, failures, recovery,
  and consumers in one code-primary unit. Split independently assignable outcomes through Coding Planning.
- There is no Generic Evaluation skill. Cowork owns the user-called `review` call, and Workflow owns stage
  REVIEW. Coding Review writes the independent report; see [Review](../process/evaluation.md).
- Re-entry starts at the earliest owner whose accepted input changed. The manager or mode tracks result identity
  and freshness; the Coding root does not.

## Review

Coding Review is independent: the reviewing agent did not design, author, or implement the target. It keeps the
target, source checklists, criteria, acceptance state, and workflow state read-only, and writes only `report.md`
and a working `checklist.md`.

Coding Review labels each Problem and Improvement `in-contract` or `out-of-contract`. It derives a contract-gate
verdict only from in-contract Problems, sufficient evidence, and caller-supplied criteria. Cowork aggregates
these verdicts from complete report pairs, and Workflow writes `gate.md` from them. The quality opinion
(`meets-design`, `mixed`, `does-not-meet`, or `not-available`) never changes the verdict.

Item results are `problem-present`, `no-problem-found`, `not-applicable`, and `evidence-insufficient`. A bound
`review-depth` token sets the in-contract bar and the baseline checklist: `ideation-design` uses the Coding
Ideation checklist, `planning-decomposition` the Coding Planning checklist, `execution-implementation` the
Coding Review checklist, and `by-owning-stage` the row of each artifact's owning stage. Durable Reports Memory
requires a separate authorized Memory action.

## Shared code-quality baseline

The [Coding Review checklist](../../../skills/coding/coding-review/checklist.md) is the single reusable code
baseline. Coding Review owns its substantive meaning and report vocabulary; Checklist owns reusable-source
revision policy. Its Governing sources include Coding Principles and the OOP child's `oop-principles.md`,
`solid.md`, and `design-pattern.md`. An item that begins "In object-oriented code" applies only when the code
defines or changes classes, interfaces, or inheritance.

The Coding Review, Coding Ideation, and Coding Planning checklists omit the Coverage Account that the Checklist
skill template holds. This is a family exception: the applying operation records coverage. Coding Review
re-challenges coverage with the Checklist spectrum and does not record the missing account as a Limit. Coding
Execution records the categories it answered in its handoff.

The Coding Review checklist has these consumers with separate authority:

- Coding Review applies it after the frozen-target critique and writes the caller-bound Review report.
- Coding Execution applies it during its one final-identity checklist pass. It answers the categories whose
  subject the change touches and records the results in its handoff. It runs no review and writes no Review
  report.

## Shared coding principles

[Coding Principles](../../../skills/coding/principles.md) holds six entries in this order: simplicity,
modularization, reusability, readability, naming, and intuitive public API. Each has a description of the
principle and its reason, a good example, and an anti-pattern. Each rule is a check an agent applies while
writing:

- Simplicity holds the inline test and the current-caller test, so it decides whether a unit exists. As soft
  guidance, a class with one method and no state is usually better as a function.
- Modularization asks four one-line answers (conceptual definition, responsibility, boundary, relationship) before
  a new directory, file, public class, or public function. The answers go in the design record: the Ideation
  design, or the Execution handoff when there was no Ideation. Source code does not carry them as comments. Its
  directory and file limits are defaults; an existing project or framework layout wins. A directory exists only
  when its files share one conceptual definition, responsibility, and boundary; that may be a domain concept or a
  layer.
- Naming owns vocabulary, names in context, and file and directory names. Name length is set by checks and a
  one-word file default, not by a hard word limit. Readability keeps types and flat control flow and points to
  Naming.
- Intuitive Public API owns public API design for procedural and object-oriented code and defines learning
  depth.

These principles apply to procedural and object-oriented code alike, so the doc sits at the Coding root, not in
the OOP child. A domain root normally holds only its children; this doc is an explicit user exception. The root
`SKILL.md` stays navigation-only and does not link it. Coding Ideation, Coding Execution, Coding Review, and the
OOP child link it directly. Learning curve has no separate entry, because Intuitive Public API covers it.

## Object-oriented design

[Coding Object-Oriented Programming](../../../skills/coding/coding-object-oriented-programming/SKILL.md) is the
direct `preference` child that owns object-oriented design guidance for the family. The root routes to it like
any other child. Its `SKILL.md` holds the defaults and a selection index that maps what the code shows to a
check and an entry. The defaults start from no pattern and keep the learning depth of every public API at 2 or
less, counted as Intuitive Public API defines. An added interface, base class, or pattern states its present
force and the simpler form it replaces in the design record, not in source comments. Two defaults are soft guidance,
not strict tests: an interface with one implementation is usually not worth its cost, and for one operation a
`Callable` is usually simpler than a one-method interface. Three supporting docs hold the entries:

| File | Entries |
|---|---|
| `oop-principles.md` | Encapsulation, abstraction, inheritance, and polymorphism. Each has a description, a good example, and an anti-pattern. |
| `solid.md` | The five SOLID principles. Each has a description, a good example that shows the fix, and an anti-pattern that shows the violation. |
| `design-pattern.md` | Creational: Abstract Factory, Builder, Factory Method, Prototype, and Singleton. Structural: Adapter, Bridge, Composite, Decorator, Facade, and Proxy. Behavioral: Chain of Responsibility, Command, Iterator, Mediator, Observer, State, Strategy, Template Method, and Visitor. |

The docs hold 20 Gang of Four patterns and omit Interpreter, Flyweight, and Memento. Each pattern heading ends
with "Pattern". A pattern entry is one or two sentences on what the pattern is, then one example. When to use a
pattern lives in the problem-sign table of the child `SKILL.md`, whose "Check first" column names the simpler
form. Composition over inheritance, cohesion and coupling, Tell-Don't-Ask, the Law of Demeter, and
Value Object have no separate entry. Examples are short, typed Python 3.12.

Coding Ideation studies the child `SKILL.md` and Coding Principles, then opens only the supporting docs a choice
needs. It designs three levels in order: Conceptual Definition, then Class and Function Design, then Codebase
Structure. Conceptual Definition states what will be implemented and its vocabulary. Class and Function Design
gives each new or changed public class and public function its four terms and the inputs, outputs, and errors
its callers rely on. Codebase Structure places each new or changed directory and file with its four terms,
chosen with Modularization and Naming. No pattern is the default; an added pattern records its force and the
simpler form it replaces. The user sees a tree of the three levels, a schema of the public classes and
functions, and a diagram of the directories and files. Unconfirmed work stays in the caller-named draft
location, and the user's recorded answer resumes the work at Step 1.1. After confirmation, each decision lives
only in its Design heading, and the Discussion topic links to that heading. The templates and the result are
flat, with every file directly in the output root, and there is no Requirements snapshot.

Coding Execution applies Simplicity first, then the other Coding Principles, while it writes and simplifies
code. It loads the child `SKILL.md` when the change creates or changes classes, interfaces, or inheritance.
With an Ideation design, it builds each class and function to the Class and Function Design and its caller
contract, reads only the entries that design names, and adds no pattern the design does not name. With no
Ideation, it designs each unit it creates with the principles and records the four terms and any added
abstraction's force in its handoff. It keeps accepted-design mechanism that fails the Simplicity tests and
records it as a handoff concern.

Coding Review loads Coding Principles before its critique, and loads the child `SKILL.md` when the target
defines or changes classes, interfaces, or inheritance. The Coding Review checklist cites the child as the
source for the object-oriented Design Pattern and Abstraction items. It cites Coding Principles as the source
for the Project Structure, Public API, Modularization, Reusability, Overengineering, Readability, Vocabulary,
and Naming Convention items. The checklist items stay in that checklist.

## Public ownership and migration

The canonical public home is `skills/coding/`. Runtime discovery exposes one recursive `coding` root and no
top-level child links. The former top-level `code-review`, `ideation`, `planning`, `study`, `execution`, and
`evaluation` skills are retired without an alias.

Current callers and role load maps use the root for domain discovery and load children at their actual stage.
Generated plugin skills and role views derive from canonical sources. Historical Memory, completed reports, and
released changelog entries retain their point-in-time names and facts.

## Related designs

- [Authoring skill family](authoring-skill-family.md) and [Design skill family](design-skill-family.md)
  use the same navigation-only shape with four direct operation children. Coding adds one preference child.
- [Review](../process/evaluation.md) records live Review facts and that Generic Evaluation is gone.
- [Identity-and-load role contracts](../process/identity-and-load-role-contracts.md) records domain
  discovery and matching-child loads.
