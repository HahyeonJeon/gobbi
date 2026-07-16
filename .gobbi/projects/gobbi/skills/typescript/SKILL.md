---
name: typescript
description: "MUST load before writing or reviewing TypeScript code. The concrete TypeScript-idiom layer beneath the language-agnostic coding standard — typing, modules & tooling, async & resources, packaging, runtime deltas, conventions, design, testing."
allowed-tools: Read, Grep, Glob, Bash
---

# TypeScript

The concrete TypeScript-idiom layer, sitting UNDER `coding`. The `coding` standard states the
language-agnostic properties of good software; this skill says what they look like in idiomatic,
maximal-strict TypeScript — the type-system idioms, the ESM module and tooling model, async and
resource patterns, packaging, and the runtime deltas. It specializes those properties for TypeScript;
it does not repeat them, and it assumes the `coding` and gobbi behavioral layers are already in context.

Load it before writing or reviewing any TypeScript. The Principles, Rules, and Procedure below carry an
ordinary strict module from first read to review without opening anything else; a Procedure step (P2)
routes you to a child doc only when a decision needs depth this cold-load floor does not carry.

---

## Principles

> **1. Study the TypeScript contract and neighboring code before design.**

The parent says study first; the TypeScript delta is that the concrete contract is the *compiler
configuration in force*, not the abstract problem — the `tsconfig` strict-flag set, the target
runtime(s) and their import-extension mode, the module system (ESM + `verbatimModuleSyntax`), the
declared TS version floor, and the artifact type (library / app / script). The same code is valid under
one tsconfig and a compile error under another, so those surfaces — not intuition — decide which syntax
is legal, which import extension resolves, and which verification path applies.

> **2. Design the TypeScript surface with the user, from references.**

The parent says design the contract with the user from prior art; the TypeScript delta is what the
surface is made of — the *exported types* and the public `.d.ts` a consumer resolves against. TypeScript
is structural, so an un-narrowed return type or an accidentally-`export`ed binding becomes part of the
contract at one keystroke, and a downstream build breaks when it changes. Show and confirm the exported
type surface — the interfaces, the generics, the discriminated unions — before bodies make it costly to
reshape.

> **3. Model with the type system: make illegal states unrepresentable.**

The parent says build deep units and design seams the machine can check; the TypeScript delta is that
the type system is itself the modeling tool. A discriminated union, `readonly`, a branded type, and a
`never` exhaustiveness check let the compiler *prove* an invariant at build time that a nominal language
would guard with a runtime check. Prefer a shape in which the wrong state cannot be constructed over one
that is validated after the fact.

> **4. Ban `any`; quarantine `unknown` at the boundary.**

The parent says validate untrusted input and guard the trust boundary; the TypeScript delta is that
`any` is not a type but the *absence* of checking — it silently disables the compiler for every value it
touches and spreads through assignment. Use `unknown` for a value whose type is not yet known and narrow
it with a guard or a schema parser before use. An annotation states a value's *shape* but never
*validates* it, so parsing untrusted data stays a separate runtime act the type does not perform.

> **5. Make async and resource lifetime explicit; never float a promise.**

The parent says push side effects to the edges and make them visible; the TypeScript delta is that a
`Promise` is a value the type system will happily let you discard — a call left un-awaited is an
unhandled rejection that surfaces far from its cause, with no signature warning. Await every promise or
handle it deliberately, carry cancellation on an `AbortSignal`, and bind a resource's release to its
scope with `using` / `await using` so disposal runs on every path, including the throwing one.

> **6. Choose the failure shape: throw for the exceptional, return a typed result for the expected.**

The parent says surface failure where a caller can act on it; the TypeScript delta is that `throw` is
untyped — a caught error is `unknown` and the signature never says what may be thrown. So the shape is a
design act: throw only `Error` subclasses (carrying `cause`) for the genuinely exceptional and catch as
`unknown`, narrowing before use; but model an *expected* failure — a validation miss, a not-found — as a
typed result in the return type, where the compiler forces the caller to handle it.

> **7. Type-erase cleanly: keep the runtime honest and the build strict.**

