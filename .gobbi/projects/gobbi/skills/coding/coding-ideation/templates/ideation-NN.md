# {Idea or Problem Name} — Coding Ideation Part {NN}

Index: [Coding Ideation](ideation-index.md)

{Omit any section or heading that does not apply, and link an inherited decision instead of restating it.}

## Summary

{The problem, desired outcome, selected direction, decisive evidence, major trade-offs, and scope.}

## Requirements

{Write freely, covering: the goal and why it matters now; the problem as it stands; the outcomes each actor
needs and how success is recognized; what is in and out of scope; and the open questions with their effect on
the design.}

## Design

{For each Discussion topic that links here, state the chosen option, why it won, its trade-offs, and the
evidence that would reopen it.}

### Conceptual Definition

{What will be implemented, and its vocabulary: each term with one preferred name and a one-sentence
definition. Name no directory, file, class, or function.}

### Class and Function Design

{The new or changed public classes and functions, each with its unit definition from the Ontology skill, read
for code as Modularization in Coding Principles states, and its caller contract. For each added pattern,
interface, or base class, name the present force it answers and the simpler form it replaces.}

### Codebase Structure

```text
{package}/
  {directory}/
    {file}  → uses {file}
    {file}
```

{The new or changed directories and files with one-way `→ uses` arrows, each with its unit definition.}
