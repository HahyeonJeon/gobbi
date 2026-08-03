---
name: typescript-conventions
description: "MUST load when writing or reviewing TypeScript code to choose names, files, imports, documentation, comments, or formatting."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# TypeScript Conventions

TypeScript Conventions defines the source-level choices that make typed code predictable to read: names, file layout, imports, documentation, comments, and formatting. It does not decide type semantics, runtime architecture, or compiler configuration.

Existing project conventions take priority when they are coherent and tool-enforced. These preferences provide a deliberate baseline for new code and for choices the project has not settled.

## Principles

### Let names expose the requirement

Names should reveal the value's role, unit, and domain meaning without repeating syntax or implementation trivia.

### Keep source organization local

Put a definition near the module or component responsible for it, and move it to shared code only after demonstrated reuse.

### Automate mechanical style

Formatting and import order belong to deterministic tools when the project has them.

## Rules

- **MUST** use names that distinguish domain concepts, units, states, and side effects at the point of use.
- **NEVER** encode a type in a name when the declaration and surrounding domain already communicate it.
- **MUST** preserve the project's established file, export, import, documentation, and formatting conventions unless the change explicitly migrates them.
- **MUST** use `import type` or an equivalent inline type modifier when the configured module pipeline requires a type-only binding.
- **NEVER** use a comment to restate the code; document intent, invariants, tradeoffs, or surprising external constraints.
- **MUST** document a public API at the level its consumers need, including behavior, failure, and lifecycle obligations that types cannot express.

## Preferences

- Prefer domain nouns for values and types, verbs for operations, `is`/`has`/`can` for booleans, and unit-bearing names where numeric units are otherwise ambiguous.
- Prefer one primary responsibility per file and named exports when they improve searchability and refactoring; follow a project's deliberate default-export convention when it is already consistent.
- Prefer imports grouped by provenance and kept stable by the project's formatter or linter.
- Prefer colocated narrow helpers and tests; move them to a shared location after independent consumers demonstrate the same behavior and type requirements.
- Prefer TSDoc-style public documentation when the repository publishes generated API docs, and ordinary prose comments for local intent.
- Prefer the project formatter without local exceptions; where no formatter exists, optimize for small diffs and the surrounding style.

These are overridable house preferences. A repository may choose different casing, export, layout, import-order, or documentation conventions when the choice is consistent and recorded.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for changes
  governed by this skill.
