---
name: typescript
description: "MUST load before writing or reviewing TypeScript. TypeScript is a domain skill that routes the task to its applicable async, compiler, convention, development, packaging, testing, and typing child skills."
allowed-tools: Read
skill-type: domain
---

# TypeScript

TypeScript routes language work to focused children. It owns navigation only; each child owns its policy or operation.

Load every row whose trigger applies. A task may need several children, and no child is a default for every TypeScript task.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`typescript-async`](typescript-async/SKILL.md) | preference | MUST load when TypeScript work involves promises, cancellation, concurrency, events, cleanup, or explicit resource management. |
| [`typescript-compiler`](typescript-compiler/SKILL.md) | tool | MUST load when TypeScript work involves compiler configuration, module resolution, imports, emit, type stripping, linting, building, or runtime host differences. |
| [`typescript-conventions`](typescript-conventions/SKILL.md) | preference | MUST load when writing or reviewing TypeScript code to choose names, files, imports, documentation, comments, or formatting. |
| [`typescript-development`](typescript-development/SKILL.md) | operation | MUST load when implementing or changing TypeScript code. TypeScript Development is an operation skill for studying the code contract, designing the typed surface, building bottom-up, and verifying the completed change. |
| [`typescript-packaging`](typescript-packaging/SKILL.md) | operation | MUST load when creating, changing, validating, or publishing a TypeScript package, its exports, declarations, or compatibility surface. |
| [`typescript-testing`](typescript-testing/SKILL.md) | operation | MUST load when creating or reviewing TypeScript runtime tests, type-level tests, negative tests, declaration checks, package checks, or documented examples. |
| [`typescript-typing`](typescript-typing/SKILL.md) | preference | MUST load when writing or reviewing TypeScript code to model or inspect types, narrowing, generics, unions, assertions, public declarations, or boundary validation. |