The parent says the machine checks the design and the skeleton type-checks before it grows; the
TypeScript delta is that types vanish at runtime — the emitted or type-stripped JavaScript carries none
of them, so the strict `tsc` pass is the *only* place a type is ever checked. Keep syntax erasable
(`erasableSyntaxOnly`: unions over `enum`, no `namespace` or parameter-properties), keep imports
verbatim (`verbatimModuleSyntax` + `import type`), and treat a green maximal-strict `tsc --noEmit` as the
proof, because nothing downstream re-checks it.

---

## Rules

### Must-Follow

- **MUST compile under a maximal-strict `tsconfig`** — `strict` plus `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`,
  `noImplicitReturns`, and `noFallthroughCasesInSwitch`; an unchecked index, an exact-optional
  violation, or a missing return then fails the build, not a reader.
- **MUST use ESM with `verbatimModuleSyntax`** — a type-only import written `import type`, a value
  import left plain; erasure is then deterministic and the emitted JavaScript matches the source.
- **MUST pick the import extension by consumption mode** — a `tsc`-emitted library uses the `.js`
  extension on relative imports (`import { util } from "./util.js"`); a directly type-stripped source
  (Node 24+, Bun, Deno) uses `.ts` with `rewriteRelativeImportExtensions`. Never mix the two in one
  source tree.
- **MUST validate untrusted boundary data before use** — JSON, network, `env`, and file input arrive as
  `unknown`; narrow with a guard or a schema parser into a domain type before any maintained logic
  reads it. This example type-checks under the skill's own baseline:

```ts
function parseCount(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }
  throw new Error("expected a finite number");
}
```

- **MUST handle every promise** — `await` it, `void` it deliberately, or attach a `.catch`; an
  un-awaited promise is an invisible unhandled rejection.
- **MUST throw only `Error` subclasses and catch as `unknown`** — narrow with `instanceof` before use
  and chain with `cause`; a thrown non-`Error` loses the stack and the cause chain.
- **MUST keep syntax erasable** — `erasableSyntaxOnly`: model a closed set with a discriminated union or
  an `as const` object, never an `enum`, a `namespace`, or a constructor parameter-property.
- **MUST make every taught `ts` example type-check** — each fenced `ts` block in this skill and its
  children compiles under the examples baseline (the harness proves it); an example is a taught fact,
  not decoration.

### Must-Not-Follow

- **NEVER use `any`** — it disables the checker and spreads by assignment. Fix: `unknown` at the
  boundary, narrowed by a guard or parser; a locally-documented `as` only for a static fact the checker
  cannot see.
- **NEVER assert with `as` to silence an error** — an assertion the value does not satisfy is a lie the
  compiler stops catching. Fix: annotate (`: T`) so the value is checked, or `satisfies T` to validate
  while keeping the narrow inferred type; reserve `as` for a fact verified by a prior runtime narrow.
- **NEVER rely on an `enum` for a closed set** — it is non-erasable and its numeric form is unsound.
  Fix: a discriminated union or an `as const` object with a derived type. `erasableSyntaxOnly` rejects
  the `enum` outright:

```ts expect-error
// @ts-expect-error enum is not erasable syntax; erasableSyntaxOnly rejects it
enum Direction { Up, Down }
```

- **NEVER ship dual ESM + CJS from one `verbatimModuleSyntax` source** — the two module systems are
  incompatible under verbatim erasure. Fix: publish ESM-only; treat a required CJS build as a separate,
  non-default emit.
- **NEVER leave a `Promise` un-awaited to "fire and forget"** — the rejection is lost. Fix: `await`,
  `void`, or `.catch` it; for background work, own it explicitly.

---

## Procedure

**MUST load `coding/SKILL.md` and `principles/SKILL.md` first** and keep them in context — this
Procedure **operationalizes** their disciplines for TypeScript; it does not restate them.

Run P1–P8 in **author mode**; in **review mode**, run P1–P4 read-only to reconstruct and grade the
existing design, skip P5–P6, and grade read-only at P7–P8, editing nothing unless the user authorizes a
fix. **P2 is the router** for specialized depth; these steps plus the parent Rules are the floor for an
ordinary strict module.

