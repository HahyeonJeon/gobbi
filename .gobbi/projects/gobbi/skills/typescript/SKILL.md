---
name: typescript
description: "MUST load before working in TypeScript. TypeScript is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# TypeScript

TypeScript routes language changes and reviews to focused children. It defines navigation only; each child defines its policy, operation, or compiler-tool guidance.

Load every row whose trigger applies. A task may need several children, and no child is a default for every TypeScript task. Every task that activates this root must select at least one child.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`typescript-async`](typescript-async/SKILL.md) | preference | MUST load when a TypeScript task involves promises, cancellation, concurrency, events, cleanup, or explicit resource management. |
| [`typescript-cli-delivery`](typescript-cli-delivery/SKILL.md) | operation | MUST load when producing, validating, installing, releasing, rolling back, or recovering a TypeScript command delivered directly without a package archive, such as a standalone executable or archive, a script copied or linked directly to an install target, or a recorded workspace or repository revision plus command. |
| [`typescript-conventions`](typescript-conventions/SKILL.md) | preference | MUST load when writing or reviewing TypeScript code to choose names, files, imports, documentation, comments, or formatting. |
| [`typescript-development`](typescript-development/SKILL.md) | operation | MUST load when studying TypeScript implementation requirements, designing a typed API, or implementing, changing, or reviewing TypeScript implementation code. |
| [`typescript-packaging`](typescript-packaging/SKILL.md) | operation | MUST load when creating, changing, validating, or publishing a TypeScript package, its exports, declarations, package-backed command metadata, or supported consumer environments. |
| [`typescript-testing`](typescript-testing/SKILL.md) | operation | MUST load when creating or reviewing TypeScript runtime tests, type-level tests, negative tests, declaration checks, package checks, or documented examples. |
| [`typescript-toolchain`](typescript-toolchain/SKILL.md) | tool | MUST load when a TypeScript task involves compiler configuration, module resolution, imports, emit, type stripping, linting, building, or differences among named runtimes. |
| [`typescript-typing`](typescript-typing/SKILL.md) | preference | MUST load when writing or reviewing TypeScript code to model or inspect types, narrowing, generics, unions, assertions, public declarations, or external-input validation. |
