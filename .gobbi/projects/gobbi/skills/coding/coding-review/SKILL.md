---
name: coding-review
description: "Coding Review is the bar a reviewer applies to code and code design. Use it when reviewing software source, tests, run or build config, or a code design."
allowed-tools: Read
skill-type: preference
---

# Coding Review

Coding Review is the domain bar for code inside [Review](../../review/SKILL.md), which owns the procedure, the
blocking rule, the report, and the verdict. Use it when reviewing software source, tests, run or build config,
or a code design.

## Principles

### Judge the behavior, not the diff

A diff that reads well can still do the wrong thing. Run the path the Goal names, then read the code to explain
what the run showed.

## Rules

- **Let the project's own bar win.** Accepted design, project conventions, and configured linters and type
  checkers come before these checks, because they are what the code must fit.
- **Apply only the checks the stage reaches.** A code design at Ideation or Planning is judged on fit and scope,
  not on tests or failure handling it does not contain yet.

## Preferences

### Goal and Scope

#### The change reaches the Goal

- Run the Goal's evidence of done and the path a user or caller takes, not only the test suite.
- A result that passes its checks but leaves the Goal's outcome unreached fails this check.

#### Nothing is missing, extra, or misunderstood

- Map each requirement in the Goal to the change. A requirement with no matching change is missing.
- An unasked feature, option, abstraction, or refactor is extra, and a requirement built to a different reading
  than the Goal states is misunderstood.

#### The change fits the accepted design

- Compare the change with the project's design memory, architecture, governing decisions, and accepted session
  design. Name each contradiction or drift with the source it breaks.
- Record a missing design source as not checked instead of inventing one.

### Correctness

#### Nothing the change reaches is left stale

- Search for every caller, mirror, generated output, config, doc, and test that uses a changed name, signature,
  path, or format, and confirm each one agrees.
- Code the change replaced is removed, not left unused beside the new code.

#### Failure paths and boundaries are handled

- Walk invalid, empty, missing, duplicate, maximum, and concurrent inputs through the changed code. Each one
  reaches a defined result, and no error is swallowed or reported as success.
- Input from outside the program is validated before use, and no secret is logged, printed, or committed.

#### Stored data and public interfaces stay compatible

- A change to a persisted format, schema, CLI flag, config key, or public API either keeps old data and callers
  working or ships the migration and names the break.

#### Tests check the claim, not the implementation

- Each test fails when the behavior it names breaks. A test that still passes with the logic stubbed out, or
  that mocks the unit it claims to test, checks nothing.
- Tests assert results a caller can observe, and cover the failure paths the change adds.

### Structure, Variation, and Vocabulary

#### Each unit has one definition, responsibility, boundary, and set of relations

- For each module, class, and function the change adds or changes, state its definition in one sentence, the
  one decision it owns, what it hides, and what it depends on and what depends on it.
- A unit whose definition needs "and", that reaches into a neighbour's internals, or that adds a dependency
  cycle or an upward dependency fails this check. The [Modularization](../principles.md#modularization) lines
  are the bar.

#### Abstraction follows commonality and variability

- Name what the changed units share and what varies between them now. An interface, base class, parameter,
  or pattern exists only for variation present now, and code that changes together lives in one place.
- Copies of one logic that must change together, or a variation point no current caller uses, fail this check.

#### Names follow the domain vocabulary

- One concept keeps one name across code, tests, docs, and the accepted design, and one name never means two
  things. Names use the domain's words, not generic ones such as `Manager`, `Helper`, or `data`.

### Code Quality

#### Coding Principles hold

- Apply [Coding Principles](../principles.md) for what the checks above do not cover: the least mechanism for
  a current need, readable code, and an intuitive public API.
- A departure from a principle's limit needs a stated reason in the code or the handoff.

#### Object-oriented design holds when classes change

- When the change adds or changes classes, interfaces, or inheritance, apply
  [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md). Each added interface,
  base class, or pattern answers a force the code has now.

## References

| Name | Description |
|---|---|
| [Review](../../review/SKILL.md) | Owns the review procedure, stage bars, blocking rule, report, and verdict. |
| [Coding Principles](../principles.md) | Simplicity, modularization, reusability, readability, naming, and intuitive public API. |
| [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) | Defaults for classes, interfaces, public APIs, SOLID, and design patterns. |