### P1 — Study and lock the task and the TypeScript contract

*Deepens principles P1 / P4 and coding P1 — study first, refine the task.*

Lock What / Why / How + in/out scope + success with the user, or cite a Scope Contract. Read the
relevant specs, design notes, README, public-API docs, project rules, applicable mistakes, neighboring
modules, callers, tests, and local prior art. Then read the concrete **TypeScript contract**: the
`tsconfig` strict-flag set; the target runtime(s) and the import-extension mode each requires; the module
system (ESM + `verbatimModuleSyntax`); the declared TS version floor; the artifact type (library / app /
script) and its `.d.ts` consumers. A new project with no declared config defaults to the maximal-strict
base (Rules) and an ESM-only, TS 5.9-floor model. Record the boundary conditions — trusted vs untrusted
inputs, sync vs async callers, resource and task lifetimes, the exported public names — and flag every
boundary that needs runtime validation. **Declare author vs review mode.** For an **edit**, map the
affected set (callers, tests, docs, the emitted `.d.ts`, config) with CRUD + 5W1H. For a **bug**,
reproduce, then trace to the root before repair.

**P1 is complete when** scope and success are explicit (or a Scope Contract cited), the TypeScript
contract is known, patterns and prior art are read, the mode is declared, and the affected set or
reproduced root is recorded.

### P2 — Load the child docs for the forks in play

*Deepens coding P1 — study the prior art the decision needs.*

Read each child **before** the decision it governs; re-run routing when the design changes. An ordinary
strict module needs no specialist child to be valid, but any TypeScript change uses the scenario and
checklist material at P8 before handoff (an evaluator enters through `evaluation.md`).

| Read | When the change involves |
|---|---|
| `typing.md` | a public boundary, a generic, a guard, a discriminated union, `satisfies` / `as`, a branded type, or `.d.ts` authoring |
| `modules-tooling.md` | the tsconfig flag set and overlays, `moduleResolution`, the import-extension fork, the typed lint, or the build |
| `async-resources.md` | promises, cancellation (`AbortSignal`), combinators, async iteration, or `using` / `await using` disposal |
| `packaging-publishing.md` | an ESM-only `exports` map, declaration emit, `publint` / `arethetypeswrong`, or public-API evolution |
| `runtime-deltas.md` | code that touches a Node / Bun / Deno / browser boundary — resolution, built-ins, `lib`, or type-stripping |
| `design.md` | a unit or API shape choice — function vs `const`-object vs class, composition, or the input surface |
| `convention.md` | casing, file naming, import ordering, `import type`, TSDoc, or the formatter stance |
| `testing.md` | behavior changes, or type-level tests are written or reviewed |
| `scenarios.md` / `checklists.md` | self-review before handoff (P8), or the good/bad/adversarial probes and binary `TS-CHECK-*` items an evaluator activates |
| `evaluation.md` | grading the TypeScript idiom of a change-set — it routes the evaluator to the scenarios, checks, and verifications (see P8) |

The parent Rules stay the floor after a child loads. **P2 is complete when** every active fork is loaded
before its decision, and the pre-handoff or evaluation path includes the triad routing above.

### P3 — Design the units and the type surface, decomposed

*Deepens coding P2 / P3 / P4 and principles P3 — design the contract, deep units, decompose by responsibility.*

Design the surface as ordered design acts, not one flat construct-pick, before any body; `design.md` and
`typing.md` deepen each act.

1. **Frame the module and the ESM boundary.** Fix its one responsibility, the acyclic import direction,
   the exported names, and the import-extension mode the target runtime dictates.
2. **Pick the unit shape.** A typed function over plain data is often the whole unit; reach for a class
   only when identity, invariants across calls, or several behaviors over owned state must travel
   together. Prefer composition over inheritance.
