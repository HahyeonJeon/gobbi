---
name: typescript
description: "MUST load before writing or reviewing TypeScript code. The concrete TypeScript-idiom layer beneath the language-agnostic coding standard — typing, modules & tooling, async & resources, packaging, runtime deltas, conventions, design, testing."
allowed-tools: Read, Grep, Glob, Bash
---

# TypeScript

The concrete TypeScript-idiom layer, sitting UNDER `coding`. It specializes the language-agnostic properties of
good software into idiomatic, maximal-strict TypeScript; it does not repeat them.

> Skeleton — this Intro is a stub finalized in T3-skill-body. Bodies for the Principles, Rules, Procedure, and
> References sections below are authored in T3; the child docs are grown in T4–T12.

---

## Principles

> Stub — the TypeScript principle set is authored in T3-skill-body. Each principle deepens a distinct
> `coding` / `principles` discipline via a "parent says X; TS delta is Y" clause; a principle that adds no TS
> delta is dropped, not padded. Count follows content.

---

## Rules

### Must-Follow

> Stub — the Must-Follow floor is authored in T3-skill-body.

### Must-Not-Follow

> Stub — the Must-Not-Follow anti-patterns are authored in T3-skill-body.

---

## Procedure

> Stub — the P1–P8 procedure spine (plus the P2 router table and the TS decision tables) is authored in
> T3-skill-body. It operationalizes `coding` and `principles`; it does not restate them.

### Child docs

The Procedure routes a reader to a child doc only when a decision needs depth this cold-load floor does not
carry. The map (grown in T4–T12):

- [`design.md`](design.md) — TS unit/API design: function vs `const`-object vs class, model-with-unions, signatures, earned generics, module tree, ownership and failure shape.
- [`convention.md`](convention.md) — casing matrix, file naming, import ordering, `import type`, TSDoc, formatter stance.
- [`typing.md`](typing.md) — the type system: discriminated unions and `never` exhaustiveness, generics, guards, `satisfies`/`as`, branded types, utility types, `.d.ts` authoring.
- [`modules-tooling.md`](modules-tooling.md) — ESM and `verbatimModuleSyntax`, `moduleResolution`, the import-extension fork, the strict base + overlays, typed lint, build.
- [`async-resources.md`](async-resources.md) — promise idioms, no floating promises, `AbortSignal`, combinators, async iterators, `using`/`await using` disposal.
- [`packaging-publishing.md`](packaging-publishing.md) — ESM-only `exports`, declaration emit, `publint` + `arethetypeswrong`, API evolution; CJS as an out-of-default exception.
- [`runtime-deltas.md`](runtime-deltas.md) — the one doc isolating the Node / Bun / Deno / browser deltas.
- [`testing.md`](testing.md) — runtime-agnostic behavior tests plus type-level testing and verification seams.
- The eval triad — [`evaluation.md`](evaluation.md) + [`scenarios.md`](scenarios.md) + [`checklists.md`](checklists.md) — is one required SET: the TS-idiom review frame beside `coding`'s property-level frame.

---

## References

> Stub — the section-level ownership register (one owner per borrowed claim) is authored in T3-skill-body.
> It uses only sibling-skill (`../{skill}/SKILL.md`) and same-directory links, and names repo-root scripts as
> Procedure code-spans, per the mirror-stable-link discipline.
