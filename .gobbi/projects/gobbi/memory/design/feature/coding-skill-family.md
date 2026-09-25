# Coding skill family

## Intent

The [Coding root](../../../skills/coding/SKILL.md) is a navigation-only domain skill for code design,
planning, implementation, non-gating review, and object-oriented design preferences. It routes every
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
| [Coding Ideation](../../../skills/coding/coding-ideation/SKILL.md) | Operation | Owns Phase 2 study, discussion, and design, then Phase 3 confirmation and one indexed result for an unresolved material code-design choice. | Stops before Planning or realization. |
| [Coding Planning](../../../skills/coding/coding-planning/SKILL.md) | Operation | Owns decomposition, grouping, order, and dispatch for defined code work. | Stops before implementation recipes. Coding Execution may order work only inside one accepted task. |
| [Coding Execution](../../../skills/coding/coding-execution/SKILL.md) | Operation | Owns implementation, verification, repair, the applicable checklist pass, and handoff for one settled code task, with code-specialist selection, affected-code reach, one local thinking guide, and the caller's commit-or-retain policy. | Gains no Review or acceptance authority. |
| [Coding Review](../../../skills/coding/coding-review/SKILL.md) | Operation | Reviews one exact stable code subject and returns one caller-bound feedback report. | Non-gating. No target-mutation right, verdict, gate, correction, or acceptance authority. |
| [Coding Object-Oriented Programming](../../../skills/coding/coding-object-oriented-programming/SKILL.md) | Preference | Owns the defaults for class, interface, and public API design, and the OOP principle, SOLID, and design pattern entries. | Owns no procedure, stage, or design decision. Accepted designs and project conventions come before its defaults. |

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
- There is no Generic Evaluation skill. Cowork owns the user-called `review` call. Domain Review writes
  the independent report; see [Review](../process/evaluation.md).
- Re-entry starts at the earliest owner whose accepted input changed. The manager or mode tracks result identity
  and freshness; the Coding root does not.

## Review

Coding Review preserves independent review or caller-authorized disclosed self-review, records whether the
reviewer is `author` or `not the author`, and keeps the subject and governing state read-only. It is
feedback only. It has no verdict, approval, acceptance, or gate effect.

Coding Review item results remain `problem found`, `no problem found`, `not applicable`, and `evidence missing`.
One supported root Problem has one primary category. `Unclassified — taxonomy Gap` remains a temporary supported
coverage signal, not a permanent category. Durable Reports Memory requires a separate authorized Memory action.

## Shared code-quality baseline

The [Coding Review checklist](../../../skills/coding/coding-review/checklist.md) is the single reusable code
baseline. It has no Coverage Account. Coding Review owns its substantive meaning and report vocabulary;
Checklist owns reusable-source revision policy and the Coverage Account on the Checklist skill template.

The source has these consumers with separate authority:

- Coding Review applies it after the locked actual-code critique and writes the caller-bound Review report.
- Coding Execution applies it to final code during its one final-identity checklist pass instead of running
  another review or writing a Review report.

## Shared coding principles

[Coding Principles](../../../skills/coding/principles.md) holds six entries in this order: simplicity, clear
units, reusability, readability, naming, and intuitive public API. Each has a description of the principle and
its reason, a good example, and an anti-pattern. Each rule is a check an agent applies while writing:

- Simplicity holds the inline test and the current-caller test, so it decides whether a unit exists.
- Modularization asks four one-line answers (conceptual definition, responsibility, boundary, relationship) before
  a new directory, file, public class, or public function. Its directory and file limits are defaults; an
  existing project or framework layout wins. A directory exists only when its files share one conceptual
  definition, responsibility, and boundary; that may be a domain concept or a layer.
- Naming owns vocabulary, names in context, and file and directory names. Name length is set by checks and a
  one-word file default, not by a hard word limit. Readability keeps types and flat control flow and points to
  Naming.
- Intuitive Public API defines learning depth.

These principles apply to procedural and object-oriented code alike, so the doc sits at the Coding root, not in
the OOP child. A domain root normally holds only its children; this doc is an explicit user exception. The root
`SKILL.md` stays navigation-only and does not link it. Coding Ideation, Coding Execution, Coding Review, and the
OOP child link it directly. Learning curve has no separate entry, because Intuitive Public API covers it.

## Object-oriented design

[Coding Object-Oriented Programming](../../../skills/coding/coding-object-oriented-programming/SKILL.md) is the
direct `preference` child that owns object-oriented design guidance for the family. The root routes to it like
any other child. Its `SKILL.md` holds the defaults and a selection index that maps what the code shows to a
check and an entry. The defaults start from no pattern and keep the learning depth of every public API at 2 or
less. Three supporting docs hold the entries:

| File | Entries |
|---|---|
| `oop-principles.md` | Encapsulation, abstraction, inheritance, and polymorphism. Each has a description, a good example, and an anti-pattern. |
| `solid.md` | The five SOLID principles. Each has a violation sign, usual fix, over-application sign, and example. |
| `design-pattern.md` | Creational: Abstract Factory, Builder, Factory Method, Prototype, and Singleton. Structural: Adapter, Bridge, Composite, Decorator, Facade, and Proxy. Behavioral: Chain of Responsibility, Command, Iterator, Mediator, Observer, State, Strategy, Template Method, and Visitor. |

The docs hold 20 Gang of Four patterns and omit Interpreter, Flyweight, and Memento. Each pattern heading ends
with "Pattern". A pattern entry is one or two sentences on what the pattern is, then one example. When to use a
pattern lives in the problem-sign table of the child `SKILL.md`, whose "Check first" column names the simpler
form. Composition over inheritance, cohesion and coupling, Tell-Don't-Ask, the Law of Demeter, and
Value Object have no separate entry. Examples are short, typed Python 3.12.

Coding Ideation reads the child `SKILL.md` while designing classes and methods, then opens only the supporting docs and coding principles it needs. The design order is conceptual definition, then class and method design, then codebase structure. Conceptual definition states what will be implemented and the terms. Class and method design holds responsibilities, boundaries, relationships, and patterns. Codebase structure holds project directories and files, chosen with Modularization and Naming. After the user confirms, each decision is recorded only in the heading named on that topic.

Coding Execution reads the child `SKILL.md` and applies its Rules, then reads only the entries that the accepted class and method design names and the coding and OOP principles it applies. It does not replace the accepted class and method design or select a new pattern.

Coding Review links the child as the source for the Design Pattern and Abstraction items in the Coding Review
checklist. It links Coding Principles as the source for the Public API, Modularization, Reusability,
Unintended Overengineering, Readability, Vocabulary, and Naming Convention items. The checklist items stay in
that checklist.

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