3. **Model with the types.** Encode the domain so illegal states cannot be built — a discriminated union
   with a `never` exhaustiveness check makes an unhandled variant a compile error:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function assertNever(x: never): never {
  throw new Error(`unhandled variant: ${JSON.stringify(x)}`);
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    default:
      return assertNever(shape);
  }
}
```

4. **Sketch the contracts.** For every public and cross-unit interface record its name, inputs, output,
   annotations, the error and lifetime shapes, and the exported `.d.ts` surface; keep one credible
   alternative for the P4 gate. Apply the decision tables below.
5. **Choose the failure shape.** Model an expected failure as a typed result in the return type; reserve
   `throw` for the exceptional and catch as `unknown`:

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parsePort(raw: string): Result<number, string> {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    return { ok: false, error: `invalid port: ${raw}` };
  }
  return { ok: true, value: n };
}
```

6. **Make lifetime explicit.** Name each resource's owner and bind its release to scope with `using` /
   `await using`, so disposal runs on the throwing path too:

```ts
class Handle implements Disposable {
  [Symbol.dispose](): void {
    // release the resource here
  }
}

function work(): void {
  using h = new Handle();
  void h; // disposed at end of scope, on every path
}
```

**Decision tables** (the concrete idiom for the design acts above):

*`interface` vs `type`:*

| Use | For |
|---|---|
| `interface` | an object shape that may be `extend`ed / `implements`-ed, or a public API surface (clearer errors, declaration merging) |
| `type` | a union, tuple, mapped, conditional, or function type, and any alias of a non-object type |

*When a generic is earned:*

| Add a type parameter | Keep it concrete |
|---|---|
| the same relationship holds across many types AND the parameter links an input to the output (or two inputs) | a single call site, or a parameter used once — a concrete type or a small union reads clearer |

*Discriminated union vs `enum`:* always the discriminated union (above) — `enum` is non-erasable and its
numeric form is unsound.

*`satisfies` vs annotation vs `as`:*

| Construct | Effect |
|---|---|
| `: T` (annotation) | checks the value AND widens it to `T` |
| `satisfies T` | checks the value, keeps its narrow inferred type |
| `as T` | asserts without checking — only for a fact the compiler cannot see, after a runtime narrow |

```ts
const config = {
  host: "localhost",
  port: 8080,
} satisfies Record<string, string | number>;

// An annotation `: Record<string, string | number>` would widen `port` to
// `string | number`. `satisfies` validated the shape yet kept `port` narrow:
const port: number = config.port;
const host: string = config.host;
```

**P3 is complete when** each unit has an earned shape and one responsibility; the module boundary,
import direction, and exported types are fixed; every contract, alternative, data / failure shape, and
lifetime is concrete; and no behavior body exists.

### P4 — Confirm the design, type surface, and names with the user

*Deepens principles P3 — design with the user before building.*

Run the design-with-user gate on the TypeScript **design packet** — the module tree, the exported types
and generics, the interface/union choices, the signatures and annotations, the failure and lifetime
models, the verification seams, and the P3 alternative. Record approval, or cite an already-explicit
decision. **Author mode only:** in review mode, reconstruct and grade the existing packet without
editing.

**P4 is complete when** the author-mode surface is approved (or a prior decision cited), or the
review-mode surface is reconstructed and graded.

### P5 — Build the typed skeleton first

*Deepens coding P7 and principles P2 — build bottom-up, skeleton first.*

Materialize the approved design before any behavior: create the modules, the types, and the
fully-annotated signatures (`-> void` included) with stub bodies. Verify it imports cleanly and passes
`tsc --noEmit` under the maximal-strict base before growing any body; a structural defect returns
through P2–P4 rather than being hidden in a body.

**P5 is complete when** the skeleton matches the approved packet, imports cleanly, and type-checks green
with no behavior implemented.

### P6 — Grow in minimal verified slices

*Deepens coding P7 / P8 / P15 — grow verified, build only what's needed, move the whole affected set.*

Grow the bodies bottom-up, one verified slice at a time: implement the smallest dependency-setting slice
first, verify that slice (format → lint → `tsc --noEmit` → focused test) before the next, and firm up
each signature as you learn. Apply the § Rules floor and the active child guidance as you write, and
follow the surrounding code where it does not contradict a Rule. Update every affected caller, test,
doc, and emitted `.d.ts` in the **same slice**; add nothing beyond the contract and finish every
in-scope path with no placeholder.

**P6 is complete when** every in-scope path is implemented with no placeholder, each slice had fresh
focused evidence before the next, and every affected surface moved in lockstep.

### P7 — Verify the whole change

*Deepens coding P6 and principles P8 — design for verification, prove the root cause is gone.*

Prove the whole change after the per-slice checks, in this fixed order, fixing a failure before the
next: **format** (deterministic formatter, check mode) → **lint** (`typescript-eslint` typed rules —
under a TS 7.0 install this runs against the side-by-side TS 6.x-compat API, not the 7.0 binary) →
**type-check** (`tsc --noEmit`, maximal-strict) → **focused tests** → **full tests** → **type-level
tests** (`expectTypeOf` / `tsd` / `@ts-expect-error`) → **build** (declaration emit + `publint` +
`arethetypeswrong`, when publishing a package). Each gate is self-failing (`cmd || exit 1`). For a bug,
re-run the original P1 reproducer.

**P7 passes only when** every applicable check exits clean on fresh output, the reproducer no longer
fires, and — when publishing — the built package, not only the checkout, satisfies its `.d.ts` and
`exports` claims.

### P8 — Review: trace to the approved design and affected set

*Deepens principles P9 and coding P15 — CRUD + 5W1H, change with blast-radius awareness.*

Review on two independent axes, then trace. Grade the language-agnostic **property** with
`../coding/evaluation.md` and the TypeScript **idiom** with `evaluation.md`. For a pre-handoff check,
read `scenarios.md` for the task-relevant good/bad/adversarial probes, then answer the activated binary
`TS-CHECK-*` items from `checklists.md` — a failed item returns to its owning step. An evaluator enters
through `evaluation.md`, which loads `scenarios.md` + `checklists.md`. Then run **traceability**: every
approved design item (P4) maps to an implemented unit, type, name, error shape, and test seam; every
scope item maps to a diff line and nothing exceeds it; every affected-set file (P1) is updated or a
justified no-op; every success criterion has fresh evidence; and no caller, test, doc, or `.d.ts` is
stale.

**P8 is complete when** both reviews pass, all activated binary checks pass, the code traces to the
approved design, names, scope, and affected set with no stale dependent, and every success criterion has
fresh evidence.

---

## References

One owner per borrowed fact; the body states the fact and this register names its owner.

- [`coding/SKILL.md`](../coding/SKILL.md#scope--language-agnostic) — owns the language-agnostic
  properties of good software (design, construction, craftsmanship) that this skill specializes into
  concrete TypeScript idioms.
- [`principles/SKILL.md`](../principles/SKILL.md) — owns the ten gobbi behavioral principles that this
  skill's Procedure operationalizes for TypeScript.
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
  and the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — the language
  and compiler facts this skill teaches: the version floor, `satisfies`, `using` / `Symbol.dispose`,
  `verbatimModuleSyntax`, `erasableSyntaxOnly`, and `rewriteRelativeImportExtensions`.
- [`@tsconfig/strictest`](https://github.com/tsconfig/bases/blob/main/bases/strictest.json) — the
  strict-flag preset the maximal-strict base builds on.
- [Choosing compiler options](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html)
  — the `nodenext`-for-libraries module model, the ESM-only publishing stance, and the browser paths.
- [typescript-eslint](https://typescript-eslint.io/users/configs/) — the typed-lint layer (`no-floating-promises`,
  `no-unsafe-*`, `no-misused-promises`) that `tsc` alone does not catch.
- [Node.js: running TypeScript](https://nodejs.org/api/typescript.html) — runtime type-stripping and the
  `.ts`-specifier resolution behind the import-extension fork.
- [`arethetypeswrong`](https://arethetypeswrong.github.io/) and [`publint`](https://publint.dev/) — the
  machine gates that validate a published package's `.d.ts` resolution and `exports` shape.
- [Testing types (Vitest)](https://vitest.dev/guide/testing-types) and [`tsd`](https://github.com/tsdjs/tsd)
  — the type-level testing surface (`expectTypeOf` / `@ts-expect-error`).
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) — the ban-`any`,
  annotation-over-`as`, `interface`-for-object-shapes, and naming defaults.
